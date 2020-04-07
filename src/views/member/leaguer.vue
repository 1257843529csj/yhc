<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="leaguar-txt boxcon">
        <h2>影火虫会员简介</h2>
        <span>影火虫会员等级目前分为四个级别：跑龙套、群众演员、最佳主角、神秘巨星；等级由经验值决定，经验值越高，等级越高。</span>
    </div>
    <div class="leaguar-dj">
        <h2>影火虫会员等级说明</h2>
        <img src="../../assets/img/hydj.png">
    </div>
    <div class="leaguar-jy">
        <h2>影火虫会员名称来源</h2>
        <table>
          <thead>
              <tr>
                  <td width="30%">会员名称</td>
                  <td width="25%">等级</td>
                  <td width="45%">说明</td>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td width="30%">跑龙套</td>
                  <td width="25%">V1</td>
                  <td width="45%">你可以说我是跑龙套的，但是你不可以说我是“死跑龙套的”！——《喜剧之王》</td>
              </tr>
              <tr>
                  <td width="30%">群众演员</td>
                  <td width="25%">V2</td>
                  <td width="45%" style="text-align: left;">虽然你们是扮演路人甲乙丙丁，但是一样是有生命没有灵魂的。 ——《喜剧之王》</td>
              </tr>
              <tr>
                  <td width="30%">最佳主角</td>
                  <td width="25%">V3</td>
                  <td width="45%" style="text-align: left;">你可以夺走我的房子、我所有的把戏和玩具，但有一样你是夺不走的……我就是钢铁侠。 ——《钢铁侠》</td>
              </tr>
              <tr>
                  <td width="30%">神秘巨星</td>
                  <td width="25%">V4</td>
                  <td width="45%">在我这里没有另外百分之五十，我赢了！ ——《战狼》</td>
              </tr>
          </tbody>
        </table>
      
    </div>
</div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
        title:"会员说明",
       
    };
  },

  mounted() {
    var that=this;
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
      
  }
};
</script>

