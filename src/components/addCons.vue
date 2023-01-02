<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Création Consultation </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons"> clear </span> </button>
            </div>

            <div class="p-2 flex flex-col">
                <div class="flex mb-2">
                    <!-- Composant de recherche rapide d'une ligne d'une table -->
                    <div class="relative">
                        <div class=" flex flex-col">
                            <span class="text-xs font-bold"> Patient </span>
                            <span @click="on_search_patient = true"  class="cursor-pointer rounded-lg border h-8 bg-white w-56 flex justify-center items-center text-xs"> {{ (p_selected.pat_nom_et_prenom)?p_selected.pat_nom_et_prenom:'--' }} </span>
                        </div>
                        <div v-if="on_search_patient" class="border z-50 rounded shadow-lg absolute py-2 w-56 bg-white top-0">
                            <div class="p-2">
                                <custom-input label="Code patient"  v-model="search"/>
                            </div>
                            <div class="flex flex-col overflow-auto" style="max-height:200px">
                                <div @click=" ()=>{
                                        p_selected = p 
                                        on_search_patient = false
                                        search = ''
                                    } " class="text-xs flex flex-col w-full p-2 border-b hover:bg-gray-50 cursor-pointer" v-for="p in pat_search" :key="p.pat_id"> 
                                    <span class="text-gray-400"> {{ p.pat_numero }} </span>
                                    <span class=""> {{ p.pat_nom_et_prenom }} </span>
                                </div>
                            </div>  
                            <div class="px-2">
                                <span class="text-xs cursor-pointer underline text-indigo-600" @click=" ()=>{
                                        on_search_patient = false
                                        search = ''
                                    } ">Fermer</span>
                            </div>
                        </div>
                    </div>
                    <!-- Fin du composant -->
                </div>
                <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="cons.cons_montant" label="Montant éspèce" />
                    <custom-input class="mr-2" v-model="cons.cons_montant_calc" label="Montant calculé" />
                </div>
                <div class="flex mb-2">
                    <custom-input class="mr-2 w-full" v-model="cons.cons_medcin" label="Médecin" />
                </div>

                <div class="flex mb-2">
                    <!-- Composant de recherche rapide d'une ligne d'une table -->
                    <div class="relative">
                        <div class=" flex flex-col">
                            <span class="text-xs font-bold"> Société </span>
                            <span @click="on_search_soc = true"  class="cursor-pointer rounded-lg border h-8 bg-white w-56 flex justify-center items-center text-xs"> {{ (soc_selected.ent_label)?soc_selected.ent_label:'--' }} </span>
                        </div>
                        <div v-if="on_search_soc" class="border z-50 rounded shadow-lg absolute py-2 w-56 bg-white top-0">
                            <div class="p-2">
                                <custom-input label="Code Société"  v-model="search"/>
                            </div>
                            <div class="flex flex-col overflow-auto" style="max-height:200px">
                                <div @click=" ()=>{
                                        soc_selected = p 
                                        on_search_soc = false
                                        search = ''
                                    } " class="text-xs flex flex-col w-full p-2 border-b hover:bg-gray-50 cursor-pointer" v-for="p in ent_search" :key="p.ent_id"> 
                                    <span class="text-gray-400"> {{ p.ent_code }} </span>
                                    <span class=""> {{ p.ent_label }} </span>
                                </div>
                            </div>  
                            <div class="px-2">
                                <span class="text-xs cursor-pointer underline text-indigo-600" @click=" ()=>{
                                        on_search_soc = false
                                        search = ''
                                    } ">Fermer</span>
                            </div>
                        </div>
                    </div>
                    <!-- Fin du composant -->
                </div>
                <div class="flex mb-2">
                    <custom-input class="mr-2" v-model="cons.cons_num_dossier" label="N° Dossier" />
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postCons"> Ajouter </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch:{
        search(a){
            if(!a) return

            if(this.on_search_patient) {
                this.searchPatByNum()
            }else if(this.on_search_soc || this.on_search_soc2){
                this.searchSocByNum()
            }
        },
        'cons.cons_montant'(a){
            if(a){
                this.cons.cons_montant_calc = null
            }
        },
        'cons.cons_montant_calc'(a){
            if(a){
                this.cons.cons_montant = null
            }
        }
    },
    data(){
        return{
            cons:{
                cons_montant:null,
                cons_montant_calc:null
            },
            p_selected:{},
            soc_selected:{},
            pat_search:[],
            search:'',
            on_search_patient:false,
            on_search_soc:false,

            //entreprise
            ent_search:[]
        }
    },
    methods:{
        async searchPatByNum(){
            try {
                const _r = await this.$http.get('api/patients/out/search',{params:{by:'pat_numero',search:this.search}})

                let _d = _r.data
                if(_d.status){
                    this.pat_search = _d.patients
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async searchSocByNum(){
            try {
                const _r = await this.$http.get('api/entreprises/out/search',{params:{by:'ent_code',search:this.search}})

                let _d = _r.data
                if(_d.status){
                    this.ent_search = _d.ents
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        async postCons(){
            try {
                
                
                this.cons.cons_pat_id = (this.p_selected.pat_id)?this.p_selected.pat_id:null
                this.cons.cons_ent_id = (this.soc_selected.ent_id)?this.soc_selected.ent_id:null

                const _r = await this.$http.post('api/consultation',this.cons)
                let _d = _r.data
                
                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    }
}
</script>

<style>

</style>