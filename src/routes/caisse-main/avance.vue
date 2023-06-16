<template>
    <div class="">

        <!-- Les filtres -->
        <div class="flex p-2 border-bottom-1 border-200 align-items-end sticky bg-white" style="top:58px">
            <!-- Recherche de patient -->
            <div class="flex flex-column mr-2">
                <span class="p-input-icon-right">
                    <i class="pi pi-search" />
                    <InputText class="p-inputtext-sm" type="text" v-model="filters.pat_label" placeholder="ex : Ralaivao Adonis"/>
                </span>
            </div>

            <!-- <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> Département </span>
                <Dropdown class="p-inputtext-sm" :options="dep_list" optionLabel="dep_label" optionValue="dep_id" v-model="filters.dep_id"/>
            </div> -->

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> Etat </span>
                <Dropdown class="p-inputtext-sm" :options="validate_list" optionLabel="label" optionValue="value" v-model="filters.validate"/>
            </div>

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> {{ dateToText(filters.date_1) }} </span>
                <InputText class="p-inputtext-sm" type="date" v-model="filters.date_1" />
            </div>

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> {{ dateToText(filters.date_2) }} </span>
                <InputText class="p-inputtext-sm" type="date" v-model="filters.date_2" />
            </div>

            <div class="flex flex-column mr-2">
                <span class="text-xs font-bold"> Choix de date </span>
                <Dropdown class="p-inputtext-sm" :options="date_choice" optionLabel="label" optionValue="key" v-model="filters.date_by"/>
            </div>
        </div>

        <!-- le tableau -->
        <div class="p-2">
            
            <table class="w-full text-sm">
                <thead class="" >
                    <tr class=" text-left">
                        <th v-for="l in list_label" class="stycky" style="top:133px" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click=" ()=>{
                            list_selected = p
                        } " v-for="p in list_avance" class="cursor-pointer"  :key="p.encav_id">
                        <td :class="{'border-yellow-500':!p.enc_validate,'active-row':list_selected.encav_id == p.encav_id,}"  class="" 
                        v-for="l in list_label" :key="l.key">

                            <div class="w-full flex justify-end" v-if="['encav_montant'].indexOf(l.key) != -1">
                                <span class=""> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                            </div>
                            <span class="" v-else-if="l.key == 'enc_is_pec'"> {{ (p[l.key])?'Oui':'Non' }} </span>
                            <span  v-else-if="l.key == 'encav_date'" class="text-sm"> {{ 
                                (filters.date_by == 'insert')?new Date(p.encav_date_enreg).toLocaleString():new Date(p.encav_date_validation).toLocaleString()
                            }} </span>

                            <div class="flex text-xs" v-else-if="l.key == 'encav_validate'"> 
                                <span class="p-1 border text-white border-round font-bold" :class="{'bg-blue-500':p.encav_validate,'bg-yellow-500':!p.encav_validate}">  {{ (p.encav_validate)?'OUI':'NON' }} </span> 
                            </div>

                            <div class="flex text-xs" v-else-if="l.key == 'encav_versement'"> 
                                <span class="p-1 border text-white border-round font-bold" :class="{'bg-blue-500':p.encav_versement,'bg-yellow-500':!p.encav_versement}">  {{ (p.encav_versement)?'OUI':'NON' }} </span> 
                            </div>
                            <span v-else-if="l.key == 'pat_nom_et_prenom'">
                                {{ (p.enc_is_externe)?p.enc_pat_externe:p.pat_nom_et_prenom }}
                                <!-- <strong v-if="p.enc_is_hosp" > {{ `(HOSP${p.encav_id?'/AVANCE':''})`  }} </strong> -->
                            </span>
                            <span class="" v-else > {{ (p[l.key])?p[l.key]:'-' }} </span>
                        </td>
                    </tr>
                    <tr class="">
                        <td class="last-row" :colspan="list_label.length - 7"> 
                            <div class="flex align-items-center">
                                <Button @click="filters.page -= 1" :disabled="!have_prev" icon="pi pi-chevron-left" class="p-button-sm p-button-text"></Button>
                                <span class="font-bold mx-2"> {{ filters.page }} sur {{ nb_page_rest }} </span>
                                <Button @click="filters.page += 1" :disabled="!have_next" icon="pi pi-chevron-right" class="p-button-sm p-button-text"></Button>
                            </div>
                        </td>
                        <td class="last-row" :colspan="3">
                            <div class="flex justify-content-center">
                                <Button :loading="on_export" @click="exportOnPDF" :disabled="list_avance.length <=0" icon="pi pi-print" label="Exporter en PDF" class="p-button-sm p-button-text mr-2"></Button>
                                <Button :loading="on_export" @click="exportOnExcel" :disabled="list_avance.length <=0" icon="pi pi-print" label="Exporter en Excel" class="p-button-sm p-button-text"></Button>
                            </div>
                        </td>
                        <td class="last-row">
                            <div class="flex flex-column">
                                <span class="text-xs"> Somme Total affichage </span>
                                <span class="font-bold"> {{ total_montant.toLocaleString('fr-CA') }} </span>
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
                                <span class="font-bold"> {{ list_avance.length }} </span>
                            </div>
                        </td>
                        <td class="last-row">
                            <div class="flex flex-column">
                                <span class="text-xs"> Montant Total </span>
                                <span class="font-bold"> {{ (result.somme_result?result.somme_result:0).toLocaleString('fr-CA') }} </span>
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
        'filters.dep_id'(){
            this.getListAvance()
        },
        'filters.pat_label'(){
            this.getListAvance()
        },
        'filters.validate'(){
            this.getListAvance()
        },
        'filters.date_1'(){
            this.getListAvance()
        },
        'filters.date_2'(){
            this.getListAvance()
        },
        'filters.date_by'(){
            this.getListAvance()
        },
        'filters.page'(){
            this.getListAvance(true)
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
                date_by:'validate'
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
                {label:"Heure",key:"encav_date"},
                {label:"N° Mouvement",key:"enc_num_hosp"},
                {label:"Patient",key:"pat_nom_et_prenom"},
                {label:"Prise en charge",key:"enc_is_pec"},
                {label:"Société",key:"ent_label"},
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

            //pour la gestion de recherche avec suggextion
            service_child_list:[],
            list_avance:[],
            result:{},
            total_montant:0,
            have_next:false,
            have_prev:false,
            nb_page_rest:0,
            on_export:false
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
        async exportOnPDF(){
            try {       
                this.on_export = true 
                const r = await this.$http('api/caisse/main/avance',{
                    params:{
                        filters:this.filters,
                        down:true,type:'pdf'
                    }
                })
                let d = r.data
                if(d.status){
                    this.on_export = true
                    setTimeout(() => {
                            window.electronAPI.downFact(`${this.$http.defaults.baseURL}/api/media/pdf/${d.pdf_name}`)
                            this.on_export = false
                    }, 500);
                }else{
                    this.showNotif('error','Exportation des données en pdf',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.on_export = false
        },
        async exportOnExcel(){
            try {       
                this.on_export = true 
                const r = await this.$http('api/caisse/main/avance',{
                    params:{
                        filters:this.filters,
                        down:true,type:'excel'
                    }
                })
                let d = r.data
                if(d.status){
                    // window.electronAPI.downFact(`${this.$http.defaults.baseURL}/api/media/pdf/${d.pdf_name}`)
                    let dd = await window.electronAPI.openSaveDialog('Enregistrement du fichier Excel (Caisse principale)',d.data)
                    if(dd.status){
                        this.showNotif('success','Exportation Avance ','Avance bien exportées')
                    }
                    
                }else{
                    this.showNotif('error','Exportation des données en Excel',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.on_export = false
        }
    },
    beforeMount(){
        this.getDataUtils()
    },

    mounted(){
        this.getListAvance()
    }
}
</script>