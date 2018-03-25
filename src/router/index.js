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
        superUser: false,
      },
      component: resolve => require(['@/views/Home'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/Login'], resolve)
    },
    {
      path: '/userManage',
      name: 'userManage',
      meta: {
        requireAuth: true,
        superUser: true,
      },
      component: resolve => require(['@/views/UserManage'], resolve)
    },    
    {
      path: '/config',
      name: 'config',
      meta: {
        requireAuth: true,
        superUser: false,
      },      
      component: resolve => require(['@/views/Config'], resolve)
    },
    {
      path: '/createNamespace',
      name: 'createNamespace',
      meta: {
        requireAuth: true,
        superUser: false,
      },      
      component: resolve => require(['@/views/CreateNamespace'], resolve)
    },
  ]
})

router.beforeEach((to, from, next) => {
  console.log("route to ", to.fullPath);

  //检查登录态
  if (to.matched.some(r => r.meta.requireAuth)) {
    let sessid = getCookie("sessid");
    if (sessid === null) {
      console.log("sess not found, next to /login, redirect ", to.fullPath);
      next({
          path: '/login',
          query: {redirect: to.fullPath}
      });
    } 
  }
  
  //检查页面权限


  //通过
  next();
})

export default router

function compo(name) {
  return resolve => require(['@/components/' + name + '.vue'], resolve)
}
function view(name) {
  return resolve => require(['@/views/' + name + '.vue'], resolve)
}
