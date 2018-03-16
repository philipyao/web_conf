import Vue from 'vue'
import Router from 'vue-router'
import {getCookie} from '../util/util'

Vue.use(Router);



const router = new Router({
  routes: [ 
    {
      path: '/',
      name: 'home',
      meta: {
        requireAuth: true,
      },
      component: resolve => require(['@/views/Home'], resolve)
    },  
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/Login'], resolve)
    },
    {
      path: '/config',
      name: 'config',
      meta: {
        requireAuth: true,
      },      
      component: resolve => require(['@/views/Config'], resolve)
    },    
  ]
})

router.beforeEach((to, from, next) => {
  console.log("route to ", to.fullPath);
  if (to.matched.some(r => r.meta.requireAuth)) {
    let sessid = getCookie("sessid");
    if (sessid === null) {
      console.log("sess not found, next to /login, redirect ", to.fullPath);
      next({
          path: '/login',
          query: {redirect: to.fullPath}
      })
    } else {
      console.log("sess exist: ", sessid);
      next();
    }
  } else {
    next();    
  }
})

export default router

function compo(name) {
  return resolve => require(['@/components/' + name + '.vue'], resolve)
}
function view(name) {
  return resolve => require(['@/views/' + name + '.vue'], resolve)
}
