<template>
    <div class="">
        <div class="text-sm flex p-2 justify-center items-center">
            <button :class="{'sub-menu-active':cur_onglet == 'entre'}" @click=" ()=> {
                    cur_onglet = 'entre'
                } " class="mx-2">Les Entrées</button>
            <button @click=" ()=>{
                    cur_onglet = 'sortie'
                } " :class="{'sub-menu-active':cur_onglet == 'sortie'}"  class="mx-2"> Les Sorties </button>
        </div>

        <div class="">

            <!-- Liste et saisie des entrées -->
            <div v-if="cur_onglet == 'entre'" class=" flex justify-center items-center">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex justify-end items-end">
                    <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_entre)" />
                    <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button>
                </div>
                <!-- Eto ny liste e ! -->
                <div class="">

                </div>
            </div>
            

            <!-- Liste et asisie des sorties -->
            <div class="flex justify-center items-center" v-else-if="cur_onglet == 'sortie'">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex justify-end items-end">
                    <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_sortie)" />
                    <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button>
                </div>
                <!-- Eto ny liste e ! -->
                <div class="">

                </div>
            </div>
        </div>

        <!-- Ajout de mouvement -->
        <add-mvmt v-if="on_add_mvmt" @close=" on_add_mvmt = false" @validate=" ()=>{
                on_add_mvmt = false
        } " :action="cur_onglet" />
    </div>
</template>

<script>
export default {
    data(){
        return{
            on_add_mvmt:false,
            cur_onglet:'entre',
            date_entre: (new Date()).toLocaleString('en-CA').split(',')[0],
            date_sortie: (new Date()).toLocaleString('en-CA').split(',')[0],
            list_entre:[]
        }
    },
    methods:{
        init(){

        },
        async getListEntreByDate(){
            try {
                const _r = await this.$http.get('api/mvmts/by-date',{params:{date:this.date_entre}})
                let _d = _r.data

                if(_d.status){

                }else{
                    
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async getListSortieByDate(){

        }
    },
    mounted(){
        this.init()
    }
}
</script>

<style scoped>


.sub-menu-active{
    @apply border-b-2 font-bold;
}

</style>