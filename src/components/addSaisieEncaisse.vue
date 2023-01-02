<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Encaissement </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="text-md material-icons"> clear </span> </button>
            </div>

            <div class="p-2 text-xs">
                <div class="flex mb-2">

                    <!-- div side -->
                    <div class="  w-40 border-r pr-2" >
                        <custom-input v-model="m_date"  label="Journée du " :disable="true" type="date" />
                    </div>

                    <!-- Contenu facture à payer -->
                    <div class="px-2 flex flex-wrap "  :style="{width:'550px'}">

                        <!-- Les factures -->
                        <div class="m-2 cursor-pointer" @click="clickFact(i)" 
                        :class="{'bg-red-500 bg-opacity-40':fact_index == i} " 
                        v-for="p,i in facts" :key="p.enc_id" :style="{width:'250px'}">
                            <div class="p-2 border  border-gray-500 text-center">
                                <span class=""> N° Mvmt: {{ p.enc_num_mvmt }} </span> -- <span class="">Patient: {{ p.pat_numero }} </span>
                            </div>
                            <div class="border flex flex-col border-gray-500 p-2 text-center pb-5 font-bold">
                                <span class=""> {{ p.pat_nom_et_prenom }} </span>
                                <span class="" v-if="p.enc_is_hosp"> ( HOSP ) </span>
                            </div>

                            <div class="border border-gray-500 p-2 text-center font-bold text-red-600">
                                <span class=""> Ar  {{ (p.enc_is_hosp)?(parseInt(p.enc_montant) - parseInt(p.enc_total_avance)).toLocaleString('fr-CA'):p.enc_montant.toLocaleString('fr-CA') }} </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="p-1 flex justify-end items-end sticky bottom-0 bg-white border-t mb-1">
                    <custom-input v-model="total_montant" class="font-bold" :disable="true" label="Montant" />
                    <span class="flex-grow"></span>  
                    <div class="flex" v-if="fact_index != -1">
                        <button class="bt-p-s mr-2" @click="generatePDF({label:'Espèce',code:'esp'})" > ESPECE </button>
                        <button class="bt-p-s" @click="generatePDF({label:'Chèque',code:'chq'})" > CHEQUE </button>
                    </div>
                </div>
                <div class="flex justify-end" v-if="on_chq">
                    <custom-input @keypress.enter="generatePDF({label:'Chèque',code:'chq'})" v-model="num_banque" ex="" label="Numéro banque" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            m_date:'',
            fact_index:-1,
            facts:[],
            total_montant:0,
            num_banque:'',
            on_chq:false
        }
    },
    methods:{
        init(){
            this.m_date = this.dateToInput(new Date())
        },

        reinit(){
            this.total_montant = 0
            this.num_banque = ''
            this.on_chq = false
            this.fact_index = -1
        },

        //Récupération des factures pas encore validée pour le paiement
        async recupFact(){
            try {
                const r = await this.$http.get('api/encaissement/fact/unvalidate')
                let d = r.data

                if(d.status){
                    this.facts = d.facts
                }else{
                    this.showNotif(d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        clickFact(i){
            this.fact_index = i
            let f = this.facts[i]
            this.total_montant = (f.enc_is_hosp)?(parseInt(f.enc_montant) - parseInt(f.enc_total_avance)).toLocaleString('fr-CA'):f.enc_montant.toLocaleString('fr-CA')
            this.on_chq = false
        },
        async generatePDF(mode){
            if(mode.code == 'chq'){
                if(!this.num_banque){
                    this.on_chq = true
                    return
                }else{
                    mode.num_banque = this.num_banque
                }
            }

            
            let f = this.facts[this.fact_index]
            try {
                const r = await this.$http.get('api/encaissement/set-pdf/'+f.enc_id,{params:{mode,util_id:this.$store.state.user.util_id}})
                let d = r.data

                if(d.status){
                    window.electronAPI.downFact(this.$http.defaults.baseURL+'/api/encaissement/download')
                    this.reinit()
                    this.$emit('validate')
                    this.recupFact()
                    this.showNotif(d.message)
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
        this.recupFact()
    }
}
</script> 