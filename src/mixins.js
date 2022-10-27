export default {
    data(){
        return {
            list_jour:['Dimanche','Lundi','Mardi','Mecredi','Jeudi','Vendredi','Samedi'],
            list_mois:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],

            type_user:[
                {label:"Admin",code:"a"},
                {label:"Personnel",code:"p"},
            ]
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
                    this.$store.commit('setUser',_d.u)
                }
            } catch (e) {
                alert('Erreur de connexion')
            }
        }
    }
}