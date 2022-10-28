<template>  
    <div class="flex justify-center items-center w-screen h-screen max-h-screen">
        <div class="flex flex-col  items-center justify-center text-gray-600"> 
            <img src="../assets/images/logo.jpg" class="mb-5" alt="" width="200" height="200" srcset="">

            <form action="/" @submit.prevent="setAuth" method="post">
                <custom-input class="mb-2 w-56" v-model="auth.id" label="Indentifiant" />
                <custom-input class="mb-2 w-56" type="password"  v-model="auth.pass" label="Mot de passe"/>
                <input type="text">

                <div class="flex justify-end text">
                    <button type="submit" class="bt-p-s flex justify-center items-center">
                        <i class="mr-2 i ic:baseline-login"></i>
                        <span class="">Connexion</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>


export default {
    data(){
     
        return{
            auth:{
                id:'',
                pass:''
            }
        }
    },
    methods:{
        async setAuth(){
            if(this.$route.query.module){
                this.auth.module = this.$route.query.module
            }
            try {
                const _r = await this.$http.post('api/auth',this.auth)

                let _d = _r.data
                if(_d.status){
                    this.$store.commit('setUser',_d.u)
                    this.$router.push('/')
                }else{
                    alert(_d.message)
                }
            } catch (e) {
                alert('Erreur de connexion')
            }
        }
    }
}
</script>