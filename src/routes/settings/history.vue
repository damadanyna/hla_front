<template>
    <div class="p-2">
        <div class="flex align-items-end mb-2 bg-white pb-2" style="position: sticky;top: 0px;z-index: 1000;">
            <!-- ici les filtres -->
            <div class="flex flex-column mt-2">
                <span class="font-bold text-xs"> {{ (filters.date)?dateToText(filters.date):'Date 1'  }} </span>
                <InputText placeholder="ex : 09/09/1998" v-model="filters.date"  type="date" class="p-inputtext-sm"/>    
            </div>
            <span class="m-2"> au </span>
            <!-- <custom-input type="date" v-model="filters.date2" :label=" (filters.date2)?dateToText(filters.date2):'Date 2' " /> -->
            <div class="flex flex-column mt-2">
                <span class="font-bold text-xs"> {{ (filters.date2)?dateToText(filters.date2):'Date 2' }} </span>
                <InputText placeholder="ex : 09/09/1998" v-model="filters.date2"  type="date" class="p-inputtext-sm"/>    
            </div>

            <div class="flex flex-column ml-2">
                <span class="font-bold text-xs"> Par </span>
                <Dropdown v-model="filters.by" :options="list_ch" optionLabel="label" optionValue="value" placeholder="Par" class="p-inputtext-sm" />
            </div>

            <div class="flex flex-column ml-2">
                <span class="p-input-icon-right">
                    <i class="pi pi-search" />
                    <InputText class="p-inputtext-sm" type="text" v-model="filters.search" :placeholder="by.label"/>
                </span>
            </div>
        </div>


        <div class="relative">
            <!-- ici la liste -->
            <table class="w-full">
                <thead class="rounded-t z-20" >
                    <tr class="text-left table-head-tr">

                        <th v-for="l in list_label" :style="th_style" class="text-sm" :key="l.key">
                            {{ l.label }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr @click=" ()=>{
                            list_selected = p
                        } " v-for="p in hist" class="cursor-pointer relative"  :key="p.uh_id">
                        <td :class="{'active-row':list_selected.uh_id == p.uh_id}"  class="text-xs" 
                        v-for="l in list_label" :key="l.key">
                            <span v-if="l.key == 'uh_date'" class=""> 
                                {{ (p[l.key])?dateToText(p[l.key]):'-' }}    
                            </span>
                            <span class="" v-else-if=" l.key == 'uh_time' "> {{ (new Date(p.uh_date)).toLocaleTimeString() }} </span>
                            <span v-else> {{ p[l.key] }} </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

export default {
    watch:{
        'filters.date'(){
            this.getHistory()
            this.list_selected = {}
        },
        'filters.date2'(){
            this.getHistory()
            this.list_selected = {}
        },

        'filters.search'(){
            this.getHistory()
            this.list_selected = {}
        },
        'filters.by'(a){
            this.getHistory()
            this.list_selected = {}

            for (let i = 0; i < this.list_ch.length; i++) {
                const e = this.list_ch[i];
                if(e.value == a){
                    this.by = e 
                    return
                }
            }
        },
    },
    data(){
        return{
            filters:{
                date:this.dateToInput(new Date()),
                date2:this.dateToInput(new Date()),
                search:'',
                by:'util_label'
            },
            hist:[],
            list_label:[
                {label:'Date',key:'uh_date'},
                {label:'Heure',key:'uh_time'},
                {label:'Module',key:'uh_module'},
                {label:'Description',key:'uh_description'},
                {label:'Observation',key:'uh_obs'},
                {label:'Utilisateur',key:'util_label'},
            ],
            list_selected:{},

            list_ch:[
                {label:'Utilisateur',value:'util_label'},
                {label:'Module',value:'uh_module'},
                {label:'Description',value:'uh_description'},
            ],

            by:{label:'Utilisateur',value:'util_label'}
        }
    },
    methods:{
        async getHistory(){
            try {
                const r = await this.$http.get('api/user/history/all',{params:{filters:this.filters}})

                let d = r.data

                if(d.status){
                    this.hist = d.hist
                }else{
                    this.showNotif('error','Historique datas',d.message)
                }
            } catch (e) {
                this.showNotifServerError()
            }
        }
    },
    mounted(){
        window.electronAPI.setTitle("Paramètres - Gestion des Historiques des utilisateurs")

        this.getHistory()
    }
}

</script>