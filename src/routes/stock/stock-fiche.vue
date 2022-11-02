<template>
    <div class="w-full flex flex-col justify-center items-center">
        

        <div class="">
            <div class="flex mb-2 sticky top-10 h-16 Z-3O px-2  bg-white border items-center ">
                <button @click="on_add_article = true " class="bt-icon mr-2"> <span class="material-icons text-sm"> add </span> </button>
                <button @click.stop="on_edit_article = true " v-if="list_selected.art_id" class="bt-icon"> <span class="material-icons text-sm"> edit </span> </button>
                <span class="flex-grow"></span>
                <custom-input v-model="filters.search" label="Recherche ..." />
            </div>
            <table class="">
                <thead class="rounded-t sticky top-28 z-20" >
                    <tr class="bg-gray-50 text-gray-700 text-sm">
                        <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click=" ()=>{
                            list_selected = p
                        } " v-for="p in list_article" class="cursor-pointer"  :key="p.art_id">
                        <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.art_id == p.art_id}"  class="p-2 border text-xs" 
                        v-for="l in list_label" :key="l.key">
                            <span class="" v-if="l.key == 'nb_stock_total'"> 
                                {{ stock_total(p.g_stock) }}    
                            </span>

                            <span class="" v-else-if="l.key.split(':')[0] == 'depot'"> 
                                {{ check_depot_stock(p.g_stock,l.key) }}
                            </span>
                            <span class="" v-else> {{ p[l.key] }} </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- add_article -->
        <add-article @validate=" ()=>{
                on_add_article = false
                this.getArticle()
            } " v-if="on_add_article"  @close="on_add_article = false" />

            <det-article :art="list_selected"  @validate=" ()=>{
                on_edit_article = false
                this.getArticle()
            } " v-if="on_edit_article" @close="on_edit_article = false" />
    </div>
</template>

<script>
export default {
    watch:{
        'filters.search'(a){
            this.getArticle()
        }
    },
    data(){
        return{
            list_article:[],
            list_label:[
                {label:'Code',key:'art_code'},
                {label:'Désignation',key:'art_label'},
                {label:'Unité',key:'art_unite_stk'},
                {label:'Conditionnement',key:'art_conditionnement'},
                {label:'Stock Total',key:'nb_stock_total'},
            ],

            on_add_article:false,
            list_depot:[],
            on_add_list_depot:false,
            on_edit_article:false,

            list_selected:{},
            filters:{
                search:'',
                limit:200
            }
        }
    },

    methods:{
        async getArticle(){
            try {
                const _r = await this.$http.get('api/articles',{params:this.filters})

                let _d = _r.data
                if(_d.status){
                    this.list_article = _d.articles
                    this.list_depot = _d.list_depot

                    if(!this.on_add_list_depot){
                        for (let i = 0; i < this.list_depot.length; i++) {
                            this.list_label.push({label:`${this.list_depot[i].depot_label}`,key:`depot:${i}`})
                        }

                        this.on_add_list_depot = true
                    }
                }else{
                    this.showNotif(d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        stock_total(p){
            let s = 0
            for(let i = 0;i<p.length;i++){
                let tmp = p[i]
                
                s += parseInt(tmp.stk_actuel)
            }
            return s
        },
        check_depot_stock(p,l){
            let r = parseInt(l.split(':')[1])

            return (p.length > 0 )?p[r].stk_actuel:0
        }
    },
    mounted(){
        this.getArticle()
    }

}
</script>