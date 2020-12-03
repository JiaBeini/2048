import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    username:{name:''},
    roomNumber:{}
  },
  mutations: {
    SOCKET_USER_INFO(state, data) {
      state.userInfo = data;
    },
    setUsername(state,data){
      state.username.name=data
    },

    setRoomNumber(state,data){
      state.roomNumber=data
    }
  },
  actions: {
  },
  modules: {
  }
})
