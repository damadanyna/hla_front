<template>
    <div class="text-gray-600 relative w-full">
        <factureVue class=" fixed top-0 left-0"></factureVue>
        <div class="p-2">
            <span class="text-2xl font-bold"> Prise en Charge </span>
        </div>
        <div class="flex p-2">
            
            <!-- Liste des patients -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-index')}"  class="menu-vert" 
            :to="{name:'pec-index'}">


                <span class="material-icons text-md mr-2"> article </span>
                <span class="text-sm"> Prise en charge </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-index'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion Fournisseurs et departements -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-consultation')}"  class="menu-vert" 
            :to="{name:'pec-consultation'}"> 
                <span class="material-icons text-md mr-2"> article </span>
                <span class="text-sm"> Consulation </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-consultation'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion des tarifs -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-service')}"  class="menu-vert" 
            :to="{name:'pec-service'}">


                <span class="material-icons text-md mr-2"> groups </span>
                <span class="text-sm"> Service </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-service'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion des entreprises -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-soc')}"  class="menu-vert" 
            :to="{name:'pec-soc'}">


                <span class="material-icons text-md mr-2"> groups </span>
                <span class="text-sm"> Société </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-soc'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>
        </div>

        <router-view ></router-view>
    </div>
</template>

<script>
import factureVue from './pec/facture.vue'; 
export default {
    components:{factureVue},
    data(){
        return{
            module_name:"prise-en-charge"
        }
    }
}
</script>

<style>

</style>