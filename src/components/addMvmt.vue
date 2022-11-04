 <template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" style="width:600px" >
            <div class="p-2 flex items-center">
                <span class="text-sm"> Saisir une {{ (action == 'entre')?'Entrée':'Sortie' }} </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="material-icons text-xs">clear</span> </button>
            </div>

            <div class="p-2 overflow-auto">
                <div class="border-b py-2 flex flex-col">
                    <div class="flex mb-2 ">
                        <c-select v-model="mvmt.mvmt_type" class="mr-5" :datas="(action == 'entre')?stock.mvmt_type_entre:stock.mvmt_type_sortie" label="l" code="k" placeholder="Type de mouvement" />
                        <custom-input v-model="mvmt.mvmt_num" class="mr-5" label="N° pièce" />
                        <span class="flex-grow"></span>
                        <custom-input type="date" class="mr-5" v-model="mvmt.mvmt_date" label="Date" />
                    </div>
                    <div class="flex mb-2">
                        <c-select v-if="action == 'sortie'" class="mr-5" :datas="list_depot" v-model="mvmt.mvmt_depot_exp" label="depot_label" code="depot_id" placeholder="Depôt de sortie" />
                        <c-select v-if="action == 'entre' || (mvmt.mvmt_type == 'transfert')" :datas="list_depot" v-model="mvmt.mvmt_depot_dest" label="depot_label" code="depot_id" 
                        :placeholder="(mvmt.mvmt_type=='transfert')?'Dépôt de destination':`Dépôt d'entrée`" />
                    </div>
                    <div class="flex">
                        <c-select v-model="mvmt.mvmt_tiers" v-if="action == 'entre'" :datas="list_fourn" label="fourn_label" code="fourn_id" placeholder="Fournisseur" />
                        <c-select  v-else-if="action == 'sortie' && mvmt.mvmt_type != 'transfert'" v-model="mvmt.mvmt_tiers" :datas="list_dep" label="dep_label" code="dep_id" placeholder="Département" />
                    </div>
                </div>
                

                <!-- Liste des articles concernés par le mouvement -->
                <div class="overflow-auto" style="max-height:300px">
                    <table class="w-full">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr  @click=" art_selected = p " :class="{'bg-gray-50':art_selected.mart_art_id == p.mart_art_id}"  class="cursor-pointer relative" v-for="p in mart_list" :key="p.mart_art_id">
                                <td class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                    <span> {{ p[l.key] }} </span>
                                </td>

                                <!-- <td class="px-2 text-xs flex justify-center items-center" v-if="list_selected.dep_id == p.dep_id"> 
                                    <button @click=" on_view_dep = true " class="bt-icon z-50 bg-white border shadow-lg absolute -top-2 -right-2"> <svg viewBox="0 0 24 24" class=" w-5"><path class=" fill-current text-gray-500" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                        <span > add </span>   </button> </td> -->
                            </tr>
                            <tr class="">
                                <td class="p-2 border text-xs" colspan="4"> Total </td>
                                <td class="p-2 border text-xs">  {{ this.mvmt.mvmt_montant }} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-2 flex border-t mt-2">
                    <button class="bt-p-s" @click="on_add_article = true"> Ajouter un article </button>
                    <button v-if="art_selected.mart_art_id" class="bt-red-s ml-2" @click="delArtMart">Suppimer</button>
                    <span class="flex-grow"></span>
                    <button class="bt-p-s" @click="postMvmt" > Ajouter </button>
                </div>
            </div>
        </div>

        <!-- Formulaire d'ajout d'un article dans le mouvement -->
        <add-article-mvmt @validate="onValidateAddArt" :mart_list="mart_list" @close="on_add_article = false" v-if="on_add_article" />
    </div>
</template>

