import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  	user: {
    	account: '',
    	is_super: false,
  	},
  	showConfirmLogout: false,
  },
  mutations: {
    SET_USER: (state, payload) => {
      // 变更状态
      state.user.account = payload.account;
      state.user.is_super = payload.is_super > 0;
      console.log("[store] setUser: %o", payload);
    },
    TOGGER_LOGOUT_MODAL: (state) => {
      state.showConfirmLogout = !state.showConfirmLogout;
      console.log("[store] togger show: ", state.showConfirmLogout);
    },
    FORCE_RELOGIN: (state) => {
      state.user.account = '';
      state.user.is_super = false;
      router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
      })
    },
  },
  actions: {
  	setUser: ({ commit }, payload) => {
  		commit('SET_USER', payload);
  	},
  	toggerLogoutModal: ({ commit }) => {
  		console.log("toggerLogoutModal");
  		commit('TOGGER_LOGOUT_MODAL');
  	},
    forceRelogin: ({ commit }) => {
      commit('FORCE_RELOGIN');
    },
  },
  getters: {
    account: (state) => {
      return state.user.account;
    },
    is_super: (state) => {
      return state.user.is_super;
    },
    showConfirmLogout: (state) => {
      return state.showConfirmLogout;
    },
  }  
});

export default store;