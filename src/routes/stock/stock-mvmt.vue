<template>
    <div class="">
        <div class="text-sm flex p-2 justify-center items-center">
            <button v-if="!($store.state.user.util_type == 'ph')" :class="{'sub-menu-active':cur_onglet == 'entre'}" @click=" ()=> {
                    cur_onglet = 'entre'
                } " class="mx-2">Les Entrées</button>
            <button @click=" ()=>{
                    cur_onglet = 'sortie'
                } " :class="{'sub-menu-active':cur_onglet == 'sortie'}"  class="mx-2"> Les Sorties </button>
        </div>

        <div class="">

            <!-- Liste et saisie des entrées -->
            <div v-show="cur_onglet == 'entre'" class=" flex flex-col justify-center items-center">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex justify-end items-end">
                    <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_entre)" />
                    <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button>
                </div>
                <!-- Eto ny liste e ! -->
                <div class="">
                    <table class="">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in list_label_entre" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } " v-for="p in list_entre" class="cursor-pointer relative"  :key="p.mvmt_id">
                                <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.mvmt_id == p.mvmt_id}"  class="p-2 border text-xs" 
                                v-for="l in list_label_entre" :key="l.key">
                                    <span v-if="l.key == 'mvmt_type'"> {{ getTypeEntre(p[l.key]) }} </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            

            <!-- Liste et asisie des sorties -->
            <div class="flex flex-col justify-center items-center" v-show="cur_onglet == 'sortie'">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex justify-end items-end">
                    <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_sortie)" />
                    <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button>
                </div>
                <!-- Eto ny liste e ! -->
                <div class="">
                    <table class="">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in list_label_sortie" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } " v-for="p in list_sortie" class="cursor-pointer relative"  :key="p.mvmt_id">
                                <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.mvmt_id == p.mvmt_id}"  class="p-2 border text-xs" 
                                v-for="l in list_label_sortie" :key="l.key">
                                    <span v-if="l.key == 'mvmt_type'"> {{ getTypeSortie(p[l.key]) }} </span>
                                    <span class="" v-else-if="l.key == 'depot_dest'"> {{ (p.mvmt_type == 'transfert')?p[l.key]:'-' }} </span>
                                    <span class="" v-else-if="l.key == 'dep_label'"> {{ (p.mvmt_type == 'transfert')?'-':p[l.key] }} </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Ajout de mouvement -->
        <add-mvmt v-if="on_add_mvmt" @close=" on_add_mvmt = false" @validate=" ()=>{

                on_add_mvmt = false
                if(cur_onglet == 'entre'){
                    getListEntreByDate()
                }else{
                    getListSortieByDate()
                }
        } " :action="cur_onglet" />
    </div>
</template>

<script>
export default {
    watch:{
        cur_onglet(a){
            if(a == 'entre'){
                this.getListEntreByDate()
            }else if(a == 'sortie'){
                this.getListSortieByDate()
            }
        },
        date_entre(a){
            this.getListEntreByDate()
        }
    },
    data(){
        return{
            on_add_mvmt:false,
            cur_onglet:'',
            date_entre: (new Date()).toLocaleString('en-CA').split(',')[0],
            date_sortie: (new Date()).toLocaleString('en-CA').split(',')[0],
            list_entre:[],
            list_sortie:[],

            list_selected:{},

            list_label_entre:[
                {label:"Numéro",key:"mvmt_num"},
                {label:"Type mouvement",key:"mvmt_type"},
                {label:"Fournisseur",key:"fourn_label"},
                {label:"Depot",key:"depot_label"},
                {label:"Nombre d'article ",key:"nb_art"},
                {label:"Montant ",key:"mvmt_montant"},
            ],
            list_label_sortie:[
                {label:"Numéro",key:"mvmt_num"},
                {label:"Type mouvement",key:"mvmt_type"},
                {label:"Département",key:"dep_label"},
                {label:"Depot de départ",key:"depot_exp"},
                {label:"Depot de déstination",key:"depot_dest"},
                {label:"Nb. article ",key:"nb_art"},
                {label:"Montant ",key:"mvmt_montant"},
            ]
        }
    },
    methods:{
        init(){
            if(this.$store.state.user.util_type == 'ph'){
                this.cur_onglet = 'sortie'
            }else{
                this.cur_onglet = 'entre'
            }
        },
        
        async getListEntreByDate(){
            try {
                const _r = await this.$http.get('api/mvmts/entre',{params:{date:this.date_entre}})
                let _d = _r.data

                if(_d.status){
                    this.list_entre = _d.list
                }else{
                    
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async getListSortieByDate(){
            try {
                const _r = await this.$http.get('api/mvmts/sortie',{params:{date:this.date_sortie}})
                let _d = _r.data

                if(_d.status){
                    this.list_sortie = _d.list
                }else{
                    
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
    },
    beforeMount(){
        this.init()
    },
    mounted(){
        
    }
}
</script>

<style scoped>


.sub-menu-active{
    @apply border-b-2 font-bold;
}

</style>