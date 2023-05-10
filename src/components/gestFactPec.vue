  <template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">EDITION DE FACTURE PRISE EN CHARGE</span>
        </template>
        <div class="flex">
            <div class="flex flex-column" style="width:45%">
                <div class="mb-2">
                    <div class="flex flex-column mb-2">
                        <label class="text-xs font-bold" for="fact_resume_intervention">Résumé des interventions</label>
                        <!-- <textarea class="input-alt w-56" name="" id="fact_resume_intervention" v-model="f.fact_resume_intervention" ></textarea> -->
                        <Textarea v-model="f.fact_resume_intervention"  :autoResize="true" rows="5" cols="30" />
                    </div>
                    <!-- <c-select :datas="list_dep" placeholder="Département" v-model="f.fact_dep_id" label="dep_label" code="dep_id" /> -->
                    <div class="flex">
                        <div class="flex flex-column">
                            <span class="text-xs font-bold"> Département </span>
                            <Dropdown  :disabled="!active_dep" class="p-inputtext-sm" v-model="f.fact_dep_id" optionLabel="dep_label" optionValue="dep_id" :options="list_dep" placeholder="Département" />
                        </div>
                        <!-- <custom-input v-model="p.date_entre" class="mb-2 " :disable="true" label="Date Entrée" type="date" /> -->
                        <div class="flex flex-column flex-grow-1 ml-2">
                            <span class="text-xs font-bold"> Date d'entrée </span>
                            <InputText class="p-inputtext-sm" v-model="p.date_entre" type="date" />
                        </div>
                    </div>
                </div>

                <Divider align="center" >
                    <span class="text-xs"> Non modifiable </span>
                </Divider>

                <div class="flex mb-2">
                    <div class="flex flex-column" style="">
                        <span class="text-xs font-bold"> Société employeur </span>
                        <InputText class="p-inputtext-sm" disabled v-model="pec.ent_label" />
                    </div>
                    <div class="flex flex-column ml-2 flex-grow-1">
                        <span class="text-xs font-bold"> Société payeur </span>
                        <InputText class="p-inputtext-sm" disabled v-model="pec.ent_label_payeur" />
                    </div>
                </div>

                <div class="flex">
                    <!-- <custom-input v-model="pec.tarif_label" class="w-56 mb-2" :disable="true" label="Tarif" /> -->
                    <div class="flex flex-column" style="width:30%">
                        <span class="text-xs font-bold"> Tarif </span>
                        <InputText class="p-inputtext-sm" disabled v-model="pec.tarif_label" />
                    </div>
                    <!-- <custom-input v-model="pec.pat_numero" class="w-24 mb-2 ml-2" :disable="true" label="Code patient" /> -->
                    <div class="flex flex-column flex-grow-1 ml-2">
                        <span class="text-xs font-bold"> Patient </span>
                        <InputText class="p-inputtext-sm" disabled v-model="pec.pat_nom_et_prenom" />
                    </div>
                </div>


            </div>

            <Divider layout="vertical" />

            <div class="flex flex-column flex-grow-1">

                <div class="mb-2 flex flex-column" :class="{'border-1 border-round border-200 p-2':on_search_product}">
                    <div class="flex flex-column">
                        <span class="p-input-icon-right">
                            <i class="pi pi-search" />
                            <InputText @focus="()=>{
                                on_search_product = true
                                researchProdServ()
                            }" class="p-inputtext-sm" type="text" v-model="filters.search" placeholder="Rechercher un produit ou un service"/>
                        </span>
                    </div>

                    <div v-if="on_search_product" class="flex flex-column" style="max-height: 300px;overflow: auto;">
                        <div @click="getTservProd(lp)" class="flex flex-column cursor-pointer border-bottom-1 hover:bg-gray-100 border-200 p-2" v-for="lp in list_prod_serv" :key="lp.service_code">
                            <span class="font-bold text-gray-600"> {{ lp.service_label }} </span>
                            <div class="flex w-full">
                                <span class="text-gray-500"> {{ lp.service_code }} </span>
                                <span class="flex-grow-1"></span>

                                <div class="flex font-bold mx-2 text-sm" v-if="lp.stock">
                                    <span class=""> PH : {{ (lp.stock && lp.stock[0])?lp.stock[0].stk_actuel:0 }} </span>
                                    <span class="ml-2"> MC : {{ (lp.stock && lp.stock[1])?lp.stock[1].stk_actuel:0 }} </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-2 flex justify-content-end text-center" v-if="on_search_product">
                        <div>
                            <Button class="p-button-sm p-button-text" @click="on_search_product = false" icon="pi pi-times" label="Fermer"/>
                        </div>
                    </div>
                </div>

                <div class="" tabindex="0" ref="tableur" v-show="!on_search_product"
                @keypress="changeNumQt" @keydown.delete="changeNumQt"
                @keydown.right="changeCurCell('right')" @keydown.left="changeCurCell('left')"
                @keydown.up = "changeCurIndex('up')" @keydown.down = "changeCurIndex('down') "
                >

                    <table class="w-full mb-2" >
                        <thead class="rounded-t sticky top-28 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">
                                <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @click=" ()=>{
                                    list_selected = p
                                    cur_index = i
                                } " v-for="p,i in f.fact_serv" class="cursor-pointer"  :key="p.service_code">
                                <td :class="{'active-row':list_selected.service_code == p.service_code}"  class="p-2 border text-xs" 
                                v-for="l in list_label" :key="l.key">

                                    <div class="w-full flex justify-end" v-if="['fserv_montant','fserv_prix_unitaire'].indexOf(l.key) != -1">
                                        <span class=""> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                                    </div>


                                    <!-- Les trois cellule éditable -->
                                    <!-- <span v-else-if="l.key == 'fserv_qt'"  :class="{'text-xl':list_selected.service_code == p.service_code && cell_selected.key == 'fserv_qt'}"
                                    class="px-2 py-1 border-1 border-round bg-white cursor-pointer flex " > {{ p.fserv_qt.toLocaleString('fr-CA') }} </span>
                                    <span v-else-if="l.key == 'fserv_prix_patient'"  
                                    :class="{'text-xl':list_selected.service_code == p.service_code && cell_selected.key == 'fserv_prix_patient'}"
                                    class="px-2 py-1 border-1 border-round bg-white cursor-pointer flex "> {{ p[l.key].toLocaleString('fr-CA') }} </span>
                                    <span v-else-if=" l.key == 'fserv_prix_societe' "  
                                    :class="{'text-xl':list_selected.service_code == p.service_code && cell_selected.key == 'fserv_prix_societe'}"
                                    class="px-2 py-1 border-1 border-round bg-white cursor-pointer flex "> {{ p[l.key].toLocaleString('fr-CA') }} </span> -->

                                    <div class="" v-else-if=" cell_edit_list.indexOf(l.key) != -1">

                                        <span @click=" ()=>{
                                            cell_selected.index = cell_edit_list.indexOf(l.key)
                                            cell_selected.key = l.key
                                        } "
                                        :class="{'text-xl':list_selected.service_code == p.service_code && cell_selected.key == l.key}"
                                        class="px-2 py-1 border-1 border-round bg-white cursor-pointer flex "> {{ p[l.key].toLocaleString('fr-CA') }} </span>

                                    </div>

                                    <span class="" v-else > {{ p[l.key] }} </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                <div class="flex">
                    <div class="flex">

                        
                        <Button v-if="(list_selected.service_code && (!pec.encharge_printed || inTypeUser(['a','g','m'])) ) " 
                        class="p-button-sm p-button-raised p-button-text ml-2" label="Supprimer" icon="pi pi-times" @click=" delFserv " />

                        <div class="flex mx-2"  v-if="list_selected.service_code">
                            <Button icon="pi pi-minus" @click="addQt('-')" class="p-button-sm p-button-text p-button-raised"  />
                            <Button icon="pi pi-plus" @click="addQt('+')" class=" p-button-text p-button-raised p-button-sm ml-2"  />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end">
                <!-- <button v-if="!pec.encharge_printed || inTypeUser(['a','g','m'])" class="bt-p-s" @click="saveFacture" > Enregistrer </button> -->
                <Button v-if="!pec.encharge_printed || inTypeUser(['a','g','m'])" @click="saveFacture" label="Enregistrer" icon="pi pi-save" class="p-button-sm" />
                <!-- <button class="bt-p-s ml-2" v-if="fact_serv.length > 0" @click=" printPec ">Imprimer</button> -->
                <Button class="p-button-sm p-button-raised p-button-text" label="Imprimer" icon="pi pi-print" @click=" printPec " />
            </div>
        </template>

        <add-product-fact @validate=" ()=>{
            on_add_product = false
            getUtilsAdd()
        }" :pec="pec" :f="f" :visible="on_add_product" @close="on_add_product = false" />

        <OverlayPanel ref="op">
            <div class="flex flex-column">
                <span class="text-xs"> Appuyez sur "Entrer" pour valider </span>
                <InputNumber v-model="cur_qt" @keypress.enter="changeQt" autofocus class="p-inputtext-sm"  />
            </div>
        </OverlayPanel>

        <OverlayPanel ref="opprix">
            <div class="flex flex-column">
                <span class="text-xs"> Appuyez sur "Entrer" pour valider </span>
                <InputNumber v-model="cur_prix" @keypress.enter="changePrix" autofocus class="p-inputtext-sm"  />
            </div>
        </OverlayPanel>

    </Dialog>
