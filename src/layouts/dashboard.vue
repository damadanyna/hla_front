<template>  
    <div class="flex " v-if="on_show">
        <sidebar />
        <router-view class="h-screen max-h-screen overflow-auto"></router-view>
    </div>
    <div v-else class="w-screen h-screen flex justify-center items-center">
        <span class="text-gray-600"> Chargement ... </span>
    </div>
</template>

<script>
export default {
    data(){
        return{
            on_show:false
        }
    },
    methods:{
        async init(){
            // alert(this.$route.name)
            await this.statusConnection()
            if(!this.$store.state.user.util_login){
                if(this.$route.name){
                    this.$router.push(`/login`)
                }
            }else{
                this.on_show = true
            }
        }
    },
    mounted(){
        this.init()
    }
}
</script>