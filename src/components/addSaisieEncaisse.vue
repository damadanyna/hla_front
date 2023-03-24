<template>
    <!-- <div class="bg-dialog-box">

        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Encaissement </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="text-md material-icons"> clear </span> </button>
            </div>

            <div class="p-2 text-xs">
                <div class="flex mb-2">

                    
                    <div class="  w-40 border-r pr-2" >
                        <custom-input v-model="m_date"  label="Journée du " :disable="true" type="date" />
                    </div>

                    
                    <div class="px-2 flex flex-wrap "  :style="{width:'550px'}">
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
    </div> -->

    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">ENCAISSEMENT</span>
        </template>
        <div class="flex flex-column">
            <div class="flex">
                <div class="flex flex-column">
                    <!-- <custom-input v-model="m_date"  label="Journée du " :disable="true" type="date" /> -->
                    <span class="text-sm font-bold"> Journée du </span>
                    <Calendar class="p-inputtext-sm" v-model="m_date" dateFormat="dd/mm/yy" />
                </div>
                <Divider layout="vertical" />
                <div class="flex flex-wrap ">
                    <div class="m-2 cursor-pointer border-round" @click="clickFact(i)" 
                     
                    v-for="p,i in facts" :key="p.enc_id" :style="{width:'250px'}">
                        <div :class="{'bg-red-200':fact_index == i} " class="p-2 border-1 border-round-top border-gray-500 text-center">
                            <span class=""> N° Mvmt: {{ p.enc_num_mvmt }} </span> -- <span class="">Patient: {{ p.pat_numero }} </span>
                        </div>
                        <div :class="{'bg-red-200':fact_index == i} " class="border-1 flex flex-col border-gray-500 p-2 text-center pb-5 font-bold">
                            <span class=""> {{ p.pat_nom_et_prenom }} </span>
                            <span class="" v-if="p.enc_is_hosp"> ( HOSP ) </span>
                        </div>

                        <div :class="{'bg-red-200':fact_index == i} " class="border-1 flex justify-content-center border-gray-500 p-2 text-center font-bold text-red-600 border-round-bottom">
                            <span class=""> Ar  {{ (p.enc_is_hosp)?(parseInt(p.enc_montant) - parseInt(p.enc_total_avance)).toLocaleString('fr-CA'):((p.enc_percent_tarif && p.enc_percent_tarif != 100)?(p.enc_montant * p.enc_percent_tarif / 100):p.enc_montant).toLocaleString('fr-CA') }} </span>
                            <span class="ml-2" v-if="p.enc_percent_tarif && p.enc_percent_tarif != 100">  ({{ p.enc_percent_tarif }} %)  </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex flex-column text-left">
                <div class="p-1 flex justify-content-end align-items-end sticky bottom-0 bg-white border-round-top mb-1">
                    <!-- <custom-input v-model="total_montant" class="font-bold" :disable="true" label="Montant" /> -->
                    <div class="flex flex-column">
                        <span class="text-sm font-bold"> Montant </span>
                        <InputText v-model="total_montant" disabled />
                    </div>
                    <span class="flex-grow-1"></span>  
                    <div class="flex" v-if="fact_index != -1">
                        <!-- <button class="bt-p-s mr-2" @click="generatePDF({label:'Espèce',code:'esp'})" > ESPECE </button> -->
                        <!-- <button class="bt-p-s" @click="generatePDF({label:'Chèque',code:'chq'})" > CHEQUE </button> -->
                        <Button class="mr-2" @click="generatePDF({label:'Espèce',code:'esp'})" label="ESPECE"/>
                        <Button @click="generatePDF({label:'Chèque',code:'chq'})" label="CHEQUE"/>
                    </div>
                </div>
                <div class="flex justify-content-end" v-if="on_chq">
                    <!-- <custom-input @keypress.enter="generatePDF({label:'Chèque',code:'chq'})" v-model="num_banque" ex="" label="Numéro banque" /> -->
                    <div class="flex flex-column">
                        <span class="text-sm font-bold"> Numéro banque </span>
                        <InputText  @keypress.enter="generatePDF({label:'Chèque',code:'chq'})" v-model="num_banque" />
                    </div>
                </div>
            </div>
        </template>
    </Dialog>
</template>
<script>
export default {
    props:['visible'],
    watch:{
        visible(a){
            if(a){
                this.init()
                this.reinit()

                this.recupFact()
            }
        }
    },
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
            this.m_date = new Date()
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
                    this.showNotif('error','Encaissement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
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
                    this.showNotif('success','Encaissement',d.message)


                    if(this.facts.length - 1 <= 0){
                        this.$emit('close')
                    }
                }else{
                    this.showNotif('error','Encaissement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        }
    },
    beforeMount(){
        this.init()
    },
    mounted(){  
        //this.recupFact()
    }
}
</script> 