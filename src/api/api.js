import { formHttp, jsonHttp } from '@/utils/http'
import Crypto from 'crypto-js'

const salt = "^rR@8=YlsU";

export default {
	login: (username, passwd) => {
		var encStr = salt + passwd + username;
		var encPasswd = Crypto.SHA1(encStr).toString();
		return formHttp.post('/api/login', {username: username, password: encPasswd});
	},
	listUser: () => {
		return jsonHttp.get("/api/user/list", {});
	},
	createUser: (username, passwd) => {
		var encStr = salt + passwd + username;
		var encPasswd = Crypto.SHA1(encStr).toString();
		console.log(encPasswd);
		return jsonHttp.post("/api/user/create", {username: username, enc_passwd: encPasswd});
	},
	changeUser: (username, enable) => {
		return jsonHttp.post("/api/user/change", {username: username, enable: enable});
	},
	listConfig: () => {
		return jsonHttp.post("/api/list", {});
	},
	changeConfig: (change) => {
		return jsonHttp.post("api/change", change);
	},
	createNamespace: (namespace, author, desc) => {
		return jsonHttp.post("/api/namespace/create", {namespace: namespace, comment: desc, author: author})
	},
}