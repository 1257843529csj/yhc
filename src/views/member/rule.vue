<template>
  <div class="box">
    <van-nav-bar
       :title='titles'
       fixed
       left-arrow
        @click-left="onClickLeft"
     >
    </van-nav-bar>
    <div class="xbox boxcon">
      <div class="ruleimg" style="width:100%">
         <img :src="rule_img" style="width:100%"/></div>
      </div>
    </div>
    </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      titles:"",
      rule_num:"",
      rule_img:""
    }
  },

  mounted() {
    this.rule_num = this.$route.query.rule;
    
    if(this.rule_num == 1){
       this.titles = "观影通使用规则";
       this.rule_img = require('../../assets/img/card.jpg')
    }else if(this.rule_num == 2){
       this.titles = "兑换券使用规则"
       this.rule_img = require('../../assets/img/quan.jpg')
    }else if(this.rule_num == 3){
      this.titles = "红包使用规则"
      this.rule_img = require('../../assets/img/hb.jpg')
    }
  },

  methods: {
    onClickLeft(){
          this.$router.goBack()
    }
  }
};
</script>

