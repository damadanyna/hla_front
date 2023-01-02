<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-end">
                <!-- <span class="text-sm"> Selectioner un produit </span> -->
                <div class="flex-grow flex ">
                    <custom-input v-model="filters.search" class="w-56" label="Rechercher un produit" />
                </div>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons"> clear </span> </button>
            </div>

            <div class="h-96 overflow-auto">

                <div class="p-2 text-sm">
                    <table class="w-full">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in list_label" class="p-2 border text-xs  text-left" :key="l.key">
                                    <div class="flex items-center" v-if=" l.key.split(':')[1] == 'tarif' "> 
                                        <span class="">{{ l.label }}</span>
                                        <span class="flex-grow"></span>
                                    </div>
                                    <span class="" v-else> {{ l.label }} </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr @dblclick=" ()=>{
                                $emit('validate',p)
                            } " @click=" ()=>{
                                    list_selected = p
                                } " class="cursor-pointer relative" v-for="p in srvs" :key="p.art_id">
                                <td
                                
                                :class="{'bg-indigo-600 bg-opacity-10':list_selected.art_id == p.art_id}" 
                                class="p-2 border text-xs relative items-center" v-for="l in list_label" :key="l.key">

                                    <div v-if="l.key.split(':')[1] == 'tarif'" class="flex items-center">
                                        <span   class=""> {{ showTarif(p,l.key) }} </span>
                                    </div>
                                    <span class="" v-else> {{ p[l.key] }} </span>
                                    
                                </td>
                                
                                <!-- <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.service_id == p.service_id"> 
                                    <button @click=" on_view_dep = true " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <span class="material-icons text-sm"> add </span> </button> </td> -->
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="p-2 flex justify-end">
                <span class="flex-grow"></span>  
                <div class="">
                    <button class="bt-p-s" @click=" ()=>{
                        $emit('validate',list_selected)
                    } "> Selectionner </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch:{
        'filters.search'(a){
            this.getList()
        }
    },
    data(){
        return{
            srvs:[],
            list_tarif:[],
            list_label:[
                {label:"Code",key:'art_code'},
                {label:"Désignation",key:'art_label'}
            ],
            list_selected:{},
            cell:{
                edit:false,
                content:''
            },
            tserv:{},
            filters:{
                search:''
            }

        }
    },
    methods:{
        async getList(){

            //Averina affecter-na ny list_lable fa raha tsy izay misy redondance
            // this.list_label = [
            //     {label:"Code",key:'service_code'},
            //     {label:"Désignation",key:'service_label'}
            // ]

            try {
                const _r = await this.$http.get('api/products/tarifs',{params:this.filters})
                let _d = _r.data

                if(_d.status){
                    this.srvs = _d.srvs
                    this.list_tarif = _d.list_tarif

                    if(this.list_label.length  == 2){
                        for (let i = 0; i < this.list_tarif.length; i++) {
                            this.list_label.push({label:this.list_tarif[i].tarif_label,key:`${i}:tarif`})
                        }
                    }
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        
        showTarif(p,k){
            let _id = parseInt(k.split((':'))[0])
            return `${p.tarifs[_id].tserv_prix}`
        }
    },

    mounted(){
        this.getList()
    }
} 
</script>

<style>

</style>