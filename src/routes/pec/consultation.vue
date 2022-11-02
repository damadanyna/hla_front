<template>
    <div class="p-2 flex justify-center items-center">
        <div>
            <div class="">
                <div class="flex mb-2">
                    <button @click="  on_add_cons = true " class="bt-icon"> <span class="material-icons text-sm"> add </span> </button>
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
                            } " class="cursor-pointer relative" v-for="p in list_cons" :key="p.cons_id">
                            <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.cons_id == p.cons_id}" class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span> {{ p[l.key] }} </span>
                            </td>

                            <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.cons_id == p.cons_id"> 
                                <button @click=" ()=>{
                                        //on_view_ent = true
                                    } " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <i class="i text-lg ic:baseline-edit"></i> </button> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Ajout consultation -->
        <add-cons v-if="on_add_cons" @close=" on_add_cons = false " />
    </div>
</template>

<script>
export default {
    data(){
        return{
            list_cons:[],
            list_label:[
                {label:'Heure',key:'cons_time'},
                {label:'N° Patient',key:'pat_numero'},
                {label:'Nom et prenom',key:'pat_nom_et_prenom'},
                {label:'Mnt ESPECE',key:'cons_montant'},
                {label:'Mnt CALCULE',key:'cons_montant_calc'},
                {label:'Médecin',key:'cons_medcin'},
                {label:'Société',key:'ent_label'},
                {label:'N° Dossier',key:'cons_num_dossier'},
            ],
            on_add_cons:false,
            list_selected:{}
        }
    },
    methods:{
         async getCons(){
            try {
                const _r = await this.$http.get('api/consultation')
                let _d = _r.data

                if(_d.status){
                    this.list_cons = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
         }
    },
    mounted(){
        this.getCons()
    }
}
</script>

<style>

</style>