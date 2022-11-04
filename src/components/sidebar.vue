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
            <router-link v-if="$store.state.user.util_type != 'p'"  :class="{'menu-side-active':($route.name == 'settings')}"  class="menu-side pl-4 mb-2" 
            :to="{name:'settings-user'}">      
            
                <svg viewBox="0 0 24 24 " class=" w-7"><path class=" fill-current text-gray-500" d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4m-5 8h2v2H7v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2z" /></svg>
                
                <span class="text-sm"> Paramètres </span>
                <transition name="fade">
                    <span v-if="$route.name == 'settings'" class="menu-bar-style"></span>
                </transition>
            </router-link>

             <!-- Pour le route du profil -->
            <router-link :class="{'menu-side-active':($route.name == 'profil')}"  class="menu-side pl-4" 
            :to="{name:'home-app'}">
                <!-- <span class="material-icons text-md mr-2"> account_circle </span> -->
                <svg viewBox="0 0 24 24 " class=" w-7"><path class=" fill-current text-gray-500" d="M12 19.2c-2.5 0-4.71-1.28-6-3.2.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.232 7.232 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10c0-5.53-4.5-10-10-10z" /></svg>


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