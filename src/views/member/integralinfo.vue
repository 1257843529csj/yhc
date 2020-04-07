<template>
  <div class="box">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="express-bg"></div>
    <div class="express_title">
        <em>.</em>
        <span>活动规则</span>
    </div>
    <div class="express_con">
        <span>一、兑换比例：1点=0.75积分</span>
        <span>二、积分兑换规则：</span>
        <span>（1）可选择多张点卡点数合并一起兑换积分</span>
        <span>（2）可将一张点卡点数全部兑换成积分</span>
        <span>（3）可自定义点卡点数兑换成积分</span>
        <span>三、使用渠道：影火虫会员商城</span>
        <span>四、消费场景：如话费充值等</span>
        <span>五、客户服务：相关解释权归影火虫平台，如有疑问，请咨询客服400-966-5002</span>
        
    </div>
    <a @click="goExchange" class="expressbtn">马上去兑换</a>
   
  </div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
        title:"活动详情",
       
    };
  },

  mounted() {
    var that=this;
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    goExchange(){ 
        this.$router.push({name:'cardexchange'});

    }
      
  }
};
</script>

