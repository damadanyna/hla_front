<template>
    <div class="p-2 flex justify-center items-center">
        <div>
            <div class="">
                <div class="flex mb-2">
                    <button @click="  on_add_ent = true " class="bt-icon"> <i class="i text-lg ic:baseline-add"></i> </button>
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
                            } " class="cursor-pointer relative" v-for="p in list_ent" :key="p.ent_id">
                            <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.ent_id == p.ent_id}" class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span> {{ p[l.key] }} </span>
                            </td>

                            <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.ent_id == p.ent_id"> 
                                <button @click=" ()=>{
                                        on_view_ent = true
                                    } " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <i class="i text-lg ic:baseline-edit"></i> </button> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <add-ent v-if="on_add_ent" @validate=" ()=>{
                getEnt()
                on_add_ent = false
            } " @close="on_add_ent = false " />

        <det-ent :e="list_selected" v-if="on_view_ent" @validate=" ()=>{
                getEnt()
                on_view_ent = false
            } " @close="on_view_ent = false " />
    </div>
</template>

<script>
export default {
    data(){
        return{
            list_ent:[],
            list_label:[
                {label:'Code',key:'ent_code'},
                {label:'Nom',key:'ent_label'},
                {label:'N° compte',key:'ent_num_compte'},
                {label:'% Patient',key:'ent_pat_percent'},
                {label:'% Société',key:'ent_soc_percent'},
                {label:'Adresse',key:'ent_adresse'},

            ],
            on_add_ent:false,
            on_view_ent:false,
            list_selected:{}
        }
    },
    methods:{
        async getEnt(){
            try {
                const _r = await this.$http.get('api/entreprises')
                let _d = _r.data

                if(_d.status){
                    this.list_ent = _d.reponse
                }else{
                    alert(_d.message)
                }
            } catch (e) {
                alert('Erreur de connexion')
            }
        }
    },
    mounted(){
        this.getEnt()
    }
}
</script>

<style>

</style>