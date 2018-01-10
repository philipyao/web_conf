import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [ 
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/Login'], resolve)
    },
    {
      path: '/config',
      name: 'config',
      component: resolve => require(['@/views/Config'], resolve)
    },    
  ]
})

router.beforeEach((to, from, next) => {
    //获取用户是否登陆
    let userInfo = window.localStorage.getItem('userinfo')
    if (!userInfo && to.path != '/login') {
        next({path: '/login'})
    } else if (to.path == '/login' && userInfo) {
        next({path: '/config'})
    }
    console.log("route to ", to.path)
    next()
})

export default router

function compo(name) {
  return resolve => require(['@/components/' + name + '.vue'], resolve)
}
function view(name) {
  return resolve => require(['@/views/' + name + '.vue'], resolve)
}
