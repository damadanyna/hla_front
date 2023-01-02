  <template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm overflow-auto bg-white" style="max-height:400px" >
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Edition de facture </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons"> clear </span> </button>
            </div>

            <div>
                <div class="flex text-sm" >
                    <div class="flex flex-col p-2">
                        <div class="flex flex-col mb-2 text-xs">
                            <label for="fact_resume_intervention">Résumé des interventions</label>
                            <textarea class="input-alt w-56" name="" id="fact_resume_intervention" v-model="f.fact_resume_intervention" ></textarea>
                        </div>
                        <c-select :datas="list_dep" placeholder="Département" v-model="f.fact_dep_id" label="dep_label" code="dep_id" />
                    </div>
                    <span class="flex-grow"></span>
                    <div class="p-2">
                        <div class=" flex flex-col w-56 mb-2">
                            <span class="text-xs font-bold"> Société </span>
                            <span class="text-xs flex items-center justify-center border rounded p-2 cursor-pointer"
                             > {{ (pec.ent_label)?pec.ent_label:'-' }} </span>
                        </div>
                        <custom-input v-model="pec.tarif_label" class="w-56 mb-2" :disable="true" label="Tarif" />
                        <div class="flex items-end">
                            <custom-input v-model="p.date_entre" class="mb-2 " :disable="true" label="Date Entrée" type="date" />
                            <span class="flex-grow"></span>
                            <custom-input v-model="pec.pat_numero" class="w-24 mb-2 ml-2" :disable="true" label="Code patient" />
                        </div>
                        <div class=" flex flex-col w-56 mb-2">
                            <span class="text-xs font-bold"> Ets payeur </span>
                            <span class="text-xs flex items-center justify-center border rounded p-2 cursor-pointer"
                             > {{ (pec.ent_label_payeur)?pec.ent_label_payeur:'-' }} </span>
                        </div>
                    </div>
                </div>

                <!-- Tableau qui va contenir les facture et service -->
                <div class="">
                    <table class="w-full">
                        <thead class="rounded-t sticky top-28 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">
                                <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } " v-for="p in f.fact_serv" class="cursor-pointer"  :key="p.fserv_id">
                                <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.fserv_id == p.fserv_id}"  class="p-2 border text-xs" 
                                v-for="l in list_label" :key="l.key">

                                    <div class="w-full flex justify-end" v-if="['fserv_montant','fserv_prix_unitaire','fserv_prix_patient','fserv_prix_societe'].indexOf(l.key) != -1">
                                        <span class=""> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                                    </div>
                                    <span class="" v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div class="p-2 flex justify-end sticky bottom-0 bg-white border-t">
                    <div class="flex">
                        <button v-if="!pec.encharge_printed || inTypeUser(['a','g','m'])" class="bt-p-s mr-2 flex justify-center items-center" @click="on_add_product = true">
                            <span class="material-icons text-sm">add</span>
                            <span class="ml-2"> Produits </span>
                        </button>

                        <button  v-if="(list_selected.fserv_id && (!pec.encharge_printed || inTypeUser(['a','g','m'])) ) " class="bt-red-s mr-2 flex justify-center items-center" @click="delFserv">
                            <span class="material-icons text-sm">clear</span>
                            <span class="ml-2"> Supprimer </span>
                        </button>
                    </div> 
                    <span class="flex-grow"></span>  
                    <div class="flex">
                        
                        <button v-if="!pec.encharge_printed || inTypeUser(['a','g','m'])" class="bt-p-s" @click="saveFacture" > Enregistrer </button>
                        <button class="bt-p-s ml-2" v-if="fact_serv.length > 0" @click=" printPec ">Imprimer</button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Ajout de produits dans la facture du truc -->
        <add-product-fact @validate=" ()=>{
            on_add_product = false
            getUtilsAdd()
        }" :pec="pec" :f="f" v-if="on_add_product" @close="on_add_product = false" />
    </div>
</template>

<script>
export default {
    props:['pec'],
    data(){
        return{
            list_dep:[],
            f:{},
            p:{
                date_entre:(new Date()).toLocaleString('en-CA').split(',')[0]
            },
            
            list_label:[
                {label:'Code',key:'service_code'},
                {label:'Désignation',key:'service_label'},
                {label:'Quantité',key:'fserv_qt'},
                {label:'Unité',key:'art_unite_stk'},
                {label:'Prix Unitaire',key:'fserv_prix_unitaire'},
                {label:'Montant',key:'fserv_montant'},
                {label:'% Patient',key:'fserv_prix_patient'},
                {label:'% Société',key:'fserv_prix_societe'},
            ],
            list_serv:[],
            list_selected:{},
            fact_serv:[],
            on_add_product:false
        }
    },
    methods:{
        async getUtilsAdd(){
            try {
                const _r = await this.$http.get('api/facture/add-utils',{params:{encharge_id:this.pec.encharge_id}})
                let _d = _r.data

                if(_d.status){
                    this.list_dep = _d.list_dep
                    this.f = _d.fact
                    // this.f.fact_dep_id = this.f.fact_dep_id | this.list_dep[0].dep_id
                    if(this.f.fact_dep_id == null){
                        this.f.fact_dep_id = this.list_dep[0].dep_id
                    }
                    this.fact_serv = this.f.fact_serv
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async recupFactureAndService(){
            try {
                const _r = await this.$http.get('api/facture')
                let _d = _r.data
                
                if(_d.status){
                    
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        init(){
            this.p.date_entre = (new Date(this.pec.encharge_date_entre)).toLocaleString('en-CA').split(',')[0]
        },

        async delFserv(){
            try {
                const _r = await this.$http.delete('api/fact_service/'+this.list_selected.fserv_id)
                let _d = _r.data
                
                if(_d.status){
                    this.getUtilsAdd()
                    this.list_selected = {}
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async saveFacture(){
            try {
                const _r = await this.$http.put('api/facture',this.f)
                let _d = _r.data
                
                if(_d.status){
                    this.getUtilsAdd()
                    this.list_selected = {}
                    this.showNotif("Facture bien enregistrée")

                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },

        //Impression de prise en charge
        async printPec(){
            try {
                const _r = await this.$http.get('api/encharge/print-pdf',{params:{encharge_id:this.pec.encharge_id}})
                let _d = _r.data
                
                if(_d.status){
                    this.showNotif(_d.message)
                    // await this.$http.get('api/facture/download')
                    window.electronAPI.downFact(this.$http.defaults.baseURL+'/api/facture/download')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },

    mounted(){
        this.init()
        this.getUtilsAdd()
    }
} 
</script>

<style>

</style>