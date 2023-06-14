<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold"> RAPPORT DE VERSEMENT PAR DATE </span>
        </template>
        <div class="flex" style="width: 500px;">
            
            <div class="flex flex-column">
                <span class="mb-3"> Choisissez une intervalle de Date </span>

                <div class="mb-3 p-2 border-1 border-red-500 border-round" v-if="nb_versement == 0" >
                    <span class="text-sm"> Aucun versement n'a été effectué pendant l'intervalle de date </span>
                </div>
                <div class="mb-3 p-2 border-1 border-green-500 border-round" v-else >
                    <span class="text-sm"> <strong> {{ nb_versement }} </strong> versements trouvés </span>
                </div>

                <div class="flex text-sm">

                    <div class="flex flex-column mr-5">
                        <span class=""> {{ dateToText(filters.date_1) }} </span>
                        <InputText v-model="filters.date_1" type="date" class="p-inputtext-sm" />
                    </div>

                    <div class="flex flex-column">
                        <span class=""> {{ dateToText(filters.date_2) }} </span>
                        <InputText v-model="filters.date_2" type="date" class="p-inputtext-sm" />
                    </div>

                </div>
            </div>

        </div>
        <template #footer>
            <Button :disabled=" (nb_versement <=0)?true:false " :loading="loading" label="Exporter en PDF" class="p-button-sm p-button-text" @click="exportVers" icon="pi pi-print"/>
            <!-- <Button label="Excel" class="p-button-sm p-button-text" icon="pi pi-print"/> -->
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['visible'],
    watch:{
        'filters.date_1'(){
            this.checkNbVersement()
        },
        'filters.date_2'(){
            this.checkNbVersement()
        },
        visible(a){
            if(a){
                this.checkNbVersement()
            }
        }
    },
    data(){
        return{
            filters:{
                date_1:this.dateToInput(new Date()),
                date_2:this.dateToInput(new Date()),
                type:'pdf'
            },
            loading:false,
            nb_versement:0
        }
    },
    methods:{
        async exportVers(){
            try {
                this.loading = true
                const r = await this.$http.get('api/caisse/main/versement/'+this.filters.type,{
                    params:{filters:this.filters}
                })

                let d = r.data
                if(d.status){
                    this.showNotif('success','Rapport de Versement','Genéré')
                    window.electronAPI.downFact(`${this.$http.defaults.baseURL}/api/encaissement/vt/rapport/down`)
                    // console.log(d)
                }else{
                    this.showNotif('error','Exportation de Rapport Versement',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }

            this.loading = false
        },

        async checkNbVersement(){
            const r = await this.$http.get('api/caisse/main/versement/nb',{params:{filters:this.filters}})

            let d = r.data

            if(d.status){
                this.nb_versement = d.nb_versement
            }else{
                this.showNotifServerError()
            }
        }

    },
    mounted(){
        this.checkNbVersement()
    }
}
</script>

<style>

</style>