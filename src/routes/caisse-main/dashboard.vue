<template>
    <div class="">

        <div class="flex">
            <div class="flex flex-column p-3 border-1 border-200 border-round m-2">
                <span class="text-2xl">  {{  dt.count_now.toLocaleString('fr-CA') }} </span>
                <span class="text-sm text-gray-400"> Aujourd'hui </span>
            </div>
            <div class="flex flex-column p-3 border-1 border-200 border-round m-2">
                <span class="text-2xl">  {{  dt.count_week.toLocaleString('fr-CA') }} </span>
                <span class="text-sm text-gray-400"> Cette semaine </span>
            </div>
            <div class="flex flex-column p-3 border-1 border-200 border-round m-2">
                <span class="text-2xl">  {{  dt.count_month.toLocaleString('fr-CA') }} </span>
                <span class="text-sm text-gray-400"> Ce mois </span>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data(){
        return{
            dt:{
                count_month:0,
                count_now:0,
                count_week:0
            }
        }
    },
    methods:{
        init(){
            
        },
        async getData(){
            try {
                const r = await this.$http.get('api/caisse/main/dash')
                let d = r.data

                if(d.status){
                    this.dt = d
                }else{
                    this.showNotif('error','Récupération des données',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        }
    },
    beforeMount(){
        this.getData()
    }
}
</script>