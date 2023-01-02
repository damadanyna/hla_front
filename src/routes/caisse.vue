<template>
    <div class="text-gray-600 relative w-full">
        <div class="p-2">
            <span class="text-2xl font-bold"> Caisse </span>
        </div>
        <div class="flex p-2">
            
            <!-- Liste des caisses principales -->
            <router-link v-if="checkModule('caisse-main') || inTypeUser(['a','g','m'])" :class="{'menu-vert-active':($route.name == 'caisse-main')}"  class="menu-vert" 
            :to="{name:'caisse-main'}">


                <span class="material-icons mr-2">list</span>
                <span class="text-sm"> Caisse Principale </span>
                <transition name="fade">
                    <span v-if="$route.name == 'caisse-main'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Liste des patients -->
            <router-link v-if="checkModule('caisse-disp') || inTypeUser(['a','g','m'])" :class="{'menu-vert-active':($route.name == 'caisse-disp')}"  class="menu-vert" 
            :to="{name:'caisse-disp'}">


                <span class="material-icons mr-2">list</span>
                <span class="text-sm"> Caisse Dispensaire </span>
                <transition name="fade">
                    <span v-if="$route.name == 'caisse-disp'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>
        </div>
        <router-view />
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    }
}
</script>

<style>

</style>