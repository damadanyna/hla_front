import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      user: {}
    }
  },
  mutations: {
    setUser (state,user) {
      state.user = user
    }
  }
})

export default store