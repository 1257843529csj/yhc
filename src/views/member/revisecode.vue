<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="revise-phone">
        <span>验证码将发送至手机{{fn(phone)}}</span>
    </div>
    <!--  手机验证码登录 -->
    <div class="login-yzm">
        <div class="login_box">
            <!-- <h3></h3> -->
            <div class="box_code">
                <div class="inputs imgcodediv inputs2" style="display: block;">
                    <span class="imgcode">
                    </span>
                    <span class="inputcon">
                        <p>
                            <input type="tel" placeholder="请输入图形验证码" id="captcha" class="dd" v-model="imgCode">
                        </p>
                    
                        <p style="width: auto;margin-left: 1rem;">
                             <img id="captchaImg" @click="reCaptcha" src="/wap/pub/code1">
                        </p>
                    </span>
                </div>
                <div class="inputs inputs2">
                    <span class="passimg"></span>
                    <span style="position:relative;" class="inputcon">
                        <a class="huoqu" href="#"  v-if="ishuoqu" @click="yzmbtn">获取验证码</a>
                        <a class="huoqu" v-else >{{inittime}}s</a>
                        <input  type="tel" placeholder="请输入手机验证码"  class="dd" v-model="code">
                    </span>
                </div>
                <div class="inputs inputs2">
                    <span class="passimg"></span>
                    <span>
                        <input type="text" v-model="pwd" class="pwd" v-if="!pwdType" placeholder="请输入密码（6-20个数字和字母组合的字符）">
                        <input  type="password" placeholder="请输入密码（6-20个数字和字母组合的字符）" class="pwd" v-model="pwd" v-if="pwdType">
                        <img :src="seen ? unseenImg : seenImg" class="eye" @click="pwdView">
                    </span>
                </div>
            </div>
        </div>   
        <div class="next" @click="revise">确认修改</div>
        </div> 
    </div>
  </div>
</template>
<script type="text/javascript">
import md5 from 'js-md5'
import $ from 'jquery';
export default {
  data() {
    return {
        title:"修改密码",
        pwd:"",
        inittime:60,
        code:"",
        imgCode:"",
        ishuoqu:true,
        msgcode:"",
        confirmpwdType:true,
        unseenImg:require("@/assets/img/eye2.png"),//看不见
        seenImg :require("@/assets/img/eye1.png"),//看得见密码
        conseen:"",
        pwdType:true,
        seen:"",
        phone:"",
       
       
    };
  },

  mounted() {
    var that=this;
    that.getPhone()
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    fn(phone2) {
        if(phone2){
          var phone = phone2.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
          return phone;
        }
    },
    getPhone:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/member/info",
        }).then(j => {
            that.phone=j.data.data.mobile;
        })
    },
    pwdView:function(){
        var that=this;
        that.seen = !this.seen;
        that.pwdType=!this.pwdType;
    },
    conPwdView:function(){
        var that=this;
        that.conseen = !this.conseen;
        that.confirmpwdType=!this.confirmpwdType;
    },
    yzmbtn:function(){
        var that=this;
        if(that.imgCode.length==0)
        {
            this.$dialog.alert({
                message:'请输入图形验证码！'
            })
        }
        else{
            that.getCode();
        }
    },
    getCode:function(){
        var that=this;
        var data={
                mobile:that.phone,
                captcha:that.imgCode,
                service_id:3,
            };
        this.$http.post('/member/code1',data).then((j) => {
            if(j.data.code==-1){
                this.$dialog.alert({
                    message:j.data.msg
                }).then(() => {
                     that.imgCode='';
                     that.reCaptcha();
                });
            }
            else{
                var timer=setInterval(function(){
                    that.ishuoqu = false;
                    that.inittime--;
                   if(that.inittime<=0){
                    that.inittime=60; 
                    that.ishuoqu = true;
                    clearInterval(timer);
                    }
                },1000) 
                that.msgcode=j.data.data;
                this.$dialog.alert({
                    message:'验证码已成功发送至手机'+ that.phone
                })

            }

        })

    },
    reCaptcha:function() {
        $("#captchaImg").attr('src', '/wap/pub/code1?_=' + Math.random());
    },
    revise:function(){
        var that=this;
        if(that.imgCode.length==0)
        {
            this.$dialog.alert({
                message:'请输入图形验证码！'
            })
            return false;
        }
        if(that.code.length==0){
            this.$dialog.alert({
                message:'请输入短信验证码！'
            })
            return false;
        }
        if(that.code.length!=6){
            this.$dialog.alert({
                message:'验证码不正确！'
            })
            return false;
        }
        
        if(that.pwd==""){
        this.$dialog.alert({
            message:'请输入密码！'
        })
        return false;
        }
        if(that.pwd.length<6 || that.pwd.length>20){
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        if (/^\d+$/.test(that.pwd)) {
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        if (/^[a-z]+$/i.test(that.pwd)) {
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        if(!( /^[A-Za-z0-9]+$/.test(that.pwd))){
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        else{
            var data={
                //mobile:that.telPhone,
                code:that.code,
                pwd:''+md5(that.pwd),
            }
            this.$http.post('/member/pwdedit2',data).then((j) => {
                if(j.data.code==0){
                    this.$dialog.alert({
                        message:j.data.msg
                    }).then(() => {
                      // on close
                      this.$router.push({name:'infobox'});
                    });  
                }else{
                    this.$dialog.alert({
                        message:j.data.msg
                    });
                }                   
            })
        }
    }
    
}
};
</script>

