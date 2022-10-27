<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajout Catégorie </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
                <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="cat.cat_code" label="Code" />
                    <custom-input class="mr-2" v-model="cat.cat_label" label="Libellée" />

                    <c-select :datas="cat_parent" label="cat_label" code="cat_id" v-model="cat.cat_parent_id" placeholder="Catégorie parente" />
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click=" postCat "> Ajouter </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['parent'],
    data(){
        return{
            cat:{
                cat_parent_id:null,
            },
            cat_parent:[]
        }
    },
    methods:{
        init(){
            //
            this.cat_parent = JSON.parse(JSON.stringify(this.parent))

            console.log(this.cat_parent)
            this.cat_parent.unshift({cat_id:null,cat_label:"Aucune"})
        },

        async postCat(){
            try {
                const _r = await this.$http.post('api/categorie_articles',this.cat)
                
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    alert(_d.message)
                }
            } catch (e) {
                alert('Erreur de connexionoooo')
            }
        }
    },
    mounted(){
        this.init()
    }
}
</script>

<style>

</style>