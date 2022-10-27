<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajout utilisateur </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <i class="i ic:baseline-clear text-xl"></i> </button>
            </div>

            <div class="p-2">
                <div class="flex flex-col mb-2">
                    <div class="mb-2 flex">
                        <custom-input class="mr-2" v-model="user.util_login" label="Identifiant "/>
                        <custom-input class="mr-2" v-model="user.util_mdp" label="Mot de passe "/>
                    </div>
                    <div class="mb-2 flex">
                        <custom-input class="mr-2" v-model="user.util_label" label="Libellé "/>
                        <c-select class="mr-2" :datas="type_user" label="label" code="code" placeholder="Type"  v-model="user.util_type"/>
                    </div>
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postUser"> Enregistrer </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            user:{
                util_type:"a"
            },
            user_access:[],
        }
    },
    methods:{
        async postUser(){
            try {
                const _r = await this.$http.post('api/users',this.user)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    alert(_d.message)
                }
            } catch (e) {
                alert('Erreur de Connexion')
            }
        }
    },
    mounted(){
    }
}
</script> 