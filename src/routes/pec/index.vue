<template>
    <div class="p-2 flex justify-center items-center w-full" v-if="!on_etat_mensuel">
        <div class="w-full">
            <div class="flex py-2 align-items-end sticky bg-white" style="top:60px;z-index:105">
                <!-- <Button class="p-button-sm mr-2" icon="pi pi-plus" @click="  on_add_pec = true " label="Ajouter" /> -->
                <!-- && inTypeUser(['a','g','m']) -->
                <Button v-if="list_selected.encharge_id && (!list_selected.encharge_printed || inTypeUser(['m','a']))"
                class="p-button-sm p-button-danger p-button-text p-button-raised" icon="pi pi-times" @click="delPec" label="Supprimer" />

                <div class="flex-grow-1 flex justify-content-center">
                    <!-- <custom-input v-model="filters.search"  class="mr-2" label="Recherche"  /> -->
                    <span class="p-input-icon-right">
                        <i class="pi pi-search" />
                        <InputText class="p-inputtext-sm" type="text" v-model="filters.search" placeholder="Recherche ..."/>
                    </span>

                    <!-- <c-select class="mr-5" placeholder="Par" v-model="filters.search_by"  :datas="list_search_by" label="label" code="code" /> -->
                    <Dropdown :options="list_search_by" class="p-inputtext-sm ml-2" v-model="filters.search_by" optionLabel="label" optionValue="code"/>
                    <Divider layout="vertical" />
                    <!-- <c-select class="ml-2" placeholder="Sélection" v-model="filters.month" :datas="data_month" label="label" code="code" /> -->
                    <Dropdown :options="data_month" class="p-inputtext-sm" v-model="filters.month" optionLabel="label" optionValue="code"/>
                    <!-- <custom-input v-model="filters.year" type="number" class="ml-2 w-16" label="Année"  /> -->
                    <InputText style="width:100px;" class="p-inputtext-sm ml-2" type="number" v-model="filters.year" placeholder="..."/>
                </div>


                <!-- <button  class="bt-p-s ml-2"> Facture détaillée </button> -->
                <!-- <menu-point v-if="list_selected.encharge_id" class="relative">
                    <menu-item  @click=" on_edit_fact = true " > <span class="material-icons"> info </span> <span class="ml-2"> Facture détaillée </span> </menu-item>
                    <menu-item  @click=" on_view_recap = true " > <span class="material-icons"> info </span> <span class="ml-2"> Récapitulatif de facture</span> </menu-item>
                </menu-point> -->
                <Button label="Etats mensuel" class="p-button-sm p-button-text mr-2 p-button-raised" @click="on_etat_mensuel = true" />
                <Button type="button" v-if="list_selected.encharge_id" icon="pi pi-ellipsis-v" class="p-button-sm p-button-rounded p-button-text"
                @click="showMenu" aria-haspopup="true" aria-controls="overlay_menu"/>
                <Menu id="overlay_menu" ref="menu" class="text-xs" :model="items_menu" :popup="true" />
            </div>
            <table class="w-full">
                <thead class="rounded-t" >
                    <tr class="bg-gray-50 text-gray-700 text-sm text-left">
                        <th v-for="l in list_label" class="p-2 border text-xs sticky" style="top:125px;z-index: 1000;" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Ligne de création de prise en charge -->
                    <tr  class="">
                        <td class="p-2 border bg-blue-50 text-xs sticky" style="top:178px;z-index: 1000;" v-for="l in list_label" :key="l.key">
                            <span  style="min-width:50px;"  class="p-1 border-1 border-300 bg-white" v-if="l.key == 'encharge_seq'"> {{ pec.encharge_seq }} </span>

                            <span @input=" (a)=>{
                                // let ff = a.target.innerText.replace(/[\r\n]+/g,'').trim()
                                // p_selected.pat_numero = ff

                            } " @dblclick="in_select_pat = true" style="min-width:50px;" autofocus contenteditable class="flex p-1 border-1 border-300 bg-white" v-else-if="l.key == 'pat_numero'" 
                            placeholder="Numero"> {{ p_selected.pat_numero }} </span>

                            <span @input=" (a)=>{
                                // let ff = a.target.innerText.replace(/[\r\n]+/g,'').trim()
                                // p_selected.pat_nom_et_prenom = ff

                            }" @dblclick="in_select_pat = true" style="min-width:50px;" contenteditable  class="flex p-1 border-1 border-300 bg-white"
                            v-else-if="l.key == 'pat_nom_et_prenom'"> {{ p_selected.pat_nom_et_prenom}} </span>

                            <span @input=" (a)=>{
                                // let ff = a.target.innerText.replace(/[\r\n]+/g,'').trim()
                                // soc_selected.ent_code = ff

                            }" @dblclick="in_select_soc = true" style="min-width:50px;" contenteditable v-else-if="l.key == 'code_soc'" class="flex p-1 border-1 border-300 bg-white" 
                            placeholder="Code" > {{ soc_selected.ent_code }} </span>

                            <span @input=" (a)=>{
                                // let ff = a.target.innerText.replace(/[\r\n]+/g,'').trim()
                                // soc_selected.ent_label = ff

                            }" @dblclick="in_select_soc = true" style="min-width:50px;" contenteditable class="flex p-1 border-1 border-300 bg-white"
                            v-else-if="l.key == 'ent_label'"> {{ soc_selected.ent_label }} </span>

                            <span @input=" (a)=>{
                                // let ff = a.target.innerText.replace(/[\r\n]+/g,'').trim()
                                // soc_pay_selected.ent_code = ff

                            }" @dblclick="in_select_soc2 = true" style="min-width:50px;" contenteditable class="flex p-1 border-1 border-300 bg-white"
                             v-else-if="l.key == 'code_payeur'"
                             placeholder="Code" > {{ soc_pay_selected.ent_code }} </span>

                            <span @input=" (a)=>{
                                // let ff = a.target.innerText.replace(/[\r\n]+/g,'').trim()
                                // soc_pay_selected.ent_label = ff

                            }" @dblclick="in_select_soc2 = true" style="min-width:50px;" contenteditable class="flex p-1 border-1 border-300 bg-white"
                            v-else-if="l.key == 'ent_label_payeur'"> {{ soc_pay_selected.ent_label }} </span>

                            <select v-else-if="l.key == 'tarif_label'" v-model="pec.encharge_tarif_id" > 
                                <option v-for="t in tarifs" :key="t.tarif_id" :value="t.tarif_id"> {{ t.tarif_label }} </option>
                            </select>

                            <span  class="flex p-1 border-1 border-300 bg-white"
                            v-else-if="l.key == 'ent_num_compte_payeur'"> {{ (soc_pay_selected.ent_num_compte)?soc_pay_selected.ent_num_compte:'-' }} </span>

                            <input class="flex sm-date text-xs" style="width: 90px;" type="date" v-else-if="l.key == 'encharge_date_entre'" v-model="pec.encharge_date_entre" />
                            <input class="flex sm-date text-xs" style="width: 90px;" type="date" v-else-if="l.key == 'encharge_date_sortie'" v-model="pec.encharge_date_sortie" />

                            <button @click="postPec" class="border-none bg-blue-500  p-2 text-white hover:bg-blue-700 border-round" v-if="l.key == 'encharge_fact_to_gest'"> Valider </button>
                            <!-- <Button class="p-buttom-sm" label="Valider" v-if="l.key == 'encharge_fact_to_gest'"/> -->
                        </td>
                    </tr>
                    <tr  @click=" ()=>{
                            list_selected = p
                        } " class="cursor-pointer relative" v-for="p,i in list_pec" :key="p.encharge_id">
                        <td  :class="{'active-row':list_selected.encharge_id == p.encharge_id}" class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                            <span class="" v-if=" ['encharge_date_entre','encharge_date_sortie'].indexOf(l.key) != -1 ">
                                {{ (p[l.key])?new Date(p[l.key]).toLocaleDateString() :'-' }}
                            </span>
                            <!-- :class="{'bg-blue-500':p[l.key]}" -->
                            <span class=""   v-else-if="['encharge_fact_to_gest','encharge_fact_to_soc'].indexOf(l.key) != -1">
                                <Checkbox style="z-index: 100;" :binary="true" v-if="l.key == 'encharge_fact_to_gest'" @click=" setStateFact(l.key,i) " :disabled="(!checkModule('prise-en-charge') || p.encharge_fact_to_gest)" :modelValue="(p[l.key])?true:false" />
                                <Checkbox style="z-index: 100;" :binary="true" v-else-if="l.key == 'encharge_fact_to_soc' " @click=" setStateFact(l.key,i) " :disabled=" (!inTypeUser(['g']) || p.encharge_fact_to_soc || !p.encharge_fact_to_gest)"  :modelValue="(p[l.key])?true:false" />
                            </span>
                            <span v-else> {{ (p[l.key] )?p[l.key] :'-'}} </span>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>

        <!-- <add-pec @validate=" ()=>{
                on_add_pec = false
                getPec()
            } " :visible="on_add_pec" @close=" on_add_pec = false " /> -->

            <select-patient @validate=" setPatient " :visible="in_select_pat" @close="in_select_pat = false" />

            <select-soc @validate=" setSoc " :visible="in_select_soc" @close="in_select_soc = false" />
            <select-soc @validate=" setSoc2 " :visible="in_select_soc2" @close="in_select_soc2 = false" />

        <gest-fact-pec @validate=" ()=>{
                on_edit_fact = false
                getPec()
            } " :pec="list_selected" :tarifs="tarifs" :visible="on_edit_fact" @close="on_edit_fact = false" @refresh="()=>{
                getPec()
            } " />

        <recap-fact-pec :pec="list_selected" :visible="on_view_recap" @close="on_view_recap = false" />
    </div>
    <div class="flex flex-column" v-else>
        <div class="flex p-2 align-items-center sticky bg-white" style="top:58px">
            <Button class="p-button-sm p-button-text p-button-rounded mr-5" @click="on_etat_mensuel = false"> 
                <i class="pi pi-arrow-left"></i>
            </Button>
            <span class="font-bold"> {{ `récapitulatifs des prises en charge`.toUpperCase() }} </span>
            

            <!-- les Filtres -->
            <div class="flex flex-grow-1 justify-content-center ">

                <!-- <div class="flex flex-column mr-2">
                    <span class="text-sm font-bold"> Société </span>
                    <Dropdown class="p-inputtext-sm" :options="ent_type_list" v-model="st_filters.ent_type" optionValue="key" optionLabel="label" />
                </div> -->
                <div class="flex flex-column mr-2">
                    <span class="text-sm font-bold"> Mois </span>
                    <Dropdown class="p-inputtext-sm" :options="datas_month" v-model="st_filters.month" optionValue="key" optionLabel="label" />
                </div>
                <div class="flex flex-column">
                    <span class="text-sm font-bold"> Année  </span>
                    <InputText class="p-inputtext-sm" type="number" v-model="st_filters.year"  />
                </div>

            </div>
        </div>


        <!-- bah ici  la liste quoi -->
        <div class="p-2">
            <table class="w-full">
                <!--  -->
                <thead class="rounded-t" >
                    <tr class="bg-gray-50 text-gray-700 text-sm text-left">
                        <th v-for="l in st_list_label" class="p-2 border text-xs sticky" style="top:135px;z-index: 1000;" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>

                <!--  -->
                <tbody>

                    <template v-for="dt in etats_list">

                        <!-- Fanaovana somme -->
                        <tr v-if="dt.list.length >0" :key="dt.id" class="text-xs"> 
                            <!-- Total -->
                            <td class="text-red-500" :colspan="st_list_label.length"> Pour le compte de {{ dt.list[0].sp_label }} ({{ dt.list[0].sp_num_compte }})  </td>
                        </tr>

                        <tr  @click=" ()=>{
                                // list_selected = p
                                st_selected = p
                            } " class="cursor-pointer relative" v-for="p in dt.list" :key="p.encharge_id">
                            <td  @contextmenu="(e)=>{
                                dt_selected = dt
                                st_selected = p
                                onRightClickSt(e)
                            }" class="p-2 border text-xs" :class="{'text-right':['fact_montant','fact_montant_pat','fact_montant_soc'].indexOf(l.key) != -1}" v-for="l in st_list_label" :key="l.key">
                                <span class="" v-if=" ['encharge_date_entre','encharge_date_sortie'].indexOf(l.key) != -1 ">
                                    {{ (p[l.key])?new Date(p[l.key]).toLocaleDateString() :'-' }}
                                </span>
                                <!-- :class="{'bg-blue-500':p[l.key]}" -->

                                <span class="" v-else-if="l.key == 'pat_nom_et_prenom'"> - {{ p[l.key] }} </span>

                                <span class="text-right" :class="{'text-red-500':l.key == 'fact_montant_soc'}" v-else-if=" ['fact_montant','fact_montant_pat','fact_montant_soc'].indexOf(l.key) != -1"> 
                                    {{ ( p[l.key]?p[l.key]:0 ).toLocaleString('fr-CA') }} </span>
                                
                                <span v-else> {{ (p[l.key] )?p[l.key] :'-'}} </span>
                            </td>
                        </tr>

                        <!-- Fanaovana somme -->
                        <tr v-if="dt.list.length >0" :key="dt.id" class="row-green text-xs  bg-orange-50 last-row"> 
                            <!-- Total -->
                            <td class="font-bold text-gray-700 text-center" :colspan="st_list_label.length - 3"> SOUS-TOTAL   <strong class="ml-2"> ...{{ dt.list[0].sp_label }} </strong> </td>

                            <!-- Les montants -->
                            <td class="font-bold p-2 text-right"> {{ dt.list.reduce( (acc,val) => acc + parseInt(val.fact_montant_pat || 0),0).toLocaleString('fr-CA') }} </td>
                            <td class="font-bold p-2 text-right text-red-500"> {{ dt.list.reduce( (acc,val) => acc + parseInt(val.fact_montant_soc || 0),0).toLocaleString('fr-CA') }} </td>
                            <td class="font-bold p-2 text-right" > {{ dt.list.reduce( (acc,val) => acc + parseInt(val.fact_montant || 0),0).toLocaleString('fr-CA') }} </td>
                        </tr>
                    </template>

                </tbody>
            </table>
        </div>


        <!-- menu contextuel -->
        <ContextMenu ref="menu" class="text-xs" :model="items_menu_st"/>

        <!-- Pour l'édition de facture de groupe -->
        <edit-fact-state :visible="on_edit_fact_state" @close="on_edit_fact_state = false" :st="st_selected" :filters="st_filters" />
    </div>
