<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      title='绑定手机号'
      left-arrow
      fixed
      @click-left="goback" 
    />
    <div class="xbox boxcon">
        <div class="other_faces">
          <img :src="faceimg">
        </div>
        <p class="other_name">{{other_name}}</p>
        <van-cell-group>
        <van-field
          v-model="phone"
          type="tel"
          label="手机号"
          placeholder="请输入手机号码"
        />
        <van-field
            v-model="sms"
            center
            clearable
            label="短信验证码"
            placeholder="请输入短信验证码"
          >
          <van-button slot="button" size="small" type="primary" @click="yzmbtn" v-if="ishuoqu">发送验证码</van-button>
          <van-button slot="button" size="small" type="primary"  v-else="ishuoqu">{{inittime}}s</van-button>
        </van-field>
        </van-cell-group>
    </div>
    <div class="next" @click="btn_quicklogin">绑定账号</div>
</div>
</template>
<script type="text/javascript">
// import $ from 'jquery';
import { tel,isWeiXin } from '@/assets/js/date.js';
import { Field,Dialog} from 'vant';
export default {
  data() {
    return {
     faceimg:"",
     other_name:"",
     phone:"",
     sms:"",
     other_token:"",
     inittime:60,
     ishuoqu:true,
     objdatas:""
    }
  },

  mounted() {
    this.faceimg = this.$route.query.faceurl;
    this.other_name = this.$route.query.usenames;
    this.other_token = this.$route.query.token_3;
    this.objdatas = this.$route.query.obgdata;
    this.logintype = this.$route.query.logintype
  },

  methods: {
    goback(){
      this.$router.goBack()
    },
    isMobile(e){
        var tels = tel(e) ;
        return tels
       },
    yzmbtn(){
        if(this.phone==""){ 
              Dialog.alert({
          message:'请输入手机号码！'
        })
        return false
        }else if(!this.isMobile(this.phone)){
              Dialog.alert({
                message:'请输入正确的手机格式'
              })
              return false
            }
            this.getCode();
     },
      getCode(){
            var that=this;
            this.$http({
              method:'post',
              url:'/member/code2',
              data:{
                  mobile:this.phone,
                  service_id:5,
            }}).then((j) => {
                 if(!j){return false;}
                 if(j.data.code == -802 || j.data.code == -801){
                          Dialog.alert({
                          message: j.data.msg
                      })
                 }else{
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
                        message: "验证码已成功发送至手机" + that.phone
                    })
                 }
            })
      },
      btn_quicklogin(){
        var that = this;
        if(that.phone==""){
              Dialog.alert({
              message:'请输入手机号码！'
            })
            return false
            }else if(!that.isMobile(that.phone)){
                    Dialog.alert({
                message:'请输入正确的手机格式'
              })
              return false
            }
              this.$http({
                    method:'post',
                    url:'/member/login3bindmobile',
                    data:{
                            token:that.other_token,
                            mobile:that.phone,
                            code:that.sms
                      }}).then((j) => {
                          if(!j){return false}
                          //alert(j.data.data.token)
                          var url = that.$route.query.redirect;
                          localStorage.setItem("token",j.data.data.token);
                          that.$router.push(url || '/')
                      }) 
      }
  }
};
</script>
<style type="text/css" scoped>
   .other_faces{width: 2rem; height: 2rem;margin: 0 auto; padding:  1.5rem 0 0.5rem 0}
   .other_faces img{ width: 2rem; height: 2rem; border-radius: 50%; overflow: hidden;  }
   .other_name{font-size: .36rem; text-align: center; margin-bottom: 0.5rem;}
</style>
