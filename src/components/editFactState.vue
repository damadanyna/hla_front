<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold"> {{ 'édition facture - état mensuel'.toUpperCase() }} </span>
        </template>
        <div class="flex flex-column" style="min-width: 900px;">
            <!-- Ici les onglets -->
            <div class="flex">
                <span   v-for="o in onglet" :key="o.value" :class="{'border-bottom-2 border-blue-500 font-bold':o.value == cur_onglet}" 
                class="ml-2 cursor-pointer" @click="cur_onglet = o.value"> 
                    {{ o.label }}
                </span>
            </div>

            <!-- Les contenus -->

            <!-- Pour la récapitulation -->
            <div class="flex" v-if="cur_onglet == 'recap'">
                <div class="p-2 flex flex-column text-sm">
                    <!-- Période date facture ... -->
                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Période de  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ `${list_mois[filters.month - 1]} ${filters.year}` }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> N° Facture  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ fact.fpc_num }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Date Facture  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ (new Date(fact.fpc_date)).toLocaleDateString() }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Société Payeur  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 60px;"> {{ st.sp_code }} </span>
                        <span class="font-bold ml-3 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ st.sp_label }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Société </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 60px;"> {{ st.se_code }} </span>
                        <span class="font-bold ml-3 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ st.se_label }} </span>
                    </div>

                    <!-- Eto mbola misy an'ilay tableau de patient iny -->
                    <div class="flex flex-column mt-5">
                        <span class="font-bold mb-2"> Liste des patients </span>
                        <div class="border-1 flex flex-column border-gray-400" style="width:400px;height: 300px;overflow: auto;">
                            <span class="p-2" v-for="p in list_patient" :key="p.pat_id"> - {{ p.pat_nom_et_prenom }}</span>
                        </div>
                    </div>
                </div>

                <!-- Tableau des infos -->
                <div class="flex flex-column w-full">
                    <div class="w-full p-2" style="max-height: 500px;overflow: auto;">
                        <table class="w-full text-xs">
                            <thead>
                                <tr>
                                    <th class="sticky top-0" v-for="l in label_list" :key="l.key">
                                        {{ l.label }}
                                    </th>
                                </tr>
                            </thead>

                            <tbody >
                                <tr v-for="p in pserv_list" :key="p.service_id">
                                    <td :class="{'text-right':l.key == 'montant'}" class="text-xs" v-for="l in label_list" :key="l.key">
                                        <span class="" v-if="l.key == 'montant'"> {{ (p.montant)?p.montant.toLocaleString('fr-CA'):'' }} </span>
                                        <span class="" v-else> {{ p[l.key] }} </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex flex-column text-sm p-2">

                        <div class="flex mb-2">

                            <div class="flex flex-grow-1 align-items-center">
                                <Checkbox v-model="fact.fpc_soins_generaux" :binary="true" />
                                <span class="ml-2"> Soins généraux </span>
                            </div>

                            <div class="flex " style="width: 30%;">
                                <InputNumber :disabled="!fact.fpc_soins_generaux" v-model="fact.fpc_soins_montant" class="p-inputtext-sm" />
                            </div>
                        </div>
                        <div class="flex align-items-center">
                            <span class="flex-grow-1"> TOTAL </span>
                            <span class="p-2 border-1 border-round border-gray-400">
                                {{ (fact.fpc_montant)?fact.fpc_montant.toLocaleString('fr-CA'):'0' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Pour le tableau détaillé -->
            <div class="flex justify-content-center align-items-center p-5" v-if="cur_onglet == 'tab-detail'">
            </div>
        </div>
        <template #footer>
            <div class="flex w-full justify-content-end">
                <Button @click="validateFact" label="Valider" icon="pi pi-check" class="p-button-sm" />
                <Button :disabled="!fact.fpc_validate" label="Imprimer"  @click="printfpc" :loading="on_export" icon="pi pi-print" class="p-button-sm p-button-text" />
            </div>
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['visible','st','filters'],
    watch:{
        visible(a){
            if(a){
                //console.log(this.st)
                this.st_cur = JSON.parse(JSON.stringify(this.st))
                this.getDatas()


                // console.log(this.st)
            }
        },
        'fact.fpc_soins_montant'(a){
            let tt = this.pserv_list.reduce((acc,val) => acc + parseInt(val.montant || 0) ,0)
            this.fact.fpc_montant = (a)?parseInt(a) + tt:tt
        },

        'fact.fpc_soins_generaux'(a){
            this.fact.fpc_soins_montant = (a)?this.fact.fpc_soins_montant:0
        }
        
    },
    data(){
        return{
            st_cur:{},
            onglet:[
                {label:'RECAPITULATION',value:'recap'},
                {label:'tableau detaillé'.toUpperCase(),value:'tab-detail'},
            ],

            cur_onglet:'recap',
            list_patient:[],
            pserv_list:[],
            fact:{
                fpc_soins_generaux:false,
                fpc_soins_montant:0,
            },

            fpc:{}, //mems


            label_list:[
                {label:'CODE',key:'service_code'},
                {label:'désignation'.toUpperCase(),key:'service_label'},
                {label:'MONTANT',key:'montant'},
            ],

            on_export:false
        }
    },
    methods:{
        //Ato tsy maintsy misy fonction manao récupération ny liste anle izy rehetra izy même société payeur sy société employeur 
        //an'ilay sélection

        //en gros ici, on va récupérer tous les encharges de sp_id et de se_id
        //avec date et mois

        async getDatas(){
            try {
                const r = await this.$http.get('api/encharge/etats-mensuel/editFacture/datas',{params:{
                    filters:this.filters,
                    st:{
                        sp_id:this.st.sp_id,
                        se_id:this.st.se_id
                    }
                }})

                let d = r.data
                if(d.status){
                    this.list_patient = d.list_pec
                    this.pserv_list = d.pserv


                    if(d.fpc.fpc_id){
                        this.fact = d.fpc
                        this.fact.fpc_soins_generaux = (this.fact.fpc_soins_generaux)?true:false
                        this.fpc = d.fpc

                    }else{

                        //reinit
                        this.fact = {
                            fpc_soins_generaux:false,
                            fpc_soins_montant:0,
                        }

                        // -----------

                        let num_tmp = (d.fpc_last)?(parseInt(d.fpc_last.split('/')[2])+1).toString().padStart(3,0):'1'.padStart(3,0)

                        this.fact.fpc_num = `HLA/FPC/${num_tmp}`
                        this.fact.fpc_date = new Date()
                        this.fact.fpc_soins_generaux = false
                        this.fact.fpc_soins_montant = 0
                        this.fact.fpc_sp_id = this.st.sp_id
                        this.fact.fpc_se_id = this.st.se_id

                        this.fact.fpc_month = this.filters.month
                        this.fact.fpc_year = this.filters.year
                    }
                    let tt = this.pserv_list.reduce((acc,val) => acc + parseInt(val.montant || 0) ,0)
                    this.fact.fpc_montant = (this.fact.fpc_soins_montant)?parseInt(this.fact.fpc_soins_montant) + tt:tt
                }else{
                    this.showNotif('error','Edition Facture',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async validateFact(){
            try {
                
                const r = await this.$http.post('api/encharge/etats-mensuel/fpc',{
                    filters:this.filters,
                    st:this.st,
                    encharge_ids:this.list_patient.map(x => x.encharge_id),
                    fact:this.fact
                })

                let d = r.data

                if(d.status){
                    this.getDatas()

                    this.$emit('refresh')
                }else{
                    this.showNotif('error',"Edition Facture - FPC",d.message)
                }

            } catch (e) {
                this.showNotifServerError()
            }
        },

        async printfpc(){
            this.on_export = true
            try {
                const r = await this.$http.get('api/encharge/etats-mensuel/fpc/print',{params:{
                    filters:this.filters,
                    st:this.st,
                    pserv_list:this.pserv_list,
                    fact:this.fact
                }}) 

                let d = r.data
                if(d.status){
                    this.on_export = true
                    setTimeout(() => {
                            window.electronAPI.downFact(`${this.$http.defaults.baseURL}/api/media/pdf/${d.pdf_name}`)
                            this.on_export = false
                    }, 500);
                }else{
                    this.showNotif('error',"Edition Facture - FPC",d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.on_export = false
        }
    }
}
</script>