<template>
    <div class="p-2">
       

        <!-- Eto ny misy ny filtre sy ny recherche -->
        <div class="flex flex-col sticky top-0 bg-white z-30">
            <div class="my-2 flex">
                <custom-input label="Recherche :" class="w-56" ex="Ralaivao Adonis" icon="search" v-model="filters.search" />
                <c-select class="mx-2" :datas="search_by_list" label="label" code="code" placeholder="Par :" v-model="filters.search_by" />
            </div>

            <!-- Ajout et tout -->
            <div class="flex mb-2">
                <button @click="  on_add_patient = true " class="bt-p-s"> <span class="material-icons text-md mr-2"> add </span> <span class=""> Ajouter </span> </button>
                <button v-if="list_selected.pat_id" @click="  on_edit_patient = true " class="bt-p-s ml-2"> 
                    <span class="material-icons text-md mr-2"> edit </span> <span class=""> Modifier </span> 
                </button>

                <button @click="on_sup_user = true" v-if="list_selected.pat_id && inTypeUser(['a','m'])"  class="bt-red-s ml-2"> 
                    <span class="material-icons text-md mr-2"> delete </span> <span class=""> Supprimer </span> 
                </button>

                <span class="flex-grow">  </span>
                <button v-if="list_selected.pat_id" class="bt-p-s" @click=" list_selected = {} "> Déselectionner </button>
            </div> 
        </div>


        <div class="">
            
            <table class="w-full">
                <thead class="rounded-t sticky top-0 z-20" >
                    <tr class="bg-gray-50 text-gray-700 text-sm">

                        <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>


                    <tr @click=" ()=>{
                            list_selected = p
                        } " v-for="p in list_patients" class="cursor-pointer relative"  :key="p.pat_id">
                        <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.pat_id == p.pat_id}"  class="p-2 border text-xs" 
                        v-for="l in list_label" :key="l.key">
                            <span v-if="l.key == 'pat_date_naiss'" class=""> 
                                {{ (p[l.key])?dateToText(p[l.key]):'-' }}    
                            </span>
                            <span class="" v-else-if=" l.key == 'pat_sexe' "> {{ (p[l.key] == 'M')?'Masculin':'Féminin' }} </span>
                            <span class="" v-else-if="l.key == 'pat_age'"> {{ (p.pat_date_naiss)?getAgeByDate(p.pat_date_naiss):'-' }} </span>
                            <span v-else-if="l.key == filters.search_by"> 
                                <!-- {{ (filters.search.trim())?p[l.key].replace(/filters.search/gmi,`<span class="bg-indigo-600"> ${filters.search} </span>`):p[l.key] }} </span> -->
                                <div v-html="searchReplace(p[l.key])"> </div>
                                <!-- '  -->
                            </span>
                            <span v-else> {{ p[l.key] }} </span>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

        <add-patient @validate=" ()=>{
            getListPatients()
            on_add_patient = false    
        } " v-if="on_add_patient" @close=" on_add_patient = false " />

        <det-patient @validate=" ()=>{
            getListPatients()
            on_edit_patient = false    
            } " v-if="on_edit_patient" :pat="list_selected"  @close=" on_edit_patient = false " />

        <sup-user @validate="()=>{
            getListPatients()
            on_sup_user = false    
            list_selected = {}
        }" :u="list_selected"  @close="on_sup_user = false" v-if="on_sup_user"/>
    </div>
</template>

<script>
export default {
    watch:{
        'filters.search'(a){
            this.getListPatients()
        }
    },
    data(){
        return{
            list_label:[
                {label:'Numéro',key:'pat_numero'},
                {label:'Nom et prénom',key:'pat_nom_et_prenom'},
                {label:'Date de naissance',key:'pat_date_naiss'},
                {label:'Age',key:'pat_age'},
                {label:'Sexe',key:'pat_sexe'},
                {label:'Profession',key:'pat_profession'},
                {label:'Adresse',key:'pat_adresse'},
            ],
            list_patients:[],
            on_add_patient:false,
            on_edit_patient:false,
            on_sup_user:false,

            list_selected:{},
            

            //Filtre de recherche
            filters:{
                search_by:'pat_nom_et_prenom',
                search:'',
                limit:200
            },

            
            search_by_list:[
                {label:"Nom/Prenom",code:"pat_nom_et_prenom"},
                {label:"Numéro",code:"pat_numero"},
                {label:"Profession",code:"pat_profession"},
                {label:"Adresse",code:"pat_adresse"},
            ]
        }
    },methods:{
        async getListPatients(){
            try {
                const _r = await this.$http.get('api/patients',{params:this.filters})

                let _d = _r.data

                if(_d.status){
                    this.list_patients = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de donnexion')
                console.log(e)
            }
        },
        async delPat(pat_id){
            try {
                const _r = await this.$http.delete('api/patient/'+pat_id)
                    let _d = _r.data
                    if(_d.status){
                    this.getListPatients()
                }
            } catch (e) {
                this.showNotif('Erreur de donnexion')
            }
        },
        searchReplace(val){
            return (!this.filters.search.trim())?val:val.replace(new RegExp(this.filters.search,'gmi'),`<span class="font-bold text-indigo-600">${this.filters.search.toUpperCase()}</span>`)
        }
    },
    mounted(){
        this.getListPatients()
    }
}
</script>