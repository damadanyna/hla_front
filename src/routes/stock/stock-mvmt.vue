<template>
    <div class="">
        <div class="text-sm flex p-2 sticky bg-white" style="top:58px">
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
                <div class="p-2 flex flex-column sticky border-bottom-1 border-200 bg-white" style="top:118px">
                    <!-- <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_entre)" /> -->
                    <div class="flex align-items-end mb-2 border-bottom-1 border-200 pb-2">

                        <!-- <div class="flex flex-column mr-2">
                            <span class="p-input-icon-right">
                                <i class="pi pi-search" />
                                <InputText class="p-inputtext-sm" type="text" v-model="filters.art_label" placeholder="ex : Doliprane"/>
                            </span>
                        </div> -->

                        <div class="flex flex-column mr-2">
                            <span class="text-sm font-bold"> Fournisseur </span>
                            <Dropdown v-model="filters.fourn_id" :options="list_fourn" optionValue="fourn_id" optionLabel="fourn_label" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ">
                            <span class="font-bold text-sm"> {{ dateToText(date_entre2) }} </span>
                            <InputText placeholder="ex : 09/09/1998" v-model="date_entre2"  type="date" class="p-inputtext-sm"  />    
                        </div>
                        <span class="mx-2"> au </span>
                        <div class="flex flex-column">
                            <span class="font-bold text-sm"> {{ dateToText(date_entre) }} </span>
                            <InputText placeholder="ex : 09/09/1998" v-model="date_entre"  type="date" class="p-inputtext-sm"  />    
                        </div>


                        
                    </div>
                    <!-- <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button> -->
                    <div class="flex">
                        <Button label="Ajouter" class="p-button-sm" icon="pi pi-plus" @click="on_add_mvmt = true" />

                        <Button label="Exporter en Excel" class="p-button-sm mx-2 p-button-text" icon="pi pi-print" :loading="on_export" @click="openSaveDialog"/>

                        <Button :loading="loading" label="Imprimer" class="p-button-sm p-button-raised p-button-text p-button-help ml-2" icon="pi pi-print" 
                        @click="printListMvmt"/>

                        <span class="flex-grow-1"></span>


                        <Button v-if="list_selected.mvmt_id && inTypeUser(['m','a','g'])" label="Supprimer" 
                        class="p-button-sm p-button-raised p-button-text p-button-danger mr-2" @click="delMvmt" />
                        <Button v-if="list_selected.mvmt_id" label="Détails" class="p-button-sm p-button-raised p-button-text" @click="on_det_mvmt = true" />
                    </div>
                </div>
                <!-- Eto ny liste e ! -->
                <div class="w-full p-2">
                    <table class="w-full">
                        <thead class="" >
                            <tr class="bg-gray-50 text-gray-700 text-sm text-center " >

                                <th v-for="l in list_label_entre" class="p-2 border text-xs text-left sticky" style="top:258px" :key="l.key">
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
                                    <span class="" v-else-if="l.key == 'mvmt_date'"> {{ new Date(p.mvmt_date).toLocaleDateString() }} </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            

            <!-- Liste et saisie des sorties -->
            <div class="flex flex-column " v-else-if="cur_onglet == 'sortie'">
                <!-- Ty le eo ambony iny e !!  -->
                <div class="p-2 flex flex-column sticky border-bottom-1 border-200 bg-white" style="top:118px">
                    <!-- <custom-input type="date" v-model="date_entre"  :label=" dateToText(date_sortie)" />
                    <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button> -->
                    <div class="flex align-items-end mb-2 border-bottom-1 border-200 pb-2">
                        <div class="flex flex-column mt-2">
                            <span class="font-bold text-sm"> {{ dateToText(date_sortie2) }} </span>
                            <InputText placeholder="ex : 09/09/1998" v-model="date_sortie2"  type="date" class="p-inputtext-sm"  />    
                        </div>
                        <span class="mx-2"> au </span>
                        <div class="flex flex-column mt-2">
                            <span class="font-bold text-sm"> {{ dateToText(date_sortie) }} </span>
                            <InputText placeholder="ex : 09/09/1998" v-model="date_sortie"  type="date" class="p-inputtext-sm"  />    
                        </div>
                    </div>
                    <!-- <button class="bt-p-s ml-2" @click=" on_add_mvmt = true"> Ajouter </button> -->
                    <div class="flex">
                        <Button label="Ajouter" class="p-button-sm ml-2" icon="pi pi-plus" @click="on_add_mvmt = true" />


                        <Button label="Exporter en Excel" class="p-button-sm mx-2 p-button-text" icon="pi pi-print" :loading="on_export" @click="openSaveDialog"/>
                        
                        <Button :loading="loading" label="Imprimer" class="p-button-sm p-button-raised p-button-text p-button-help ml-2" icon="pi pi-print" 
                        @click="printListMvmt"/>

                        <div class="relative">
                            <Button v-if="$store.state.user.util_type == 'ph' || inTypeUser(['g','m','a']) " label="Pharmacie" class="p-button-sm p-button-raised p-button-text p-button-danger ml-2" 
                                @click="on_det_em = true"/>

                            <span v-if="nbEncMvmt != 0" class="absolute text-xs bg-red-500 p-1 border-1 border-red-500 text-red-500" style="top:-2px;right: -2px;"></span>
                        </div>


                        <span class="flex-grow-1"></span>

                        <Button v-if="list_selected.mvmt_id" label="Détails" class="p-button-sm p-button-raised p-button-text" @click="on_det_mvmt = true" />
                    </div>
                </div>

                <!-- Eto ny liste e ! -->
                <div class="w-full p-2">
                    <table class="w-full">
                        <thead class="rounded-t" >
                            <tr class="bg-gray-50 text-gray-700 text-sm ">

                                <th v-for="l in list_label_sortie" class="p-2 border text-xs text-left sticky" style="top:258px" :key="l.key">
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
                                    <span class="" v-else-if="l.key == 'depot_dest'"> {{ (p.mvmt_type == 'transfert')?p[l.key]:(p.dep_label)?p.dep_label:'-' }} </span>
                                    <!-- <span class="" v-else-if="l.key == 'dep_label'"> {{ (p.mvmt_type == 'transfert')?'-':p[l.key] }} </span> -->
                                    <span class="" v-else-if="l.key == 'mvmt_montant'"> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tokony eto zany ilay élément ho an'ilay suivie fa mbola miandry confirmation -->
            <div class="" v-else-if="cur_onglet == 'suivi'">

                <!-- ici les actions -->
                <div class="flex flex-column p-2 sticky bg-white" style="top:118px">

                    <!-- les filtres -->
                    <div class="flex border-bottom-1 align-items-end border-200 py-2 "  >

                        <div class="flex flex-column">
                            <span class="text-sm font-bold"> Mouvement </span>
                            <Dropdown v-model="s_filters.action" :options="s_action" optionLabel="label" optionValue="key" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" v-if="s_filters.action == 'entre'">
                            <span class="text-sm font-bold"> Type de mouvement </span>
                            <Dropdown v-model="s_filters.type" :options="stock.mvmt_type_entre" optionLabel="l" optionValue="k" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" v-if="s_filters.action == 'sortie'">
                            <span class="text-sm font-bold"> Type de mouvement </span>
                            <Dropdown v-model="s_filters.type" :options="stock.mvmt_type_sortie" optionLabel="l" optionValue="k" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2">
                            <span class="text-sm font-bold"> Article </span>
                            <InputText v-model="s_filters.art_label" placeholder="ex : doliprane" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" v-if="s_filters.action == 'entre'">
                            <span class="text-sm font-bold"> Fournisseur </span>
                            <Dropdown v-model="s_filters.fourn_id" :options="list_fourn" optionLabel="fourn_label" 
                            optionValue="fourn_id" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" v-if="s_filters.action == 'sortie'">
                            <span class="text-sm font-bold"> Dépôt de départ </span>
                            <Dropdown v-model="s_filters.depot_exp" :options="list_depot" optionLabel="depot_label" 
                            optionValue="depot_id" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" v-if="s_filters.action == 'sortie' && s_filters.type == 'transfert'" >
                            <span class="text-sm font-bold"> Dépôt de destination </span>
                            <Dropdown v-model="s_filters.depot_dest" :options="list_depot" optionLabel="depot_label" 
                            optionValue="depot_id" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" v-if="s_filters.action == 'sortie' && s_filters.type != 'transfert'" >
                            <span class="text-sm font-bold"> Département </span>
                            <Dropdown v-model="s_filters.dep_id" :options="list_dep" optionLabel="dep_label" 
                            optionValue="dep_id" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" >
                            <span class="text-sm font-bold"> {{ dateToText(s_filters.date_1) }} </span>
                            <InputText v-model="s_filters.date_1" type="date" class="p-inputtext-sm" />
                        </div>

                        <div class="flex flex-column ml-2" >
                            <span class="text-sm font-bold"> {{ dateToText(s_filters.date_2) }} </span>
                            <InputText v-model="s_filters.date_2" type="date" class="p-inputtext-sm" />
                        </div>
                    </div>
                    <!-- Les boutons -->
                    <div class="border-bottom-1 border-200 py-2 flex">

                        

                        <Button label="Exporter en Excel" class="p-button-sm mx-2 p-button-text" icon="pi pi-print" :loading="suivi_on_export" @click="openDialogExportSuivi"/>

                        <Button :loading="suivi_on_print" label="Imprimer" class="p-button-sm p-button-raised p-button-text p-button-help ml-2" icon="pi pi-print" 
                        @click="printSuivi"/>

                        <span class="flex-grow-1"></span>

                        <Button label="Recherche" class="p-button-sm" icon="pi pi-search" @click="searchMart" />

                    </div>
                </div>

                <!-- Ici l'affichage des tableaux -->
                <div class="p-2">

                    <!-- LES DATAS DES ENTREES -->
                    <table class="w-full" v-if="s_filters.action == 'entre'">
                        <thead class="rounded-t" >
                            <tr class="bg-gray-50 text-gray-700 text-sm ">

                                <th v-for="l in s_label_entre" class="p-2 border text-xs text-left sticky" style="top:258px" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in s_mart_list" class="cursor-pointer relative"  :key="p.mart_id">
                                <td   class="p-2 border text-xs" 
                                v-for="l in s_label_entre" :key="l.key">
                                <span v-if="l.key == 'mvmt_date'"> {{ new Date(p.mvmt_date).toLocaleDateString() }} </span>
                                    <span class="" v-else-if="l.key == 'depot_dest'"> {{ (p.mvmt_type == 'transfert')?p[l.key]:(p.dep_label)?p.dep_label:'-' }} </span>
                                    <!-- <span class="" v-else-if="l.key == 'dep_label'"> {{ (p.mvmt_type == 'transfert')?'-':p[l.key] }} </span> -->
                                    <span class="" v-else-if="l.key == 'mvmt_montant'"> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                                    <span class="" v-else-if=" l.key.split(':')[0] == 'dp'" >
                                        {{ getStockArt(l.key,p) }}
                                    </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                            <tr class="">
                                <td class="last-row" :colspan="s_label_entre.length - 2"> TOTAL </td>
                                <td class="last-row">
                                    <div class="flex flex-column">
                                        <span class=""> Résultat </span>
                                        <span class="font-bold"> {{ s_mart_nb}} </span>
                                    </div>
                                </td>
                                <td class="last-row">
                                    <div class="flex flex-column">
                                        <span class=""> Affichage </span>
                                        <span class="font-bold"> {{ s_mart_list.length }} </span>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                    <!-- LES DATAS DES SORTIES -->
                    <table class="w-full" v-if="s_filters.action == 'sortie'">
                        <thead class="rounded-t" >
                            <tr class="bg-gray-50 text-gray-700 text-sm ">

                                <th v-for="l in s_label_sortie" class="p-2 border text-xs text-left sticky" style="top:258px" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in s_mart_list" class="cursor-pointer relative"  :key="p.mart_id">
                                <td   class="p-2 border text-xs" 
                                v-for="l in s_label_sortie" :key="l.key">
                                    <span v-if="l.key == 'mvmt_date'"> {{ new Date(p.mvmt_date).toLocaleDateString() }} </span>
                                    <span class="" v-else-if="l.key == 'depot_dest'"> {{ (p.mvmt_type == 'transfert')?p[l.key]:(p.dep_label)?p.dep_label:'-' }} </span>
                                    <!-- <span class="" v-else-if="l.key == 'dep_label'"> {{ (p.mvmt_type == 'transfert')?'-':p[l.key] }} </span> -->
                                    <span class="" v-else-if="l.key == 'mvmt_montant'"> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                                    <span class="" v-else-if=" l.key.split(':')[0] == 'dp'" >
                                        {{ getStockArt(l.key,p) }}
                                    </span>
                                    <span v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>

                            <tr class="">
                                <td class="last-row" :colspan="s_label_entre.length - 2"> TOTAL </td>
                                <td class="last-row">
                                    <div class="flex flex-column">
                                        <span class=""> Résultat </span>
                                        <span class="font-bold"> {{ s_mart_nb}} </span>
                                    </div>
                                </td>
                                <td class="last-row">
                                    <div class="flex flex-column">
                                        <span class=""> Affichage </span>
                                        <span class="font-bold"> {{ s_mart_list.length }} </span>
                                    </div>
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

        <!-- Détails de mouvement -->

        <det-mvmt :mvmt="list_selected" :visible="on_det_mvmt" @close=" on_det_mvmt = false"  />


        <!-- Détails de sortie médicaments encaissements -->
        <det-enc-mvmt :visible="on_det_em" @close=" on_det_em = false" @change=" ()=>{
            getListSortieByDate()
            getNbEncMvmtNow()
        } " />
    </div>
