<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Détails Département </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
               <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="dep.dep_code" label="Code" />
                    <custom-input class="mr-2" v-model="dep.dep_label" label="Nom du département" />
                </div>
                <div class="py-2 flex justify-end">
                    <button class="bt-red-s" @click="delDep"> Supprimer </button>
                    <span class="flex-grow"></span>
                    <button class="bt-p-s" @click="updateDep"> Modifier </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['d'],
    data(){
        return{
            dep:{}
        }
    },
    methods:{
        async updateDep(){

            delete this.dep.dep_date_enreg
            try {
                const _r = await this.$http.put('api/departement',this.dep)

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

        async delDep(){
            try {
                const _r = await this.$http.delete('api/departement/'+this.dep.dep_id)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },
    mounted(){
        this.dep  = this.d
    }
}
</script>

<style>

</style>