</template>

<script>
export default {
    watch:{
        'filters.month'(){
            this.list_selected = {}
            this.getPec()
        },
        'filters.year'(){
            this.list_selected = {}
            this.getPec()
        },
        'filters.search'(){
            this.list_selected = {}
            this.getPec()
        },

        'filters.search_by'(){
            this.list_selected = {}
            this.getPec()
        },
        'p_selected.pat_numero'(a){
            console.log(a)
        },
        on_etat_mensuel(a){
            if(a){
                this.getEtatsMensuel()
            }
        },
        'st_filters.month'(){
            this.getEtatsMensuel()
        },
        'st_filters.year'(){
            this.getEtatsMensuel()
        }
    },
    data(){
        return{
            list_pec:[],
            on_edit_fact:false,
            list_label:[
                {label:'N°seq.',key:'encharge_seq'},
                {label:'Numéro',key:'pat_numero'},
                {label:'Patient',key:'pat_nom_et_prenom'},
                {label:'Code',key:'code_soc'},
                {label:'Société Emp.',key:'ent_label'},
                {label:'Code',key:'code_payeur'},
                {label:'Société Pay.',key:'ent_label_payeur'},
                {label:'Tarif',key:'tarif_label'},
                {label:'N° compte',key:'ent_num_compte_payeur'},
                {label:"Date d'entrée",key:'encharge_date_entre'},
                {label:"Date de sortie",key:'encharge_date_sortie'},
            ],
            on_add_pec:false,
            on_view_pec:false,
            list_selected:{},

            on_view_recap:false,

            pec:{
                encharge_util_id:this.$store.state.user.util_id,
                encharge_date_entre:this.dateToInput(new Date())
            },

            p_selected:{
                pat_numero:''
            },
            soc_selected:{
                ent_code:''
            },
            soc_pay_selected:{
                ent_code:''
            }, 

            tarifs:[],
            soc:[],

            //pour le filtre par date d'insertion
            data_month:[],
            filters:{
                month:0,
                year:new Date().getFullYear(),
                search_by:'pat_nom_et_prenom',
                search:''
            },
            list_search_by:[
                {label:'Patient',code:"pat_nom_et_prenom"},
                {label:'Société',code:"e1.ent_label"},
                {label:'Soc. Payeur',code:"e2.ent_label"}
            ],

            items_menu:[
                {
                    label: 'Facture détaillée',
                    icon: 'pi pi-list',
                    command: () => {
                        this.on_edit_fact = true
                    }
                },
                {
                    label: 'Récapitulatif de facture',
                    icon: 'pi pi-list',
                    command: () => {
                        this.on_view_recap = true
                    }
                },
            ],
            in_select_pat:false,
            in_select_soc:false,
            in_select_soc2:false,

            loading:false,


            //gestion etats mensuel
            on_etat_mensuel:false,
            datas_month:[],
            ent_type_list:[
                {label:'Employeur',key:'se'},
                {label:'Payeur',key:'sp'},
            ],

            st_filters:{
                month:6,
                ent_type:'sp',
                year:2023
            },
            etats_list:[],

            st_list_label:[
                {label:'Identification du Client',key:'pat_nom_et_prenom'},
                {label:'Code',key:'se_code'},
                {label:'Société',key:'se_label'},
                {label:'Tarif',key:'tarif_label'},
                {label:'N° facture',key:'spfact_num'},
                {label:"Entrée",key:'encharge_date_entre'},
                {label:"Sortie",key:'encharge_date_sortie'},
                {label:"MNT Patient",key:'fact_montant_pat'},
                {label:"MNT Société",key:'fact_montant_soc'},
                {label:"TOTAL",key:'fact_montant'},
            ],

            items_menu_st:[
                {label:`Edition FACTURE GROUPE`},
                {separator:true},
                {label:`Voir DETAILS FACTURE`},
                {separator:true},
                {label:`Voir RECAP FACTURE`,
                    command: ()=>{
                        this.on_edit_fact_state = true
                    }
                }
            ],
            dt_selected:{},
            st_selected:{},
            on_edit_fact_state:false
        }
    },
    methods:{

        //GESTION ETAT MENSUEL
        setDatasMonth(){
            for (let i = 0; i < this.list_mois.length; i++) {
                const e = this.list_mois[i];
                this.datas_month.push({label:e,key:i+1})
            }
        },
        async getEtatsMensuel(){
            try {
                const r = await this.$http.get('api/encharge/etats-mensuel/list',{params:{
                    filters:this.st_filters
                }})

                let d = r.data

                if(d.status){
                    this.etats_list = d.datas
                }else{
                    this.showNotif('error','Récupération de la liste',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        onRightClickSt(event){
            this.$refs.menu.show(event)
        },


        async getPec(){
            try {
                const _r = await this.$http.get('api/encharge',{params:this.filters})
                let _d = _r.data

                if(_d.status){
                    this.list_pec = _d.reponse


                    //Modification du truc
                    if(this.list_selected.encharge_id){
                        for (let i = 0; i < this.list_pec.length; i++) {
                            const e = this.list_pec[i];
                            if(e.encharge_id == this.list_selected.encharge_id){
                                this.list_selected = this.list_pec[i]
                                break
                            }
                        }
                    }
                }else{
                    this.showNotif('error','Récupération de la liste',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        async delPec(){
            try {
                const _r = await this.$http.delete('api/encharge/'+this.list_selected.encharge_id,{params:{user_id:this.getUserId()}})
                let _d = _r.data

                if(_d.status){
                    this.list_selected = {}
                    this.getPec()
                }else{
                    this.showNotif('error','Suppression prise en charge',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        reinitPec(){
            this.pec = {
                encharge_util_id:this.$store.state.user.util_id
            }

            this.pec.encharge_date_entre = this.dateToInput(new Date())
            this.p_selected = {}
            this.soc_selected = {}
            this.soc_pay_selected = {},

            this.tarifs = []
            this.soc = []

            this.in_select_pat = false
            this.in_select_soc = false
            this.in_select_soc2 = false

            this.loading = false

            this.getUtilsAdd()
        },
        async postPec(){
            try {
                if(!this.p_selected.pat_id){
                    this.showNotif('error','Edition Prise en charge',`Le Patient est obligatoire`)
                    return
                }
                
                this.pec.encharge_pat_id = (this.p_selected.pat_id)?this.p_selected.pat_id:null
                this.pec.encharge_ent_id = (this.soc_selected.ent_code)?this.soc_selected.ent_id:null
                this.pec.encharge_ent_payeur = (this.soc_pay_selected.ent_code)?this.soc_pay_selected.ent_id:null

                this.pec.user_id = this.getUserId()


                this.loading = true
                const _r = await this.$http.post('api/encharge',this.pec)

                let _d = _r.data
                if(_d.status){
                    this.getPec()
                    this.reinitPec()
                }else{
                    this.showNotif('error','Edition Prise en charge',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.loading = false
        },
        init(){
            //Set liste_mois to _data
            this.data_month.push({label:"Toute l'année",code:0})
            for (let i = 0; i < this.list_mois.length; i++) {
                const e = this.list_mois[i]
                this.data_month.push({label:e,code:i+1})
            }

            //Gestion des colonnes pour la gestion de facture
            if(this.checkModule('prise-en-charge') || this.inTypeUser(['m','a'])){
                this.list_label.push({label:'Transmis au Gest.',key:'encharge_fact_to_gest'})
            }

            if(this.inTypeUser(['g','a','m'])){
                this.list_label.push({label:'Transmis à l\'Assu.',key:'encharge_fact_to_soc'})
            }


            this.setDatasMonth()
        },
        reinitForm(){

        },
        setPatient(p){
            this.p_selected = p
            this.pec.encharge_pat_id = p.pat_id

            this.in_select_pat = false
        },
        setSoc(s){
            this.soc_selected = s
            this.pec.encharge_ent_id = s.ent_id

            this.in_select_soc = false
        },

        setSoc2(s){
            this.soc_pay_selected= s
            this.pec.encharge_ent_payeur = s.ent_id

            this.in_select_soc2 = false
        },
        async setStateFact(st,index){
            let id = this.list_pec[index].encharge_id
            if(this.list_pec[index][st]){
                this.showNotif('Plus possible de modifier')
                return
            }
            try {
                const r = await this.$http.put('api/encharge/fact/state',{key:st,encharge_id:id})
                let d = r.data
                if(d.status){
                    this.showNotif('success','Prise en charge','Modification bien enregistré')
                    this.getPec()
                }else{
                    this.showNotif('error','Prise en charge',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        showMenu(event) {
            this.$refs.menu.toggle(event);
        },

        async getUtilsAdd(){
            try {
                const _r = await this.$http.get('api/encharge/utils/add')
                let _d = _r.data

                if(_d.status){
                    this.tarifs = _d.tarifs

                    this.pec.encharge_tarif_id = (this.tarifs.length > 0)?this.tarifs[0].tarif_id:null
                    this.soc =_d.soc


                    let last_seq = _d.last_seq
                    let year = (new Date()).getFullYear().toString().substring(2)
                    if(last_seq == 0){
                        this.pec.encharge_seq = `${year}/${'1'.padStart(4,0)}`
                    }else{
                        last_seq = (parseInt(last_seq.split('/')[1]) + 1).toString()
                        this.pec.encharge_seq = `${year}/${last_seq.padStart(4,0)}`
                    }
                }else{
                    this.showNotif('error','Erreur de connexion',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
    },
    beforeMount(){
        this.init()
        this.getUtilsAdd()
    },
    mounted(){
        this.getPec()
        
    }
}
</script>

<style>

</style>