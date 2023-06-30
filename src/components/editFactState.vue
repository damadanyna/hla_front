<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold"> {{ 'édition facture - état mensuel'.toUpperCase() }} </span>
        </template>
        <div class="flex flex-column" style="min-width: 900px;">
            <!-- Ici les onglets -->
            <div class="flex">
                <span   v-for="o in onglet" :key="o.value" :class="{'border-bottom-2 border-blue-500 font-bold':o.value == cur_onglet}" 
                class="ml-2 cursor-pointer" @click="cur_onglet = o.value"> 
                    {{ o.label }}
                </span>
            </div>

            <!-- Les contenus -->

            <!-- Pour la récapitulation -->
            <div class="flex" v-if="cur_onglet == 'recap'">
                <div class="p-2 flex flex-column text-sm">
                    <!-- Période date facture ... -->
                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Période de  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ `${list_mois[filters.month - 1]} ${filters.year}` }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> N° Facture  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ `-` }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Date Facture  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ `-` }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Société Payeur  </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 60px;"> {{ st.sp_code }} </span>
                        <span class="font-bold ml-3 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ st.sp_label }} </span>
                    </div>

                    <div class="flex mb-2 align-items-center">
                        <span class="" style="width: 110px;"> Société </span>
                        <span class="font-bold ml-5 p-1 border-1 border-gray-400" style="min-width: 60px;"> {{ st.se_code }} </span>
                        <span class="font-bold ml-3 p-1 border-1 border-gray-400" style="min-width: 150px;"> {{ st.se_label }} </span>
                    </div>

                    <!-- Eto mbola misy an'ilay tableau de patient iny -->
                    <div class="flex flex-column mt-5">
                        <span class="font-bold mb-2"> Liste des patients </span>
                        <div class="border-1 flex flex-column border-gray-400" style="width:400px;height: 300px;overflow: auto;">
                            <span class="p-2" v-for="i in 20" :key="i"> - ({{ i }}) RALAIVELO Angelo</span>
                        </div>
                    </div>

                </div>

                <!-- Tableau des infos -->
                <div class="">
                    <span class=""> ici tableau des infos </span>
                </div>
            </div>


            <!-- Pour le tableau détaillé -->
            <div class="flex justify-content-center align-items-center p-5" v-if="cur_onglet == 'tab-detail'">

                <span class=""> Ici tableau détaillé (en cours ...)  </span>

            </div>

        </div>
        <template #footer>
            
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['visible','st','filters'],
    watch:{
        visible(a){
            if(a){
                console.log(this.st)
                this.st_cur = JSON.parse(JSON.stringify(this.st))
            }
        }
    },
    data(){
        return{
            st_cur:{},
            onglet:[
                {label:'RECAPITULATION',value:'recap'},
                {label:'tableau dtaillé'.toUpperCase(),value:'tab-detail'},
            ],

            cur_onglet:'recap',
            list_patient:[],
            pserv_list:[],
            fact:{}
        }
    },
    methods:{
        //Ato tsy maintsy misy fonction manao récupération ny liste anle izy rehetra izy même société payeur sy société employeur 
        //an'ilay sélection

        //en gros ici, on va récupérer tous les encharges de sp_id et de se_id
        //avec date et mois

        async getDatas(){
            try {
                const r = await this.$http.get('api/encharge/etats-mensuel/editFacture/datas',{params:{
                    filters:this.filters,
                    st:this.st
                }})


            } catch (e) {
                this.showNotifServerError()
            }
        }


    }
}
</script>