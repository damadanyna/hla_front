<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Gestion Tarif </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
                <div class="flex flex-col mb-2">
                    <div class="mb-2 flex">
                        <custom-input class="mr-2 w-56" v-model="tarif.tarif_label" label="Désignation"/>
                    </div>
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postTarif"> Ajouter </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            tarif:{},
        }
    },
    methods:{
        async postTarif(){
            try {
                const _r = await this.$http.post('api/tarifs',this.tarif)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    alert(_d.message)
                }
            } catch (e) {
                alert('Erreur de Connexion')
            }
        },
    },
    mounted(){
    }
}
</script> 