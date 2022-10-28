
import './index.css'
import './assets/fonts/ic.css'
import {createRouter,createWebHashHistory} from 'vue-router'
import { createApp } from 'vue'

import axios from 'axios'

import App from './App.vue'


//les composants
import CustomInput from './components/customInput.vue' //
import sidebar from './components/sidebar.vue' //
import add_patient from './components/add-patient.vue'
import c_select from './components/c-select.vue'

//dans Gestion Stock
import addFourn from './components/addFourn.vue'
import detFourn from './components/detFourn.vue'

import addDep from './components/addDep.vue'
import detDep from './components/detDep.vue'

//Resak user
import detailUser from './components/detailUser.vue'
import addUser from './components/addUser.vue'

//Catégorie
import addCat from './components/addCat.vue'

//Prise en charge
import addPec from './components/addPec.vue'
import addTarif from './components/addTarif.vue'
import detTarif from './components/detTarif.vue'
import addEnt from './components/addEnt.vue'
import detEnt from './components/detEnt.vue'

import addCons from './components/addCons.vue'

import st from './store.js'


import btn from './components/btn.vue'
import add_article from './components/addArticle.vue'

//Importation du mixin global
import _mixin from './mixins'


//Ny routes ny APP rehetra


const routes = [

    //Ny MEnu principale rehefa avy ni-connect 
    {path:'/',component:() =>  import('./layouts/dashboard.vue'),
        children:[
            { path:'',name:'home-app', component:() => import('./routes/home-app.vue') },

            //Pour la gestion patients
            { path:'/patients',component:() => import('./routes/patients.vue') , 
                children:[
                    { path:'',name:'patients',component:() => import('./routes/patients/list-patient.vue') },
                ]
            },


            //Pour la gestion Caisse
            { path:'/caisse',component:() => import('./routes/caisse.vue') , 
                children:[
                    { path:'',name:'caisse',component:() => import('./routes/caisse/list-caisse.vue') },
                ]
            },

            //Pour la gestion des paramètres
            { path:'/settings',component:() => import('./routes/settings.vue') , 
                children:[
                    { path:'',name:'settings-user',component:() => import('./routes/settings/gestion-user.vue') },
                    { path:'module',name:'settings-module',component:() => import('./routes/settings/gestion-module.vue') },
                ]
            },


            //Pour la gestion de stock
            { path:'/stock',component:() => import('./routes/stock.vue') , 
                children:[
                    { path:'',name:'stock-fiche',component:() => import('./routes/stock/stock-fiche.vue') },
                    { path:'tiers',name:'stock-tiers',component:() => import('./routes/stock/stock-tiers.vue') },
                    { path:'cat',name:'stock-cat',component:() => import('./routes/stock/stock-cat.vue') },
                ]
            },

            { path:'/pec',component:() => import('./routes/pec.vue') , 
                children:[
                    { path:'',name:'pec-index',component:() => import('./routes/pec/index.vue') },
                    { path:'consultation',name:'pec-consultation',component:() => import('./routes/pec/consultation.vue') },
                    { path:'tarif',name:'pec-tarif',component:() => import('./routes/pec/tarif.vue') },
                    { path:'soc',name:'pec-soc',component:() => import('./routes/pec/soc.vue') },
                ]
            },
        ]   
    },

    //Rehefa mbola tsy ni-connect ny utilisateur
    {
        path:'/login',name:'login',component:() => import('./routes/login.vue')
    }
]




const router  = createRouter({
    history:createWebHashHistory(),
    routes
})

const app = createApp(App)
app.use(router)

app.use(st)


//configuration axios

//'http://192.168.88.254:4044' //Sur serveur
axios.defaults.baseURL = 'http://localhost:4044' //'http://localhost:4044'

//Ajout de axios dans vue
app.config.globalProperties.$http = axios


//Gestion du mixins global
app.mixin(_mixin)



//Ajout des composants utiles globalment
app.component('custom-input',CustomInput)
app.component('sidebar',sidebar)
app.component('add-patient',add_patient)
app.component('c-select',c_select)
app.component('detail-user',detailUser)
app.component('add-user',addUser)
app.component('btn',btn)
app.component('add-article',add_article)


//--------------
app.component('add-fourn',addFourn)
app.component('det-fourn',detFourn)

app.component('add-dep',addDep)
app.component('det-dep',detDep)

//Cat
app.component('add-cat',addCat)

//Gestion prise en charge
app.component('add-pec',addPec)
app.component('add-tarif',addTarif)
app.component('det-tarif',detTarif)
app.component('add-ent',addEnt)
app.component('det-ent',detEnt)

app.component('add-cons',addCons)


app.mount('#app')


