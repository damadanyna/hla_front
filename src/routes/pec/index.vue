<template>
    <div class="p-2 flex justify-center items-center">
        <div>
            <div class="">
                <div class="flex mb-2">
                    <button @click="on_add_pec = true " class="bt-icon">
                        <svg viewBox="0 0 24 24" class=" w-5"><path class=" fill-current text-gray-500" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                        <span > add </span>  
                    </button>
                    <button class=" ml-3 bt-icon"  @click="on_add_pec = true " >
                        <svg viewBox="0 0 24 24"  class=" w-5"><path class=" fill-current text-gray-400" d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" /></svg> 
                        <span > Etat Mensuel </span>  
                    </button>
                    <select class=" ml-3" name="" id="" v-model="select_value" @change="getPec(select_value,select_value2)">
                        <option  v-for="item,i in liste_mois" :key="i" :value="i" v-text="item"></option>
                    </select>
                    <select class=" ml-3" name="" id="" v-model="select_value2" @change="getPec(select_value,select_value2)">
                        <option  v-for="item,i in liste_annee" :key="i" :value="item" v-text="item"></option>
                    </select>
                    
                </div>
                <table class="">
                    <thead class="rounded-t sticky top-0 z-20" >
                        <tr class="bg-gray-50 text-gray-700 text-sm">
                            <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key" v-text="l.label "> 
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- <tr v-for="p in list_pec" :key="p.pec_id">
                            <td class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span> {{ p[l.key] }} </span>
                            </td>
                        </tr> -->

                        <tr @click=" ()=>{
                                list_selected = p
                            } " class="cursor-pointer relative" v-for="p in list_pec" :key="p.encharge_id">
                            <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.encharge_id == p.encharge_id}" class="p-2 border text-xs" v-for="l,k in list_label" :key="k">
                                 <span v-if="k==5 || k==6" v-text="new Date(p[l.key]).toLocaleDateString('fr')"> </span>
                                <span else="" v-text="p[l.key]"> </span>
                            </td>
                            <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.encharge_id == p.encharge_id"> 
                                <button @click=" ()=>{
                                        //on_view_ent = true
                                    } " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <i class="i text-lg ic:baseline-edit"></i> </button> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <add-pec @validate=" ()=>{
                on_add_pec = false
                getPec()
            } " v-if="on_add_pec" @close=" on_add_pec = false " />
    </div>
</template>

<script>
export default {
    data(){
        return{
            list_pec:[],
            list_label:[
                {label:'N°seq',key:'encharge_seq'},
                {label:'Patient',key:'pat_nom_et_prenom'},
                {label:'Scté',key:'entreprise'},
                {label:'Scté payeur',key:'etat_payeur'},
                {label:'Tarif',key:'encharge_tarif_id'},
                {label:'Date Entrer' ,key:'encharge_date_entre'},
                {label:'Date Sortie',key:'encharge_date_sortie'},
                {label:'N° compte',key:'encharge_num_compte'},
            ],
            liste_mois:["Liste en cours","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Oût","Septembre","Octobre","Novembre","Décembre","Toute l'année"],
            liste_annee:[2022,2021],
            on_add_pec:false,
            on_view_pec:false,
            list_selected:{},
            select_value:0,
            select_value2:0,
            date:{mois:1,annee:2022}
        }
    },
    methods:{
        async getPec(moi,annee){
            try {
                const _r = await this.$http.get('api/encharge',{params:{mois:moi,annee:annee}})
                 console.log(_r);
                let _d = _r.data

                if(_d.status){
                    this.list_pec = _d.reponse 
                }else{
                    this.showNotif(_d.message)
                }
            }catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }, 
        
    },

    mounted(){
        
        this.select_value2=this.liste_annee[0]
        this.getPec(this.date.mois,this.date.annee)
    }
}
</script>

<style>

</style>