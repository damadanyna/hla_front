<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Saisie d'encaissement </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="text-xs material-icons"> clear </span> </button>
            </div>

            <div class="p-2 text-xs">
                <div class="flex flex-col mb-2">


                    <div class="">
                        <div class="flex items-end mb-2">
                            <custom-input  :disable="true" v-model="enc.enc_num_mvmt" label="N° Mouvement" />
                            <custom-input  :disable="true" v-model="enc.enc_date" label="Date" type="date" class="ml-2" />

                        </div>
                        <div class="flex items-end mb-2">
                            <!-- Patient avec un autre type de choix de patient -->
                            <div class="flex flex-col">
                                <span class="text-xs font-bold">Patient</span>
                                <span class="flex items-center justify-center border p-2 rounded w-full cursor-pointer" @click=" in_select_pat = true ">  
                                    {{ (pat_selected.pat_id != undefined)?pat_selected.pat_nom_et_prenom:'-' }} </span>
                            </div>  
                        </div>
                        <div class="flex items-end mb-2">
                            <c-select :datas="choice_pec" label="label" code="code" v-model="enc.enc_is_pec"  placeholder="Choix de paiement" />
                            <c-select v-if="enc.enc_is_pec == 1" :datas="soc" label="ent_label" code="ent_id" class="ml-2" v-model="enc.enc_ent_id"  placeholder="Société payeur" />
                        </div>

                        <div class="flex items-end mb-2" >
                            <c-select :datas="tarif" label="tarif_label" code="tarif_id" v-model="enc.enc_tarif_id"  placeholder="Tarif" />
                        </div>
                    </div>

                    <!-- ICI la liste des produits et service commander par le truc -->
                    <div class="">
                        <table class="w-full">
                            <thead class="rounded-t sticky top-28 z-20" >
                                <tr class="bg-gray-50 text-gray-700 text-sm">
                                    <th v-for="l in es_label_list" class="p-2 border text-xs" :key="l.key">
                                        {{ l.label }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr @click=" ()=>{
                                        list_selected = p
                                    } " v-for="p in encserv" class="cursor-pointer"  :key="p.service_code">
                                    <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.service_code == p.service_code}"  class="p-2 border text-xs" 
                                    v-for="l in es_label_list" :key="l.key">

                                        <div class="w-full flex justify-end" v-if="['encserv_montant','encserv_prix_unit'].indexOf(l.key) != -1">
                                            <span class=""> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                                        </div>
                                        <span class="" v-else > {{ p[l.key] }} </span>
                                    </td>
                                </tr>
                                <tr class="text-xs">
                                    <td class="p-2 border"  colspan="5">
                                        <span class="font-bold"> Total </span>
                                    </td>
                                    <td class="p-2 border ">
                                        <div class="w-full flex justify-end">
                                            <span class="">{{ enc.enc_montant.toLocaleString('fr-CA') }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="p-2 flex justify-end sticky bottom-0 bg-white border-t">
                    <div class="flex">
                        <button class="bt-p-s mr-2 flex justify-center items-center" @click="on_add_product = true">
                            <span class="material-icons text-sm">add</span>
                            <span class="ml-2"> Produits </span>
                        </button>

                        <button v-if="list_selected.service_code" class="bt-red-s mr-2 flex justify-center items-center" @click="delFserv">
                            <span class="material-icons text-sm">clear</span>
                            <span class="ml-2"> Supprimer </span>
                        </button>
                    </div> 
                    <span class="flex-grow"></span>  
                    <div class="">
                        <button class="bt-p-s" @click="setEncaissement" > Valider </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Patient -->
        <select-patient @validate=" setPatient " v-if="in_select_pat" @close="in_select_pat = false" />

        <!-- Ajout d'un produit -->
        <add-product-caisse :tarif="tarif_selected" v-if="on_add_product" @close="on_add_product = false" @validate="setProduct" />
    </div>
</template>
<script>
export default {
    watch:{
        'enc.enc_tarif_id'(a){
            for (let i = 0; i < this.tarif.length; i++) {
                const e = this.tarif[i];
                if(a == e.tarif_id){
                    this.tarif_selected = e
                    break
                }
            }
        },

    },
    data(){
        return{
            enc:{
                enc_is_pec:0,
                enc_tarif_id:-1,
                enc_montant:0
            },
            in_select_pat:false,
            pat_selected:{},
            soc:[],
            tarif:[],
            choice_pec:[
                {label:'Au comptant',code:0},
                {label:'Prise en Charge',code:1},
            ],

            encserv:[],
            es_label_list:[
                {label:'Code',key:'service_code'},
                {label:'Désignation',key:'service_label'},
                {label:'Quantité',key:'encserv_qt'},
                {label:'Unité',key:'art_unite_stk'},
                {label:'Prix Unitaire',key:'encserv_prix_unit'},
                {label:'Montant',key:'encserv_montant'},
            ],
            on_add_product:false,
            list_selected:{},
            tarif_selected:{}
        }
    },
    methods:{
        async recupAddUtils(){
            try {
                const r = await this.$http.get('api/encaissement/add-utils')
                let d = r.data

                this.soc = d.soc
                this.tarif = d.tarif

                this.enc.enc_ent_id = d.soc[0].ent_id

                this.enc.enc_num_mvmt = d.last_mvmt + 1

                //
                this.tarif_selected = this.tarif[0]
                this.enc.enc_tarif_id = this.tarif[0].tarif_id

            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },

        //Ajout de l'encaissement dans la base
        async setEncaissement(){
            if(!this.enc.enc_is_pec){
                this.enc.enc_ent_id  = null
            }

            if(!this.enc.enc_pat_id){
                this.showNotif('Le patient est obligatoire')
                return
            }
            try {
                const r = await this.$http.post('api/encaissement',{enc:this.enc,encserv:this.encserv})
                let d = r.data

                if(d.status){
                    this.$emit('validate')
                    this.showNotif(d.message)
                }else{
                    this.showNotif(d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        setPatient(p){
            this.pat_selected = p
            this.enc.enc_pat_id = p.pat_id

            this.in_select_pat = false
        },
        init(){
            this.enc.enc_date = this.dateToInput(new Date()) 
            this.enc.enc_util_id = this.$store.state.user.util_id
        },
        setProduct(a){
            this.enc.enc_montant = 0
            
            this.on_add_product = false
            this.encserv.push(a)

            for (let i = 0; i < this.encserv.length; i++) {
                const e = this.encserv[i];
                this.enc.enc_montant += parseInt(e.encserv_montant)
            }
        },
        delFserv(){
            for (let i = 0; i < this.encserv.length; i++) {
                const e = this.encserv[i];

                if(e.service_code == this.list_selected.service_code){
                    this.encserv.splice(i,1)
                    this.list_selected = {}
                    break
                }
                
            }
        }
    },
    beforeMount(){
        this.recupAddUtils()
    },
    mounted(){  

        this.init()
    }
}
</script> 