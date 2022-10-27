<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajout de société </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
                <div class="flex flex-col mb-2">
                    <div class="mb-2 flex">
                        <custom-input class="mr-2" v-model="ent.ent_code" label="Code"/>
                        <custom-input class="mr-2 w-56" v-model="ent.ent_label" label="Nom"/>
                    </div>

                    <div class="mb-2 flex">
                        <custom-input class="mr-2 " v-model="ent.ent_pat_percent" label="% Patient"/>
                        <custom-input class="mr-2" v-model="ent.ent_soc_percent" label="% Société"/>
                    </div>

                    <div class="mb-2 flex">
                        <custom-input class="mr-2 w-full" v-model="ent.ent_adresse" label="Adresse"/>
                        
                    </div>
                    <div class="mb-2 flex">
                        <custom-input class="mr-2 w-56" v-model="ent.ent_num_compte" label="Numéro de compte"/>
                    </div>
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postEnt"> Ajouter </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            ent:{},
        }
    },
    methods:{
        async postEnt(){
            try {
                const _r = await this.$http.post('api/entreprises',this.ent)
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