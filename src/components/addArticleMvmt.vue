<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajouter d'un article</span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons"> clear </span> </button>
            </div>

            <div class="p-2" >

                <div class="">
                    <!-- Composant de recherche rapide d'une ligne d'une table -->
                    <div class="flex">
                        <div class="relative">
                            <div class=" flex flex-col">
                                <span class="text-xs font-bold"> Article </span>
                                <span @click="on_search_art = true"  class="cursor-pointer rounded-lg border h-8 bg-white w-56 flex justify-center items-center text-xs"> {{ (a_selected.art_label)?a_selected.art_label:'--' }} </span>
                            </div>
                            <div v-if="on_search_art" class="border z-50 rounded shadow-lg absolute py-2 w-56 bg-white top-0">
                                <div class="p-2">
                                    <custom-input label="Article"  v-model="search"/>
                                </div>
                                <div class="flex flex-col overflow-auto" style="max-height:200px">
                                    <div @click=" ()=>{
                                            a_selected = a 
                                            on_search_art = false
                                            search = ''

                                            //insertion pour le mart
                                            mart.mart_art_id = a_selected.art_id
                                            mart.mart_art_unit = a_selected.art_unite_stk
                                            mart.mart_art_label = a_selected.art_label
                                        } " class="text-xs flex flex-col w-full p-2 border-b hover:bg-gray-50 cursor-pointer" v-for="a in art_search" :key="a.art_id"> 
                                        <span class="text-gray-400"> {{ a.art_code }} </span>
                                        <span class=""> {{ a.art_label }} </span>
                                    </div>
                                </div>  
                                <div class="px-2">
                                    <span class="text-xs cursor-pointer underline text-indigo-600" @click=" ()=>{
                                            on_search_art = false
                                            search = ''
                                        } ">Fermer</span>
                                </div>
                            </div>
                            
                        </div>
                        <div class="flex flex-col text-xs ml-2">
                            <span class="text-xs font-bold">Unité</span>
                            <span class="p-2 border rounded"> {{ (a_selected.art_unite_stk)?a_selected.art_unite_stk:'--' }} </span>
                        </div>
                    </div>
                    <!-- Fin du composant -->

                    <div class="flex ">
                        <custom-input type="number" class="w-24 mr-2" v-model="mart.mart_qt" label="Qté"  />
                        <custom-input type="number" class="w-48" v-model="mart.mart_prix_unit" label="P-U (Ar)"  />
                        <div class="flex flex-col text-xs ml-2">
                            <span class="text-xs font-bold">Montant</span>
                            <span class="p-2 border rounded"> {{  mart.mart_montant  }} </span>
                        </div>
                    </div>
                </div>
                
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="setMart" > Valider </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['mart_list'],
    watch:{
        search(a){
            this.searchArtByLabel()
        },
        'mart.mart_qt'(a){
            this.mart.mart_montant = a * this.mart.mart_prix_unit
        },
        'mart.mart_prix_unit'(a){
            this.mart.mart_montant = a * this.mart.mart_qt
        }
    },
    data(){
        return{
            mart:{
                mart_montant:0
            },
            on_search_art:false,
            a_selected:{},
            art_search:[],
            search:''
        }
    },
    methods:{
        setMart(){
            this.$emit('validate',this.mart)
        },
        async searchArtByLabel(){
            try {
                const _r = await this.$http.get('api/articles/search',{params:{
                    id_not_in:this.mart_list.map(x => x.mart_art_id),
                    search:this.search
                }})

                let _d = _r.data

                if(_d.status){
                    this.art_search = _d.articles
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
    },
    mounted(){
        // console.log(this.mart_list)
    }
}
</script>

<style>

</style>