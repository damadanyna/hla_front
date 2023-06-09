<template>
    <div class="">

        <!-- Les filtres -->
        <div class="flex p-2 border-bottom-1 border-200 align-items-end">
            <!-- Recherche de patient -->
            <div class="flex flex-column mr-2">
                <span class="p-input-icon-right">
                    <i class="pi pi-search" />
                    <InputText class="p-inputtext-sm" type="text" v-model="filters.pat_label" placeholder="ex : Ralaivao Adonis"/>
                </span>
            </div>

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> Département </span>
                <Dropdown class="p-inputtext-sm" :options="dep_list" optionLabel="dep_label" optionValue="dep_id" v-model="filters.dep_id"/>
            </div>

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> {{ dateToText(filters.date_1) }} </span>
                <InputText class="p-inputtext-sm" type="date" v-model="filters.date_1" />
            </div>

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> {{ dateToText(filters.date_2) }} </span>
                <InputText class="p-inputtext-sm" type="date" v-model="filters.date_2" />
            </div>
        </div>

        <!-- le tableau -->
        <div class="p-2">
            
        </div>

    </div>
</template>

<script>
export default {
    watch:{
        'filters.service_label'(a){
            if(!a){
                this.service_child_list = []
            }else{
                this.searchChild()
            }
            
        }
    },
    data(){
        return{
            filters:{
                pat_label:'',
                dep_id:-1,
                limit:100,
                page:1,
                vailadte:-1,
                date_1:this.dateToInput(new Date()),
                date_2:this.dateToInput(new Date())
            },

            dep_list:[
                {dep_label:'TOUS',dep_id:-1}
            ],

            validate_list:[
                {label:'Tous',value:-1},
                {label:'Encaissé',value:1},
                {label:'Non Encaissé',value:0},
            ],
            list_label:[
                {label:"Heure",key:"enc_time"},
                {label:"N° Mouvement",key:"enc_num_mvmt"},
                {label:"Patient",key:"pat_nom_et_prenom"},
                {label:"Prise en charge",key:"enc_is_pec"},
                {label:"Société",key:"ent_label"},
                {label:"Montant Total",key:"enc_montant"},
                {label:"Avance",key:"enc_total_avance"},
                {label:"Encaissée",key:"enc_validate"},
                {label:"Versée",key:"enc_versement"},
                {label:"Département",key:"dep_label"},
            ],
            list_selected:{},

            //pour la gestion de recherche avec suggextion
            service_child_list:[]

        }
    },
    methods:{
        init(){
            
        },
        async getDispList(){

        },
        async getDataUtils(){
            try {
                const r = await this.$http.get('api/caisse/main/data-for-filters')
                let d = r.data

                if(d.status){
                    this.dep_list = [...this.dep_list,...d.dep_list]
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
    },
    beforeMount(){
        this.getDataUtils()
    }
}
</script>