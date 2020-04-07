<template>
	<div class="box">
        <van-nav-bar
      :title='title'
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
        <div class="boxcon">
		 <div id="h" v-if="ispwd">
	        <div class="login_box">
	            <div class="boxs">
	                <div class="inputs">
	                    <span class="phoneimg"></span>
	                    <span class="inputcon">
	                        <input type="tel" placeholder="请输入手机号码" class="dd" v-model="model.telPhone" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')">
	                    </span>
	                </div>
	                <div class="inputs">
	                	<div style="display: flex; display: -webkit-flex; width: 100%;align-items: center;">
	                    <span class="passimg"></span>
	                    <span>
	                        <input type="text" v-model="model.password" class="pwd" v-if="!pwdType" placeholder="请输入密码">
	                        <input  type="password" placeholder="请输入密码" class="pwd" v-model="model.password" v-if="pwdType">
	                        <img :src="seen ? unseenImg : seenImg" class="eye" @click="pwdView">
	                    </span>
	                </div>
	                </div>
	            </div>
	        </div>   
	        <div class="next" @click="login">登录</div>
	            <div class="qt">
	                <span>
	                <a @click="ispwd = false">手机号快捷登录</a></span>
	                <span  class="ps"><a @click="getPwd">忘记密码？</a></span>
	            </div>
	        </div> 
		        <!--  手机验证码登录 -->
            <div class="login-yzm" v-if="!ispwd">
                <div class="login_box">
                    <!-- <h3></h3> -->
                    <div class="boxs">
                        <div class="inputs">
                            <span class="phoneimg"></span>
                            <span class="inputcon">
                                <input  type="tel" placeholder="请输入手机号码" v-model="model.telPhone" class="dd" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')">
                            </span>
                        </div>
                         <div class="inputs imgcodediv">
                         	<div style="display: flex; display: -webkit-flex">
                            <span class="imgcode">
                            </span>
                            <span class="inputcon">
                                <p>
                                    <input type="tel" placeholder="请输入图形验证码" id="captcha" class="dd" v-model="imgCode">
                                </p>
                                <p style="width: auto;margin-left: 1rem;">
                                    <img id="captchaImg" @click="reCaptcha" src="">
                                </p>
                            </span>
                        	</div>
                        </div>
                        <div class="inputs">
                            <span class="passimg"></span>
                            <span style="position:relative;">
                                <a class="huoqu" href="#"  v-if="ishuoqu" @click="yzmbtn">获取验证码</a>
                                <a class="huoqu yanz" v-else >{{inittime}}s</a>
                                <input  type="tel" placeholder="请输入短信验证码"  class="dd" v-model="code">
                            </span>
                        </div>
                </div>   
                <div class="next" @click="btn_quicklogin">登录</div>
                    <div class="logintip">
                        <span @click="ispwd = true">账号密码登录</span>
                    </div>
                </div> 
            </div>
            <div class="otherlogin">
                 <p>第三方账号登录</p>
                 <div class="othericon">
                     <div @click="otherlogins(1)"><img src="../assets/img/wechat.png"></div>
                     <div @click="otherlogins(3)"><img src="../assets/img/QQ.png"></div>
                 </div>
            </div>
        </div>
	</div>