</template>

<script>
export default {
    props:['pec','visible'],
    watch:{
        visible(a){
            if(a){
                this.init()
                this.getUtilsAdd()
            }
        },
        'filters.search'(a){
            this.researchProdServ()
        },
        cur_index(a){
            if(a > -1){
                this.list_selected = this.fact_serv[a] 
            }
        },

        on_search_product(a){
            if(!a){
                setTimeout(() => {
                    this.$refs.tableur.focus()
                }, 500);
            }
        }

    },
    data(){
        return{
            
            list_label:[
                {label:'Code',key:'service_code'},
                {label:'Désignation',key:'service_label'},
                {label:'Quantité',key:'fserv_qt'},
                {label:'Unité',key:'art_unite_stk'},
                {label:'Prix Unitaire',key:'fserv_prix_unitaire'},
                {label:'Montant',key:'fserv_montant'},
                {label:'% Patient',key:'fserv_prix_patient'},
                {label:'% Société',key:'fserv_prix_societe'},
            ],

            f:{},
            p:{
                date_entre:new Date()
            },
            list_dep:[],
            list_serv:[],
            list_selected:{},
            fact_serv:[],
            on_add_product:false,


            on_search_product:false,

            filters:{
                search:''
            },

            list_prod_serv:[],

            list_to_add:{},
            list_to_modif:{},
            list_to_del:{},

            active_dep:true,

            cur_qt:0,
            cur_prix:0,
            prix_selected:null,

            cur_index:-1,
            cell_selected:{index:0,key:'fserv_qt'},
            cell_edit_list:['fserv_qt','fserv_prix_patient','fserv_prix_societe']
        }
    },
    methods:{
        async getUtilsAdd(){
            try {
                const _r = await this.$http.get('api/facture/add-utils',{params:{encharge_id:this.pec.encharge_id}})
                let _d = _r.data

                if(_d.status){
                    this.list_dep = _d.list_dep
                    this.f = _d.fact
                    // this.f.fact_dep_id = this.f.fact_dep_id | this.list_dep[0].dep_id
                    // if(this.f.fact_dep_id == null){
                    //     this.f.fact_dep_id = this.list_dep[0].dep_id
                    // }

                    this.active_dep = (_d.fact.fact_dep_id)?false:true



                    this.fact_serv = this.f.fact_serv
                }else{
                    this.showNotif('error','Prise en charge',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        async recupFactureAndService(){
            try {
                const _r = await this.$http.get('api/facture')
                let _d = _r.data
                
                if(_d.status){
                    
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        init(){
            this.f = {} 
            this.p = {
                date_entre:this.dateToInput(new Date(this.pec.encharge_date_entre))
            } 
            this.list_dep = [] 
            this.list_serv = [] 
            this.list_selected = {} 
            this.fact_serv = [] 
            this.on_add_product = false

            this.p.date_entre =this.dateToInput(new Date(this.pec.encharge_date_entre))


            this.on_search_product = false
            this.list_prod_serv = []
            this.filters.search = ''

            this.list_to_add = {}
            this.list_to_modif = {}
            this.list_to_del = {}


            this.active_dep = true


        },

        async delFserv(){

            //Suppression d'un fact service

            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];

                if(e.service_code == this.list_selected.service_code){

                    if(this.list_to_add[e.service_code] != undefined){
                        delete this.list_to_add[e.service_code]
                    }else{
                        this.list_to_del[e.service_code] = this.fact_serv[i]
                    }

                    this.fact_serv.splice(i,1)
                    this.list_selected = {}

                    break
                }
                
            }
        },
        changeQt(){
            if(this.cur_qt <= 0 ) return

            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];
                
                if(e.service_code == this.list_selected.service_code){

                    this.fact_serv[i].fserv_qt = this.cur_qt

                    this.fact_serv[i].fserv_montant = parseInt(e.fserv_prix_unitaire) * parseInt(this.fact_serv[i].fserv_qt)
                    this.fact_serv[i].fserv_prix_patient = parseInt(this.pec.ent_pat_percent) * this.fact_serv[i].fserv_montant / 100
                    this.fact_serv[i].fserv_prix_societe = parseInt(this.pec.ent_soc_percent) * this.fact_serv[i].fserv_montant / 100
                    // this.calcMontant()


                    this.list_to_modif[e.service_code] = this.fact_serv[i]
                    

                    this.$refs.op.toggle();
                    // console.log(this.list_modif_hosp)
                    break
                }
            }
        },
        setAddQtNum(nb){
            if(! this.list_selected.service_code) return 
            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];
                
                if(e.service_code == this.list_selected.service_code){

                    if(this.cell_selected.key == 'fserv_qt'){
                        this.fact_serv[i].fserv_qt = (this.fact_serv[i].fserv_qt * 10) + nb

                        this.fact_serv[i].fserv_montant = parseInt(e.fserv_prix_unitaire) * parseInt(this.fact_serv[i].fserv_qt)
                        this.fact_serv[i].fserv_prix_patient = parseInt(this.pec.ent_pat_percent) * this.fact_serv[i].fserv_montant / 100
                        this.fact_serv[i].fserv_prix_societe = parseInt(this.pec.ent_soc_percent) * this.fact_serv[i].fserv_montant / 100
                    }else{
                        let prix_alt =  (this.fact_serv[i][this.cell_selected.key] * 10) + nb
                        if(prix_alt >  this.fact_serv[i].fserv_montant){
                            this.showNotif('error','Modification prix','Le prix doit être inférieur au prix total')
                            break
                        }

                        this.fact_serv[i][this.cell_selected.key] = prix_alt

                        if(this.cell_selected.key == 'fserv_prix_patient'){
                            this.fact_serv[i].fserv_prix_societe = this.fact_serv[i].fserv_montant - prix_alt
                        }else if(this.cell_selected.key == 'fserv_prix_societe'){
                            this.fact_serv[i].fserv_prix_patient = this.fact_serv[i].fserv_montant - prix_alt
                        }

                    }

                    this.list_to_modif[e.service_code] = this.fact_serv[i]
                    break
                }
            }
        },
        //this.fact_serv[i].fserv_qt = (this.fact_serv[i].fserv_qt - (this.fact_serv[i].fserv_qt % 10)) / 10
        setSubQtNum(){
            if(! this.list_selected.service_code) return 
            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];
                
                if(e.service_code == this.list_selected.service_code){

                    if(this.cell_selected.key == 'fserv_qt'){
                        this.fact_serv[i].fserv_qt = (this.fact_serv[i].fserv_qt - (this.fact_serv[i].fserv_qt % 10)) / 10

                        this.fact_serv[i].fserv_montant = parseInt(e.fserv_prix_unitaire) * parseInt(this.fact_serv[i].fserv_qt)
                        this.fact_serv[i].fserv_prix_patient = parseInt(this.pec.ent_pat_percent) * this.fact_serv[i].fserv_montant / 100
                        this.fact_serv[i].fserv_prix_societe = parseInt(this.pec.ent_soc_percent) * this.fact_serv[i].fserv_montant / 100
                    }else{
                        let prix_alt = (this.fact_serv[i][this.cell_selected.key] - (this.fact_serv[i][this.cell_selected.key] % 10)) / 10
                        this.fact_serv[i][this.cell_selected.key] = prix_alt

                        if(this.cell_selected.key == 'fserv_prix_patient'){
                            this.fact_serv[i].fserv_prix_societe = this.fact_serv[i].fserv_montant - prix_alt
                        }else if(this.cell_selected.key == 'fserv_prix_societe'){
                            this.fact_serv[i].fserv_prix_patient = this.fact_serv[i].fserv_montant - prix_alt
                        }

                    }
                    this.list_to_modif[e.service_code] = this.fact_serv[i]
                    break
                }
            }
        },
        showEditQt(e,p){
           
            // console.log(p.tarifs[index])

             this.$refs.op.toggle(e) 

            this.list_selected = p
            this.cur_prix = p.fserv_qt

        },
        changePrix(){
            if(this.cur_prix < 0 ) return

            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];
                
                if(e.service_code == this.list_selected.service_code){
                    // this.fact_serv[i].fserv_qt = this.cur_prix

                    if(this.cur_prix >  this.fact_serv[i].fserv_montant){
                        this.showNotif('error','Modification prix','Le prix doit être inférieur au prix total')
                        break
                    }

                    this.fact_serv[i][this.prix_selected] = this.cur_prix

                    if(this.prix_selected == 'fserv_prix_patient'){
                        this.fact_serv[i].fserv_prix_societe = this.fact_serv[i].fserv_montant - this.cur_prix
                    }else if(this.prix_selected == 'fserv_prix_societe'){
                        this.fact_serv[i].fserv_prix_patient = this.fact_serv[i].fserv_montant - this.cur_prix
                    }

                    // this.calcMontant()


                    this.list_to_modif[e.service_code] = this.fact_serv[i]
                    

                    this.$refs.opprix.toggle();
                    // console.log(this.list_modif_hosp)
                    break
                }
            }
        },

        showEditPrix(e,p,k){
            this.$refs.opprix.toggle(e)
            this.list_selected = p
            this.cur_prix = p[k]
            this.prix_selected = k
        },
        async saveFacture(){
            if(!this.checkServiceZeroQt()) return


            try {
                const _r = await this.$http.put('api/facture',{f:this.f,del:this.list_to_del,add:this.list_to_add,modif:this.list_to_modif})
                let _d = _r.data
                
                if(_d.status){
                    this.getUtilsAdd()
                    this.list_selected = {}
                    this.showNotif('success','Facture prise en charge',"Facture bien enregistrée")

                    // this.$emit('validate')
                    this.list_selected = false

                    //Réinitialisation des listes des modifs/suppression
                    this.list_to_add = {}
                    this.list_to_modif = {}
                    this.list_to_del = {}
                }else{
                    this.showNotif('success','Facture prise en charge',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        changeCurIndex(p){
            let t = this.fact_serv.length

            if(p == 'up'){
                this.cur_index -= (this.cur_index > 0 )?1:0
            }else{
                this.cur_index += (this.cur_index < t-1)?1:0
            }

            //console.log(p)
        },

        changeCurCell(c){
            if(c == 'right'){
                if(this.cell_selected.index >= this.cell_edit_list.length - 1) return

                this.cell_selected.index +=1
                this.cell_selected.key = this.cell_edit_list[this.cell_selected.index]
            }else if(c == 'left'){
                if(this.cell_selected.index <= 0) return

                this.cell_selected.index -= 1
                this.cell_selected.key = this.cell_edit_list[this.cell_selected.index]
            }
        },

        changeNumQt(e){

            // console.log(e)

            //On va verifié si la touche est un nombre ou pas
            let t = parseInt(e.key)
            if(t.toString() == 'NaN'){
                if(e.code == 'NumpadEnter' || e.code == 'Enter'){ //si appui de l'entrée de pavé numérique
                    //console.log('Entrée du pavé numérique')
                    if(this.cur_index < this.fact_serv.length -1){
                        this.cur_index += 1
                    }
                }else if(e.code == 'Backspace'){
                    this.setSubQtNum()
                }else if(e.code == 'Delete'){
                    this.delFserv()
                }
            }else {
                this.setAddQtNum(t)
            }
            
        },

        //Impression de prise en charge
        async printPec(){
            try {
                const _r = await this.$http.get('api/encharge/print-pdf',{params:{encharge_id:this.pec.encharge_id}})
                let _d = _r.data
                
                if(_d.status){
                    this.showNotif('success','Prise en charge',_d.message)
                    // await this.$http.get('api/facture/download')
                    window.electronAPI.downFact(this.$http.defaults.baseURL+'/api/facture/download')
                }else{
                    this.showNotif('error','Prise en charge',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },

        async getTservProd(lp){
            try {
                //Recherche d'abord si le truc est déja dans la liste
                for (let i = 0; i < this.fact_serv.length; i++) {
                    const e = this.fact_serv[i];
                    if(e.service_code == lp.service_code){
                        this.fact_serv[i].fserv_qt += 1
                        this.fact_serv[i].fserv_montant = parseInt(e.fserv_prix_unitaire) * parseInt(this.fact_serv[i].fserv_qt)
                        this.fact_serv[i].fserv_prix_patient = parseInt(this.pec.ent_pat_percent) * this.fact_serv[i].fserv_montant / 100
                        this.fact_serv[i].fserv_prix_societe = parseInt(this.pec.ent_soc_percent) * this.fact_serv[i].fserv_montant / 100

                        // this.calcMontant()

                        this.list_to_modif[e.service_code] = this.fact_serv[i]
                        this.on_search_product = false
                        return
                    }
                    
                }

                //---------------------------
                const r = await this.$http.get('api/caisse/tarif-prod',{params:{
                    service_id:(lp.art_id)?lp.art_id:lp.service_id,
                    is_product:(lp.art_id)?1:0,
                    tarif_id:this.pec.tarif_id
                }})

                let d = r.data
                if(d.status){
                    

                    let ts = d.tserv

                    //Ajout de l'encserv
                    this.fact_serv.unshift({
                        fserv_serv_id:(lp.art_id)?lp.art_id:lp.service_id,
                        service_label:lp.service_label,
                        service_code:lp.service_code,
                        fserv_qt:0,
                        fserv_prix_unitaire:ts.tserv_prix,
                        fserv_montant:0 * parseInt(ts.tserv_prix),
                        fserv_prix_patient:parseInt(this.pec.ent_pat_percent) * parseInt(ts.tserv_prix) / 100,
                        fserv_prix_societe:parseInt(this.pec.ent_soc_percent) * parseInt(ts.tserv_prix) / 100,
                        fserv_is_product:(lp.art_id)?1:0,
                        art_unite_stk:(lp.art_id)?lp.art_unite_stk:null
                    })

                    // this.calcMontant()

                    this.cur_index += 1

                    this.list_to_add[lp.service_code] = this.fact_serv[this.fact_serv.length - 1]

                }else{
                    this.showNotif('error','Prise en charge',d.message)
                }


                this.on_search_product = false
            } catch (e) {
                console.log(e)
                console.log(this.pec)
                this.showNotifServerError()
            }
        },


        async researchProdServ(){
            try {
                const r = await this.$http.get('api/caisse/search/prod-serv',{params:this.filters})

                let d = r.data
                if(d.status){
                    this.list_prod_serv = d.list
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        addQt(s){
            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];
                
                if(e.service_code == this.list_selected.service_code){
                    if(s == '-'){
                        this.fact_serv[i].fserv_qt -= 1
                    }else{
                        this.fact_serv[i].fserv_qt += 1
                    }

                    this.fact_serv[i].fserv_montant = parseInt(e.fserv_prix_unitaire) * parseInt(this.fact_serv[i].fserv_qt)
                    this.fact_serv[i].fserv_prix_patient = parseInt(this.pec.ent_pat_percent) * this.fact_serv[i].fserv_montant / 100
                    this.fact_serv[i].fserv_prix_societe = parseInt(this.pec.ent_soc_percent) * this.fact_serv[i].fserv_montant / 100
                    // this.calcMontant()


                    this.list_to_modif[e.service_code] = this.fact_serv[i]


                    if(this.fact_serv[i].fserv_qt == 0){
                        if(this.list_to_add[e.service_code] != undefined){
                            delete this.list_to_add[e.service_code]
                        }else{
                            this.list_to_del[e.service_code] = this.fact_serv[i]
                        }
                        //avant la suppression
                        this.fact_serv.splice(i,1)
                        this.list_selected = {}
                    }

                    break
                }
            }
        },

        checkServiceZeroQt(){

            for (let i = 0; i < this.fact_serv.length; i++) {
                const e = this.fact_serv[i];
                
                if(e.fserv_qt == 0){
                     this.showNotif('error','Insertion produits/services',`Certains quantité de produits/services sont à ${'zéro'.toUpperCase()}`)
                    return false
                }
            }
            return true
        }
    },

    mounted(){
    }
} 
</script>

<style>

</style>