<script>
export default {
    props:['action'],
    watch:{
        'mvmt.mvmt_depot_dest'(a,old){
            if(this.mvmt.mvmt_type == 'transfert'){
                if(a == this.mvmt.mvmt_depot_exp){
                    this.mvmt.mvmt_depot_exp = old
                }
            }
        },
        'mvmt.mvmt_depot_exp'(a,old){
            if(this.mvmt.mvmt_type == 'transfert'){
                if(a == this.mvmt.mvmt_depot_dest){
                    this.mvmt.mvmt_depot_dest = old
                }
            }
        },
        'mvmt.mvmt_type'(a){
            if(a == 'transfert'){
                this.mvmt.mvmt_depot_exp = this.list_depot[0].depot_id
                 this.mvmt.mvmt_depot_dest = this.list_depot[1].depot_id
            }

            this.getUtilsAdd()
        }


    },
    data(){
        return{
            on_add_article:false,
            mvmt:{
                mvmt_date:(new Date()).toLocaleString('en-CA').split(',')[0]
            },
            mart_list:[],
            list_depot:[],
            list_fourn:[],
            list_dep:[],
            

            list_label:[
                {label:"Désignation",'key':'mart_art_label'},
                {label:"Qté",key:'mart_qt'},
                {label:"Unité",key:'mart_art_unit'},
                {label:"P-U (Ar)",key:'mart_prix_unit'},
                {label:"Montant (Ar)",key:'mart_montant'}
            ],
            art_selected:{}
        }
    },
    methods:{
        init(){
            this.mvmt.mvmt_action = this.action
            this.mvmt.mvmt_util_id = this.$store.state.user.util_id

            // alert(this.$store.state.user.util_id)

            if(this.action == 'entre'){
                this.mvmt.mvmt_type = this.stock.mvmt_type_entre[0].k //achat
            }else if(this.action == 'sortie'){
                this.mvmt.mvmt_type = this.stock.mvmt_type_sortie[0].k
            }
        },
        async getUtilsAdd(){
            try {
                const _r = await this.$http.get('api/mvmt/utils-add',{params:{action:this.action,type:this.mvmt.mvmt_type}})
                let _d = _r.data

                if(_d.status){

                    if(this.action == 'entre'){
                        _d.list_depot.splice(0,1)
                    }

                    this.list_depot = _d.list_depot
                    this.list_fourn = _d.list_fourn
                    this.list_dep = _d.list_dep

                    let last_mvmt = _d.mvmt_last

                    if(last_mvmt.length <= 0){
                        this.mvmt.mvmt_num = `${this.stock.prefix_num[this.mvmt.mvmt_type]}-1`
                    }else{
                        last_mvmt = last_mvmt[0]
                        let _num = parseInt(last_mvmt.mvmt_num.split('-')[1])
                        this.mvmt.mvmt_num = `${this.stock.prefix_num[this.mvmt.mvmt_type]}-${_num+1}`
                    }


                    //Initialisation des données
                    if(this.action == 'entre'){
                        this.mvmt.mvmt_tiers = this.list_fourn[0].fourn_id

                        //depot
                        this.mvmt.mvmt_depot_dest = this.list_depot[0].depot_id
                        this.mvmt.mvmt_depot_exp = this.list_depot[0].depot_id
                    }else{
                        this.mvmt.mvmt_tiers = this.list_dep[0].dep_id
                        //depot
                        this.mvmt.mvmt_depot_dest = this.list_depot[0].depot_id
                        this.mvmt.mvmt_depot_exp = this.list_depot[0].depot_id
                    }


                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                console.log(e);
                this.showNotif('Erreur de connexion')
            }
        },
        async postMvmt(){
            try {
                const _r = await this.$http.post('api/mvmt',{mvmt:this.mvmt,list_mart:this.mart_list})

                let _d = _r.data

                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },
        onValidateAddArt(a){
            this.mart_list.push(a)


            //Calcul du total montant
            this.mvmt.mvmt_montant = 0
            for (let i = 0; i < this.mart_list.length; i++) {
                const e = this.mart_list[i];
                this.mvmt.mvmt_montant += parseInt(e.mart_montant) || 0
            }
            this.on_add_article = false
        },
        delArtMart(){
            for(let i=0;i < this.mart_list.length;i++){
                if(this.mart_list[i].mart_art_id == this.art_selected.mart_art_id){
                    this.mart_list.splice(i,1)
                    break
                }
            }


            //Calcul du total montant
            this.mvmt.mvmt_montant = 0
            for (let i = 0; i < this.mart_list.length; i++) {
                const e = this.mart_list[i];
                this.mvmt.mvmt_montant += parseInt(e.mart_montant) || 0
            }


            this.art_selected = {}
        }
    },
    beforeMount(){
        this.init()
    },
    mounted(){
        this.getUtilsAdd()
    }
}
</script>

<style>

</style>