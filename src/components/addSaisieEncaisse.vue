<template>
    <Dialog :maximizable="true" maximized :visible="visible" @update:visible=" ()=>{
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
                <div class="flex flex-column " style="max-width: 800px;">

                    <div class="mt-2 w-full border-1 border-200 p-2 text-md flex sticky top-0 bg-white mb-2" style="z-index:105">
                        <div class="mr-2 cursor-pointer" @click="changeOnglet(l)" :class="{'border-bottom-2 font-bold border-blue-500':cur_view == l.code}" v-for="l in list_view" :key="l.code">
                            <span class=""> {{ l.label }} </span>
                        </div>
                    </div>


                    <div class="flex flex-wrap" v-if="cur_view == 'fact'">

                        <div class="m-2 cursor-pointer border-round border-blue-400" :class="{'bg-blue-50 shadow-6':fact_index == i}" @click="clickFact(i)" 
                     
                            v-for="p,i in facts" :key="p.enc_id" :style="{width:'250px'}">
                            <div style="height:50px"  class="p-2 border-1 border-round-top border-gray-500 text-center text-sm">
                                <span class=""> N° Mvmt: {{ p.enc_num_mvmt.toString().padStart(5,0) }} </span> -- <span class="">Patient: {{ (p.enc_is_externe)?' EXT ':p.pat_numero }} </span>
                            </div>
                            <div style="height:100px"  class="border-1 flex flex-column border-gray-500 p-2 text-center pb-5 font-bold">
                                <span class=""> {{ (p.enc_is_externe)?p.enc_pat_externe:p.pat_nom_et_prenom }} </span>
                                <span class="" v-if="p.enc_is_hosp"> ( HOSP ) </span>
                                <!-- <span class="ml-2" v-if="p.enc_is_externe"> ( EXT ) </span> -->
                            </div>

                            <div  class="border-1 flex justify-content-center border-gray-500 p-2 text-center font-bold text-red-600 border-round-bottom">
                                <span class=""> Ar  {{ (p.enc_montant - ((p.enc_total_avance)?p.enc_total_avance:0)).toLocaleString('fr-CA') }} </span>
                            </div>
                        </div>

                    </div>

                    <div class="flex flex-wrap" v-if="cur_view == 'avance'">
                        
                        <div class="m-2 cursor-pointer border-round border-blue-400" :class="{'bg-blue-50 shadow-6':avance_index == i}" @click="clickAvance(i)" 
                     
                            v-for="p,i in avance" :key="p.enc_id" :style="{width:'250px'}">
                            <div style="height:50px"  class="p-2 border-1 border-round-top border-gray-500 text-center text-sm">
                                <span class="">Patient: {{ p.pat_numero }} </span>
                            </div>
                            <div style="height:100px"  class="border-1 flex flex-column border-gray-500 p-2 text-center pb-5 font-bold">
                                <span class=""> {{ (p.enc_is_externe)?p.enc_pat_externe:p.pat_nom_et_prenom }} </span>
                                <span class="" v-if="p.enc_is_hosp"> ( HOSP ) </span>
                            </div>

                            <div  class="border-1 flex justify-content-center border-gray-500 p-2 text-center font-bold text-red-600 border-round-bottom">
                                <span class=""> Ar  {{ p.encav_montant.toLocaleString('fr-CA') }} </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex flex-column text-left">
                <div class="p-1 flex justify-content-end align-items-end sticky bottom-0 bg-white border-round-top mb-1">
                    <!-- <custom-input v-model="total_montant" class="font-bold" :disable="true" label="Montant" /> -->
                    <div class="flex flex-column border-1 border-gray-200 border-round">
                        <span class="text-xs font-bold p-1"> Montant </span>
                        <span class="font-bold text-xl bg-blue-50 p-2 border-round-b text-right" style="width:200px"> {{ total_montant.toLocaleString('fr-CA') }} </span>
                    </div>
                    <span class="flex-grow-1"></span>  
                    <div v-if="cur_view == 'fact' && fact_index != -1" class="flex">
                        <!-- <button class="bt-p-s mr-2" @click="generatePDF({label:'Espèce',code:'esp'})" > ESPECE </button> -->
                        <!-- <button class="bt-p-s" @click="generatePDF({label:'Chèque',code:'chq'})" > CHEQUE </button> -->
                        <Button class="mr-2" @click="generatePDF({label:'Espèce',code:'esp'})" label="ESPECE"/>
                        <Button @click="generatePDF({label:'Chèque',code:'chq'})" label="CHEQUE"/>
                    </div>

                    <div v-if="cur_view == 'avance' && avance_index != -1" class="flex">
                        <Button @click="validateAvance" :label=" 'reçu'.toUpperCase() "/>
                    </div>
                </div>
                <div class="flex justify-content-end" v-if="on_chq && cur_view == 'fact'">
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
        },
        cur_view(){
            this.reinit()
        }
    },
    data(){
        return{
            m_date:'',
            fact_index:-1,
            avance_index:-1,
            facts:[],
            total_montant:0,
            num_banque:'',
            on_chq:false,

            avance:[],

            list_view:[
                {label:'ENCAISSEMENT DISPENSAIRES',code:'fact'},
                {label:'AVANCES',code:'avance'},
            ],
            cur_view:'fact'
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
            this.avance_index = -1

            //if(this.facts.length <= 0) this.cur_view = 'avance'
        },

        //Récupération des factures pas encore validée pour le paiement
        async recupFact(){
            try {
                const r = await this.$http.get('api/encaissement/fact/unvalidate')
                let d = r.data

                if(d.status){
                    this.facts = d.facts
                    this.avance = d.avance

                    if(this.facts.length <= 0) this.cur_view = 'avance'
                    if(this.avance.length <= 0) this.cur_view = 'fact'
                }else{
                    this.showNotif('error','Encaissement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        changeOnglet(l){
            this.cur_view = l.code
            console.log(this.cur_view)
        },
        clickFact(i){
            this.fact_index = i
            let f = this.facts[i]
            this.total_montant = (f.enc_is_hosp)?(parseInt(f.enc_montant) - parseInt(f.enc_total_avance)).toLocaleString('fr-CA'):f.enc_montant.toLocaleString('fr-CA')
            this.on_chq = false
        },

        clickAvance(i){
            this.avance_index = i
            let a = this.avance[i]
            this.total_montant = a.encav_montant
        },
        async validateAvance(){

            let av = this.avance[this.avance_index]
            try{
                const r = await this.$http.get('api/encaissement/set-pdf/'+av.enc_id,{params:{
                    util_id:this.getUserId(),
                    encav_id:av.encav_id
                }})
                let d = r.data
                if(d.status){
                    window.electronAPI.downFact(this.$http.defaults.baseURL+'/api/encaissement/download')
                    this.recupFact()

                    this.reinit()
                    this.$emit('validate')
                    this.showNotif('success','Encaissement Avance','Avance bien encaissée')
                }else{
                    this.showNotif('error','Encaissement avance',d.message)
                }
            }catch(e){
                this.showNotifServerError()
            }
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
                const r = await this.$http.get('api/encaissement/set-pdf/'+f.enc_id,{params:{mode,util_id:this.getUserId()}})
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