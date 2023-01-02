<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
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
                <!-- <div class="">
                    <span class=""> Gestion de tarif </span>
                </div> -->
                <div class="p-2 flex justify-end">
                    <button class="bt-p-s" @click=" (modif)?upService():postService() "> {{ (modif)?'Modifier':'Ajouter' }} </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['modif','s'],
    data(){
        return{
            srv:{
                service_parent_id:null,
            },
            srv_parent:[],
        }
    },
    methods:{
        async recupDataUtils(){
            try {
                const _r = await this.$http.get('api/service/add-utils')
                let _d = _r.data

                if(_d.status){
                    this.srv_parent = _d.srv_parent
                    this.srv_parent.unshift({service_id:null,service_label:'Aucune'})
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de Connexion')
            }
        },
        async postService(){
            try {
                const _r = await this.$http.post('api/service',this.srv)
                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de Connexion')
            }
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
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de Connexion')
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