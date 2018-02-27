import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {getCookie} from '../util/util'

Vue.use(Router);

const router = new Router({
  routes: [ 
    {
      path: '/',
      name: 'home',
      meta: {
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
        superUser: true,
      },
      component: resolve => require(['@/views/UserManage'], resolve)
    },    
    {
      path: '/config',
      name: 'config',
      meta: {
        superUser: false,
      },      
      component: resolve => require(['@/views/Config'], resolve)
    },
    {
      path: '/createNamespace',
      name: 'createNamespace',
      meta: {
        superUser: false,
      },      
      component: resolve => require(['@/views/CreateNamespace'], resolve)
    },
  ]
})

router.beforeEach((to, from, next) => {
  console.log("route to ", to.fullPath);

  if (store.getters.account) {
    /* account exist */
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      //检查权限
      if (to.matched.some(r => r.meta.superUser)) {
        let is_super = store.getters.is_super;
        if (!is_super) {
          Vue.prototype.$Modal.warning({
            title: "无权限",
            content: "本账号无权访问，你可以使用管理员账号来操作",
          });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } else {
      /* no account */
      console.log("no account");
      if (to.path === '/login') {
        next();
      } else {
        next('/login');
      }
  }
})

export default router

function compo(name) {
  return resolve => require(['@/components/' + name + '.vue'], resolve)
}
function view(name) {
  return resolve => require(['@/views/' + name + '.vue'], resolve)
}
