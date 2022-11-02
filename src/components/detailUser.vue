<template>
    <div class="bg-dialog-box">

        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Détails utilisateur </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons text-sm"> clear </span> </button>
            </div>

            <div class="p-2">
                <div class="flex flex-col mb-2">
                    <div class="mb-2 flex">
                        <custom-input class="mr-2" v-model="user.util_login" label="Identifiant "/>
                    </div>
                    <div class="mb-2 flex">
                        <custom-input class="mr-2" v-model="user.util_label" label="Libellé "/>
                        <c-select class="mr-2" :datas="type_user" label="label" code="code" placeholder="Type"  v-model="user.util_type"/>
                    </div>
                </div>
                <div class="text-xs">
                    <div class="mb-2 flex jus items-center">
                        <input v-model="mng_pass.change" type="checkbox" name="" id="mang_pass">
                        <label class="ml-2" for="mng_pass">Changer de mot de passe</label>
                    </div>
                    <div class="" v-if="mng_pass.change" >
                        <custom-input type="password" v-model="mng_pass.pass" label="Nouveau mot de passe" />
                    </div>
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="updateUser"> Enregistrer </button>
                </div>
            </div>

            <div class="mt-2">
                <div class="p-2 border">
                    <span class="text-sm "> Liste des accès de l'utilisateur </span>
                </div>

                <div class="p-2 flex text-xs justify-center items-center" v-if="user_access.length <= 0 ">
                    <i class="i text-2xl mx-2 ic:baseline-info"></i>
                    <span v-if="u.util_type == 'm' || u.util_type == 'a'" class=" mx-2 italic"> L'utilisateur a accès à tous les modules </span>
                </div>

                <div class="flex text-xs">
                    <div class=" p-2 rounded m-2" v-for="m in user_access" :key="m.ua_id">
                        <input @click="updateAccess(m.module_id)" type="checkbox" :checked=" m.ua_util_id != null " :id="m.module_id" >
                        <label class="mx-2" :for="m.module_id"> {{ m.module_label }} </label>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props:['u'],
    data(){
        return{
            user:{},
            user_access:[],
            module_list:[],
            mng_pass:{
                change:false,
                pass:''
            }
        }
    },
    methods:{
        async getDetailUser(){
            try {
                const _r = await this.$http.get(`api/user/${this.u.util_id}`)

                let _d = _r.data

                if(_d.status) {
                    this.user = _d.user
                    this.user_access = _d.user_access
                    this.module_list = _d.module_list
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                console.log(e)
            }
        },
        async updateUser(){

            try {
                delete this.user.util_mdp
                delete this.user.util_date_enreg

                const _r = await this.$http.put(`api/user`,{user:this.user,mng_pass:this.mng_pass})

                let _d = _r.data

                if(_d.status) {
                    this.getDetailUser()
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                console.log(e)
            }
        },
        async updateAccess(id_module){
            try {

                const _r = await this.$http.put(`api/user/access/${this.user.util_id}`,{id_module})
                let _d = _r.data

                if(_d.status) {
                    this.getDetailUser()
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                console.log(e)
            }
        }
    },
    mounted(){
        this.getDetailUser()
    }
}
</script> 