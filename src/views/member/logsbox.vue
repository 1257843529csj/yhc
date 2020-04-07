<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="qd">
        <img src="../../assets/img/money.png" alt="">
    </div>
    <div class="money_txt">我的余额</div>
    <div class="money_m">¥{{money.rmb}}</div>
  </div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
        title:"我的账户",
        money:0,
       
    };
  },

  mounted() {
    var that=this;
    that.getMoney();
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getMoney:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/charge/logs",
        }).then(j => {
            that.money=j.data.data;
        }) 

    },
      
  }
};
</script>

