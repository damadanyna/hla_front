<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Edition article </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2 overflow-auto" style="max-height:400px;">
                <div class="">
                    <div class="flex items-center mb-2">
                        <i class="i ic:baseline-info mr-2 text-xl"></i>
                        <span class="text-xs font-bold ">Informations article</span>
                    </div>
                    <div class="flex mb-3">
                        <c-select class="mr-2" :datas="parent_cat" label="cat_label" placeholder="Famille" code="cat_id" v-model="article.art_parent_cat_id" />
                        <c-select class="mr-2"  :datas="sub_cat" label="cat_label" placeholder="Sous Famille" code="cat_id" v-model="article.art_cat_id" />
                    </div>
                    <div class="mb-3 flex">
                        <custom-input label="Code article" class="w-32 mr-2" v-model="article.art_code" />
                        <custom-input label="Désignation" class=" w-72 " v-model="article.art_label" />
                    </div>
                    <div class="mb-3 flex">
                        <custom-input label="Unité de stock" class="w-32 mr-2" v-model="article.art_unite_stk" />
                        <custom-input label="Conditionnement" ex="Ex : 50/Car" class="w-32 mr-2" v-model="article.art_conditionnement" />
                    </div>
                    <div class="mb-3 flex">
                        <custom-input label="Prix de revient" ex="" class="w-42 mr-2" v-model="article.art_prix_unitaire" />
                        <custom-input label="Prix unitaire" ex="" class="w-42 mr-2" v-model="article.art_prix_revient" />
                    </div>
                    <div class="mb-3">
                        <custom-input label="Emplacement" class="" v-model="article.art_emplacement" />
                    </div>
                </div>

                <div v-if="this.art.g_stock.length <= 0" class="">
                    <div class="flex items-center mb-2">
                        <i class="i ic:baseline-inventory mr-2 text-xl"></i>
                        <span class="text-xs font-bold ">Informations Stock</span>
                    </div>

                    <div>
                        <div class="mb-2" v-for="p,i in list_depot" :key="p.depot_id">
                            <div class="">
                                <span class="font-bold"> {{ p.depot_label }} </span>
                            </div>
                            <div class="flex ">
                                <custom-input type="number" class="mr-2" label="Stk Initial" ex=" " v-model="model_stk_depot[i].stk_initial" />
                                <custom-input type="number" class="mr-2" label="Stk Actuel" ex=" " v-model="model_stk_depot[i].stk_actuel" />
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="putArticle" > Enregistrer </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    props:['art'],
    watch:{
        'article.art_parent_cat_id'(a){
            this.getSubCat(a)
        },
    },
    data(){
        return{
            parent_cat:[],
            sub_cat:[],
            list_depot:[],
            article:{},
            model_stk_depot:[],
            stk_depot:{}
        }
    },
    methods:{
        async getUtilsAdd(){
            try {
                const _r = await this.$http.get('api/articles/utils-add')

                let _d = _r.data

                if(_d.status){
                    this.parent_cat = _d.parent_cat
                    this.sub_cat = _d.sub_cat
                    this.list_depot = _d.list_depot

                    // this.article.art_parent_cat_id = (this.parent_cat[0])?this.parent_cat[0].cat_id:null
                    // this.article.art_cat_id = (this.sub_cat[0])?this.sub_cat[0].cat_id:null

                    this.article = JSON.parse(JSON.stringify(this.art))

                    if(this.article.g_stock.length > 0){
                        //initialisation des dépots initiales
                        for(let i = 0; i < this.article.g_stock.length; i++){
                            let tmp = this.article.g_stock[i]
                            this.model_stk_depot[i] = {stk_initial:tmp.stk_initial,stk_actuel:tmp.stk_actuel}
                        }
                    }else{
                        //initialisation des dépots initiales
                        for(let i = 0; i < this.list_depot.length; i++){
                            this.model_stk_depot[i] = {stk_initial:0,stk_actuel:0}
                        }
                    }
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async getSubCat(s){
            try {
                const _r = await this.$http.get('api/articles/sub-cat/'+s)

                let _d = _r.data

                if(_d.status){
                    this.sub_cat = _d.sub_cat
                    // this.article.art_cat_id = (this.sub_cat.length <= 0)?null:this.sub_cat[0].cat_id
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async putArticle(){
            try {
                const _r = await this.$http.put('api/article',{article:this.article,stock:this.model_stk_depot,list_depot:this.list_depot})
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        addStk(depot_id,stk_type){
            
        }
    },
    mounted(){
        // this.article = JSON.parse(JSON.stringify(this.art))
        this.getUtilsAdd()
    }
}
</script>

<style>

</style>