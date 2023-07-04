<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold"> Récapitulatif de facture </span>
        </template>
        <div class="flex">
            <table class="w-full">
                <thead class="rounded-t sticky top-28 z-20" >
                    <tr class="bg-gray-50 text-gray-700 text-sm text-left">
                        <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in list_serv" class="cursor-pointer"  :key="p.service_id">
                        <td   class="p-2 border text-xs" :class="{'text-right':['montant_pat','montant_soc'].indexOf(l.key) != -1}"
                        v-for="l in list_label" :key="l.key">
                            <span class="" v-if="['montant_pat','montant_soc'].indexOf(l.key) != -1"> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                            <span class="" v-else > {{ (p[l.key])?p[l.key]:'-' }} </span>
                        </td>
                    </tr>
                    <tr class="font-bold">
                        <td class=" p-2 border text-xs ">
                            Total
                        </td>
                        <td class="p-2 border text-xs font-bold text-right"> 
                            {{  montant_total_pat.toLocaleString('fr-CA') }}
                        </td>
                        <td class="p-2 border text-xs font-bold text-right"> 
                            {{  montant_total_soc.toLocaleString('fr-CA') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <template #footer>
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['pec','visible'],
    watch:{
        visible(a){
            if(a){
                this.recupRecapFactPec()
            }
        }
    },
    data(){
        return{
            list_serv:[],
            montant_total_pat:0,
            montant_total_soc:0,
            list_label:[
                {label:"Désignation des actes",key:"service_label"},
                {label:"Montant Patient",key:"montant_pat"},
                {label:"Montant Société",key:"montant_soc"},

            ]
        }
    },
    methods:{
        async recupRecapFactPec(){
            try {
                const r = await this.$http.get('api/encharge/recap-fact/'+this.pec.encharge_id)
                let d = r.data
                if(d.status){
                    this.list_serv = d.list_serv
                    this.montant_total_pat = d.montant_total_pat
                    this.montant_total_soc = d.montant_total_soc
                }else{  
                    this.showNotif(d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
    },

    mounted(){
        
    }
} 
</script>

<style>

</style>