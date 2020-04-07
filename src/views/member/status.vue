<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      title='出票中'
      fixed
    />
    <div class="xbox boxcon chupiaos">
      <div class="content">
        <div class="ts">取票码会以短信形式发送，也可在我的订单中查看</div>
        <div class="ticket">
        <div class="titlez">福州中影星汇电影城</div>
          <div class="ticket_detail">
            <h3>
            叶问4：完结篇(2张)</h3>
            <p>福州中影星汇电影城&nbsp;&nbsp; 3号厅</p>
            <p style="color:#f56430">12月31日 周二 13:40 </p>
            <p class="safa">7排12座&nbsp;&nbsp;7排13座 </p>
                </div>
          <div class="chupiao"><img src="../../assets/img/ticket.gif"></div>
          <div class="loading"><p>正在出票...</p>
          <p>预计1-15分钟内出票，若遇到影院系统异常导致出 票失败，系统将自动为您退款</p>
      </div>
</div>

<a href="http://m.yz.ffw.com.cn/activity/register/verify?c=dXN5ZGYqNg==&amp;s=in&amp;f=2" style="display: block; height: 100px; margin: .2rem .2rem 0 .2rem;"><img style="max-width: 100%;" src="/static/tmp/yuezu.gif" alt=""></a>

<div class="freshen" onclick="location.href='/wap/order/all'">查看订单</div>
</div>
    </div>
    </div>
</template>
<script type="text/javascript">
// import $ from 'jquery';
import { tel,isWeiXin } from '@/assets/js/date.js';
import { Field,Dialog} from 'vant';
export default {
  data() {
    return {
    
    }
  },

  mounted() {
   
  },

  methods: {
    
  }
};
</script>
<style type="text/css" scoped>
.chupiaos .ts {
  width:6.4rem;
  margin: 0 auto;
  overflow:hidden;
  color:#f66304;
  font-size:.24rem;
  text-align:center;
  padding:.2rem 0;
  background:#fff2d0;
}
.chupiaos .ticket {
  width:6rem;
  margin:.2rem auto 0;
  background:#fff;
  padding:0 0 .3rem ;
  
}
.chupiaos  .titlez{ font-size:.26rem; color:#666666; padding:.2rem 0 ;  margin:0 .2rem; border-bottom:1px #eee solid;}

.chupiaos  .ticket_detail {
padding:0 .2rem .2rem;
  background:#fff;
  border-bottom:1px #eee solid;
  
}
.ticket_detail h3 {
    color: #333333;
    font-size: .32rem;
    font-weight: normal;
    padding: .2rem 0;
}
.ticket_detail p {
    line-height: 25px;
    font-size: .26rem;
    color: #666666;
}
.loading p:last-child {
    font-size: .26rem;
    color: #999999;
    text-align: left;
    margin-top: .2rem;
    line-height: .35rem;
}
.loading {
    color: #333333;
    font-size: .32rem;
    text-align: center;
    padding: 0 .65rem;
}
.chupiao{  width:1.95rem; height:1.95rem; margin:0 auto; padding:.2rem 0;  }
.chupiao img{ width:1.95rem; height:1.95rem;}
.freshen {
    width: 6rem;
    height: .84rem;
    background: #ff9a00;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    color: #FFF;
    text-align: center;
    line-height: .84rem;
    margin: .3rem auto;
}

</style>
