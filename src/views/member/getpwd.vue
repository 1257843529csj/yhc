<template>
  <div class="box">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <!--  手机验证码登录 -->
    <div class="login-yzm">
        <div class="login_box">
            <!-- <h3></h3> -->
            <div class="box">
                <div class="inputs">
                    <span class="phoneimg"></span>
                    <span class="inputcon">
                        <input  type="tel" placeholder="请输入手机号码" v-model="telPhone" class="dd" maxlength="11">
                    </span>
                </div>
                <div class="inputs" v-if="isimgcode">
                    <span class="imgcode">
                    </span>
                    <span class="inputcon">
                        <p>
                            <input type="tel" placeholder="请输入图形验证码" id="captcha" class="dd" v-model="imgCode">
                        </p>
                        <p style="width: auto;margin-left: 1rem;">
                            <img id="captchaImg" @click="reCaptcha" :src="imgTipe">
                        </p>
                    </span>
                    
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
        <div class="next" @click="getPwd">下一步</div>
        </div> 
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
        title:"找回密码",
        telPhone:"",
        inittime:60,
        code:"",
        imgCode:"",
        ishuoqu:true,
        msgcode:"",
        isimgcode:false,
        imgTipe:"",
       
    };
  },

  mounted() {
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    yzmbtn:function(){
        var that=this;
        if(that.telPhone==""){
            this.$dialog.alert({
              message: '请输入手机号码！'
            });
            return false;
        }
        if (!that.isMobile(that.telPhone)) {
            this.$dialog.alert({
              message: '手机号格式不对哦！'
            });
            return false;
        }
        if(!that.isimgcode){
            console.log(1)
            that.getCode();
        }
        else{
            if(that.imgCode.length!=4)
            {
                this.$dialog.alert({
                  message: '图形验证码错误！'
                });
            }
            else{
                that.getCode();
            }

        }
    },
    getCode:function(){
        var that=this;
        var data={
                mobile:that.telPhone,
                captcha:that.imgCode,
                service_id:3,
            };
        this.$http.post('/member/code2',data).then((j) => {
            if(j.data.code==-802){
                that.isimgcode=true;
                that.imgTipe=j.data.data.url;
                if(that.imgCode!=""){
                    this.$dialog.alert({
                      message: j.data.msg
                    });
                }
            }
            else if(j.data.code==-801){
                this.$dialog.alert({
                  message: j.data.msg
                });
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
                that.msgcode=j.data.data;
                this.$dialog.alert({
                  message: '验证码已成功发送至手机'+that.telPhone
                });
            }
            else{
                this.$dialog.alert({
                      message: j.data.msg
                }).then(() => {
                     that.imgCode='';
                     that.reCaptcha();
                });
            }

        })

    },
    reCaptcha:function() {
        var that=this;
        that.imgTipe='/wap/pub/code1?_=' + Math.random();
    },
    getPwd:function(){
        var that=this;
       if(that.telPhone==""){
            this.$dialog.alert({
              message: '请输入手机号码！'
            });
          return false;
        }
        if (!that.isMobile(that.telPhone)) {
            this.$dialog.alert({
              message: '手机号格式不对哦！'
            });
            return false;
        }
        if(that.code.length==0){
            this.$dialog.alert({
              message: '请输入短信验证码！'
            });
            return false;
        }
        if(that.code.length!=6){
            this.$dialog.alert({
              message: '验证码不正确！'
            });
            return false;
        }
        
        else{
            var data={
                mobile:that.telPhone,
                code:that.code,
            }
            this.$http.post('/member/pwdReset',data).then((j) => {
                if(j.data.code==0){
                    this.$router.push({name:'forgetpwd'});
                }else{
                    this.$dialog.alert({
                      message: j.data.msg
                    });

                }
                
            })
        }
    },
    isMobile(mobile){
        return /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^18\d{9}$)|(^19\d{9}$)|(^17\d{9}$)/.test(mobile);
    }
}
};
</script>

