<template>
    <Dialog  :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold"> {{ (modif)?'Edition Facture Hospitalisation':'Facturation Hospitalisation' }} </span>
            <Divider layout="vertical" />
            <div v-if="enc.enc_validate" class="flex ml-2 border-1 border-200 p-1 border-round justify-content-center align-items-center ">
                <span class="material-symbols-outlined text-blue-500"> verified </span>
                <span class="text-sm ml-2"> Encaissée </span>
            </div>
        </template>
        <div class="flex flex-column" ref="content" >

            <div  class="flex mb-2" >

                <!-- 1er DIV -->
                <div class="" style="width:50%">
                    <div class="flex align-items-end mb-2">
                        <!-- <custom-input  :disable="true" v-model="enc.enc_num_hosp" label="Référence Hospitalisation" /> -->
                        <div class="flex flex-column">
                            <span class="text-xs font-bold"> Référence Hospitalisation </span>
                            <InputText class="p-inputtext-sm" v-model="enc.enc_num_hosp" disabled />
                        </div>
                        <!-- <c-select :datas="dep" label="dep_label" code="dep_id" placeholder="Département" v-model="enc.enc_dep_id" /> -->
                        <div class="flex flex-column ml-2">
                            <span class="text-xs font-bold"> Département </span>
                            <Dropdown class="p-inputtext-sm" :options="dep" optionLabel="dep_label" optionValue="dep_id"  v-model="enc.enc_dep_id" placeholder="Département" />
                        </div>
                    </div>
                    <div class="flex flex-column mb-2 flex-grow-1">
                            <span class="text-xs font-bold"> Date d'entrée </span>
                            <InputText class="p-inputtext-sm" v-model="enc.enc_date_entre" type="date" />
                    </div>
                    <div class="flex flex-column mt-4 mb-4">
                        <!-- <InputText  :disable="false" v-model="enc.enc_date_entre" label="Date d'entrée" type="date" class="" /> -->
                        <div :class="{'border-1 border-blue-500 border-round':enc.enc_is_externe,'border-1 border-gray-200 border-round':!enc.enc_is_externe}" 
                        class="p-2 field-checkbox text-sm mb-2">
                            <Checkbox :disabled="(enc.enc_id)?true:false" inputId="binary" :checked="(enc.enc_is_externe)?true:false" v-model="enc.enc_is_externe" :binary="true" />
                            <label for="binary"> Externe </label>
                        </div>
                        <div class="flex flex-column flex-grow-1">
                            <span class="text-xs font-bold">Patient</span>
                            <!-- <span class="flex items-center justify-center border p-2 rounded cursor-pointer w-80" @click=" in_select_pat = true ">  
                                {{ (pat_selected.pat_id != undefined)?pat_selected.pat_nom_et_prenom:'-' }} </span> -->
                            <InputText :disabled="(enc.enc_id)?true:false" class="p-inputtext-sm" v-model="pat_selected.pat_nom_et_prenom" @click=" ()=>{
                                if(!enc.enc_is_externe && !enc.enc_id){
                                    in_select_pat = true
                                }
                            } " />
                        </div>  

                    </div>
                    <div class="flex flex-column mb-2">
                        <!-- <c-select :datas="choice_pec" label="label" code="code" v-model="enc.enc_is_pec"  placeholder="Choix de paiement" /> -->
                        <div class="flex flex-column mb-2">
                            <span class="text-xs font-bold"> Choix de paiement </span>
                            <Dropdown class="p-inputtext-sm" :options="choice_pec" optionLabel="label" optionValue="code"  v-model="enc.enc_is_pec" placeholder="Choix de paiement" />
                        </div>

                        <!-- <c-select v-if="enc.enc_is_pec == 1" :datas="soc" label="ent_label" code="ent_id" class="ml-2" v-model="enc.enc_ent_id"  placeholder="Société payeur" /> -->
                        <div class="flex flex-column mb-2" v-if="enc.enc_is_pec == 1" >
                            <span class="text-xs font-bold"> Société payeur </span>
                            <Dropdown class="p-inputtext-sm" :options="soc" optionLabel="ent_label" optionValue="ent_id"  v-model="enc.enc_ent_id" placeholder="Société payeur" />
                        </div>

                        <!-- <c-select :datas="tarif" label="tarif_label" class="ml-2" code="tarif_id" v-model="enc.enc_tarif_id"  placeholder="Tarif" /> -->
                        <div class="flex flex-column mb-2">
                            <span class="text-xs font-bold"> Tarif </span>
                            <Dropdown class="p-inputtext-sm" :disabled="ene.encserv.length > 0 || ene.encprescri.length > 0" :options="tarif" optionLabel="tarif_label" optionValue="tarif_id"  v-model="enc.enc_tarif_id" placeholder="Tarif" />
                        </div>
                    </div>

                    <Divider/>

                    <!-- Affichage des trucs sur le truc e -->
                    <div class="p-1 flex w-full border-1 border-round border-200">
                        <div class="px-2">
                            <!-- <custom-input :disable=" (!enc.enc_date_entre) " v-model="enc.enc_date_sortie" label="Date de sortie" type="date"/> -->
                            <div class="flex flex-column mb-2">
                                <span class="text-xs font-bold"> Date de sortie </span>
                                <InputText class="p-inputtext-sm" v-model="enc.enc_date_sortie" type="date" placeholder="dd/mm/yyyy"  :disabled=" (!enc.enc_date_entre) "/>
                            </div>
                            <div class="flex align-items-end mb-2">
                                <!-- <custom-input :disable="true" v-model="enc.enc_paie_final" class="flex-grow" label="Tout payé le" type="date"/> -->
                                <div class="flex flex-column flex-grow-1">
                                    <span class="text-xs font-bold"> Tout payé le </span>
                                    <InputText class="p-inputtext-sm" placeholder="dd/mm/yyyy" v-model="enc.enc_paie_final" type="date"  disabled/>
                                </div>
                                <Button class="p-button-sm ml-2" label="Paiement final" @click=" ()=>{
                                    on_paiement_final = true
                                    enc.enc_paie_final = dateToInput(new Date())
                                } " :disabled="(enc.enc_date_sortie && !enc.enc_to_caisse)?false:true" />
                            </div>
                            <!-- <c-select class="mt-1" :disable="(enc.enc_to_caisse || !enc.enc_date_sortie )" :datas="resultat_final" 
                            v-model="enc.enc_result_final" label="label" code="code" placeholder="Résultat final" /> -->

                            <div class="flex flex-column mb-2">
                                <span class="text-xs font-bold"> Résultat final </span>
                                <Dropdown class="p-inputtext-sm" :options="resultat_final" optionLabel="label" optionValue="code"  v-model="enc.enc_tarif_id" placeholder="Résultat final"
                                 :disabled="(enc.enc_to_caisse || !enc.enc_date_sortie )?true:false" />
                            </div>
                        </div>
                        <div class="px-2">
                            <!-- <custom-input v-model="enc.enc_montant" label="TOTAL A PAYER" :disable="true"/> -->
                            <div class="flex flex-column mb-2">
                                <span class="text-xs font-bold"> TOTAL A PAYER </span>
                                <InputNumber class="p-inputtext-sm" v-model="enc.enc_montant" disabled />
                            </div>
                            <!-- <custom-input v-model="enc.enc_total_avance" class="mt-1" label="TOTAL AVANCE" :disable="true"/> -->
                            <div class="flex flex-column mb-2">
                                <span class="text-xs font-bold"> TOTAL AVANCE </span>
                                <InputNumber class="p-inputtext-sm" v-model="enc.enc_total_avance" disabled />
                            </div>
                            <!-- <custom-input v-model="enc.enc_reste_paie" class="mt-1" label="RESTE A PAYER" :disable="true"/> -->
                            <div class="flex flex-column mb-2">
                                <span class="text-xs font-bold"> RESTE A PAYER </span>
                                <InputNumber class="p-inputtext-sm" v-model="enc.enc_reste_paie" disabled />
                            </div>
                        </div>
                    </div>

                </div>

                <!-- DIV du Tableau des avances et des désignations des actes -->
                <Divider layout="vertical" />
                <div class="flex flex-column relative" style="min-width:600px;">
                    <div class="mt-2 border-1 border-200 p-2 text-md flex sticky top-0 bg-white mb-2" style="z-index:105">
                        <div class="mr-2 cursor-pointer border-bottom-2 border-400" @click="cur_view = l.code" :class="{'border-bottom-2 font-bold border-blue-500':cur_view == l.code}" v-for="l in list_view" :key="l.code">
                            <span class=""> {{ l.label }} </span>
                        </div>
                    </div>

                    <!-- onglet avance / gestion avance -->
                    <div v-if="cur_view == 'avance' && enc.enc_id " class="">
                        <table class="w-full">
                            <thead class="rounded-t " >
                                <tr class="bg-gray-50 text-gray-700 text-sm">
                                    <th v-for="l in av_label_list" class="p-2 border text-xs text-left" :key="l.key">
                                        {{ l.label }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr @click=" ()=>{
                                        av_selected = p
                                    } " v-for="p in encav" class="cursor-pointer"  :key="p.encav_id">
                                    <td :class="{'active-row':av_selected.encav_id == p.encav_id}"  class="p-2 border text-xs" 
                                    v-for="l in av_label_list" :key="l.key">

                                        <div class="w-full flex justify-end" v-if="['encav_montant'].indexOf(l.key) != -1">
                                            <span class=""> {{  parseInt(p[l.key]).toLocaleString('fr-CA') }} </span>
                                        </div>
                                        <span v-else-if="l.key == 'encav_date'"> {{ dateToText(p[l.key]) }} </span>
                                        <div class="flex text-xs" v-else-if="l.key == 'encav_validate'"> 
                                            <span class="p-1 border text-white border-round font-bold" :class="{'bg-blue-500':p.encav_validate,'bg-yellow-500':!p.encav_validate}">  {{ (p.encav_validate)?'OUI':'NON' }} </span> 
                                        </div>
                                        <span class="" v-else > {{ p[l.key] }} </span>
                                    </td>
                                </tr>
                                <tr class="text-xs">
                                    <td class="p-2 border"  colspan="2">
                                        <span class="font-bold"> </span>
                                    </td>
                                    <td class="p-2 border ">
                                        <div class="w-full flex flex-column text-left">
                                            <span class="text-xs font-bold"> Total Encaissé</span>
                                            <span class="">{{ enc.enc_total_avance.toLocaleString('fr-CA') }}</span>
                                        </div>
                                    </td>
                                    <td class="p-2 border ">
                                        <div class="w-full flex flex-column text-left">
                                            <span class="text-xs font-bold"> Total</span>
                                            <span class="">{{ total_all_avance.toLocaleString('fr-CA') }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div v-if="!enc.enc_validate || inTypeUser(['g','m','a'])" class="flex mt-2">
                            <div class="flex w-full">
                                <div>
                                    <Button class="p-button-sm " label="Avance" icon="pi pi-plus" @click="on_add_avance = true" />
                                </div>

                                
                                <div>
                                    <Button  v-if="av_selected.encav_id && !av_selected.encav_validate && inTypeUser(['a','g','m'])" 
                                    class="p-button-sm p-button-text p-button-danger p-button-raised ml-2" @click="delAvance" label="Supprimer" icon="pi pi-times" />
                                </div>

                                <span class="flex-grow-1"> </span>


                                <div class="">
                                    <Button label="Facture actuelle"  @click="viewFact" icon="pi pi-print" class="p-button-sm p-button-text p-button-help p-button-raised ml-2" />
                                </div>
                                
                            </div> 
                            
                        </div>
                    </div>

                    <!-- Ici pour la prescription -->
                    <div v-if="cur_view == 'prescription'" class="flex flex-column relative">
                        <div style="position: sticky;top: 50px;z-index: 1000;"  class="mb-2 flex flex-column" :class="{'border-1 border-round border-200 p-2':on_search_product}">
                            <div class="flex flex-column ">
                                <span class="p-input-icon-right">
                                    <i class="pi pi-search" />
                                    <InputText @focus="()=>{
                                        on_search_product = true
                                        researchProdServ()
                                    }" class="p-inputtext-sm" type="text" v-model="filters.search" placeholder="Rechercher un produit ou un service"/>
                                </span>
                            </div>

                            <div v-if="on_search_product" class="flex flex-column" style="max-height: 300px;overflow: auto;">
                                <div @click="getTservProd(lp)" class="flex cursor-pointer border-bottom-1 hover:bg-gray-100 border-200 p-2" v-for="lp in list_prod_serv" :key="lp.service_code">
                                    <span class="font-bold text-gray-600 flex-grow-1"> {{ lp.service_label }} </span>
                                    <div class="flex">
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


                        <div class="" ref="tableur" v-show="!on_search_product" tabindex="0"
                        @keypress="changeNumQt" @keydown.delete="changeNumQt"
                        @keydown.up = "changeCurIndex('up')" @keydown.down = "changeCurIndex('down') "
                        >

                            <table class="w-full" >
                                <thead class="rounded-t sticky top-28 z-20" >
                                    <tr class="bg-gray-50 text-gray-700 text-sm">
                                        <th v-for="l in esp_label_list" class="p-2 border text-xs text-left" :key="l.key">
                                            {{ l.label }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  @click=" ()=>{
                                            list_selected = p
                                            cur_index = i
                                        } " v-for="p,i in ene.encprescri" class="cursor-pointer"  :key="p.service_code">
                                        <td :class="{'active-row':list_selected.service_code == p.service_code}"  class="p-2 border text-xs" 
                                        v-for="l in esp_label_list" :key="l.key">

                                            <div class="w-full flex justify-end" v-if="['encp_montant','encp_prix_unit'].indexOf(l.key) != -1">
                                                <span class=""> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                                            </div>

                                            <span v-else-if="l.key == 'encp_qt'"  :class="{'text-xl':list_selected.service_code == p.service_code}"
                                            class="px-2 py-1 border-1 border-round bg-white cursor-pointer flex "> {{ p.encp_qt.toLocaleString('fr-CA') }} </span>

                                            <span class="" v-else > {{ p[l.key] }} </span>
                                        </td>
                                    </tr>
                                    <tr class="text-xs">
                                        <td class="p-2 border"  colspan="5">
                                            <span class="font-bold"> Total </span>
                                        </td>
                                        <td class="p-2 border ">
                                            <div class="w-full flex text-left">
                                                <span class="">{{ enc.enc_montant_prescription.toLocaleString('fr-CA') }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                        
                        <div v-if="!enc.enc_validate || inTypeUser(['g','m','a'])" class="flex mt-2">
                            <div class="flex">

                                <Button label="Supprimer" v-if="list_selected.service_code" class="p-button-sm p-button-text p-button-danger p-button-raised ml-2" 
                                icon="pi pi-times" @click="delFserv" />
                            </div> 
                        </div>
                    </div>

                    <!-- Début de l'affichage designation des actes -->
                    <div v-if="cur_view == 'acte'" class="flex flex-column relative">
                        <div style="position: sticky;top: 50px;z-index: 1000;"  class="mb-2 flex flex-column" :class="{'border-1 border-round border-200 p-2':on_search_product}">
                            <div class="flex flex-column ">
                                <span class="p-input-icon-right">
                                    <i class="pi pi-search" />
                                    <InputText @focus="()=>{
                                        on_search_product = true
                                        researchProdServ()
                                    }" class="p-inputtext-sm" type="text" v-model="filters.search" placeholder="Rechercher un produit ou un service"/>
                                </span>
                            </div>

                            <div v-if="on_search_product" class="flex flex-column" style="max-height: 300px;overflow: auto;">
                                <div @click="getTservProd(lp)" class="flex cursor-pointer border-bottom-1 hover:bg-gray-100 border-200 p-2" v-for="lp in list_prod_serv" :key="lp.service_code">
                                    <span class="font-bold text-gray-600 flex-grow-1"> {{ lp.service_label }} </span>
                                    <div class="flex">
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


                        <div class="" ref="tableur" v-show="!on_search_product" tabindex="0"
                        @keypress="changeNumQt" @keydown.delete="changeNumQt"
                        @keydown.up = "changeCurIndex('up')" @keydown.down = "changeCurIndex('down') "
                        >

                            <table class="w-full" >
                                <thead class="rounded-t sticky top-28 z-20" >
                                    <tr class="bg-gray-50 text-gray-700 text-sm">
                                        <th v-for="l in es_label_list" class="p-2 border text-xs text-left" :key="l.key">
                                            {{ l.label }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click=" ()=>{
                                            list_selected = p
                                            cur_index = i
                                        } " v-for="p,i in ene.encserv" class="cursor-pointer"  :key="p.service_code">
                                        <td :class="{'active-row':list_selected.service_code == p.service_code}"  class="p-2 border text-xs" 
                                        v-for="l in es_label_list" :key="l.key">

                                            <div class="w-full flex justify-end" v-if="['encserv_montant','encserv_prix_unit'].indexOf(l.key) != -1">
                                                <span class=""> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                                            </div>

                                            <span v-else-if="l.key == 'encserv_qt'"  :class="{'text-xl':list_selected.service_code == p.service_code}"
                                            class="px-2 py-1 border-1 border-round bg-white cursor-pointer flex "> {{ p.encserv_qt.toLocaleString('fr-CA') }} </span>

                                            <span class="" v-else > {{ p[l.key] }} </span>
                                        </td>
                                    </tr>
                                    <tr class="text-xs">
                                        <td class="p-2 border"  colspan="5">
                                            <span class="font-bold"> Total </span>
                                        </td>
                                        <td class="p-2 border ">
                                            <div class="w-full flex text-left">
                                                <span class="">{{ (enc.enc_montant - enc.enc_montant_prescription).toLocaleString('fr-CA') }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                        
                        <div v-if="!enc.enc_validate || inTypeUser(['g','m','a'])" class="flex mt-2">
                            <div class="flex">

                                <Button label="Supprimer" v-if="list_selected.service_code" class="p-button-sm p-button-text p-button-danger p-button-raised ml-2" 
                                icon="pi pi-times" @click="delFserv" />

                                <div class="flex mx-2"  v-if="list_selected.service_code">
                                    <Button icon="pi pi-minus" @click="addQt('-')" class="p-button-sm p-button-text p-button-raised"  />
                                    <Button icon="pi pi-plus" @click="addQt('+')" class=" p-button-text p-button-raised p-button-sm ml-2"  />
                                </div>
                            </div> 
                        </div>
                    </div>
                    <!-- Fin tableau -->
                </div>
            </div>

        </div>
        <template #footer>
            <!-- <button :disabled=" enc.enc_validate && !inTypeUser(['g','m','a']) " class="bt-p-s" 
            @click="(modif)?upEncaissement():setEncaissement() " > {{ (modif)?'Enregistrer':'Valider' }} </button> -->
            <Button label="Enregistrer" :loading="loading" icon="pi pi-check" @click="(modif)?upEncaissement():setEncaissement() " 
            :disabled=" enc.enc_validate && !inTypeUser(['g','m','a']) " class="p-button-sm" />
            <!-- <button @click="viewFact" v-if="enc.enc_validate" class=" bt-p-s ml-2">
                <span class=""> Imprimer </span>
            </button> -->
            <Button class="p-button-sm ml-2 p-button-text p-button-raised p-button-help" @click="viewFact" v-if="enc.enc_validate" label="Imprimer" />
        </template>

        <select-patient @validate=" setPatient " :visible="in_select_pat" @close="in_select_pat = false" />
        <!-- <add-product-caisse :tarif="tarif_selected" :visible="on_add_product" @close="on_add_product = false" @validate="setProduct" /> -->
        <add-avance-hosp @validate=" setAvance " :enc="enc"  :visible="on_add_avance" @close="on_add_avance = false" />

        <paiement-final-hosp :pat="pat_selected" :en="enc" :visible="on_paiement_final"  @close=" ()=>{
            on_paiement_final = false
            upEncaissement()
        } " />


        <OverlayPanel ref="op">
            <div class="flex flex-column">
                <span class="text-xs"> Appuyez sur "Entrer" pour valider </span>
                <InputNumber v-model="cur_qt" @keypress.enter="changeQt" autofocus class="p-inputtext-sm"  />
            </div>
        </OverlayPanel>
    </Dialog>
