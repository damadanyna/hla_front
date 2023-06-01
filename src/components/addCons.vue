<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm" style="min-width:600px">
        <template #header>
            <span class="text-sm font-bold"> Ajout consultation </span>
        </template>
        <div class="flex flex-column">
            <div class="flex w-full mb-2">
                <div class="flex flex-column flex-grow-1">
                    <span class="text-xs font-bold"> Patient </span>
                    <InputText class="p-inputtext-sm" v-model="p_selected.pat_nom_et_prenom" @click="in_select_pat = true" />
                </div>
                <!-- <custom-input class="mr-2 w-full" v-model="cons.cons_medcin" label="Médecin" /> -->
                <div class="flex flex-column ml-2" style="width:40%">
                    <span class="text-xs font-bold"> Médecin </span>
                    <InputText class="p-inputtext-sm" v-model="cons.cons_medcin" />
                </div>
            </div>

            <div class="flex mb-2 w-full">
                <!-- <custom-input class="mr-2" v-model="cons.cons_montant" label="Montant éspèce" /> -->
                <div class="flex flex-column flex-grow-1">
                    <span class="text-xs font-bold"> Montant éspèce </span>
                    <InputNumber class="p-inputtext-sm" v-model="cons.cons_montant" />
                </div>
                <!-- <custom-input class="mr-2" v-model="cons.cons_montant_calc" label="Montant calculé" /> -->
                <div class="flex flex-column ml-2 flex-grow-1">
                    <span class="text-xs font-bold"> Montant calculé </span>
                    <InputNumber class="p-inputtext-sm" v-model="cons.cons_montant_calc" />
                </div>
            </div>

            <div class="flex mb-2 w-full">
                <div class="flex flex-column flex-grow-1">
                    <span class="text-xs font-bold"> Société </span>
                    <InputText class="p-inputtext-sm" v-model="soc_selected.ent_label" @click="in_select_soc = true" />
                </div>

                <div class="flex flex-column ml-2" style="width:40%">
                    <span class="text-xs font-bold"> N° Dossier </span>
                    <InputText class="p-inputtext-sm" v-model="cons.cons_num_dossier" />
                </div>


            </div>

        </div>
        <template #footer>
            <Button label="Valider" :loading="loading" class="p-button-sm" icon="pi pi-check" @click=" postCons " />
        </template>

        <!--  -->
        <select-patient @validate=" setPatient " :visible="in_select_pat" @close="in_select_pat = false" />
        <select-soc @validate=" setSoc " :visible="in_select_soc" @close="in_select_soc = false" />
    </Dialog>
</template>

<script>
export default {
    props:['visible'],
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
        },
        visible(a){
            if(a){
                this.init()
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
            in_select_pat:false,
            in_select_soc:false,
            search:'',
            on_search_patient:false,
            on_search_soc:false,

            //entreprise
            ent_search:[],
            loading:false,
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


                this.cons.user_id = this.getUserId()

                this.loading = true
                const _r = await this.$http.post('api/consultation',this.cons)
                let _d = _r.data
                
                if(_d.status){
                    this.$emit('validate')
                    this.showNotif('success','Consultation',"Consultation bien Ajoutée")
                }else{
                    this.showNotif('error','Consultation',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.loading = false
        },

        setPatient(p){
            this.p_selected = p
            this.in_select_pat = false
        },
        setSoc(s){
            this.soc_selected = s
            this.in_select_soc = false
        },
        init(){
            this.cons = {
                cons_montant:null,
                cons_montant_calc:null
            },
            this.p_selected = {},
            this.soc_selected = {},
            this.pat_search = [],
            this.in_select_pat = false,
            this.in_select_soc = false,
            this.search = '',
            this.on_search_patient = false,
            this.on_search_soc = false,

            //entreprise
            this.ent_search = []

            this.loading = false
        }
    }
}
</script>

<style>

</style>