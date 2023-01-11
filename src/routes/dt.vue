<template>
    <div class="text-gray-600 relative w-full">
        <div class="p-2">
            <span class="text-2xl font-bold"> Dentisterie </span>
        </div>
        <div class="flex p-2">
            
            <!-- Liste des patients pour la dentisterie -->
            <router-link class="menu-vert" 
            :to="{name:'dt-patient'}" :class="{'menu-vert-active':($route.name == 'dt-patient')}">


                <span class="material-icons mr-2">list</span>
                <span class="text-sm"> Liste des patients </span>
                <transition name="fade">
                    <span v-if="$route.name == 'dt-patient'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Onglet rendez-vous -->
            <router-link class="menu-vert" 
            :to="{name:'dt-rdv'}" :class="{'menu-vert-active':($route.name == 'dt-rdv')}">


                <span class="material-icons mr-2">calendar_today</span>
                <span class="text-sm"> Rendez-vous </span>
                <transition name="fade">
                    <span v-if="$route.name == 'dt-rdv'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
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