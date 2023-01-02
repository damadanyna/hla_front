<template>
    <div class="p-2 flex justify-center items-center w-full">
        <div class="w-full">
            <div class="w-full">
                <div class="flex mb-2 items-end ">
                    <button @click="  on_add_pec = true " class="bt-p-s">  <span class="material-icons text-md"> add </span> <span class="ml-2"> Ajouter </span> </button>
                    <button v-if="list_selected.encharge_id && inTypeUser(['a','g','m'])"  class="bt-p-s ml-2" @click="delPec">  <span class="material-icons text-md"> clear </span> <span class="ml-2"> Supprimer </span> </button>
                    
                    <div class="flex-grow flex justify-center">
                        <custom-input v-model="filters.search"  class="mr-2" label="Recherche"  />
                        <c-select class="mr-5" placeholder="Par" v-model="filters.search_by"  :datas="list_search_by" label="label" code="code" />
                        <c-select class="ml-2" placeholder="Sélection" v-model="filters.month" :datas="data_month" label="label" code="code" />
                        <custom-input v-model="filters.year" type="number" class="ml-2 w-16" label="Année"  />
                    </div>

                    
                    <!-- <button  class="bt-p-s ml-2"> Facture détaillée </button> -->
                    <menu-point v-if="list_selected.encharge_id" class="relative">
                        <menu-item  @click=" on_edit_fact = true " > <span class="material-icons"> info </span> <span class="ml-2"> Facture détaillée </span> </menu-item>
                        <menu-item  @click=" on_view_recap = true " > <span class="material-icons"> info </span> <span class="ml-2"> Récapitulatif de facture</span> </menu-item>
                    </menu-point>
                </div>
                <table class="w-full">
                    <thead class="rounded-t sticky top-0 z-20" >
                        <tr class="bg-gray-50 text-gray-700 text-sm text-left">
                            <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                                {{ l.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- <tr v-for="p in list_pec" :key="p.pec_id">
                            <td class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span> {{ p[l.key] }} </span>
                            </td>
                        </tr> -->

                        <tr @click=" ()=>{
                                list_selected = p
                            } " class="cursor-pointer relative" v-for="p,i in list_pec" :key="p.encharge_id">
                            <td :class="{'bg-indigo-600 bg-opacity-10':list_selected.encharge_id == p.encharge_id}" class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                <span class="" v-if=" ['encharge_date_entre','encharge_date_sortie'].indexOf(l.key) != -1 ">
                                    {{ dateToText(p[l.key])  }}
                                </span>
                                <span class="" :class="{'bg-blue-500':p[l.key]}" v-else-if="['encharge_fact_to_gest','encharge_fact_to_soc'].indexOf(l.key) != -1">
                                    <input v-if="l.key == 'encharge_fact_to_gest'" @click=" setStateFact(l.key,i) " :disabled="(!checkModule('prise-en-charge') || p.encharge_fact_to_gest)" type="checkbox" :checked=" p[l.key]" >

                                    <input v-else-if="l.key == 'encharge_fact_to_soc' " @click=" setStateFact(l.key,i) " :disabled=" (!inTypeUser(['g']) || p.encharge_fact_to_soc || !p.encharge_fact_to_gest)" type="checkbox" :checked="p[l.key]" >
                                </span>
                                <span v-else> {{ p[l.key] }} </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <add-pec @validate=" ()=>{
                on_add_pec = false
                getPec()
            } " v-if="on_add_pec" @close=" on_add_pec = false " />

        <gest-fact-pec @validate=" ()=>{
                on_edit_fact = false
                getPec()
            } " :pec="list_selected" v-if="on_edit_fact" @close="on_edit_fact = false" />

        <recap-fact-pec :pec="list_selected" v-if="on_view_recap" @close="on_view_recap = false" />
    </div>
</template>

<script>
export default {
    watch:{
        'filters.month'(){
            this.getPec()
        },
        'filters.year'(){
            this.getPec()
        },
        'filters.search'(){
            this.getPec()
        },
        
        'filters.search_by'(){
            this.getPec()
        }
    },
    data(){
        return{
            list_pec:[],
            on_edit_fact:false,
            list_label:[
                {label:'N°sequence',key:'encharge_seq'},
                {label:'Patient',key:'pat_nom_et_prenom'},
                {label:'Société employeur',key:'ent_label'},
                {label:'Société payeur',key:'ent_label_payeur'},
                {label:'Tarif',key:'tarif_label'},
                {label:'N° compte',key:'ent_num_compte_payeur'},
                {label:"Date d'entrée",key:'encharge_date_entre'},
                {label:"Date de sortie",key:'encharge_date_sortie'},
            ],
            on_add_pec:false,
            on_view_pec:false,
            list_selected:{},

            on_view_recap:false,

            //pour le filtre par date d'insertion
            data_month:[],
            filters:{
                month:0,
                year:2022,
                search_by:'pat_nom_et_prenom',
                search:''
            },
            list_search_by:[
                {label:'Patient',code:"pat_nom_et_prenom"},
                {label:'Société',code:"e1.ent_label"},
                {label:'Soc. Payeur',code:"e2.ent_label"}
            ]

            
        }
    },
    methods:{
        async getPec(){
            try {
                const _r = await this.$http.get('api/encharge',{params:this.filters})
                let _d = _r.data

                if(_d.status){
                    this.list_pec = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async delPec(){
            try {
                const _r = await this.$http.delete('api/encharge/'+this.list_selected.encharge_id)
                let _d = _r.data

                if(_d.status){
                    this.list_selected = {}
                    this.getPec()
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
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
                this.list_label.push({label:'Transmis au gestionnaire',key:'encharge_fact_to_gest'})
            }

            if(this.inTypeUser(['g','a','m'])){
                this.list_label.push({label:'Transmis à l\'Assureur',key:'encharge_fact_to_soc'})
            }

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
                    this.showNotif('Modification bien enregistré')
                    this.getPec()
                }else{
                    this.showNotif(d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },
    beforeMount(){
        this.init()
    },
    mounted(){
        this.getPec()
    }
}
</script>

<style>

</style>