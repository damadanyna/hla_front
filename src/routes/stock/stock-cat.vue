<template>
    <div class="w-full flex flex-col justify-center items-center">
        

        <div class="">
            <div class="flex mb-2">
                <button @click="  on_add_cat = true " class="bt-icon"> <span class="material-icons text-sm"> add </span> </button>
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
                    <tr v-for="p in list_cat" :key="p.patient_id">
                        <td class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                            <span> {{ p[l.key] }} </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- add_article -->
        <add-cat :parent="list_cat" @validate=" ()=> {
                on_add_cat = false
                getListParentCat()
            } " v-if="on_add_cat"  @close="on_add_cat = false" />
    </div>
</template>

<script>
export default {
    data(){
        return{
            list_cat:[],
            list_label:[
                {label:'Code',key:'cat_code'},
                {label:'Désignation',key:'cat_label'},
                {label:'Nb Sous cat.',key:'nb_child'},
            ],

            on_add_cat:false
        }
    },
    methods:{
        async getListParentCat(){
            try {
                const _r = await this.$http.get('api/categorie_articles/parent')

                let _d = _r.data
                if(_d.status){
                    this.list_cat = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },

    mounted(){
        this.getListParentCat()
    }

}
</script>