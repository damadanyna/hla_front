<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">OBSERVATION POUR LA SUPPRESISON</span>
        </template>
        <div class="flex" style="width: 500px;">
            <div class="flex flex-column w-full">
                <span class="font-bold"> Observation sur la suppression : </span>
                <Textarea v-model="uh_obs" rows="5" class="w-full" placeholder="L'observation ..." />
            </div>
        </div>
        <template #footer>
            <Button label="Supprimer" class="p-button-sm" icon="pi pi-check" @click="delEnc" :loading="isLoading" />
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['e','visible'],
    watch:{
        visible(a){
            if(a){
                this.enc  = JSON.parse(JSON.stringify(this.e))
            }
        }
    },
    data(){
        return{
            enc:{},
            isLoading:false,
            submitted:false,
            uh_obs:''
        }
    },
    methods:{
        async delEnc(){

            if(!this.uh_obs){
                this.showNotif('error','Suppression encaissement',`L'OBSERVATION est OBLIGATOIRE pour pouvoir supprimer un encaissement`)
                return
            }
            this.isLoading = true


            try {
                let f = this.enc
                const r = await this.$http.delete('api/encaissement/'+f.enc_id,{params:{util_id:this.getUserId(),uh_obs:this.uh_obs}})
                let d = r.data

                if(d.status){
                    //Encaissememt bien supprimer
                    this.showNotif('success',`Suppression d'encaissement`,'Ligne encaissement bien supprimer')
                    this.$emit('validate')
                }else{
                    this.showNotif('error',`Suppression d'encaissement`,d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.isLoading = false
        }
    },
    mounted(){
        
    }
}
</script>

<style>

</style>