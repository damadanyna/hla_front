x<template>
    <div class="text-gray-600 relative w-full" v-if="on_show">
        <div class="p-2">
            <span class="text-2xl font-bold"> Stock </span>
        </div>
        <div class="flex p-2">
            
            <!-- Liste des articles -->
            <router-link :class="{'menu-vert-active':($route.name == 'stock-fiche')}"  class="menu-vert" 
            :to="{name:'stock-fiche'}">


                <span class="material-icons text-xl mr-2"> article </span>
                <span class="text-sm"> Article </span>
                <transition name="fade">
                    <span v-if="$route.name == 'stock-fiche'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion des mouvements -->
            <router-link :class="{'menu-vert-active':($route.name == 'stock-mvmt')}"  class="menu-vert" 
            :to="{name:'stock-mvmt'}">
            
                <span class="material-icons text-xl mr-2"> shopping_cart </span>
                <span class="text-sm"> Mouvements </span>
                <transition name="fade">
                    <span v-if="$route.name == 'stock-mvmt'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion Fournisseurs et departements -->
            <router-link :class="{'menu-vert-active':($route.name == 'stock-tiers')}"  class="menu-vert" 
            :to="{name:'stock-tiers'}">


                <span class="material-icons text-xl mr-2"> groups </span>
                <span class="text-sm"> Fournisseurs </span>
                <transition name="fade">
                    <span v-if="$route.name == 'stock-tiers'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion Famille -->
            <router-link :class="{'menu-vert-active':($route.name == 'stock-cat')}"  class="menu-vert" 
            :to="{name:'stock-cat'}">


                <span class="material-icons text-xl mr-2"> category </span>
                <span class="text-sm"> Catégories </span>
                <transition name="fade">
                    <span v-if="$route.name == 'stock-cat'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>
        </div>
        <router-view />
    </div>
    <div class="w-screen h-screen flex justify-center items-center" v-else>
        <img src="../assets/images/logo.jpg" width="400" height="400" alt="">
    </div>
</template>

<script>
export default {
    data(){
        return {
            module_name:"stock",
            on_show:false
        }
    },
    methods:{
        async init(){
            await this.statusConnection()
            if(!this.$store.state.user.util_login){
                this.$router.push(`/login?module=${this.module_name}`)
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