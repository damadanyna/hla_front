<template>
    <div class="bg-dialog-box">

        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" :style="{width:'500px'}" >
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Détails facture </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons text-sm"> clear </span> </button>
            </div>

            <div class="">
                <table class="w-full">
                    <thead class="rounded-t sticky top-28 z-20" >
                        <tr class="bg-gray-50 text-gray-700 text-sm text-left">
                            <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                                {{ l.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in list_serv" class="cursor-pointer"  :key="p.encserv_id">
                            <td   class="p-2 border text-xs" 
                            v-for="l in list_label" :key="l.key">

                                <div class="w-full flex justify-end" v-if="['encserv_montant'].indexOf(l.key) != -1">
                                    <span class=""> {{  p[l.key].toLocaleString('fr-CA') }} </span>
                                </div>
                                <span class="" v-else > {{ (p[l.key])?p[l.key]:'-' }} </span>
                            </td>
                        </tr>
                        <tr class="font-bold">
                            <td class=" p-2 border text-xs " colspan="2">
                                Total
                            </td>
                            <td class="p-2 border text-xs"> 
                                <div class="w-full flex justify-end" >
                                    <span class=""> {{  enc.enc_montant.toLocaleString('fr-CA') }} </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props:['enc'],
    data(){
        return{
            list_label:[
                {label:'Code',key:'service_code'},
                {label:'Désignation des actes',key:'service_label'},
                {label:'Montant',key:'encserv_montant'},
            ],
            list_serv:[]
        }
    },
    methods:{
        async getListEncserv(){
            try {
                const r = await this.$http.get('api/encaissement/det/'+this.enc.enc_id)
                let d = r.data
                if(d.status){
                    this.list_serv = d.list_serv
                } else{
                    this.showNotif(d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },
    mounted(){
        this.getListEncserv()
    }
}
</script> 