<template>
    <div class="text-gray-600 relative w-full">
        <div class="p-2">
            <span class="text-2xl font-bold"> Patients </span>
        </div>
        <div class="flex p-2">
            
            <!-- Liste des patients -->
            <router-link :class="{'menu-vert-active':($route.name == 'patients')}"  class="menu-vert" 
            :to="{name:'patients'}">


                <i class="i ic:baseline-list mx-2 text-2xl"></i>
                <span class="text-sm"> Liste </span>
                <transition name="fade">
                    <span v-if="$route.name == 'patients'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
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