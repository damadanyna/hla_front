<template>
    <div class="">

        <!-- Les filtres -->
        <div class="flex p-2 border-bottom-1 border-200 align-items-end sticky bg-white" style="top:58px">
            <!-- Recherche de patient -->
            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> Patient </span>
                <span class="p-input-icon-right">
                    
                    <i class="pi pi-search" />
                    <InputText class="p-inputtext-sm" type="text" v-model="filters.pat_label" placeholder="ex : Ralaivao Adonis"/>
                </span>
            </div>


            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> {{ dateToText(filters.date_1) }} </span>
                <InputText type="date"  v-model="filters.date_1" class="p-inputtext-sm" />
            </div>


            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> {{ dateToText(filters.date_2) }} </span>
                <InputText type="date"  v-model="filters.date_2" class="p-inputtext-sm" />
            </div>


            <div class="flex align-items-end" style="width:500px">
                <div class="flex flex-column">
                    <span class="text-xs font-bold"> Service Parent </span>
                    <Dropdown  :options="sp_list" optionLabel="service_label" v-model="filters.service_parent" 
                    optionValue="service_id" class="p-inputtext-sm mr-2" />
                </div>

                <input-sugg style="z-index: 1200;" placeholder="Service enfant" :width="600" v-model="filters.service_label">
                    <div  @click="this.filters.service_label = s.service_label" class="p-2 flex  hover:bg-gray-100"  v-for="s in service_child_list" :key="s.service_id">
                        <span class="text-sm"> {{ s.service_label }} </span>
                    </div>

                    <div v-if="service_child_list.length <= 0" class="p-2 flex align-items-center justify-content-center hover:bg-gray-50">
                        <span class=""> Aucun résultat </span>
                    </div>
                </input-sugg>

            </div>



            <span class="flex-grow-1"></span>
            <!-- <Button label="Rechercher" class="p-button-sm" icon="pi pi-search"/> -->
        </div>

        <!-- le tableau -->
        <div class="p-2">

            <table class="w-full text-sm">
                <thead class="" >
                    <tr class=" text-left">
                        <th v-for="l in list_label_med" class="sticky" style="top:133px" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click=" ()=>{
                            list_selected = p
                        } " v-for="p in list_encserv" class="cursor-pointer"  :key="`${p.enc_id}${p.encserv_id}`">
                        <td :class="{'border-yellow-500':!p.enc_validate,'active-row':list_selected.enc_id == p.enc_id,}"  class="" 
                        v-for="l in list_label_med" :key="l.key">

                            <div class="w-full flex justify-end" v-if="['encserv_montant'].indexOf(l.key) != -1">
                                <span class=""> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                            </div>
                            <span class="" v-else-if="l.key == 'enc_is_pec'"> {{ (p[l.key])?'Oui':'Non' }} </span>
                            <span  v-else-if="l.key == 'enc_date_validation'" class="text-sm"> {{ 
                                new Date(p.enc_date_validation).toLocaleString()
                            }} </span>


                            <div class="" v-else-if="l.key == 'enc_num_mvmt'">
                                <span class="" v-if="p.enc_is_hosp"> {{ p.enc_num_hosp  }} </span>
                                <span class="" v-else> {{ (p[l.key])?`${ (new Date(p.enc_date_enreg)).getFullYear().toString().substr(2)}/${p[l.key].toString().padStart(5,0)}`:'-' }} </span>
                            </div>
                            
                            <span v-else-if="l.key == 'pat_nom_et_prenom'">
                                {{ (p.enc_is_externe)?p.enc_pat_externe:p.pat_nom_et_prenom }}
                                <!-- <strong v-if="p.enc_is_hosp" > {{ `(HOSP${p.encav_id?'/AVANCE':''})`  }} </strong> -->
                            </span>
                            <span class="" v-else > {{ (p[l.key])?p[l.key]:'-' }} </span>
                        </td>
                    </tr>
                    <tr class="">
                        <td class="last-row" :colspan="list_label_med.length - 4"> 
                            <div class="flex align-items-center">
                                <Button @click="filters.page -= 1" :disabled="!have_prev" icon="pi pi-chevron-left" class="p-button-sm p-button-text"></Button>
                                <span class="font-bold mx-2"> {{ filters.page }} sur {{ nb_page_rest }} </span>
                                <Button @click="filters.page += 1" :disabled="!have_next" icon="pi pi-chevron-right" class="p-button-sm p-button-text"></Button>
                            </div>
                        </td>
                        
                        <td class="last-row">
                            <div class="flex flex-column">
                                <span class="text-xs"> Résulat total </span>
                                <span class="font-bold"> {{ (result.nb_result )?result.nb_result :0 }} </span>
                            </div>
                        </td>
                        <td class="last-row">
                            <div class="flex flex-column">
                                <span class="text-xs"> Affichage </span>
                                <span class="font-bold"> {{ list_encserv.length }} </span>
                            </div>
                        </td>
                        <td class="last-row">
                            <div class="flex flex-column">
                                <span class="text-xs"> Quantité Total </span>
                                <span class="font-bold"> {{ (result.somme_qt?result.somme_qt:0).toLocaleString('fr-CA') }} </span>
                            </div>
                        </td>
                        <td class="last-row">
                            <div class="flex flex-column">
                                <span class="text-xs"> Montant Total </span>
                                <span class="font-bold"> {{ (result.somme_encserv?result.somme_encserv:0).toLocaleString('fr-CA') }} </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>


        </div>
    </div>
