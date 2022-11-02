<template>
    <div class="p-2 flex justify-center items-center">
        <div>
            <div class="">
                <div class="flex mb-2">
                    <button @click="  on_add_pec = true " class="bt-icon">  <span class="material-icons text-sm"> add </span> </button>
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
                        <!-- <tr v-for="p in list_pec" :key="p.pec_id">
                            <td class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span> {{ p[l.key] }} </span>
                            </td>
                        </tr> -->

                        <tr @click=" ()=>{
                                list_selected = p
                            } " class="cursor-pointer relative" v-for="p in list_pec" :key="p.encharge_id">
                            <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.encharge_id == p.encharge_id}" class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span> {{ p[l.key] }} </span>
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
                {label:'Scté',key:'ent_label'},
                {label:'Scté payeur',key:'ent_label_payeur'},
                {label:'Tarif',key:'tarif_label'},
                {label:'N° compte',key:'ent_num_compte_payeur'},
            ],
            on_add_pec:false,
            on_view_pec:false,
            list_selected:{}
        }
    },
    methods:{
        async getPec(){
            try {
                const _r = await this.$http.get('api/encharge')
                let _d = _r.data

                if(_d.status){
                    this.list_pec = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },
    mounted(){
        this.getPec()
    }
}
</script>

<style>

</style>