</template>
<script type="text/javascript">
import $ from 'jquery';
import md5 from 'js-md5'
import {Dialog,Toast} from 'vant';
import { tel,isWeiXin } from '@/assets/js/date.js';
var domain = "http://m21.filmfly.cn"
export default {
	data() {
	    return {
        title:'登录',
	     model:{
           telPhone:"",
           password:"",
        },
        ispwd:false,
        inittime:60,
        seen:"",
        code:"",
        unseenImg:require("@/assets/img/eye2.png"),//看不见
        seenImg :require("@/assets/img/eye1.png"),//看得见密码
        pwdType:true,
        ishuoqu:true,
        imgCode:"",
        iswechat:isWeiXin()
	    }
	  },
      mounted(){
          
      },
	  methods:{
        onClickLeft(){
              this.$router.goBack()
            },
	  	 isMobile(e){
	  	 	var tels = tel(e) ;
	  	 	return tels
	  	 },
         otherlogins(e){
                window.WebViewJavascriptBridge.callHandler(
                                    'otherlogin'  
                                    , {
                                        'type':e
                                    }  //请求参数
                                    , function(responseData) { //回调数据接口
                                           
                                    }
                    );
         },
	  	 login:function(){
            var that=this;
            //that.model.telPhone="18657412082";
            if(that.model.telPhone==""){
            	Dialog.alert({
				  message:'请输入手机号码！'
				})
				return false
            }else if(!that.isMobile(that.model.telPhone)){
            	Dialog.alert({
				  message:'手机格式不对哦'
				})
				return false
            }else if(that.model.password==""){
                Dialog.alert({
				  message:'请输入密码！'
				})
				return false
            }
            var telPhone = that.model.telPhone;
            var password=''+md5(that.model.password);
            this.$http({
	            method:'post',
	            url:'/member/login',
            params:{
             	acc:telPhone,
                pwd:password,
                type:1,
            }}).then((j) => {
            	 if(j.data.code == 0){
            	 	var url = that.$route.query.redirect;
            	 	localStorage.setItem("token",j.data.data.token);
                    Toast.clear()
            	 	Dialog.alert({
					  message:j.data.msg
					}).then(() => {

					     that.$router.push(url || '/')
					});
            	 }else if(j.data.code == -802){
            	 	 $(".imgcodediv").show();
                     $("#captchaImg").attr("src",domain1+j.data.data.url);
                     if(that.imgCode!=""){
                     	Dialog.alert({
						  message:j.data.msg
						})
                    }
            	 }else{
            	 	Dialog.alert({
						  message:j.data.msg
						})
            	 } 
            })
       },
        yzmbtn:function(){
            var that=this;
            //that.model.telPhone="18657412082";
            if(that.model.telPhone==""){ 
            	Dialog.alert({
				  message:'请输入手机号码！'
				})
				return false
            }else if(!that.isMobile(that.model.telPhone)){
            	Dialog.alert({
				  message:'手机格式不对哦'
				})
				return false
            }
            if($(".imgcodediv").css("display")=="none"){
                that.getCode();
            }
            else{
                if(that.imgCode.length!=4)
                {
                    Dialog.alert({
				  		message: '图形验证码错误！'
					})
                }
                else{
                    that.getCode();
                }

            }
        },
        getCode:function(){
            var that=this;
            this.$http({
	            method:'post',
	            url:'/member/code2',
            	data:{
             	  mobile:that.model.telPhone,
                  captcha:that.imgCode,
                  service_id:8,
            }}).then((j) => {
            	if(!j){return false;}
            	if(j.data.code == -802){
                    $(".imgcodediv").show();
                    $("#captchaImg").attr("src",domain+j.data.data.url);
                    if(that.imgCode!=""){
                    	  Dialog.alert({
						  		message: j.data.msg
						  })
                    }
                    
              }
                else if(j.data.code==-801){
                   Dialog.alert({
						  message: j.data.msg
					})
                }
                else if(j.data.code==0){
                    var timer=setInterval(function(){
                        that.ishuoqu = false;
                        that.inittime--;
                       if(that.inittime<=0){
                        that.inittime=60;
                        that.ishuoqu = true;
                        clearInterval(timer);
                        }
                    },1000) 
                    Dialog.alert({
						  message: "验证码已成功发送至手机" + that.model.telPhone
					})
                }
                else{
                    Dialog.alert({
                          message: j.data.msg
                    }).then(() => {
                         that.imgCode='';
                         that.reCaptcha();
                    });
                }

            })
        },
         btn_quicklogin:function(){
           var that=this;
           if(that.model.telPhone==""){
            	Dialog.alert({
				  message:'请输入手机号码！'
				})
				return false
            }else if(!that.isMobile(that.model.telPhone)){
            	Dialog.alert({
				  message:'手机格式不对哦'
				})
				return false
            }
            if(that.code.length==0){
                 Dialog.alert({message: "请输入短信验证码"})
                 return false
            }
            if(that.code.length!=6){
                 Dialog.alert({message: "验证码不正确！"})
                 return false
            }
            
            this.$http({
	            method:'post',
	            url:'/member/login',
	            params:{
	             	  acc:that.model.telPhone,
	                  code:that.code,
	                  type:2,
	            }}).then((j) => {
	            	if(j.data.code==0){
                        var url = that.$route.query.redirect;
                        localStorage.setItem("token",j.data.data.token);
	            	 	Dialog.alert({
						  message:j.data.msg
						}).then(() => {
						    that.$router.push(url || '/')
						});
                    }else{
                        Dialog.alert({
						  message:j.data.msg
						})
                    }
            })      
        },
        getPwd:function(){
            this.$router.push({name:'getpwd'});
            // this.$router.push({name:'forgetpwd'});
           
        },
        reCaptcha(){
        	$("#captchaImg").attr('src',domain+'/wap/pub/code1?_='+Math.random());
        },
        pwdView(){
          var that=this;
          that.seen = !this.seen;
          that.pwdType=!this.pwdType
        }
	  }
}
</script>