</template>

<script>
export default {
    watch:{
        'filters.service_label'(){
            this.searchChildService()
            this.searchEncserv()
        },
        'filters.service_parent'(){
            this.service_child_list = []
            this.filters.service_label = ''
            this.searchEncserv()
        },
        'filters.date_1'(){
            this.searchEncserv()
        },
        'filters.date_2'(){
            this.searchEncserv()
        },
        'filters.pat_label'(){
            this.searchEncserv()
        },
    },
    data(){
        return{
            filters:{
                pat_label:'',
                dep_id:-1,
                limit:100,
                page:1,
                validate:-1,
                date_1:this.dateToInput(new Date()),
                date_2:this.dateToInput(new Date()),
                date_by:'validate',
                art_label:'',
                service_parent:-1,
                service_label:''
            },

            dep_list:[
                {dep_label:'TOUS',dep_id:-1}
            ],
            sp_list:[
                {service_label:'TOUS',service_id:-1,service_code:'MED'}
            ],


            validate_list:[
                {label:'Tous',value:-1},
                {label:'Encaissé',value:1},
                {label:'Non Encaissé',value:0},
            ],

            prod_serv_list:[
                {label:'Médicaments'.toUpperCase(),value:1},
                {label:'Service'.toUpperCase(),value:0},
            ],
            list_label_serv:[
                {label:"Heure",key:"enc_date_validation"},
                {label:"N° Mouvement",key:"enc_num_mvmt"},
                {label:"Patient",key:"pat_nom_et_prenom"},
                {label:"Prise en charge",key:"enc_is_pec"},
                {label:"Code",key:"service_code"},
                {label:"Désignation",key:"service_label"},
                {label:"Département",key:"dep_label"},
            ],
            list_label_med:[
                {label:"Heure",key:"enc_date_validation"},
                {label:"N° Mouvement",key:"enc_num_mvmt"},
                {label:"Patient",key:"pat_nom_et_prenom"},
                {label:"Prise en charge",key:"enc_is_pec"},
                {label:"Code",key:"service_code"},
                {label:"Désignation",key:"service_label"},
                {label:"Quantité",key:"encserv_qt"},
                {label:"Montant",key:"encserv_montant"},
                {label:"Département",key:"dep_label"},
            ],
            list_selected:{},
            date_choice:[
                {label:'Insertion',key:'insert'},
                {label:'Validation',key:'validate'},
            ],

            //pour la gestion de recherche avec suggestion
            service_child_list:[],
            list_avance:[],


            result:{},
            total_montant:0,
            have_next:false,
            have_prev:false,
            nb_page_rest:0,
            list_encserv:[]
        }
    },
    methods:{
        init(){
            
        },
        async getDataUtils(){
            try {
                const r = await this.$http.get('api/caisse/main/data-for-filters')
                let d = r.data

                if(d.status){
                    this.dep_list = [...this.dep_list,...d.dep_list]
                    this.sp_list = [...this.sp_list,...d.sp_list]
                    this.sp_list.push({
                        service_label:'MEDICAMENTS',service_id:-42,service_code:'MED'
                    })
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async getListAvance(a){
            try {

                if(!a){
                    this.filters.page = 1
                }
                const r = await this.$http.get('api/caisse/main/avance',{
                    params:{filters:this.filters}
                })
                let d = r.data

                if(d.status){
                    this.list_avance = d.list_avance
                    this.result = d.result
                    this.total_montant = d.total_montant

                    this.calc_pagination()
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        calc_pagination(){
            let {nb_result} = this.result
            let {limit,page} = this.filters

            this.nb_page_rest = Math.ceil(nb_result / limit) //arrondi vers le haut

            this.have_next = (nb_result > limit && page < nb_result/limit)?true:false
            this.have_prev = (nb_result > limit && page > 1)
        },

        async searchChildService(){
            try {
                const r = await this.$http.get('api/services/search/child',{params:{
                    parent_id:this.filters.service_parent,
                    label:this.filters.service_label
                }})

                let d = r.data

                if(d.status){
                    this.service_child_list = d.services
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async searchEncserv(){
            try {
                const r = await this.$http('api/caisse/main/encserv',{
                    params:{
                        filters:this.filters
                    }
                })
                let d = r.data
                if(d.status){
                    this.list_encserv = d.encserv
                    this.result = d.result

                    this.calc_pagination()
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        }
    },
    beforeMount(){
        this.getDataUtils()
    },

    mounted(){
        this.searchEncserv()
    }
}
</script>