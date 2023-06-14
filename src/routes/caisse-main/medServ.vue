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

                <input-sugg  placeholder="Service enfant" :width="600" v-model="filters.service_label">
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
        <div class="">

        </div>
    </div>
</template>

<script>
export default {
    watch:{
        'filters.service_label'(){
            this.searchChildService()
        },
        'filters.service_parent'(){
            this.service_child_list = []
            this.filters.service_label = ''
        },
        'filters.date_1'(){
            this.searchEncserv()
        },
        'filters.date_2'(){
            this.searchEncserv()
        }
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
                {label:"Heure",key:"encav_date"},
                {label:"N° Mouvement",key:"enc_num_mvmt"},
                {label:"Patient",key:"pat_nom_et_prenom"},
                {label:"Prise en charge",key:"enc_is_pec"},
                {label:"Montant Total",key:"encav_montant"},
                {label:"Encaissée",key:"encav_validate"},
                {label:"Versée",key:"encav_versement"},
                {label:"Département",key:"dep_label"},
            ],
            list_label_med:[
                {label:"Heure",key:"encav_date"},
                {label:"N° Mouvement",key:"enc_num_mvmt"},
                {label:"Patient",key:"pat_nom_et_prenom"},
                {label:"Prise en charge",key:"enc_is_pec"},
                {label:"Montant Total",key:"encav_montant"},
                {label:"Encaissée",key:"encav_validate"},
                {label:"Versée",key:"encav_versement"},
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