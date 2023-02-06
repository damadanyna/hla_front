<template>
    <div class="">
        <div class="text-sm flex p-2">
            <!-- <button v-if="!($store.state.user.util_type == 'ph')" :class="{'sub-menu-active':cur_onglet == 'entre'}" @click=" ()=> {
                    cur_onglet = 'entre'
                } " class="mx-2">Les Entrées</button>
            <button @click=" ()=>{
                    cur_onglet = 'sortie'
                } " :class="{'sub-menu-active':cur_onglet == 'sortie'}"  class="mx-2"> Les Sorties </button> -->
            <SelectButton v-model="cur_onglet" :options="tabMvmt" optionValue="value" optionLabel="name" aria-labelledby="single" class="p-button-sm" />
        </div>


        <div class="">

            <!-- Liste et saisie des entrées -->
            <div v-if="cur_onglet == 'entre'" class=" flex flex-column">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex align-items-end">
                    <!-- <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_entre)" /> -->
                    <div class="flex flex-column mt-2">
                        <span class="font-bold text-sm"> {{ dateToText(date_entre) }} </span>
                        <Calendar placeholder="ex : 09/09/1998" v-model="date_entre"  dateFormat="dd/mm/yy" class="p-inputtext-sm"  />    
                    </div>
                    <!-- <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button> -->
                    <Button label="Ajouter" class="p-button-sm ml-2" icon="pi pi-plus" @click="on_add_mvmt = true" />
                </div>

                <Divider />
                <!-- Eto ny liste e ! -->
                <div class="w-full p-2">
                    <table class="w-full">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm text-center">

                                <th v-for="l in list_label_entre" class="p-2 border text-xs text-left" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } " v-for="p in list_entre" class="cursor-pointer relative"  :key="p.mvmt_id">
                                <td :class="{'active-row':list_selected.mvmt_id == p.mvmt_id}"  class="p-2 border text-xs" 
                                v-for="l in list_label_entre" :key="l.key">
                                    <span v-if="l.key == 'mvmt_type'"> {{ getTypeEntre(p[l.key]) }} </span>
                                    <span class="" v-else-if="l.key == 'mvmt_montant'"> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            

            <!-- Liste et asisie des sorties -->
            <div class="flex flex-column " v-if="cur_onglet == 'sortie'">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex align-items-end">
                    <!-- <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_sortie)" />
                    <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button> -->
                    <div class="flex flex-column mt-2">
                        <span class="font-bold text-sm"> {{ dateToText(date_sortie) }} </span>
                        <Calendar placeholder="ex : 09/09/1998" v-model="date_sortie"  dateFormat="dd/mm/yy" class="p-inputtext-sm"  />    
                    </div>
                    <!-- <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button> -->
                    <Button label="Ajouter" class="p-button-sm ml-2" icon="pi pi-plus" @click="on_add_mvmt = true" />
                </div>

                <Divider/>
                <!-- Eto ny liste e ! -->
                <div class="w-full p-2">
                    <table class="w-full">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in list_label_sortie" class="p-2 border text-xs text-left" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                } " v-for="p in list_sortie" class="cursor-pointer relative"  :key="p.mvmt_id">
                                <td :class="{'active-row':list_selected.mvmt_id == p.mvmt_id}"  class="p-2 border text-xs" 
                                v-for="l in list_label_sortie" :key="l.key">
                                    <span v-if="l.key == 'mvmt_type'"> {{ getTypeSortie(p[l.key]) }} </span>
                                    <span class="" v-else-if="l.key == 'depot_dest'"> {{ (p.mvmt_type == 'transfert')?p[l.key]:'-' }} </span>
                                    <span class="" v-else-if="l.key == 'dep_label'"> {{ (p.mvmt_type == 'transfert')?'-':p[l.key] }} </span>
                                    <span class="" v-else-if="l.key == 'mvmt_montant'"> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Ajout de mouvement -->
        <add-mvmt :visible="on_add_mvmt" @close=" on_add_mvmt = false" @validate=" ()=>{

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

            // console.log(a)
        },
        date_entre(a){
            this.getListEntreByDate()
        }
    },
    data(){
        return{
            on_add_mvmt:false,
            cur_onglet:'',
            date_entre: new Date(),
            date_sortie: new Date(),
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
            ],

            tabMvmt: [
                {name: 'Les Entrées', value: 'entre'},
                {name: 'Les Sorties', value: 'sortie'},
            ],
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

<style>

</style>