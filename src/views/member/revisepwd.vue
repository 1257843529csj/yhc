<template>
  <div class="box">
    <van-nav-bar
      :title='title'
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="login_box">
        <div class="box">
            <div class="inputs">
                <span class="passimg"></span>
                <span class="inputcon">
                    <input type="text" v-model="model.pwdOld" class="pwd" v-if="!pwdType" placeholder="请输入旧密码">
                    <input  type="password" placeholder="请输入旧密码" class="pwd" v-model="model.pwdOld" v-if="pwdType">
                    <img :src="seen ? unseenImg : seenImg" class="eye" @click="pwdView">
                </span>
            </div>
            <div class="inputs">
            <span class="passimg"></span>
            <span>
                <input type="text" placeholder="请输入新密码（6-20个数字和字母组合的字符）" v-model="model.pwd" class="pwd" v-if="!confirmpwdType">
                <input  type="password" placeholder="请输入新密码（6-20个数字和字母组合的字符）" class="pwd" v-model="model.pwd" v-if="confirmpwdType">
                <img :src="conseen ? unseenImg : seenImg" class="eye" @click="conPwdView">
            </span>
        </div>
    </div>   
    <div class="next" @click="finish">确认修改</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import md5 from 'js-md5'
export default {
  data() {
    return {
        model:{
            pwdOld:"",
            pwd:"",
        },
        title:"修改密码",
        seen:"",
        unseenImg:require("@/assets/img/eye2.png"),//看不见
        seenImg :require("@/assets/img/eye1.png"),//看得见密码
        conseen:"",
        pwdType:true,
        confirmpwdType:true
       
    };
  },

  mounted() {
    var that=this;
    that.phone=this.$route.query.phone;
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
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
    finish:function(){
        var that=this;
        if(that.model.pwdOld==""){
            this.$dialog.alert({
                message:'请输入旧密码！'
            })
            return false;
        }
        if(that.model.pwd==""){
            this.$dialog.alert({
                message:'请输入新密码！'
            })
            return false;
        }
        if(that.model.pwd.length<6 || that.model.pwdOld.length>20){
            this.$dialog.alert({
                message:'请输入6-20个字符！'
            })
            return false;
        }
        if (/^\d+$/.test(that.model.pwd)) {
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        if (/^[a-z]+$/i.test(that.model.pwd)) {
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        if(!( /^[A-Za-z0-9]+$/.test(that.model.pwd))){
            this.$dialog.alert({
                message:'请输入字母与数字的组合密码！'
            })
            return false;
        }
        else{
            var pwd1=''+md5(that.model.pwdOld);
            var pwd2=''+md5(that.model.pwd);
            var data={
                pwdOld:pwd1,
                pwd:pwd2,
            };
            this.$http.post('/member/pwdedit',data).then((j) => {
                if(j.data.code==0){
                    this.$dialog.alert({
                        message:j.data.msg
                    }).then(() => {
                      // on close
                      this.$router.push({name:'infobox'});
                    });
                }
                else{
                    this.$dialog.alert({
                        message:j.data.msg
                    })
                }

            })
        }

    }
    
}
};
</script>