</template>
<script>
export default {
    props:['modif','en','visible'],
    watch:{
        'enc.enc_tarif_id'(a){
            for (let i = 0; i < this.tarif.length; i++) {
                const e = this.tarif[i];
                if(a == e.tarif_id){
                    this.tarif_selected = e
                    break
                }
            }
        },
        cur_view(a){
            if(a == 'avance'){
                this.calcTotalAvance()
            }else if(a == 'acte'){
                this.ene_s = {
                    nm:'encserv',
                    pfx:'encserv'
                }
            }else if(a == 'prescription'){
                this.ene_s = {
                    nm:'encprescri',
                    pfx:'encp'
                }
            }

            if(a != "avance"){
                this.list_selected = {}
                this.cur_index = -1
            }
        },
        'enc.enc_total_avance'(a){
            this.enc.enc_reste_paie = parseInt(this.enc.enc_montant) - parseInt(a) 
        },
        'enc.enc_montant'(a){
            this.enc.enc_reste_paie = parseInt(a) - parseInt(this.enc.enc_total_avance)
        },
        'enc.enc_date_sortie'(a){
            if(!a){
                this.enc.enc_paie_final = null
                this.enc.enc_result_final = null
            }else{
                this.enc.enc_result_final = (this.enc.enc_result_final)?this.enc.enc_result_final:this.resultat_final[0].code
            }
        },
        visible(a){
            if(a){
                this.recupAddUtils()
                this.init()
            }
        },
        'filters.search'(a){
            this.researchProdServ()
        },
        cur_index(a){
            if(a > -1){
                this.list_selected = this.ene[this.ene_s.nm][a] 
            }
        },

        on_search_product(a){
            if(!a){
                setTimeout(() => {
                    this.$refs.tableur.focus()
                    this.$refs.content.parentElement.scrollTop = 0

                    //console.log(`cur_index : ${this.cur_index}, list_selected ${this.list_selected.service_label}`);
                }, 500);
            }
        }
    },
    data(){
        return{
            enc:{
                enc_is_pec:0,
                enc_tarif_id:-1,
                enc_montant:0,
                enc_total_avance:0,
                enc_montant_prescription:0,
                enc_reste_paie:0
            },

            //Pour la navigation par clavier
            cur_index:-1,

            //Juste pour les modifications et suppressions
            to_del_serv:[],
            to_del_prescri:[],
            to_add_serv:[], //Ato daholo na ny ajout na ny modification // tsy mandeha tsony io

            to_del_av:[],
            to_add_av:[],

            in_select_pat:false,
            pat_selected:{},
            soc:[],
            tarif:[],
            dep:[],
            cur_view:'acte',
            list_view:[
                {label:'DETAILS PAR DESIGNATION',code:'acte'},
                {label:'AVANCES PERCUES',code:'avance'},
                {label:'PRESCRIPTIONS',code:'prescription'},
            ],
            choice_pec:[
                {label:'Au comptant',code:0},
                {label:'Prise en Charge',code:1},
            ],

            encserv:[],
            encprescri:[],

            list_modif_prescri:{},

            //C'est vraiment le truc qui va contenir 
            //les 2 tableaux qui sont vraiment identique mais doit contenir
            //des listes de choses différentes
            ene:{
                encserv:[],
                encprescri:[]
            },
            ene_s:{
                nm:'encserv',
                pfx:'encserv'
            },

            esp_label_list:[
                {label:'Code',key:'service_code'},
                {label:'Désignation',key:'service_label'},
                {label:'Quantité',key:'encp_qt'},
                {label:'Unité',key:'art_unite_stk'},
                {label:'Prix Unitaire',key:'encp_prix_unit'},
                {label:'Montant',key:'encp_montant'},
            ],
            es_label_list:[
                {label:'Code',key:'service_code'},
                {label:'Désignation',key:'service_label'},
                {label:'Quantité',key:'encserv_qt'},
                {label:'Unité',key:'art_unite_stk'},
                {label:'Prix Unitaire',key:'encserv_prix_unit'},
                {label:'Montant',key:'encserv_montant'},
            ],
            av_label_list:[
                {label:'Date',key:'encav_date'},
                {label:'Caissier',key:'util_label'},
                {label:'Montant',key:'encav_montant'},
                {label:'Encaissée',key:'encav_validate'},
            ],
            on_add_product:false,
            list_selected:{},
            av_selected:{},
            encav:[],
            tarif_selected:{},  

            //gestion avance
            on_add_avance:false,
            total_avance:0,
            reste_paie:0,

            //Gestion paiment final
            on_paiement_final:false,

            on_search_product:false,

            filters:{
                search:''
            },

            list_prod_serv:[],
            list_modif_hosp:{},

            //valeur actuelle pour la quantité du produit séléctionné
            cur_qt:0,
            total_all_avance:0,

            loading:false,

            
        }
    },
    methods:{
        changeCurIndex(p){
            let t = this.ene[this.ene_s.nm].length

            if(p == 'up'){
                this.cur_index -= (this.cur_index > 0 )?1:0
            }else{
                this.cur_index += (this.cur_index < t-1)?1:0
            }

            //console.log(p)
        },
        changeQt(){
            if(this.cur_qt <= 0 ) return

            for (let i = 0; i < this.encserv.length; i++) {
                const e = this.encserv[i];
                
                if(e.service_code == this.list_selected.service_code){
                    this.encserv[i].encserv_qt = this.cur_qt

                    this.encserv[i].encserv_montant = parseInt(e.encserv_prix_unit) * parseInt(this.encserv[i].encserv_qt)
                    this.calcTotalEnc()

                    if(this.encserv[i].encserv_qt == 0){
                        this.encserv.splice(i,1)
                        this.list_selected = {}
                    }

                    //Ajout des encservs à modifier
                    this.list_modif_hosp[e.service_code] = e

                    this.$refs.op.toggle();
                    // console.log(this.list_modif_hosp)
                    break
                }
            }
        },
        showEditQt(e,p){
           
            // console.log(p.tarifs[index])

             this.$refs.op.toggle(e) 

            this.list_selected = p
            this.cur_qt = p.encserv_qt

        },
        async recupAddUtils(){
            try {

                
                const r = await this.$http.get('api/encaissement/add-utils/hosp',{params:{enc_id:(this.modif)?this.en.enc_id:0}})
                let d = r.data

                if(d.status){
                    this.soc = d.soc
                    this.tarif = d.tarif

                    

                    this.enc.enc_num_hosp = d.last_num_hosp
                    this.dep = d.dep
                
                    //
                    this.tarif_selected = this.tarif[0]

                    if(!this.modif){
                        this.enc.enc_dep_id = d.dep[0].dep_id
                        this.enc.enc_ent_id = d.soc[0].ent_id
                        this.enc.enc_tarif_id = this.tarif[0].tarif_id
                    }else{
                        this.enc = d.enc
                        
                        this.ene.encserv = d.encserv
                        this.ene.encprescri = d.encprescri
                        this.encav = d.encav

                        this.enc.enc_montant_prescription = (this.enc.enc_montant_prescription)?this.enc.enc_montant_prescription :0

                        if(this.enc.enc_is_externe){
                            this.pat_selected.pat_nom_et_prenom = this.enc.enc_pat_externe
                        }else{
                            this.pat_selected = d.enc.patient
                        }

                        //Gestion Date
                        this.enc.enc_date_entre = (this.enc.enc_date_entre)?this.dateToInput(new Date(this.enc.enc_date_entre)):null
                        this.enc.enc_date_sortie = (this.enc.enc_date_sortie)?this.dateToInput(new Date(this.enc.enc_date_sortie)):null
                        this.enc.enc_paie_final = (this.enc.enc_paie_final)?this.dateToInput(new Date(this.enc.enc_paie_final)):null
                        this.calcTotalAvance()

                        //Suppression des données unitiles
                        delete this.enc.patient
                    }
                }else{  
                    this.showNotif(d.message)
                }

            } catch (e) {
                this.showNotif('Erreur de connexion - Ajout/Edition Hospitalisation')
            }
        },

        //Ajout de l'encaissement dans la base
        async setEncaissement(){

            if(!this.checkServiceZeroQt()) return

            if(!this.enc.enc_is_pec){
                this.enc.enc_ent_id  = null
            }

            if(((!this.enc.enc_pat_id && !this.enc.enc_is_externe) || !this.enc.enc_date_entre) || (this.enc.enc_is_externe && !this.pat_selected.pat_nom_et_prenom) ){
                this.showNotif('error','Facturation','Le patient est obligatoire')
                return
            }

            this.enc.enc_pat_externe = (this.enc.enc_is_externe)?this.pat_selected.pat_nom_et_prenom:null

            try {
                this.loading = true
                const r = await this.$http.post('api/encaissement',{
                    enc:this.enc,
                    encserv:this.ene.encserv,
                    encprescri:this.ene.encprescri,
                    encav:this.encav,
                    user_id:this.getUserId()})
                let d = r.data

                if(d.status){
                    this.$emit('validate',{close:true})
                    this.showNotif('success','Facturation','Hospitalisation bien insérée')
                }else{
                    this.showNotif('error','Facturation',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.loading = false

        },

        //Modification d'une hospitalisation
        //Ajout de l'encaissement dans la base
        async upEncaissement(){

            if(!this.checkServiceZeroQt()) return

            if(!this.enc.enc_is_pec){
                this.enc.enc_ent_id  = null
            }

            if(!this.enc.enc_pat_id){
                this.showNotif('Le patient est obligatoire')
                return
            }

            //Insertion des serviecs à ajouter
            // let add = []
            // for (let i = 0; i < this.to_add_serv.length; i++) {
            //     add.push(this.encserv[this.to_add_serv[i]])
            // }
            // this.to_add_serv = add

            // add = []
            // for (let i = 0; i < this.to_add_av.length; i++) {
            //     add.push(this.encav[this.to_add_av[i]])
            // }
            // this.to_add_av = add

            try {
                const r = await this.$http.put('api/encaissement/hosp',{
                    enc:this.enc,
                    encserv:{del:this.to_del_serv,add:this.ene.encserv},
                    encprescri:{del:this.to_del_prescri,add:this.ene.encprescri},
                    encav:{del:this.to_del_av,add:this.to_add_av},
                    user_id:this.getUserId()})
                let d = r.data

                if(d.status){
                    this.$emit('validate')
                    this.showNotif('success','Hospitalisation','Hospitalisation bien modifiée')
                    this.recupAddUtils()

                    
                    this.list_selected = {}
                    this.cur_index = -1

                }else{
                    this.showNotif('error','Hospitalisation',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        setPatient(p){
            this.pat_selected = p
            this.enc.enc_pat_id = p.pat_id

            this.in_select_pat = false
        },
        setAvance(){
            this.getListAvance()
            this.on_add_avance = false
        },

        async delAvance(){
            try{
                const r = await this.$http.delete('api/caisse/avance',{params:{encav_id:this.av_selected.encav_id,user_id:this.getUserId()}})
                let d = r.data

                if(d.status){
                    this.getListAvance()
                }else{
                    this.showNotif('error','Avance',d.message)
                }
            }catch(e){
                this.showNotifServerError()
            }
        },
        async getListAvance(){
            try{
                const r = await this.$http.get('api/caisse/avance',{params:{enc_id:this.enc.enc_id}})
                let d = r.data

                if(d.status){
                    this.encav = d.encav
                    this.calcTotalAvance()
                    
                }else{
                    this.showNotif('error','Avance',d.message)
                }
            }catch(e){
                this.showNotifServerError()
            }
        },

        calcTotalAvance(){
            this.enc.enc_total_avance  = 0
            this.total_all_avance = 0
            for (let i = 0; i < this.encav.length; i++) {
                const e = this.encav[i];
                if(e.encav_validate){
                    this.enc.enc_total_avance += parseInt(e.encav_montant)
                }

                this.total_all_avance += parseInt(e.encav_montant)
            }
        },  
        init(){

            this.enc = {
                enc_is_pec:0,
                enc_tarif_id:-1,
                enc_montant:0,
                enc_total_avance:0,
                enc_montant_prescription:0,
                enc_reste_paie:0
            }

            this.enc.enc_date_entre = this.dateToInput(new Date())
            // console.log(this.enc.enc_date_entre)
            this.enc.enc_util_id = this.$store.state.user.util_id
            this.enc.enc_is_hosp = 1
            this.enc.enc_to_caisse = 0

            this.to_del_serv = []
            this.to_del_prescri = []
            this.to_add_serv = [],//Ato daholo na ny ajout na ny modification //tsy mandeha tsony io

            this.to_del_av = []
            this.to_add_av = []

            this.in_select_pat = false
            this.pat_selected = {}
            this.soc = []
            this.tarif = []
            this.dep = []
            this.cur_view = 'acte'

            this.on_add_product = false
            this.list_selected = {}
            this.av_selected = {}
            this.encav = []
            this.tarif_selected = {}, 

            //gestion avance
            this.on_add_avance = false
            this.total_avance = 0
            this.reste_paie = 0

            //Gestion paiment final
            this.on_paiement_final = false

            this.encserv = []
            this.encprescri = []

            this.list_modif_prescri = {}

            //C'est vraiment le truc qui va contenir 
            //les 2 tableaux qui sont vraiment identique mais doit contenir
            //des listes de choses différentes
            this.ene = {
                encserv:[],
                encprescri:[]
            }
            this.ene_s = {
                nm:'encserv',
                pfx:'encserv'
            }

            this.on_search_product = false

            this.list_prod_serv = []
            this.filters.search = ''

            this.list_modif_hosp = {}

            this.cur_qt = 0

            this.cur_index = -1

        },
        calcTotalEnc(){
            this.enc.enc_montant = 0
            this.enc.enc_montant_prescription = 0

            for (let i = 0; i < this.ene.encserv.length; i++) {
                const e = this.ene.encserv[i];
                this.enc.enc_montant += parseInt(e.encserv_montant)
            }

            for (let i = 0; i < this.ene.encprescri.length; i++) {
                const e = this.ene.encprescri[i];
                this.enc.enc_montant_prescription += parseInt(e.encp_montant)
            }

            this.enc.enc_montant = this.enc.enc_montant + this.enc.enc_montant_prescription 
        },  
        setProduct(a){
            this.on_add_product = false
            this.encserv.push(a)

            this.to_add_serv.push(this.encserv.length - 1)
            this.calcTotalEnc()
            
        },
        delFserv(){
            let nm = this.ene_s.nm
            let pfx = this.ene_s.pfx

            for (let i = 0; i < this.ene[nm].length; i++) {
                const e = this.ene[nm][i];

                if(e.service_code == this.list_selected.service_code){

                    if(e[`${pfx}_enc_id`]){
                        this.to_del_prescri.push(e[`${pfx}_id`])
                    }
                    this.ene[nm].splice(i,1)
                    this.list_selected = {}


                    if(this.ene[nm].length <= 0) this.cur_index = -1
                    this.calcTotalEnc()
                    break
                }
            }
        },

        async viewFact(){
            try {
                // let f = this.list_selected
                const r = await this.$http.get('api/encaissement/set-pdf/'+this.enc.enc_id,{params:{util_id:this.getUserId()}})
                let d = r.data

                if(d.status){
                    window.electronAPI.downFact(this.$http.defaults.baseURL+'/api/encaissement/download')
                }else{
                    this.showNotif('error','Facturation',d.message)
                }
            } catch (e) {
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



        async getTservProd(lp){
            try {

                let nm = this.ene_s.nm
                let pfx = this.ene_s.pfx


                //Recherche d'abord si le truc est déja dans la liste
                for (let i = 0; i < this.ene[nm].length; i++) {
                    const e = this.ene[nm][i];

                    if(e.service_code == lp.service_code){

                        this.ene[nm][i][`${pfx}_qt`] += 1
                        this.ene[nm][i][`${pfx}_montant`] = parseInt(e[`${pfx}_prix_unit`]) * parseInt(this.ene[nm][i][`${pfx}_qt`])
                        this.calcTotalEnc()

                        this.on_search_product = false
                        return
                    }
                }
                //---------------------------
                const r = await this.$http.get('api/caisse/tarif-prod',{params:{
                    service_id:(lp.art_id)?lp.art_id:lp.service_id,
                    is_product:(lp.art_id)?1:0,
                    tarif_id:this.enc.enc_tarif_id
                }})


                let d = r.data
                if(d.status){
                    let ts = d.tserv

                    //Ajout de l'encserv
                    this.ene[nm].unshift({
                        service_label:lp.service_label,
                        service_code:lp.service_code,
                        art_unite_stk:(lp.art_id)?lp.art_unite_stk:null,
                    })

                    this.ene[nm][0][`${pfx}_serv_id`] = (lp.art_id)?lp.art_id:lp.service_id
                    this.ene[nm][0][`${pfx}_qt`] = 0
                    this.ene[nm][0][`${pfx}_prix_unit`] = ts.tserv_prix
                    this.ene[nm][0][`${pfx}_montant`] = 0 * parseInt(ts.tserv_prix)
                    this.ene[nm][0][`${pfx}_is_product`] = (lp.art_id)?1:0

                    this.cur_index = 0
                    this.list_selected = this.ene[nm][0]
                    this.calcTotalEnc()

                }else{
                    this.showNotif('error','Preparation encaissement',d.message)
                }

                this.on_search_product = false
            } catch (e) {
                this.showNotifServerError()
            }
        },

        addQt(s){

            let nm = this.ene_s.nm
            let pfx = this.ene_s.pfx

            for (let i = 0; i < this.ene[nm].length; i++) {
                const e = this.ene[nm][i];
                
                if(e.service_code == this.list_selected.service_code){
                    if(s == '-'){
                        if(this.ene[nm][i][`${pfx}_qt`] == 1) return

                        this.ene[nm][i][`${pfx}_qt`] -= 1
                    }else{
                        this.encserv[i][`${pfx}_qt`] += 1
                    }

                    this.ene[nm][i][`${pfx}_montant`] = this.round50(parseInt(e[`${pfx}_prix_unit`]) * parseInt(this.ene[nm][i][`${pfx}_qt`]))
                    this.calcTotalEnc()

                    if(this.ene[nm][i][`${pfx}_qt`] == 0){
                        this.ene[nm].splice(i,1)
                        this.list_selected = {}
                    }

                    //Ajout des encservs à modifier
                    this.list_modif_hosp[e.service_code] = e

                    // console.log(this.list_modif_hosp)
                    break
                }
            }
        },

        setAddQtNum(nb){

            let nm = this.ene_s.nm
            let pfx = this.ene_s.pfx


            if(! this.list_selected.service_code) return 
            for (let i = 0; i < this.ene[nm].length; i++) {
                const e = this.ene[nm][i];
                
                if(e.service_code == this.list_selected.service_code){

                    this.ene[nm][i][`${pfx}_qt`] = (this.ene[nm][i][`${pfx}_qt`] * 10) + nb

                    this.ene[nm][i][`${pfx}_montant`] = this.round50(parseInt(e[`${pfx}_prix_unit`]) * parseInt(this.ene[nm][i][`${pfx}_qt`]))
                    this.calcTotalEnc()


                    //Ajout des encservs à modifier
                    this.list_modif_hosp[e.service_code] = e
                    break
                }
            }
        },
        setSubQtNum(){
            let nm = this.ene_s.nm
            let pfx = this.ene_s.pfx

            if(! this.list_selected.service_code) return 
            for (let i = 0; i < this.ene[nm].length; i++) {
                const e = this.ene[nm][i];
                
                if(e.service_code == this.list_selected.service_code){

                    this.ene[nm][i][`${pfx}_qt`] = (this.ene[nm][i][`${pfx}_qt`] - (this.ene[nm][i][`${pfx}_qt`]% 10)) / 10

                    this.ene[nm][i][`${pfx}_montant`] = this.round50(parseInt(e[`${pfx}_prix_unit`]) * parseInt(this.ene[nm][i][`${pfx}_qt`]))
                    this.calcTotalEnc()

                    //Ajout des encservs à modifier
                    this.list_modif_hosp[e.service_code] = e
                    break
                }
            }
        },

        changeNumQt(e){

            //On va verifié si la touche est un nombre ou pas
            let t = parseInt(e.key)
            if(t.toString() == 'NaN'){
                if(e.code == 'NumpadEnter' || e.code == 'Enter'){ //si appui de l'entrée de pavé numérique
                    //console.log('Entrée du pavé numérique')
                    if(this.cur_index < this.ene[this.ene_s.nm].length -1){
                        this.cur_index += 1
                    }
                }else if(e.code == 'Backspace'){
                    this.setSubQtNum()
                }else if(e.code == 'Delete'){
                    this.delFserv()
                }else if(e.key == '-'){
                    this.addQt('-')
                }else if(e.key == '+'){
                    this.addQt('+')
                }
            }else {
                this.setAddQtNum(t)
            }
            //console.log(e)
        },
        checkServiceZeroQt(){

            for (let i = 0; i < this.encserv.length; i++) {
                const e = this.encserv[i];
                
                if(e.encserv_qt == 0){
                    this.showNotif('error','Insertion produits/services',`Certains quantité de produits/services sont à ${'zéro'.toUpperCase()}`)
                    return false
                }
            }

            for (let i = 0; i < this.encprescri.length; i++) {
                const e = this.encprescri[i];
                
                if(e.encp_qt == 0){
                    this.showNotif('error','Insertion produits/services',`Certains quantité de produits/services dans PRESCRIPTION sont à ${'zéro'.toUpperCase()}`)
                    return false
                }
            }
            return true

            
        }
    },
    mounted(){  
        //console.log(this.getUserId());
    }
}
</script> 