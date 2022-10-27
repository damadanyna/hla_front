<template>
    <div class="p-2">
       

        <!-- Eto ny misy ny filtre sy ny recherche -->
        <div class="my-2 flex">
            <custom-input label="Recherche ..." class="w-56" v-model="filters.search" />
            <c-select class="mx-2" :datas="search_by_list" label="label" code="code" placeholder="Par ..." v-model="filters.search_by" />
        </div>


        <div class="">
            <div class="flex mb-2">
                <button @click="  on_add_patient = true " class="bt-icon"> <i class="i text-lg ic:baseline-add"></i> </button>
            </div>
            <table class="">
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
                            <span class="" v-else-if=" l.key == 'pat_sexe' "> {{ (p[l.key] == 'm')?'Masculin':'Féminin' }} </span>
                            <span v-else> {{ p[l.key] }} </span>
                        </td>

                         <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.pat_id == p.pat_id"> 
                                <button @click="delPat(p.pat_id)" class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <i class="i text-lg ic:baseline-clear"></i> </button> </td>
                    </tr>

                </tbody>
            </table>
        </div>

        <add-patient @validate=" ()=>{
            getListPatients()
            on_add_patient = false    
        } " v-if="on_add_patient" @close=" on_add_patient = false " />
    </div>
</template>

<script>
export default {
    data(){
        return{
            list_label:[
                {label:'Num.',key:'pat_numero'},
                {label:'Nom et prénom',key:'pat_nom_et_prenom'},
                {label:'Date de Naissance',key:'pat_date_naiss'},
                {label:'Age',key:'pat_age'},
                {label:'Sexe',key:'pat_sexe'},
                {label:'Profession',key:'pat_profession'},
                {label:'Adresse',key:'pat_adresse'},
            ],
            list_patients:[],
            on_add_patient:false,

            list_selected:{},
            

            //Filtre de recherche
            filters:{
                search_by:'pat_nom_et_prenom',
                search:''
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
                const _r = await this.$http.get('api/patients')

                let _d = _r.data

                if(_d.status){
                    this.list_patients = _d.reponse
                }else{
                    alert(_d.message)
                }
            } catch (e) {
                alert('Erreur de donnexion')
                console.log(e)
            }
        },
        async delPat(pat_id){
            try {
               if(confirm("Supprimer le patient")){
                     const _r = await this.$http.delete('api/patient/'+pat_id)
                     let _d = _r.data
                     if(_d.status){
                        this.getListPatients()
                    }
               }
            } catch (e) {
                alert('Erreur de donnexion')
            }
        }
    },
    mounted(){
        this.getListPatients()
    }
}
</script>