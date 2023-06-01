<template>
    <div class="text-gray-600 w-full flex flex-column">
        <div class="flex flex-column">
            <div class="p-2">
                <span class="text-2xl font-bold"> Paramètres </span>
            </div>
            <TabMenu :model="items" style="z-index:50" class="sticky top-0">
            </TabMenu>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data(){
        return{
            items:[
				{
					label:"Gestion Utilisateurs",
					icon:"pi pi-fw pi-user",
					to:{name:'settings-user'}
				},
                {
					label:"Historique des actions",
					icon:"pi pi-fw pi-history",
					to:{name:'settings-history'}
				}
			]
        }
    },
    mounted(){
    }
}
</script>

<style>
/* Primevue Style */
.p-menubar-end{
  padding: 2px;
}
/*  */
</style>


