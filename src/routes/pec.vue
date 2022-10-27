<template>
    <div class="text-gray-600 relative w-full">

        <div class="p-2">
            <span class="text-2xl font-bold"> Prise en Charge </span>
        </div>
        <div class="flex p-2">
            
            <!-- Liste des patients -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-index')}"  class="menu-vert" 
            :to="{name:'pec-index'}">


                <i class="i ic:baseline-article mx-2 text-2xl"></i>
                <span class="text-sm"> Prise en charge </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-index'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion Fournisseurs et departements -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-consultation')}"  class="menu-vert" 
            :to="{name:'pec-consultation'}">


                <i class="i ic:baseline-groups mx-2 text-2xl"></i>
                <span class="text-sm"> Consulation </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-consultation'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion des tarifs -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-tarif')}"  class="menu-vert" 
            :to="{name:'pec-tarif'}">


                <i class="i ic:baseline-groups mx-2 text-2xl"></i>
                <span class="text-sm"> Tarif </span>
                <transition name="fade">
                    <span v-if="$route.name == 'pec-tarif'" class="left-1/4 bottom-1 rounded absolute block w-2/4 h-1 bg-blue-600"></span>
                </transition>
            </router-link>

            <!-- Gestion des entreprises -->
            <router-link :class="{'menu-vert-active':($route.name == 'pec-soc')}"  class="menu-vert" 
            :to="{name:'pec-soc'}">


                <i class="i ic:baseline-groups mx-2 text-2xl"></i>
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
export default {
    data(){
        return{
            module_name:"prise-en-charge"
        }
    }
}
</script>

<style>

</style>