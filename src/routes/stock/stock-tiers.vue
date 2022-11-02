 <template>
    <div class="">
        <div class="p-2">
            <!-- <span class="text-xs"> Gestion des fournisseurs et les départements </span> -->
        </div>

        <div class="flex p-2 items-center justify-center">
            <button :class="{'sub-menu-active':cur_onglet == 'fourn'}" @click=" ()=> {
                    cur_onglet = 'fourn'
                    getListFourn()
                } " class="mx-2">Fournisseurs</button>
            <button @click=" ()=>{
                    cur_onglet = 'dep'
                    getListdep()
                } " :class="{'sub-menu-active':cur_onglet == 'dep'}"  class="mx-2"> Départements </button>
        </div>


        
        <div class="flex justify-center items-center">
            <!-- Onglet Fournisseurs -->
            <div class="" v-if="cur_onglet == 'fourn'">
                <!-- Liste fornisseurs -->
                <div class="">
                    <button @click=" on_add_fourn = true " class="bt-icon border"> <span class="material-icons text-sm"> add </span> </button>
                    <table class="">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in fourn_list_label" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } "  class="cursor-pointer relative" v-for="p in list_fourn" :key="p.fourn_id">
                                <td class="p-2 border text-xs " :class="{'bg-indigo-600 bg-opacity-10':list_selected.fourn_id == p.fourn_id}" v-for="l in fourn_list_label" :key="l.key">
                                    <span> {{ p[l.key] }} </span>
                                </td> 
                                <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.fourn_id == p.fourn_id"> 
                                    <button @click=" on_view_fourn = true " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <span class="material-icons text-sm"> edit </span> </button> </td>
                            </tr>
                        </tbody>
                    </table>
                </div> 
            </div> 
            <!-- Onglet département -->
            <div class="" v-else-if="cur_onglet == 'dep'">
                <button @click="  on_add_dep = true " class="bt-icon"> <span class="material-icons text-sm"> add </span> </button>
                <div class="">
                    <table class="">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in dep_list_label" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } " class="cursor-pointer relative" v-for="p in list_dep" :key="p.dep_id">
                                <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.dep_id == p.dep_id}" class="p-2 border text-xs" v-for="l in dep_list_label" :key="l.key">
                                    <span> {{ p[l.key] }} </span>
                                </td>

                                <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.dep_id == p.dep_id"> 
                                    <button @click=" on_view_dep = true " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <span class="material-icons text-sm"> add </span> </button> </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <!-- Les boîtes de dialogue d'ajout -->

        <!-- Fournisseur -->
        <add-fourn @close=" on_add_fourn = false " v-if="on_add_fourn" @validate=" ()=>{
                on_add_fourn = false
                getListFourn()
            } " />
        <det-fourn :f="list_selected" @close=" on_view_fourn = false " v-if="on_view_fourn" @validate=" ()=>{
                on_view_fourn = false
                getListFourn()
            } " />

        <!-- Département -->
        <add-dep @close=" on_add_dep = false " v-if="on_add_dep" @validate=" ()=>{
                on_add_dep = false
                getListdep()
            } " />

        <det-dep :d="list_selected" @close=" on_view_dep = false " v-if="on_view_dep" @validate=" ()=>{
                on_view_dep = false
                getListdep()
            } " />
                

    </div>
</template>

<script>
export default {
    data(){
        return{
            cur_onglet:'fourn',

            fourn_list_label:[
                {label:"Code",'key':'fourn_code'},
                {label:"Nom",key:'fourn_label'},
                {label:"Nif",key:'fourn_nif'},
                {label:"Stat",key:'fourn_stat'}
            ],
            list_fourn:[],
            on_add_fourn:false,
            on_view_fourn:false,

            list_selected:{},


            dep_list_label:[
                {label:"Code",'key':'dep_code'},
                {label:"Nom",'key':'dep_label'},
            ],
            list_dep:[],
            on_add_dep:false,
            on_view_dep:false

        }
    },
    methods:{
        async getListFourn(){
            try {
                const _r = await this.$http.get('api/fournisseurs')

                let _d = _r.data

                if(_d.status){
                    this.list_fourn = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async getListdep(){
            try {
                const _r = await this.$http.get('api/departements')

                let _d = _r.data

                if(_d.status){
                    this.list_dep = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },
    mounted(){
        this.getListFourn()
    }
}
</script>

<style scoped>


.sub-menu-active{
    @apply border-b-2;
}

</style>