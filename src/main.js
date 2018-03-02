// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'

 // ivew UI组件
import iView from 'iview'
import '../theme/iview/index.less'

import Vuex from 'vuex'
Vue.use(Vuex);

Vue.config.productionTip = false
// 强制启用devtools
Vue.config.devtools = true

Vue.use(iView)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
