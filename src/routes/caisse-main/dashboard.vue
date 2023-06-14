<template>
    <div class="p-2">

        <div class="flex mb-5 ">
            <div class="flex flex-column flex-grow-1 p-3 border-1 border-200 border-round mr-5" :style="st">
                <span class="text-2xl">  {{  dt.count_now.toLocaleString('fr-CA') }} </span>
                <span class="text-sm text-gray-400"> Aujourd'hui </span>
            </div>
            <div class="flex flex-column flex-grow-1 p-3 border-1 border-200 border-round mr-5" :style="st">
                <span class="text-2xl">  {{  dt.count_week.toLocaleString('fr-CA') }} </span>
                <span class="text-sm text-gray-400"> Cette semaine </span>
            </div>
            <div class="flex flex-column flex-grow-1 p-3 border-1 border-200 border-round" :style="st">
                <span class="text-2xl">  {{  dt.count_month.toLocaleString('fr-CA') }} </span>
                <span class="text-sm text-gray-400"> Ce mois </span>
            </div>
        </div>

        <div class="flex flex-column p-2 border-1 border-round border-200 mb-5 " :style="stg">
            <span class="text-gray-400"> Total Cette année </span>
            <div class="" style="width:95%;height: 500px;"  v-if="chartData.labels">
                <Chart :height="90" type="bar" :data="chartData" :options="chartOptions" />
            </div>
        </div>

        <div class="flex ">

            <div class="flex flex-column flex-grow-1 border-1 border-round border-200 mr-2 p-3" >
                <div class="flex">
                    <span class="mb-5 p-2 bg-white border-orange-500 border-1 border-round"> Dispensaire </span>
                </div>
                <div v-if="dt.rapport_disp" class="flex flex-column text-sm">

                    <div class="flex py-3 text-gray-600  px-2 border-orange-300 mb-2" v-for="l in 4" :key="l">
                        <span class="flex flex-grow-1"> {{ dateToText(dt.rapport_disp[`date${l}`]) }}  </span>
                        <span class="flex justify-content-end flex-grow-1"> {{ dt.rapport_disp[`m${l}`].toLocaleString('fr-CA') }}  </span>
                    </div>
                </div>

            </div>

            <div class="flex flex-column flex-grow-1 border-1 border-round border-200 p-3" >
                <div class="flex">
                    <span class="mb-5 p-2 bg-white border-orange-500 border-1 border-round"> Hospitalisation </span>
                </div>
                <div v-if="dt.rapport_disp" class="flex flex-column text-sm">

                    <div class="flex py-3 text-gray-600  px-2 border-orange-300 mb-2 " v-for="l in 4" :key="l">
                        <span class="flex flex-grow-1"> {{ dateToText(dt.rapport_hosp[`date${l}`]) }}  </span>
                        <span class="flex justify-content-end flex-grow-1"> {{ dt.rapport_hosp[`m${l}`].toLocaleString('fr-CA') }}  </span>
                    </div>
                </div>

            </div>
        </div>

        <Divider />

        <div class="p-5 flex flex-column justify-content-center align-items-center">

            <span class="text-sm text-gray-700 mb-5 italic"> Pour l'exportation en PDF de Rapport de Versement par Intervalle de date  </span>

            <!-- bouton de création de rapport versement -->
            <Button class="p-button-sm" style="z-index: 1000;" @click="on_versement = true" label="Rapport Versement" icon="pi pi-print" />
        </div>


        <!-- Boîte de dialogue Rapport de versement -->
        <rapport-versement-main :visible="on_versement" @close="on_versement = false" />
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
            },
            chartOptions:{
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    responsive:false,
                    maintainAspectRation:false
                }
            },
            chartData:{},
            st:{
                backgroundColor:'rgba(255, 159, 64,0.03)'
            },
            stg:{
                backgroundColor:'rgba(75, 192, 192,0.03)'
            },
            on_versement:false
        }
    },
    methods:{
        init(){
            
        },
        setRapportYear(){
            this.chartData.labels = this.list_mois
            let m = new Date().getMonth()
            this.chartData.datasets = [
                {
                    label:'Rapport Annuel',
                    data:this.list_mois.map((x,i)=>{
                        return this.dt.rapport_year[`m${i}`]
                    }),
                    backgroundColor:this.list_mois.map((x,i)=>{
                        return (m == i)?'rgba(255, 159, 64, 0.5)':'rgba(75, 192, 192, 0.2)'
                    }),
                    borderColor:this.list_mois.map((x,i)=>{
                        return (m == i)?'rgb(255, 159, 64)':'rgb(75, 192, 192)'
                    }),
                    borderWidth: 1
                }
            ]
        },
        async getData(){
            try {
                const r = await this.$http.get('api/caisse/main/dash')
                let d = r.data

                if(d.status){
                    this.dt = d

                    this.setRapportYear()
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