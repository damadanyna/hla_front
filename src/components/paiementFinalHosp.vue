<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" :style="{width:`600px`}">
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Saisie encaissement facture </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="text-xs material-icons"> clear </span> </button>
            </div>

            <div class="p-2">
                <div class="flex flex-col p-5 border rounded mb-2">
                    <div class="flex mb-2">
                        <custom-input :disable="true" class="" v-model="enc.enc_num_mvmt" label="N° Mouvement" />
                        <custom-input :disable="true" class="ml-2" v-model="enc.enc_date" label="Date" type="date" />
                        <custom-input :disable="true" class="ml-2" v-model="(enc.enc_num_hosp)" label="Référence Hospitalisation" />
                    </div>

                    <div class="flex">
                        <custom-input :disable="true" class="" v-model="op" label="Opérateur" />
                        <custom-input :disable="true" class="ml-2 flex-grow" v-model="pat.pat_nom_et_prenom" label="Patient" />
                    </div>

                </div>
                <div class="flex justify-center items-center p-5 border rounded">
                    <custom-input :disable="true" class="" v-model="reste_paie" label="Reste à payer" />

                    <custom-input :disable="true" class="ml-2 " v-model="enc.enc_total_avance" label="Montant payé (avance)" />
                </div>
            </div>

            <div class="flex justify-center items-center p-5">
                <button class="bt-p-s" @click="setToCaisse">Passer à la caisse</button>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props:['en','pat'],
    data(){
        return{
            enc:{},
            op:'',
            reste_paie:0
        }
    },
    methods:{
        async recupAddUtils(){
            try {
                const r = await this.$http.get('api/encaissement/add-utils')
                let d = r.data
                this.enc.enc_num_mvmt = (!this.enc.enc_num_mvmt)?d.last_mvmt + 1:this.enc.enc_num_mvmt
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        init(){
            this.enc = JSON.parse(JSON.stringify(this.en))
            this.enc.enc_date = this.dateToInput(new Date())
            this.op = this.$store.state.user.util_label

            this.enc.enc_total_avance = (!this.enc.enc_total_avance)?0:this.enc.enc_total_avance

            this.reste_paie = parseInt(this.enc.enc_montant) - parseInt((this.enc.enc_total_avance)?this.enc.enc_total_avance:0)

        },
        async setToCaisse(){
            try {
                const r = await this.$http.put('api/encaissement/hosp/to-caisse',{enc_id:this.enc.enc_id,enc_num_mvmt:this.enc.enc_num_mvmt})
                let d = r.data
                if(d.status){
                    this.$emit('close')
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
        this.recupAddUtils()
    }
}
</script> 