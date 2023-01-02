<template>
    <div class="bg-dialog-box">


        <!-- Content Overlay -->
        <div class="border rounded-sm shadow-sm bg-white" :style="{width:`700px`}">
            <div class="p-2 flex items-center">
                <span class="text-sm font-bold"> Ajout d'une avance </span>
                <span class="flex-grow"></span>
                <button class="bt-s w-8 h-8 flex justify-center items-center" @click="$emit('close')"> <span class="text-xs material-icons"> clear </span> </button>
            </div>

            <div class="p-2 flex ">
                <custom-input type="date" v-model="encav.encav_date" label="Date" />
                <custom-input v-model="caissier.util_label" :disable="true" class="ml-2" label="Caissier" />
                <custom-input type="number" v-model="encav.encav_montant" class="ml-2" label="Montant" />
            </div>

            <div class="p-2 flex">
                <span class="flex-grow"></span>
                <button class="bt-p-s" @click="setAvance"> Valider </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            encav:{
                encav_date:''
            },
            caissier:{}
        }
    },
    methods:{
        init(){
            this.encav.encav_date = this.dateToInput(new Date())
            this.encav.encav_util_id = this.$store.state.user.util_id
            this.encav.util_label = this.$store.state.user.util_label
            this.encav.encav_id = (new Date()).getTime()

            this.caissier = this.$store.state.user
        },
        async recupDataUtils(){

        },
        setAvance(){
            let mn = parseInt(this.encav.encav_montant)
            if(mn.toString() == 'NaN' ||  mn <= 0){
                this.showNotif('Le montant doit être supérieur à zéro')
                return
            }

            // console.log(mn)

            this.$emit('validate',this.encav)
        }
    },
    mounted(){
        this.init()
    }
}
</script> 