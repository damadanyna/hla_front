<template>
    <div class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75 flex justify-center items-center" 
    style="z-index:1005">

        <!-- Overlay -->
        <div class="bg-white rounded" style="width:600px">
            <div class="flex items-center border-b p-1 px-2 bg-gray-50 rounded-t">
                <span class="text-sm font-bold"> Ajout d'un patient </span>
                <span class="flex-grow"></span>
                <button @click="$emit('close')" class="rounded-full border text-sm flex justify-center items-center w-8 h-8"> <i class="i ic:baseline-clear mx-2 text-2xl"></i> </button>
            </div>
            <div class="p-2 flex flex-col">
                <div class="flex items-end mb-2">
                    <custom-input  label="Numéro ..." class="mx-2 w-56" v-model="p.pat_numero" />
                    <custom-input  label="Profession ..." class="mx-2 w-56" v-model="p.pat_profession" />
                </div>

                <div class="flex mb-2">
                    <custom-input  label="Nom et prénom ..." class="mx-2 w-96" v-model="p.pat_nom_et_prenom" />
                </div>

                <div class="flex items-end mb-2">
                    <custom-input type="date"  label="Date de naissance" class="mx-2 w-56" v-model="p.pat_date_naiss" />
                    <custom-input  label="Age ..." class="mx-2"  />
                </div>

                <div class="flex items-end mb-2">
                    <c-select :datas="sex_list" class="mx-2 w-56" placeholder="Sexe ..." label="label" code="code" v-model="p.pat_sexe"  />
                </div>

                <div class="flex items-end mb-2">
                    <custom-input label="Adresse ..." class="mx-2 w-56" v-model="p.pat_adresse" />
                </div>

            </div>

            <div class="flex justify-end p-2 border-t bg-gray-50 rounded-b">
                <button class="bt text-sm flex justify-center items-center" @click="addPatient">
                    <i class="i ic:baseline-check icon-s"></i>
                    <span class="mx-2"> Valider </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch:{
        'p.pat_numero'(a){
            console.log(a)
        }
    },
    data(){
        return{
            p:{
                pat_sexe:'m',
                pat_numero:'',
                pat_date_naiss:'',
                pat_adresse:'',
                pat_profession:'',
                pat_nom_et_prenom:''
            },
            sex_list:[
                {label:"Masculin",code:'M'},
                {label:"Féminin",code:'F'}
            ]
        }
    },
    methods:{
        async addPatient(){
            try {
                const _r = await this.$http.post('api/patient',this.p)
                let _d = _r.data
                console.log(_d)
                if(_d.status){
                    this.$emit('validate')
                }else{
                    this.showNotif(_d.message)
                }

            } catch (e) {
                this.showNotif('Erreur de connexion')
                console.log(e)
            }
        }
    }
}
</script>