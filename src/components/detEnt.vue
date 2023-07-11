<template>

    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm" style="min-width:500px">
        <template #header>
            <span class="text-sm font-bold">Edition de société</span>
        </template>
        <div class="w-full">
            <div class="mb-2 flex ">
                <!-- <custom-input class="mr-2" v-model="ent.ent_code" label="Code"/> -->
                <div class="flex flex-column" style="width:30%">
                    <span class="text-xs font-bold"> Code </span>
                    <InputText class="p-inputtext-sm " autofocus v-model="ent.ent_code"  />
                </div>
                <!-- <custom-input class="mr-2 w-56" v-model="ent.ent_label" label="Nom"/> -->
                <div class="flex flex-column flex-grow-1 ml-2">
                    <span class="text-xs font-bold"> Nom </span>
                    <InputText class="p-inputtext-sm " v-model="ent.ent_label"  />
                </div>
            </div>
            <div class="mb-2 flex">
                <!-- <custom-input class="mr-2 " v-model="ent.ent_pat_percent" label="% Patient"/> -->
                <div class="flex flex-column">
                    <span class="text-xs font-bold"> % Patient </span>
                    <InputNumber class="p-inputtext-sm " v-model="ent.ent_pat_percent"  />
                </div>
                <!-- <custom-input class="mr-2" v-model="ent.ent_soc_percent" label="% Société"/> -->
                <div class="flex flex-column flex-grow-1 ml-2">
                    <span class="text-xs font-bold"> % Société </span>
                    <InputNumber class="p-inputtext-sm " v-model="ent.ent_soc_percent"  />
                </div>
            </div>

            <div class="mb-2">
                <!-- <custom-input class="mr-2 " v-model="ent.ent_pat_percent" label="% Patient"/> -->
                <div class="flex flex-column">
                    <span class="text-xs font-bold"> Adresse </span>
                    <InputText class="p-inputtext-sm " v-model="ent.ent_adresse"  />
                </div>
            </div>
            <div class="mb-2">
                <!-- <custom-input class="mr-2" v-model="ent.ent_soc_percent" label="% Société"/> -->
                <div class="flex flex-column flex-grow-1">
                    <span class="text-xs font-bold"> Numéro de compte </span>
                    <InputText class="p-inputtext-sm " v-model="ent.ent_num_compte"  />
                </div>
            </div>

            <div class="mb-2">
                <!-- <custom-input class="mr-2" v-model="ent.ent_soc_percent" label="% Société"/> -->
                <div class="flex flex-column flex-grow-1">
                    <span class="text-xs font-bold"> GROUPE </span>
                    <InputText class="p-inputtext-sm " v-model="ent.ent_group_label"  />
                </div>
            </div>
        </div>
        <template #footer>
            <!-- <button class="bt-red-s" @click="delEnt"> Supprimer </button> -->
            <Button class="p-button-sm p-button-text p-button-danger p-button-raised " @click="delEnt" label="Supprimer" icon="pi pi-times"/>
            <Button label="Enregistrer" icon="pi pi-check" class="p-button-sm" @click="upEnt" />
        </template>
    </Dialog>
</template>
<script>
export default {
    props:['e','visible'],
    watch:{
        visible(a){
            if(a){
                this.init()
                this.ent.ent_pat_percent = parseInt(this.ent.ent_pat_percent)
                this.ent.ent_soc_percent = parseInt(this.ent.ent_soc_percent)
            }
        },
        'ent.ent_pat_percent'(a){
            let tt = parseInt(a || 0)
            if(tt < 0) this.ent.ent_pat_percent = 0
            if(tt > 100 ) this.ent.ent_pat_percent = 100

            this.ent.ent_soc_percent = 100 - this.ent.ent_pat_percent
        },
        'ent.ent_soc_percent'(a){
            let tt = parseInt(a || 0)
            if(tt < 0) this.ent.ent_soc_percent = 0
            if(tt > 100 ) this.ent.ent_soc_percent = 100

            this.ent.ent_pat_percent = 100 - this.ent.ent_soc_percent
        },
    },
    data(){
        return{
            ent:{},
        }
    },
    methods:{
        async upEnt(){
            try {
                this.ent.user_id = this.getUserId()

                if(this.ent.ent_group_label) this.ent.ent_group_label = this.ent.ent_group_label.toUpperCase().trim() 
                const _r = await this.$http.put('api/entreprise',this.ent)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                    this.showNotif('success','Société',"Société bien modifié")
                }else{
                    this.showNotif('error','Société',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        async delEnt(){
            try {
                const _r = await this.$http.delete('api/entreprise/'+this.ent.ent_id,{params:{user_id:this.getUserId()}})
                let _d = _r.data

                if(_d.status){
                    this.$emit('deleted')
                    this.showNotif('success','Société',"Société bien Supprimé")
                }else{
                    this.showNotif('error','Société',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        init(){
            this.ent = JSON.parse(JSON.stringify(this.e))
            delete this.ent.ent_date_enreg
        }
    },
    mounted(){
        
    }
}
</script> 