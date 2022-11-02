<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajout département </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
                <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="dep.dep_code" label="Code" />
                    <custom-input class="mr-2" v-model="dep.dep_label" label="Nom du département" />
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postDep"> Ajouter </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            dep:{}
        }
    },
    methods:{
        async postDep(){

            console.log(this.fourn)
            try {
                const _r = await this.$http.post('api/departements',this.dep)

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
    }
}
</script>

<style>

</style>