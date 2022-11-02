<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajout fournisseur </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
                <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="fourn.fourn_code" label="Code" />
                    <custom-input class="mr-2" v-model="fourn.fourn_label" label="Nom du fournisseur" />
                </div>
                <div class="mb-2">
                    <div class="flex flex-col">
                        <label for="" class="text-xs text-indigo-600 font-bold">Adresse</label>
                        <textarea v-model="fourn.fourn_adresse" class="input-alt text-xs" placeholder="Adresse"></textarea>
                    </div>
                </div>
                <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="fourn.fourn_nif" label="N° Nif" />
                    <custom-input class="mr-2" v-model="fourn.fourn_stat" label="N° Stat" />
                </div>

                <div class="mb-2">
                    <div class="flex flex-col">
                        <label for="" class="text-xs text-indigo-600 font-bold">Infos</label>
                        <textarea v-model="fourn.fourn_info" class="input-alt text-xs" placeholder="Infos"></textarea>
                    </div>
                </div>
                <div class="mb-2">
                    <div class="flex items-center py-2">
                        <input type="checkbox" class="mr-2" :checked="fourn.fourn_tva" v-model="fourn.fourn_tva" id="fourn_tva" >
                        <label for="fourn_tva" class="text-xs"> TVA Automatique </label>
                    </div>
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postFourn"> Ajouter </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            fourn:{}
        }
    },
    methods:{
        async postFourn(){

            console.log(this.fourn)
            try {
                const _r = await this.$http.post('api/fournisseurs',this.fourn)

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