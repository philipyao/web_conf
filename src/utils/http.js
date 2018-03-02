import Vue from 'vue'
// ajax 
import axios from 'axios'
// url-encode
import Qs from 'qs'
import store from '@/store'
import router from '@/router'

var formHttp = axios.create({
  baseURL: '',
  //`withCredentails`选项表明了是否是跨域请求
  withCredentials: true,  
  timeout: 2000,
  //请求类型url-encode
  headers:{'Content-Type':'application/x-www-form-urlencoded'},
  transformRequest: [function (data) {
  	//x-www-form-urlencoded
    data = Qs.stringify(data);
    return data;
  }],
  //返回都是json类型
  responseType: 'json'
});
formHttp.interceptors.request.use(
	config => {
		if (store.getters.token) {
			config.headers.Token = store.getters.token;
		}
		return config;
	}, error => {
		console.log("http request error", error);
		return Promise.reject(error);
	}
);
formHttp.interceptors.response.use(
	response => {
		console.log("response %o", response);
		const rspdata = response.data;
		if (rspdata.errcode !== 0) {
			console.log("errcode: ", rspdata.errcode);
			if (rspdata.errcode === -1) {
				//系统错误
	          Vue.prototype.$Modal.warning({
	            title: "系统错误",
	            content: '详细：' + rspdata.errmsg,
	          });				
			} else if (rspdata.errcode === -20001 || rspdata.errcode === -20002 || rspdata.errcode === -20003) {
				//参数非法
			  console.log("参数非法");
	          Vue.prototype.$Modal.warning({
	            title: "参数非法",
	            content: '详细：' + rspdata.errmsg,
	          });							
			} else if (rspdata.errcode === -20101) {
				//方法错误
	          Vue.prototype.$Modal.warning({
	            title: "method错误",
	            content: '请确认GET/POST方法是否使用正确',
	          });							
			} else if (rspdata.errcode === 40001) {	
				//无权限
	          Vue.prototype.$Modal.warning({
	            title: "无权限",
	            content: '没有权限访问该页面',
	          });				
			} else if (rspdata.errcode === 40004) {
				//登录过期
		          Vue.prototype.$Modal.confirm({
		            title: "登录过期",
		            content: "登录已过期，请重新登录",
                    onOk: () => {
						store.dispatch("forceLogout");
		                router.replace({
		                    path: '/login',
		                    query: {redirect: router.currentRoute.fullPath}
		                })	
                    },
                    onCancel: () => {
						store.dispatch("forceLogout");
		                router.replace({
		                    path: '/login',
		                    query: {redirect: router.currentRoute.fullPath}
		                })	
                    }		            
		          });
			}
		}
		return response.data;
	},
	error => {
		console.log('err ' + error); // for debug
		if (error.response) {
			// The request was made and the server responded with a status code
      		// that falls out of the range of 2xx
			//TODO messageBox
			//error.response.status
			//error.response.statusText
		} else if (error.request) {
			// The request was made but no response was received
			//TODO messageBox 请求超时
		} else {
			// Something happened in setting up the request that triggered an Error
			//请求出错
			//TODO messageBox
			//error.message
		}
		return Promise.reject(error);
	}
);

export { formHttp };

var jsonHttp = axios.create({
  baseURL: '',
  //`withCredentails`选项表明了是否是跨域请求
  withCredentials: true,
  timeout: 2000,
  //请求类型json
  headers:{'Content-Type':'application/json'},
  //返回都是json类型
  responseType: 'json'
});
jsonHttp.interceptors.request.use(config => {
		if (store.getters.token) {
			config.headers.Token = store.getters.token;
		}
		return config;		
	}, error => {
		console.log("http request error", error);
		return Promise.reject(error);
	}
);
jsonHttp.interceptors.response.use(
	response => {
		console.log("response %o", response);
		var rspdata = response.data;
		if (rspdata.errcode !== 0) {
			//处理一些通用错误
			if (rspdata.errcode === -1) {
				//系统错误
	          Vue.prototype.$Modal.warning({
	            title: "系统错误",
	            content: '详细：' + rspdata.errmsg,
	          });				
			} else if (rspdata.errcode === -20001 || rspdata.errcode === -20002 || rspdata.errcode === -20003) {
				//参数非法
			  console.log("参数非法");
	          Vue.prototype.$Modal.warning({
	            title: "参数非法",
	            content: '详细：' + rspdata.errmsg,
	          });							
			} else if (rspdata.errcode === -20101) {
				//方法错误
	          Vue.prototype.$Modal.warning({
	            title: "method错误",
	            content: '请确认GET/POST方法是否使用正确',
	          });							
			} else if (rspdata.errcode === 40001) {	
				//无权限
	          Vue.prototype.$Modal.warning({
	            title: "无权限",
	            content: '没有权限访问该页面',
	          });
			} else if (rspdata.errcode === 40004) {
				//登录过期
				Vue.prototype.$Modal.warning({
					title: "登录过期",
					content: "登录会话已过期，请重新登录",
					onOk: () => {
						store.dispatch("forceRelogin");
					}          
				});
			}
            console.log("to response data!");
			return response.data;
		} else {
			return rspdata;
		}
	},
	error => {
		console.log('err ' + error); // for debug
		if (error.response) {
			// The request was made and the server responded with a status code
      		// that falls out of the range of 2xx
			Vue.prototype.$Modal.error({
				title: "错误",
				content: 'http错误' + error.response.status + ': ' + error.response.statusText,
			});
		} else if (error.request) {
			// The request was made but no response was received
			Vue.prototype.$Modal.error({
				title: "错误",
				content: '请求超时',
			});
		} else {
			// Something happened in setting up the request that triggered an Error
			Vue.prototype.$Modal.error({
				title: "错误",
				content: 'http请求出错：' + error.message,
			});
		}
		return Promise.reject(error);
	}
);
export { jsonHttp };