</template>

<script>

import XLSX from "xlsx";

export default {
    watch:{
        cur_onglet(a){
            if(a == 'entre'){
                this.getListEntreByDate()
            }else if(a == 'sortie'){
                this.getListSortieByDate()
                this.getNbEncMvmtNow()
            }

            this.list_selected = {}

            // console.log(a)
        },
        date_entre2(a){
            this.getListEntreByDate()
            this.list_selected = {}
        },
        date_sortie2(a){
            this.getListSortieByDate()
            this.list_selected = {}
        },
        date_entre(a){
            this.getListEntreByDate()
            this.list_selected = {}
        },
        date_sortie(a){
            this.getListSortieByDate()
            this.list_selected = {}
        },
        'filters.fourn_id'(){
            this.getListEntreByDate()
        },
        's_filters.art_label'(a){
            if(a){
                this.searchMart()
            }else{
                this.s_mart_list = []
                this.s_mart_nb = 0
            }
        }
    },
    data(){
        return{
            on_add_mvmt:false,
            on_det_mvmt:false,
            cur_onglet:'',
            date_entre: this.dateToInput(new Date()),
            date_entre2: this.dateToInput(new Date()),
            date_sortie2:this.dateToInput(new Date()),
            date_sortie: this.dateToInput(new Date()),
            list_entre:[],
            list_sortie:[],

            list_selected:{},

            list_label_entre:[
                {label:"Numéro",key:"mvmt_num"},
                {label:"Date",key:"mvmt_date"},
                {label:"Type mouvement",key:"mvmt_type"},
                {label:"Fournisseur",key:"fourn_label"},
                {label:"Depot",key:"depot_label"},
                {label:"Nombre d'article ",key:"nb_art"},
                {label:"Montant ",key:"mvmt_montant"},
            ],
            list_label_sortie:[
                {label:"Numéro",key:"mvmt_num"},
                {label:"Type mouvement",key:"mvmt_type"},
                {label:"Depot de départ",key:"depot_exp"},
                {label:"Depot de déstination",key:"depot_dest"},

                {label:"Nb. article ",key:"nb_art"},
                {label:"Montant ",key:"mvmt_montant"},
            ],

            tabMvmt: [
                {name: 'Les Sorties', value: 'sortie'},
                {name: 'Suivies', value: 'suivi'},
            ],

            loading:false,
            nbEncMvmt:0,

            on_det_em:false,
            on_export:false,

            filters:{
                art_label:'',
                fourn_id:-1
            },

            list_fourn:[{fourn_id:-1,fourn_label:'Tous'}],
            list_depot:[],
            list_dep:[],

            //c'est juste du n'importe quoi de mettre une autre secation dans le truc et de faire choisir les 2 mêmes sections
            //ETO NY VARIABLE REHETRA MOMBA AN'ILAY ONGLET
            s_filters:{
                action:'entre',
                art_label:'',
                fourn_id:-1,
                depot_dest:-1,
                depot_exp:-1,
                dep_id:-1,
                date_1:this.dateToInput(new Date()),
                date_2:this.dateToInput(new Date()),
                type:'achat',
                limit:100
            },
            s_action:[
                {label:"Entrée".toUpperCase(),key:'entre'},
                {label:'sortie'.toUpperCase(),key:'sortie'}
            ],
            s_label_entre:[
                {label:'Numéro',key:'mvmt_num'},
                {label:'Code',key:'art_code'},
                {label:'Date',key:'mvmt_date'},
                {label:'Désignation',key:'art_label'},
                {label:'Quantité',key:'mart_qt'},
                {label:'Fournisseur',key:'fourn_label'},
                {label:'Dépôt',key:'depot_label'},
            ],
            s_label_sortie:[
                {label:'Numéro',key:'mvmt_num'},
                {label:'Code',key:'art_code'},
                {label:'Date',key:'mvmt_date'},
                {label:'Désignation',key:'art_label'},
                {label:'Quantité',key:'mart_qt'},
                {label:'Dépôt de départ',key:'depot_exp'},
                {label:'Dépôt de destination',key:'depot_dest'},
            ],
            s_mart_list:[],
            s_mart_nb:0,
            suivi_on_print:false,
            suivi_on_export:false,

            on_change_value:false

        }
    },
    methods:{
        init(){
            if(this.$store.state.user.util_type == 'ph'){
                this.cur_onglet = 'sortie'
            }else{
                this.tabMvmt.unshift({name: 'Les Entrées', value: 'entre'})
                this.cur_onglet = 'entre'
            }
        },
        
        async getListEntreByDate(){
            try {
                const _r = await this.$http.get('api/mvmts/entre',{params:{date:this.date_entre,date2:this.date_entre2,
                filters:this.filters}})
                let _d = _r.data

                if(_d.status){
                    this.list_entre = _d.list
                }
                
            } catch (e) {
                this.showNotifServerError()
            }
        },
        async getListSortieByDate(){
            try {
                const _r = await this.$http.get('api/mvmts/sortie',{params:{date:this.date_sortie,date2:this.date_sortie2,
                filters:this.filters}})
                let _d = _r.data

                if(_d.status){
                    this.list_sortie = _d.list
                }
                
            } catch (e) {
                this.showNotifServerError()
            }
        },
        async openSaveDialog(){
            const f = await window.electronAPI.openSaveDialog('Enregistrement du fichier Excel')

            if(f){

                let ff = f.split('.')
                if(ff.length > 1){
                    ff.splice(ff.length - 1,1)
                }
                ff = ff.join('.')
                await this.exportMvmt(ff)
            }
        },

        async openDialogExportSuivi(){
            const f = await window.electronAPI.openSaveDialog('Enregistrement du fichier Excel (Suivi Mouvement)')

            if(f){

                let ff = f.split('.')
                if(ff.length > 1){
                    ff.splice(ff.length - 1,1)
                }
                ff = ff.join('.')
                await this.exportSuivi(ff)
            }
        },

        async exportSuivi(filepath){
            try {
                this.suivi_on_export = true
                const r = await this.$http.get('api/mvmt/suivi/filters/export',{params:{filepath,filters:this.s_filters
                }})
                let d = r.data

                // console.log(r)

                if(d.status){
                    this.showNotif('success','Exportation Suivi ','Suivi bien exportés')

                    // const workbook = XLSX.read(d);

                    // /* write file */
                    // XLSX.writeFile(workbook, filepath);

                }else{
                    this.showNotif('error','Exportation Suivi',"Erreur dans la base de donnée")
                }

            } catch (e) {
                this.showNotifServerError()
            }

            this.suivi_on_export = false
        },
        async exportMvmt(filepath){
            this.on_export = true
            try {
                const r = await this.$http.get('api/mvmts/export/es',{params:{filepath,
                    action:this.cur_onglet,
                    date:(this.cur_onglet == 'entre')?this.date_entre:this.date_sortie,
                    date2:(this.cur_onglet == 'entre')?this.date_entre2:this.date_sortie2,
                }})
                let d = r.data

                if(d.status){
                    this.showNotif('success','Exportation mouvement ','Mouvement bien exportés')
                }else{
                    this.showNotif('error','Exportation mouvement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.on_export = false
        },

        async delMvmt(){
            try {
                const r = await this.$http.delete('api/mvmt',{params:{mvmt_id:this.list_selected.mvmt_id,user_id:this.getUserId()}})
                let d = r.data
                if(d.status){
                    if(this.cur_onglet == 'sortie'){
                        this.getListSortieByDate()
                    }else{
                        this.getListEntreByDate()
                    }
                }else{
                    this.showNotif('error','Suppression mouvement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async printListMvmt(){

            this.loading = true
            try {
                const _r = await this.$http.get('api/mvmts/print/es',{params:
                    {
                    action:this.cur_onglet,
                    date:(this.cur_onglet == 'entre')?this.date_entre:this.date_sortie,
                    date2:(this.cur_onglet == 'entre')?this.date_entre2:this.date_sortie2,}})
                let _d = _r.data

                if(_d.status){

                    setTimeout(()=> {
                        window.electronAPI.downFact(`${this.$http.defaults.baseURL}/api/mvmts/print/es/down`)
                        this.loading = false
                    }, 3000);
                    
                }else{
                    this.showNotif('error','PDF Détails mouvement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async getNbEncMvmtNow(){
            try {
                const _r = await this.$http.get('api/mvmt/enc-med/nb')
                let _d = _r.data

                if(_d.status){
                    this.nbEncMvmt = _d.nbEncMvmt
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async getDataUtils(){
            try {
                const r = await this.$http.get('api/mvmt/data-utils/filters')
                let d = r.data

                if(d.status){
                    this.list_fourn = [...this.list_fourn,...d.fourn]
                    this.list_depot = d.list_depot
                    this.list_dep = d.list_dep
                    this.nbEncMvmt = d.nbEncMvmt



                    //ajout des dépots
                    for (let i = 0; i < d.list_depot.length; i++) {
                        const e = d.list_depot[i];
                        this.s_label_entre.push({label:e.depot_label,key:`dp:${e.depot_id}`})
                        this.s_label_sortie.push({label:e.depot_label,key:`dp:${e.depot_id}`})
                    }
                }
            } catch (e) {
                console.error(e)
                this.showNotifServerError()
            }
        },


        getStockArt(k,mart){
            let depot_id = parseInt(k.split(':')[1])

            if(mart.mart_det_stock == null){
                return '-'
            }

            let stk = JSON.parse(mart.mart_det_stock)

            if(Array.isArray(stk)){
                if(stk.length == 0){
                    return '-'
                }else{
                    for (let i = 0; i < stk.length; i++) {
                        const e = stk[i];
                        if(e.depot_id == depot_id){

                            //Resaka achat fotsiny e
                            if(mart.mvmt_action == 'entre'){
                                return (e.depot_code == 'M02')?`${e.stk_actuel} (${e.stk_actuel - mart.mart_qt})`:e.stk_actuel
                            }else if(mart.mvmt_action == 'sortie'){

                                if(mart.mvmt_type == 'transfert'){

                                    if(e.depot_id == mart.mvmt_depot_dest){
                                        return `${e.stk_actuel} (${e.stk_actuel - mart.mart_qt})`
                                    }else if(e.depot_id == mart.mvmt_depot_exp){
                                        return `${e.stk_actuel} (${e.stk_actuel + mart.mart_qt})`
                                    }

                                }else{
                                    return (e.depot_code == 'M01')?`${e.stk_actuel} (${e.stk_actuel - mart.mart_qt})`:e.stk_actuel
                                }
                            }

                            //return e.stk_actuel
                        }
                    }
                    return '-'
                }
            }else{
                return '-'
            }
        },

        async printSuivi(){
            try {
                this.suivi_on_print = true
                const r = await this.$http.get('api/mvmt/suivi/filters/print',{params:{filters:this.s_filters}})
                let d = r.data

                if(d.status){
                    this.showNotif('success','Impression Suivi',"Impression effectuée")

                    setTimeout(()=> {
                        window.electronAPI.downFact(`${this.$http.defaults.baseURL}/api/mvmt/suivi/filters/down`)
                        this.suivi_on_print = false
                    }, 2000);


                }else{
                    this.showNotif('error','Impression Suivi',d.message)
                }

            } catch (e) {
                this.showNotifServerError()
            }
        },
        async searchMart(){
            try {
                const r = await this.$http.get('api/mvmt/suivi/filters',{params:{filters:this.s_filters}})
                let d = r.data

                if(d.status){
                    this.s_mart_list = d.mart_list
                    this.s_mart_nb = d.mart_nb
                }else{
                    this.showNotif('error','Recherche Suivi',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        }
    },
    beforeMount(){
        this.init()
        this.getDataUtils()


    },
    mounted(){
        
    }
}
</script>

<style>

</style>