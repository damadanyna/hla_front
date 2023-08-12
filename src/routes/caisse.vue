<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="text-gray-600 relative w-full">
        <div class="p-2">
            <span class="text-2xl font-bold"> Caisse </span>
        </div>

        <TabMenu :model="items" style="z-index:50" class="sticky top-0 z-">
        </TabMenu>

        <router-view />
    </div>
</template>

<script>
export default {
    data(){
        return{
            items: [{label:"Caisse Dispensaire",icon:"pi pi-wallet", to:{name:'caisse-disp'}}]
        }
    },
    methods:{
        init(){
            
        }
    },
    beforeMount(){
        this.init()
    }
}
</script>

<style>

</style>