<template>
    <!-- <div class="bg-dialog-box">
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Gestion Tarif </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons"> clear </span> </button>
            </div>

            <div class="p-2">
                <div class="flex flex-col mb-2">
                    <div class="mb-2 flex">
                        <custom-input class="mr-2 w-56" v-model="tarif.tarif_label" label="Désignation"/>
                    </div>
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click="postTarif"> Ajouter </button>
                </div>
            </div>
        </div>
    </div> -->

    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">AJOUT D'UN TARIIF</span>
        </template>
        <div class="flex">
            <div class="mr-2">
                <span class="text-xs font-bold"> Libellé du Tarif </span>
                <InputText class="p-inputtext-sm " autofocus v-model="tarif.tarif_label"  :class="{'p-invalid':submitted && !tarif.tarif_label}" />
            </div>
        </div>
        <template #footer>
            <Button  label="Ajouter" class="p-button-sm" icon="pi pi-check" @click="postTarif" :loading="isLoading" />
        </template>
    </Dialog>
</template>
<script>
export default {
    props:['visible'],
    watch:{
        visible(a){
            if(a){
                this.submitted = false

                this.tarif = {}
            }
        }
    },
    data(){
        return{
            tarif:{},
            
            isLoading:false,
            submitted:false
        }
    },
    methods:{
        async postTarif(){
            this.isLoading = true
            this.submitted = true
            try {
                const _r = await this.$http.post('api/tarifs',this.tarif)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                    this.showNotif('success','Ajout d\'un Tarif','Tarif bien ajouté')
                }else{
                    this.showNotif('error','Ajout d\'un service',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.isLoading = false
        },
    },
    mounted(){
    }
}
</script> 