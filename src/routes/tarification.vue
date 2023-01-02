<template>
    <div class="text-gray-600 relative w-full">
        <div class="p-2">
            <span class="text-2xl font-bold"> Tarification </span>
        </div>
        <div class="flex p-2">
            
            <!-- Tarification Service -->
            <router-link :class="{'menu-vert-active':($route.name == 'tarif-service')}"  class="menu-vert" 
            :to="{name:'tarif-service'}">


                <span class="material-icons  mr-2"> list </span>
                <span class="text-sm"> Services </span>
                <transition name="fade">
                    <span v-if="$route.name == 'tarif-service'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Tarification Médicaments -->
            <router-link :class="{'menu-vert-active':($route.name == 'tarif-med')}"  class="menu-vert" 
            :to="{name:'tarif-med'}">


                <span class="material-icons  mr-2"> list </span>
                <span class="text-sm"> Médicaments </span>
                <transition name="fade">
                    <span v-if="$route.name == 'tarif-med'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
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
            on_add_patient:false,
            module_name:"fiche-patient"
        }
    }
}
</script>

<style>

</style>