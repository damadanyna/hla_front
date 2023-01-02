<template>
    <div class="bg-gray-50 flex flex-col h-screen max-h-screen overflow-auto" :style="style">
        <div class="w-full text-gray-600">
            <!-- <div class="w-full flex items-center justify-center p-2 border-b">
                <span class="text-lg"> Hôpital </span>
            </div> -->

            <div class="m-2">

                <!-- Pour le route de l'accueil -->
                <router-link :class="{'menu-side-active font-bold':($route.name == 'home-app')}"  class="menu-side pl-4" 
                :to="{name:'home-app'}">
                    <span class="material-icons text-md mr-2"> apps </span>
                    <span class="text-sm"> Applications </span>

                    <transition name="fade">
                        <span v-if="$route.name == 'home-app'" class="menu-bar-style"></span>

                    </transition>
                </router-link>
            </div>
        </div>
        <div class="flex-grow">
        </div>

        <div class="m-2 text-gray-600">

            <!-- Pour le route du settings -->
            <router-link v-if="['a','m'].indexOf($store.state.user.util_type) != -1"  :class="{'menu-side-active':($route.name == 'settings')}"  class="menu-side pl-4 mb-2" 
            :to="{name:'settings-user'}">
                <span class="material-icons text-md mr-2"> admin_panel_settings </span>


                <span class="text-sm"> Paramètres </span>
                <transition name="fade">
                    <span v-if="$route.name == 'settings'" class="menu-bar-style"></span>

                </transition>
            </router-link>

             <!-- Pour le route du profil -->
            <router-link :class="{'menu-side-active':($route.name == 'profil')}"  class="menu-side pl-4" 
            :to="{name:'home-app'}">
                <span class="material-icons text-md mr-2"> account_circle </span>


                <span class="text-sm"><strong> {{ $store.state.user.util_label }} </strong> </span>

                <transition name="fade">
                    <span v-if="$route.name == 'profil'" class="menu-bar-style"></span>
                </transition>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            style:{
                width:`200px`,
                minWidth:`200px`
            }
        }
    }
}
</script>

<style>
.menu-side-active{
    @apply border bg-white shadow-sm;
}
.menu-side{
    @apply items-center p-2  relative rounded-md hover:bg-white bg-opacity-40 flex hover:bg-opacity-75;
}
.menu-bar-style{
    @apply left-0 top-1/4 rounded absolute block w-1 h-2/4 bg-blue-600;
}
</style>