<template>
    <Dialog :maximizable="true" :visible="visible" @update:visible=" ()=>{
            $emit('close') 
        } "  :modal="true" class="p-fluid p-dialog-sm">
        <template #header>
            <span class="text-sm font-bold">AJOUT D'UN PATIENT {{ (type == 'dt')?'- Dentisterie':'' }} </span>
        </template>
        <div class="">
            <div class="flex flex-column mb-2">

                <div class="flex mb-2">
                    <div class="flex flex-column mt-2" style="width:30%">
                        <span class="font-bold text-sm"> Numéro </span>
                        <InputText class="p-inputtext-sm" autofocus type="text" v-model="p.pat_numero" placeholder="ex : D34ER567" 
                        :class="{'p-invalid':submitted && !p.pat_numero}" />
                    </div>
                    <Divider layout="vertical" style="width:5%"/>
                    <div class="flex flex-column mt-2" style="width:65%">
                        <span class="font-bold text-sm"> Profession </span>
                        <InputText type="text" v-model="p.pat_profession" placeholder="ex : POMPISTE" class="p-inputtext-sm" />
                    </div>
                </div>

                <div class="flex mb-2">
                    <!-- <custom-input  label="Nom et prénom ..." class="mx-2 w-96" v-model="p.pat_nom_et_prenom" /> -->
                    <div class="flex flex-column mt-2" style="width:100%">
                        <span class="font-bold text-sm"> Nom et prenom </span>
                        <InputText type="text" v-model="p.pat_nom_et_prenom" placeholder="ex : Ralaivao Adonis" class="p-inputtext-sm" 
                        :class="{'p-invalid':submitted && !p.pat_nom_et_prenom}" />
                    </div>
                </div>

                <div class="flex mb-2">
                    <!-- <custom-input type="date"  label="Date de naissance" class="mx-2 w-56" v-model="p.pat_date_naiss" /> -->
                    <div class="flex flex-column mt-2" style="width:65%">
                        <span class="font-bold text-sm"> Date de naissance </span>
                        <!-- <Calendar placeholder="ex : 09/09/1998" v-model="p.pat_date_naiss"  dateFormat="dd/mm/yy" class="p-inputtext-sm"  
                        :class="{'p-invalid':submitted && !p.pat_date_naiss}"/> -->

                        <InputText type="date" v-model="p.pat_date_naiss" :class="{'p-invalid':submitted && !p.pat_date_naiss}" placeholder="09/09/1998"  />
                    </div>
                    <!-- <custom-input :disable="true" v-model="getAge" label="Age ..." class="mx-2"  /> -->
                    <Divider layout="vertical" style="width:5%"/>
                    <div class="flex flex-column mt-2" style="width:30%">
                        <span class="font-bold text-sm"> Age </span>
                        <InputText type="text" v-model="getAge" class="p-inputtext-sm" disabled />
                    </div>
                </div>

                <div class="flex flex-column mb-2">
                    <!-- <c-select :datas="sex_list" class="mx-2 w-56" placeholder="Sexe ..." label="label" code="code" v-model="p.pat_sexe"  /> -->
                    <span class="font-bold text-sm"> Sexe </span>
                    <Dropdown v-model="p.pat_sexe" :options="sex_list" optionLabel="label" optionValue="code" placeholder="sexe" class="p-inputtext-sm" />
                </div>

                <div class="flex items-end mb-2">
                    <!-- <custom-input label="Adresse ..." class="mx-2 w-56" v-model="p.pat_adresse" /> -->
                    <div class="flex flex-column mt-2" style="width:100%">
                        <span class="font-bold text-sm"> Adresse </span>
                        <InputText type="text" v-model="p.pat_adresse" placeholder="ex : AMBOHIMENA NORD" class="p-inputtext-sm" />
                    </div>
                </div>

                <div class="flex items-end mb-2">
                    <!-- <custom-input label="Adresse ..." class="mx-2 w-56" v-model="p.pat_adresse" /> -->
                    <div class="flex flex-column mt-2" style="width:100%">
                        <span class="font-bold text-sm"> Dernière Visite </span>
                        <!--  <Calendar placeholder="ex : 09/09/2023" v-model="p.pat_dernier_visite"  dateFormat="dd/mm/yy" class="p-inputtext-sm"/>  -->

                        <InputText v-model="p.pat_dernier_visite" placeholder="09/09/1998" type="date"  />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Enregistrer" class="p-button-sm" icon="pi pi-check" @click="addPatient"  :loading="isLoading" />
        </template>
    </Dialog>
</template>

<script>
export default {
    props:['visible','type'],
    watch:{
        'p.pat_nom_et_prenom'(a){
            this.p.pat_nom_et_prenom = a.toUpperCase()

        },
        'p.pat_adresse'(a){
            this.p.pat_adresse = a.toUpperCase()
        },
        'p.pat_numero'(a){
            this.p.pat_numero = a.toUpperCase()
        },
        'p.pat_profession'(a){
            this.p.pat_profession = a.toUpperCase()
        },

        'p.pat_date_naiss'(a){
            //console.log(a.length)
        }
    },
    data(){
        return{
            p:{
                pat_sexe:'M',
                pat_numero:'',
                pat_date_naiss:'',
                pat_adresse:'',
                pat_profession:'',
                pat_nom_et_prenom:'',
                pat_dernier_visite:null
            },
            sex_list:[
                {label:"Masculin",code:'M'},
                {label:"Féminin",code:'F'}
            ],
            isLoading:false,
            submitted:false,
        }
    },
    computed:{
        getAge(){
            if(!this.p.pat_date_naiss){
                return 0
            }else{

                //Calcul d'age par internet
                //https://www.folkstalk.com/2022/07/calculate-age-from-date-of-birth-javascript-with-code-examples.html
                
                var today = new Date();
                var birthDate = new Date(this.p.pat_date_naiss);

                console.log(birthDate)
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
                {
                    age--;
                }
                return isNaN(age)?0:age;
            }
        }
    },
    methods:{
        async addPatient(){
            this.submitted = true
            this.isLoading = true

            //Mise en majuscule du nom et prenom du patient

            //this.p.pat_date_naiss = this.formatDate(this.p.pat_date_naiss) 
            
            try {
                let url = (this.type == 'dt')?'api/dt/patient':'api/patient'
                this.p.user_id = this.getUserId()
                const _r = await this.$http.post(url,this.p)
                let _d = _r.data
                console.log(_d)
                if(_d.status){
                    this.$emit('validate')
                    this.showNotif('success',`Ajout d'un patient`,_d.message)
                }else{
                    this.showNotif('error',`Ajout d'un patient`,_d.message)
                }

            } catch (e) {
                this.showNotifServerError()
                console.log(e)
            }

            this.isLoading = false
        },
        reinit(){
            this.submitted = false

            this.p = {
                pat_sexe:'M',
                pat_numero:'',
                pat_date_naiss:'',
                pat_adresse:'',
                pat_profession:'',
                pat_nom_et_prenom:''
            }
        }
    }
}
</script>