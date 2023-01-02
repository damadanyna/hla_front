<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Ajout de produits | <span class="p-1 rounded bg-blue-600 text-white"> Tarif :  {{ pec.tarif_label }} </span></span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons"> clear </span> </button>
            </div>

            <div>

                <div class="p-2 text-sm">
                    <div class="mb-2 flex items-end">
                        <c-select v-model="cur_prod" :datas="list_choice" label="label" code="code" placeholder="Services / Produits" />
                    </div>
                    <div class="mb-2 flex items-end">
                        <!-- eto ny sélection ana service -->
                        <div v-if="cur_prod == 'serv'" class=" flex flex-col w-56">
                            <span class="text-xs font-bold"> Choix de services </span>
                            <span class="text-xs flex items-center justify-center border rounded p-2 cursor-pointer"
                             @click="on_select_service = true"> {{ (service_label)?service_label:'-' }} </span>
                        </div>
                        <div v-else-if="cur_prod == 'med'" class=" flex flex-col w-56">
                            <span class="text-xs font-bold"> Choix de médicaments </span>
                            <span class="text-xs flex items-center justify-center border rounded p-2 cursor-pointer"
                             @click="on_select_product = true"> {{ (art_label)?art_label:'-' }} </span>
                        </div>

                        <custom-input v-model="fs.fserv_qt" type="number" class="w-16 ml-2" label="Quantité" />
                        <custom-input v-model="fs.fserv_prix_unitaire" type="number" :disable="true" class="w-32 ml-2" label="Prix Unitaire" />
                        <custom-input disable="true" v-model="fs.fserv_montant" type="number" class="w-32 ml-2" label="Montant" />

                    </div>
                    <div class="mb-2 flex">
                        <custom-input disable="true" v-model="fs.fserv_prix_patient" type="number" class="w-32" :label="`${pec.ent_pat_percent}% patient`" />
                        <custom-input disable="true" v-model="fs.fserv_prix_societe" type="number" class="w-32 ml-2" :label="`${pec.ent_soc_percent}% Société`" />
                    </div>
                </div>

                <div class="p-2 flex justify-end">
                    <span class="flex-grow"></span>  
                    <div class="">
                        <button class="bt-p-s" @click=" addProduct " > Ajouter </button>
                    </div>
                </div>
            </div>
        </div>


    <!-- Selection de service -->
    <select-service @validate=" getService " v-if="on_select_service" @close="on_select_service = false" />
    <select-product @validate=" getProduct " v-if="on_select_product" @close="on_select_product = false"  />
    </div>
</template>

<script>
export default {
    props:['f','pec'],

    watch:{
        'fs.fserv_qt'(a){
            let e = parseInt(a) | 0
            this.fs.fserv_montant = (parseInt(this.fs.fserv_prix_unitaire) | 0 ) * e
        },
        'fs.fserv_prix_unitaire'(a){
            let e = parseInt(a) | 0
            this.fs.fserv_montant = (parseInt(this.fs.fserv_qt) | 0 ) * e
        },
        'fs.fserv_montant'(a){
            let e = parseInt(a) | 0
            this.fs.fserv_prix_patient = parseInt(this.pec.ent_pat_percent) * e / 100
            this.fs.fserv_prix_societe = parseInt(this.pec.ent_soc_percent) * e / 100
        },
        cur_prod(a){
            this.fs.fserv_is_product = (a == 'med')?1:0
        }

    },
    data(){
        return{
            on_select_service:false,
            on_select_product:false,
            fs:{
                fserv_qt:1,
                fserv_prix_unitaire:0,
                fserv_montant:0,
                fserv_is_product:0
            },
            service_label:'',
            art_label:'',

            cur_prod:'serv',

            list_choice:[
                {label:"Médicaments",code:"med"},
                {label:"Services",code:"serv"}
            ]
        }
    },
    methods:{
        getService(a){
            this.service_label = a.service_label
            this.fs.fserv_serv_id = a.service_id


            for (let i = 0; i < a.tarifs.length; i++) {
                const e = a.tarifs[i];
                if(this.pec.tarif_id == e.tarif_id){
                    this.fs.fserv_prix_unitaire = e.tserv_prix
                    break
                }
            }

            this.on_select_service = false
        },

        getProduct(a){
            this.art_label = a.art_label
            this.fs.fserv_serv_id = a.art_id


            for (let i = 0; i < a.tarifs.length; i++) {
                const e = a.tarifs[i];
                if(this.pec.tarif_id == e.tarif_id){
                    this.fs.fserv_prix_unitaire = e.tserv_prix
                    break
                }
            }

            this.on_select_product = false
        },
        async addProduct(){
            try {
                const _r = await this.$http.post('api/fact_service',this.fs)
                let _d = _r.data
                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        }
    },

    mounted(){
        // console.log(this.pec)

        this.fs.fserv_fact_id = this.f.fact_id
    }
} 
</script>

<style>

</style>