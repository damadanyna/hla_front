<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold"> {{ `recapitulatif facture pour : ${st.pat_nom_et_prenom}`.toUpperCase() }} </span>
        </template>
        <div class="flex" style="width:700px">

            <div class="p-2">
                <table class="w-full text-xs">
                    <thead>
                        <tr>
                            <th class="sticky top-0" v-for="l in label_list" :key="l.key">
                                {{ l.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-for="p in pserv_list" :key="p.service_id">
                            <td :class="{'text-right': ['montant','montant_pat','montant_soc'].indexOf(l.key) != -1}" class="text-xs" v-for="l in label_list" :key="l.key">
                                <span class="" v-if="['montant','montant_pat','montant_soc'].indexOf(l.key) != -1"> {{ (p[l.key])?p[l.key].toLocaleString('fr-CA'):'' }} </span>
                                <span class="" v-else> {{ p[l.key] }} </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
        <template #footer>
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['st','visible'],
    watch:{
        visible(a){
            if(a){
                this.getDetails()
            }
        }
    },
    data(){
        return{
            pserv_list:[],
            label_list:[
                {label:'CODE',key:'service_code'},
                {label:'désignation'.toUpperCase(),key:'service_label'},
                {label:'MONTANT Patient',key:'montant_pat'},
                {label:'MONTANT Société',key:'montant_soc'},
                {label:'MONTANT',key:'montant'},
            ],
        }
    },
    methods:{
        async getDetails(){
            try {
                const r = await this.$http.get('api/encharge/etats-mensuel/detail',{params:{
                    st:this.st
                }})
                let d = r.data
                if(d.status){
                    this.pserv_list = d.pserv
                }else{
                    this.showNotif('error',`Récupération des données`,d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        }
    },
    mounted(){
        
    }
}
</script>

<style>

</style>