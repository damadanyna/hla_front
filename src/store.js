import { createStore } from 'vuex'

import jsPDF from 'jspdf' 
// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: {},
      notif_pop:{
          show:false,
          title:'',
          content:'',
          error:false
      },
      ua:[]
    }
  },
  mutations: {
    export_pdf(state,dom){
      var doc = new jsPDF(); 
      doc.html(
          document.querySelector(dom), 
          {
            callback: function (doc) { doc.save('facture_PEC.pdf')}, 
            html2canvas: {  scale: .35, },
      }); 
    },
    setUser (state,u) {
      state.user = u
    },
    setUa(state,ua){
      state.ua = ua
    },
    show(state,t){
      state.notif_pop.show = t.show
      state.notif_pop.title = 'Notification'
      state.notif_pop.content = t.content
      state.notif_pop.error = t.error
    },
    hide(state){
        state.notif_pop.show  = false
    }

  }
})

export default store