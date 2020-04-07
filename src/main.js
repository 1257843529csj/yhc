import Vue from 'vue'
import App from './App.vue'
import router from './router'
import rem from './assets/js/rem'
import axios from 'axios'
import $ from 'jquery';
import Vant from 'vant';
import { isWeiXin,mobiletype } from '@/assets/js/date.js';
import 'vant/lib/index.css';
import './assets/css/g.css';
import './assets/css/movie.css';
import './assets/css/index.css';
import './assets/css/cinema.css';
import './assets/css/member.css';
import Swiper from 'swiper';
// import wx from 'weixin-js-sdk'
import { Lazyload,Toast,Dialog} from 'vant';
var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(Vant);
Vue.use(Lazyload);
Vue.config.productionTip = false;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['clientid'] = 'testclient';

const env = process.env.NODE_ENV;
//安卓初始化 
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
       callback(WebViewJavascriptBridge)
    } else {
       document.addEventListener(
          'WebViewJavascriptBridgeReady',
          function() {
             callback(WebViewJavascriptBridge)
          },
          false
       );
    }
 }
connectWebViewJavascriptBridge(function(bridge) {
        bridge.init(function(message, responseCallback) {
           console.log('JS got a message', message);
           var data = {
              'Javascript Responds': ' Responds'
           };
           if (responseCallback) {
              console.log('JS responding with', data);
              responseCallback(data);
           }
        });
        //获取第三方登录
        bridge.registerHandler("thirdRegister", function(data, responseCallback) {
                 console.log('thirdRegister data', data);
                 login3(data,"android")
                  if (responseCallback) {
                     var responseData = "Javascript Says Right back aka!";
                    responseCallback(responseData);
                  }
        });
     })

//iso 初始化
function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}
setupWebViewJavascriptBridge(function(bridge) {
    var uniqueId = 1
    function log(message, data) {
      var log = document.getElementById('log')
      var el = document.createElement('div')
      el.className = 'logLine'
      el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
      if (log.children.length) { log.insertBefore(el, log.children[0]) }
      else { log.appendChild(el) }
    }

    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
      log('ObjC called testJavascriptHandler with', data)
      var responseData = { 'Javascript Says':'Right back atcha!' }
      log('JS responding with', responseData)
      responseCallback(responseData)
    })
    //获取第三方登录
    bridge.registerHandler("thirdRegister", function(data, responseCallback) {
                  console.log('thirdRegister data', data);
                  //alert(JSON.stringify(data));
                  login3(data,"ios")
                  if (responseCallback) {
                     var responseData = "Javascript Says Right back aka!";
                     responseCallback(responseData);
                  }
        });
    document.body.appendChild(document.createElement('br'))

    var callbackButton = document.getElementById('buttons').appendChild(document.createElement('button'))
    callbackButton.innerHTML = 'Fire testObjcCallback'
    callbackButton.onclick = function(e) {
      e.preventDefault()
      log('JS calling handler "testObjcCallback"')
      bridge.callHandler('testObjcCallback', {'foo': 'bar'}, function(response) {
        log('JS got response', response)
      })
    }
  })
//三方登录回调后处理
function login3(logindata,moblie_type){
     if(moblie_type == "android"){
       var logindataobj = JSON.parse(logindata)
       var login_type;
       if(logindataobj.comefrom == "weixin"){
         login_type = 1
       }else{
         login_type = 3
       }
     }else if(moblie_type == "ios"){
        var logindataobj = logindata;
        login_type = logindataobj.type;
     }
     //alert(JSON.stringify(logindataobj))
     //alert("type"+login_type)
     axios({
              method:'post',
              url:'/member/login3',
              data:{
                  union_id:logindataobj.union_id,
                  open_id:logindataobj.open_id,
                  type:login_type,
                  nick:logindataobj.nick,
                  avatar:logindataobj.avatar,
                  gender:logindataobj.gender,
                  access_token:logindataobj.access_token
            }}).then((j) => {
                //alert(JSON.stringify(j))
                if(j.data.data.needBindMobile == 0){
                  //alert(JSON.stringify(j.data.data.token));
                  localStorage.setItem("token",j.data.data.token);
                    router.push('/')
                }else if(j.data.data.needBindMobile == 1){
                    router.push({name:"bindmoblie3",query:{faceurl:logindataobj.avatar,usenames:logindataobj.nick,token_3:j.data.data.token,obgdata:logindataobj,logintype:login_type}})
                }
            })
}  

var domain = "/"
if(env==='production'){
  axios.defaults.baseURL="http://m21.filmfly.cn/c3";
  domain = "/app"
}else if(env ==='development'){
  axios.defaults.baseURL="/c2"
}
axios.defaults.transformRequest = [function (data) {
    var ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]
var getnum = 0;//请求次数
axios.interceptors.response.use(
   response => {
     if(response.data.token!=''){
         localStorage.setItem("token",response.data.token);

     }
     if(response.data.code=="-1"){
        Toast.clear();
        getnum = 0;
        Dialog.alert({
          message:response.data.msg
        })
        //return false
        return response;
     }
     if(response.data.code=="-2"){
        //Toast.clear();
        getnum = 0;
        return response;
     }
     else if(response.data.code =="-400"){
        Toast.clear();
        getnum = 0;
        Dialog.alert({
          message:response.data.msg
        }).then(() => {
          window.location.href=domain
        });
     }
     else if(response.data.code =="-800"){
        Toast.clear();
        getnum = 0;
        router.push(
            {
                name:'loginbox',
                query:{
                    redirect:router.history.current.fullPath
                }
            }
        );
        return false;
     }else if(response.data.code =="-2"){
         return response;
     }else{
         getnum --;
         //console.log(getnum)
         if(getnum <= 0 ){
           Toast.clear()
         }
         return response;
     }
   },
   error => {
   	 //console.log(error.response);
     Toast.clear()
     getnum = 0;
     return Promise.reject(error.response)   // 返回接口返回的错误信息
   });
axios.interceptors.request.use(
      config => {
        Toast.clear();
        getnum++;
        //console.log(getnum)
        Toast.loading({
          message: '加载中...',
          duration: 0
        });
        var token = localStorage.getItem("token");
        if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
           config.headers.token = token;
        }
        config.headers.cityid = localStorage.getItem("cityid");
        config.headers.clientagent= isWeiXin() ? 'wap' : 'app'
        return config
      },
      err => {
        Toast.clear()
        console.log(err+"a")
        return Promise.reject(err);
      });
    Vue.prototype.$http = axios;
    
    //登录拦截
    router.beforeEach((to, from, next) => {
      Toast.clear()
      if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
        var token = localStorage.getItem("token");
        if (token) {  // 判断当前的token是否存在
          next();
        }
        else {
          setTimeout(() =>{Toast.clear()},1000)
          next({
            path: '/Login',
            query: {redirect:to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
        }
      }
      else {
        Toast.clear()
        next();
      }
    });
new Vue({
  router,
  render: h => h(App),
}).$mount('#app') 
