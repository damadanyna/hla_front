<template>
    <div class="p-2 w-full flex flex-col justify-center items-center">
        

        <div class="flex mt-2 w-full">
            <div class=" flex flex-col w-full">
                <div class="p-2">
                    <!-- <span class="text-sm"> La liste des utilisateurs </span> -->
                </div>
                

                <!-- DIV list user -->
                <div class="w-full">
                    <div class="flex mb-2">
                        <button @click="  on_add_user = true " class="bt-p-s"> 
                            <span class="material-icons"> add </span>
                            <span class=""> Ajouter </span>
                        </button>
                    </div>
                    <table class="w-full">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 ">

                                <th v-for="l in list_label" class="p-2 border" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="u in list_users" @click=" ()=>{
                                    u_selected = u
                                    on_view_user = true
                                } " :key="u.util_id" class="hover:bg-gray-50 cursor-pointer hover:bg-opacity-50">
                                <td class="p-2 border" v-for="l in list_label" :key="l.key">
                                    <span v-if="l.key == 'util_type'" class=""> 
                                        {{ getTypeUser(u[l.key]) }}    
                                    </span>
                                    <span v-else> {{ u[l.key] }} </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Fin list user -->
            </div>
        </div>


        <!-- Détails utilisateur si click sur l'utilisateur -->
        <detail-user @validate="getListUser" :u="u_selected" v-if="on_view_user" @close="on_view_user = false"  />

        <!-- Ajout utilisateur -->
        <add-user @validate=" ()=>{
            on_add_user = false
            getListUser()
        } " v-if="on_add_user" @close=" on_add_user = false " />
    </div>
</template>

<script>
export default {
    data(){
        return{
            list_label:[
                {label:"Libellé",key:"util_label"},
                {label:"Identifiant",key:"util_login"},
                {label:"Type",key:"util_type"},
            ],
            list_users:[],

            u_selected:{},
            on_view_user:false,
            on_add_user:false
        }
    },
    methods:{
        async getListUser(){
            try {
                const _r = await this.$http.get('api/users')

                let _d = _r.data

                if(_d.status){
                    this.list_users = _d.reponse
                }else{
                    this.showNotif(_d.message)
                }
            } catch (e) {
                this.showNotif('Erreur dans la base de donnée')
                console.log(e)
            }
        },
        getTypeUser(t){
            for (let i = 0; i < this.type_user.length; i++) {
                const e = this.type_user[i]
                if(e.code == t){
                    return e.label
                }
            }
        }
    },
    mounted(){
        this.getListUser()
    }
}
</script>