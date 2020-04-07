<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="waytitle">
        <span>为了保障你的账户安全</span>
        <span>进行操作前需验证身份</span>
    </div>
    <div class="waycon">
        <span class="waycon-tip">请选择一种验证方式</span>
        <div class="waycon-detail">
            <div @click="yanPwd">
                <img src="../../assets/img/yan1.png">
                <p>
                    <span class="wphone">********</span>
                    <span>通过旧密码验证身份</span> 
                </p>
                <em>></em>
            </div>
            <div @click="yancode">
                <img src="../../assets/img/yan1.png">
                <p>
                    <span class="wphone">{{phone}}</span>
                    <span>通过手机验证码验证身份</span> 
                </p>
                <em>></em>
            </div>
        </div>
    </div>
    <div class="wayaboutus">
        <span>若无法解决</span>
        <a href="tel:400-966-5002">请拨打客服电话<font>400-966-5002</font></a>
        
    </div>
  </div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
        title:"修改方式",
        phone:'',
       
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
    yanPwd(){
        this.$router.push({name:'revisepwd'});
    },
    yancode(){
        this.$router.push({name:'revisecode'});

      
    },
    }
};
</script>

