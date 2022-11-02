<template>
    <div class="p-2 w-full flex flex-col justify-center items-center">
        

        <div class="flex mt-2">
            <div class=" flex flex-col">
                <div class="p-2">
                    <!-- <span class="text-sm"> La liste des utilisateurs </span> -->
                </div>
                

                <!-- DIV list user -->
                <div class="">
                    <div class="flex mb-2">
                        <button @click="  on_add_user = true " class="bt-icon"> <i class="i text-lg ic:baseline-add"></i> </button>
                    </div>
                    <table class="">
                        <thead class="rounded-t sticky top-0 z-20" >
                            <tr class="bg-gray-50 text-gray-700 text-sm">

                                <th v-for="l in list_label" class="p-2 border text-xs" :key="l.key">
                                    {{ l.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="u in list_users" @click=" ()=>{
                                    u_selected = u
                                    on_view_user = true
                                } " :key="u.util_id" class="hover:bg-gray-50 cursor-pointer hover:bg-opacity-50">
                                <td class="p-2 border text-xs" v-for="l in list_label" :key="l.key">
                                    <span v-if="l.key == 'util_type'" class=""> 
                                        {{ (u[l.key] == 'a')?'Admin':'Personnel' }}    
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
        }
    },
    mounted(){
        this.getListUser()
    }
}
</script>