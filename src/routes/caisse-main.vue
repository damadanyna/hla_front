<template>
    <div class="text-gray-600 relative w-full">

        <div class="flex p-3">
            <span class="font-bold text-gray-600 text-xl"> CAISSE PRINCIPALES </span>
        </div>

        <TabMenu :model="items" style="z-index:50" class="sticky top-0 z-">
            <!-- <template #item="{item}">
                <span class="material-symbols-outlined mr-2"> {{ item.icon }} </span>
                <router-link :to="item.to">{{item.label}}</router-link>
            </template> -->
        </TabMenu>

        <router-view />

    </div>
</template>

<script>

export default {
    data(){
        return{
            items: [
                {label:"Tableau de bord", to:{name:'cm-dashboard'}},
                {label:"Caisse Dispensaire",to:{name:'cm-disp'}},
                {label:"Caisse Hospitalisation",to:{name:'cm-hosp'}},
                {label:"Caisse Avance",to:{name:'cm-avance'}},
                {label:"Service / Médicaments",to:{name:'cm-med-serv'}},
            ]
        }
    },
    methods:{
        init(){
            
        }
    },
    beforeMount(){
    }
}

</script>