<template>
    <!-- <div class="bg-dialog-box">
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> {{ (modif)?'Modification Service':'Ajout de Service'  }} </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons">clear</span> </button>
            </div>

            <div class="p-2">
                <div class="flex mb-2">
                    <custom-input class="mr-2 w-72" v-model="srv.service_label" label="Libellé Service" />
                    <c-select v-model="srv.service_parent_id" :datas="srv_parent" placeholder="Service parent" label="service_label" code="service_id" />
                </div>
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click=" (modif)?upService():postService() "> {{ (modif)?'Modifier':'Ajouter' }} </button>
                </div>
            </div>
        </div>
    </div> -->
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">AJOUT D'UN SERVICE</span>
        </template>
        <div class="flex">
            <div class="mr-2">
                <span class="text-xs font-bold"> Libellé Service </span>
                <InputText class="p-inputtext-sm " autofocus v-model="srv.service_label"  :class="{'p-invalid':submitted && !srv.service_label}" />
            </div>

            <div class="mr-2 flex-grow-1" v-if="!modif" >
                <span class="text-xs font-bold"> Service parent </span>
                <Dropdown v-model="srv.service_parent_id" :options="srv_parent" optionLabel="service_label" optionValue="service_id" class="p-inputtext-sm" />
            </div>
        </div>
        <template #footer>
            <Button :label="(modif)?'Modifier':'Ajouter'" class="p-button-sm" icon="pi pi-check" @click=" (modif)?upService():postService() " :loading="isLoading" />
        </template>
    </Dialog>
</template>
<script>
export default {
    props:['modif','s','visible'],
    watch:{
        visible(a){
            if(a){
                this.srv = {
                    service_parent_id:-1,
                }
                this.recupDataUtils()
                this.submitted = false

                this.init()
                
            }
        }
    },
    data(){
        return{
            srv:{
                service_parent_id:-1,
            },
            srv_parent:[],
            isLoading:false,
            submitted:false
        }
    },
    methods:{
        async recupDataUtils(){
            try {
                const _r = await this.$http.get('api/service/add-utils')
                let _d = _r.data

                if(_d.status){
                    this.srv_parent = _d.srv_parent
                    this.srv_parent.unshift({service_id:-1,service_label:'Aucune'})
                }else{
                    this.showNotif('error','Ajout d\'un service',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        async postService(){
            this.isLoading = true
            this.submitted = true


            try {
                const _r = await this.$http.post('api/service',this.srv)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                    this.showNotif('success','Ajout d\'un service','Service bien ajouté')
                }else{
                    this.showNotif('error','Ajout d\'un service',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.isLoading = false
        },
        async upService(){
            let upService = {
                service_id:this.srv.service_id,
                service_label:this.srv.service_label,
                service_parent_id:this.srv.service_parent_id
            }
            try {
                const _r = await this.$http.put('api/service',upService)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                    this.showNotif('success','Ajout d\'un service',`Service bien modifié`)
                }else{
                    this.showNotif('error','Ajout d\'un service',_d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        },
        init(){
            if(this.modif){
                this.srv = JSON.parse(JSON.stringify(this.s))
            }
            this.srv.service_util_id = this.$store.state.user.util_id
        }
    },
    mounted(){
        this.init()
        this.recupDataUtils()
    }
}
</script> 