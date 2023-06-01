<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">AJOUT D'UNE AVANCE</span>
        </template>
        <div class="flex">
            <!-- <custom-input type="date" v-model="encav.encav_date" label="Date" /> -->
            <div class="flex flex-column">
                <span class="text-xs font-bold"> Date </span>
                <Calendar dateFormat="dd/mm/yy" class="p-inputtext-sm" v-model="encav.encav_date" />
            </div>


            <!-- <custom-input v-model="caissier.util_label" :disable="true" class="ml-2" label="Caissier" /> -->
            <div class="flex flex-column ml-2">
                <span class="text-xs font-bold"> Caissier </span>
                <InputText class="p-inputtext-sm"  v-model="caissier.util_label" disabled />
            </div>


            <!-- <custom-input type="number" v-model="encav." class="ml-2" label="Montant" /> -->
            <div class="flex flex-column ml-2">
                <span class="text-xs font-bold"> Montant </span>
                <InputNumber class="p-inputtext-sm"  v-model="encav.encav_montant"  />
            </div>
        </div>
        <template #footer>
           <!-- <button class="bt-p-s" @click="setAvance"> Valider </button> -->
           <Button class="p-button-sm" @click="setAvance" label="Valider" :loading="loading" icon="pi pi-check" />
        </template>
    </Dialog>
</template>
<script>
export default {
    props:['visible','enc'],
    watch:{
        visible(a){
            this.encav = {
                encav_date:''
            }
            this.caissier = {}
            this.init()

            
        }
    },
    data(){
        return{
            encav:{
                encav_date:''
            },
            caissier:{},
            loading:false,
        }
    },
    methods:{
        init(){
            this.encav.encav_date = new Date()
            this.encav.encav_util_id = this.$store.state.user.util_id
            this.encav.util_label = this.$store.state.user.util_label
            this.caissier = this.$store.state.user

            this.loading = false

            console.log(this.enc)
        },
        async recupDataUtils(){

        },
        async setAvance(){
            let mn = parseInt(this.encav.encav_montant)
            if(mn.toString() == 'NaN' ||  mn <= 0){
                this.showNotif('error','Ajout Avance','Le montant doit être supérieur à zéro')
                return
            }

            this.loading= true

            try{
                //Appel d'insertion d'une avance
                const r = await this.$http.post('api/caisse/avance',{enc:this.enc,encav:this.encav,user_id:this.getUserId()})
                let d = r.data

                if(d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif('error','Avance',d.message)
                }
            }catch(e){
                this.showNotifServerError()
            }

            this.loading = false
        }
    },
    mounted(){
        // this.init()
    }
}
</script> 