export default {
    data(){
        return {
            list_jour:['Dimanche','Lundi','Mardi','Mecredi','Jeudi','Vendredi','Samedi'],
            list_mois:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],

            type_user:[
                {label:"Admin",code:"a"},
                {label:"Personnel",code:"p"},
            ],
            stock:{
                mvmt_action:[
                    {l:'Entrée',k:'entre'},
                    {l:'Sortie',k:'sortie'},
                ],
                mvmt_type_entre:[
                    {l:'Achat',k:'achat'},
                ],
                mvmt_type_sortie:[
                    {l:'Sortie Interne',k:'sortie-interne'},
                    {l:'Transfert',k:'transfert'},
                    {l:'Vente',k:'vente'},
                    {l:'Produits périmés',k:'produits-perimes'},
                    {l:'Don',k:'don'},
                ],
                prefix_num:{
                    'achat':'AC',
                    'sortie-interne':'SI',
                    'transfert':'TR',
                    'vente':'VE',
                    'produits-perimes':'PP',
                    'don':'DO'
                }
            }
        }
    },
    methods:{
        dateToText(d){
            let t = new Date(d)

            let date = t.getDate()
            let j = this.list_jour[t.getDay()]
            let m = this.list_mois[t.getMonth()]
            let y = t.getFullYear()

            return j+","+date+" "+m+" "+y
        },
        async statusConnection(){
            try {
                const _r = await this.$http.get('api/status-connexion')
                let _d = _r.data
                if(_d.status){
                    this.$store.commit('setUa',_d.ua)
                    this.$store.commit('setUser',_d.u)
                }
            } catch (e) {
                this.showNotif('Erreur de connexion')
            }
        },

        hideNotif(){
            this.$store.commit('hide')
        },
              //Notification ...
        showNotif(m,error = false){
            let x = {
                show:true,
                title:Notification,
                content:m,
                error:error
            }

            if(this.$store.state.notif_pop.show){
                this.hideNotif()
                setTimeout(()=>{
                    this.$store.commit('show',xd)
                },200)
            }else{
                this.$store.commit('show',x)
            }
        }

    }
}