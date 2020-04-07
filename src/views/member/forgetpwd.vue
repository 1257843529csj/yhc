<template>
  <div class="box">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="login_box">
        <div class="box">
            <div class="inputs">
                <span class="passimg"></span>
                <span>
                    <input type="text" v-model="model.newpwd" class="pwd" v-if="!pwdType" placeholder="新密码（6-20个数字和字母组合的字符）">
                    <input  type="password" placeholder="新密码（6-20个数字和字母组合的字符）" class="pwd" v-model="model.newpwd" v-if="pwdType">
                    <img :src="seen ? unseenImg : seenImg" class="eye" @click="pwdView">
                </span>
            </div>
            <div class="inputs">
            <span class="passimg"></span>
            <span>
                <input type="text" placeholder="确认新密码" v-model="model.confirmpwd" class="pwd" v-if="!confirmpwdType">
                <input  type="password" placeholder="确认新密码" class="pwd" v-model="model.confirmpwd" v-if="confirmpwdType">
                <img :src="conseen ? unseenImg : seenImg" class="eye" @click="conPwdView">
            </span>
        </div>
    </div>   
    <div class="next" @click="finish">完成</div>
    </div>
  </div>
</template>
<script type="text/javascript">
import md5 from 'js-md5'
export default {
  data() {
    return {
        title:"找回密码",
        model:{
            newpwd:"",
            confirmpwd:"",
        },
        seen:"",
        unseenImg:require("@/assets/img/eye2.png"),//看不见
        seenImg :require("@/assets/img/eye1.png"),//看得见密码
        conseen:"",
        pwdType:true,
        confirmpwdType:true
       
    };
  },

  mounted() {
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    pwdView:function(){
        var that=this;
        that.seen = !this.seen;
        that.pwdType=!this.pwdType
    },
    conPwdView:function(){
        var that=this;
        that.conseen = !this.conseen;
        that.confirmpwdType=!this.confirmpwdType
    },
    finish:function(){
        var that=this;
        if(that.model.newpwd==""){
            this.$dialog.alert({
              message: '请输入新密码！'
            });
            return false;
        }
        if(that.model.newpwd.length<6 || that.model.newpwd.length>20){
            this.$dialog.alert({
              message: '您的密码不足6字符，请重新输入！'
            });
            return false;
        }
        if(that.model.newpwd.length>20){
            this.$dialog.alert({
              message: '您的密码不足6字符，请重新输入！'
            });
            return false;
        }
        if (/^\d+$/.test(that.model.newpwd)) {
            this.$dialog.alert({
              message: '请输入字母与数字的组合密码！'
            });
            return false;
        }
        if (/^[a-z]+$/i.test(that.model.newpwd)) {
            this.$dialog.alert({
              message: '请输入字母与数字的组合密码！'
            });
            return false;
        }
        if(!( /^[A-Za-z0-9]+$/.test(that.model.newpwd))){
            this.$dialog.alert({
              message: '请输入字母与数字的组合密码！'
            });
            return false;
        }
        if(that.model.confirmpwd==""){
            this.$dialog.alert({
              message: '请输入确认密码！'
            });
            return false;
        }
        if(that.model.confirmpwd.length<6){
            this.$dialog.alert({
              message: '您的密码不足6字符，请重新输入！'
            });
            return false;
        }
        if(that.model.newpwd.length>20){
            this.$dialog.alert({
              message: '您的密码超过20字符，请重新输入！'
            });
            return false;
        }
        if (/^\d+$/.test(that.model.confirmpwd)) {
            this.$dialog.alert({
              message: '请输入字母与数字的组合密码！'
            });
            return false;
        }
        if (/^[a-z]+$/i.test(that.model.confirmpwd)) {
            this.$dialog.alert({
              message: '请输入字母与数字的组合密码！'
            });
            return false;
        }
        if(!( /^[A-Za-z0-9]+$/.test(that.model.confirmpwd))){
            this.$dialog.alert({
              message: '请输入字母与数字的组合密码！'
            });
            return false;
        }
        if(that.model.newpwd==that.model.confirmpwd){
            var pwd1=''+md5(that.model.newpwd);
            var pwd2=''+md5(that.model.confirmpwd);
            var data={
                pwd1:pwd1,
                pwd2:pwd2,
            };
            this.$http.post('/member/pwdReset2',data).then((j) => {
                if(j.data.code==0){
                    this.$dialog.alert({
                      message: j.data.msg
                    }).then(() => {
                        that.$router.push({name:'login'})
                    });
                    /*return false; */
                }

            })
        }
        else{
            this.$dialog.alert({
              message: '两次密码不一致，请重新输入！'
            });
            return false;

        }

    }
}
};
</script>

