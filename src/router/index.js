import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


//设置cookie, expiredays为null则有效期为默认session
Vue.prototype.setCookie = (name, value, expiredays) => {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);　　　　
  document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

//获取cookie
var getCookie = (name) => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return (arr[2]);
  } else {
    return null;
  }   
};
Vue.prototype.getCookie = getCookie;

//删除cookie
Vue.prototype.delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
};

const router = new Router({
  routes: [ 
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/Login'], resolve)
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
    let sessid = getCookie("sessid");
    if (sessid === null && to.path !== '/login') {
      next({path: '/login'});
    } else if (sessid !== null && to.path !== '/login') {
      next({path: '/config'})
    }
    next()
})

export default router

function compo(name) {
  return resolve => require(['@/components/' + name + '.vue'], resolve)
}
function view(name) {
  return resolve => require(['@/views/' + name + '.vue'], resolve)
}
