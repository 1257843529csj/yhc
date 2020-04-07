<template>
	<div class="box">
		<van-nav-bar title="订单确认" fixed :z-index="999" @click-left="goback" left-arrow/>
		<div class="payend_time boxcon">
			剩余支付时间：<em>{{minute}}分{{second}}秒</em>
		</div>
		<div class="confirm_minfo">
		    <p>{{orderinfo.movie_title}}</p>
		    <p>{{orderinfo.cinema_name}}</p>
		    <p>{{orderinfo.plan_date}}&nbsp;（{{orderinfo.plan_versionsFormat}})</p>
		    <p>{{orderinfo.hall_name}}&nbsp;&nbsp;<em v-for="z in orderinfo.seats">{{z}}</em></p>
		</div>
		<div class="confirm_minfo_line"></div>
		<div class="duanxin">
			接收短信：<input id="tel" name="tel" disabled="" type="text" maxlength="13" :value="orderinfo.mobile">
		</div>
		<div class="confirm_minfo_line"></div>
		<div class="jiage">
    		<ul>
        	<li><span>总票价</span><span>{{orderinfo.extraFee}} <font style="font-size:.32rem;">¥{{orderinfo.total_fee}}</font></span></li>
 			<li class="fixs">
 				<span style="color:#f45e54">
 					<i class="iconfont buke"></i>该场次不支持改签</span>
 					<span style="color:#333; font-size:.3rem">应付总额：
 					<i style="color:#f45e54">¥</i>
 					<font style="color:#f45e54; font-size:.4rem;">{{orderinfo.total_fee}}</font>
            	</span>
       		 </li>
    		</ul>
		</div>
		<div class="confirm_minfo_line"></div>
		<div class="ref-box" v-if="orderinfo.refundTipShow">
		  <h3>退改签须知</h3>
		  <div class="alert-style1">
		    <p>1.您所购买的场次不支持改签！系统出票后将无法进行改签操作！</p>
		    <p>2.符合退票条件可退票：未取票且在电影开场2小时前，可联系客服退票（仅限整笔订单退票）。</p>
		    <p class="red">3.特别提醒：电影开场前2小时内不允许退票；已享受营销活动等优惠价格不允许退票。</p>
		    </div>
		</div>
		<div id="subBtn" href="#" class="fukuan" @click="gotopay">立即购票</div>
	</div>
</template>
<script type="text/javascript">
import Dialog  from 'vant'
	export default {
		data(){
			return{
				orderid:"",
				orderinfo:"",
				second:"",
				minute:""
			}
		},
		mounted() {
			this.getorededata()
		},
		watch: {
	      second: {
	        handler (newVal) {
	          this.num(newVal)
	        }
	      },
	      minute: {
	        handler (newVal) {
	          this.num(newVal)
	        }
	      }
	  	},
		methods:{
			 goback(){
			 	this.$router.goBack()
			 },
		      num(n) {
		        return n < 10 ? '0' + n : '' + n
		      },
		       timer () {
		        var _this = this
		        var time = window.setInterval(function () {
		          if (_this.second === 0 && _this.minute !== 0) {
		            _this.second = 59
		            _this.minute -= 1
		          } else if (_this.minute === 0 && _this.second === 0) {
		            _this.second = 0
		            window.clearInterval(time);
		            Dialog.alert({
					  message: '支付时间超时,请重新选座'
					}).then(() => {
					  	this.$router.go(-2); 
					});
		          } else {
		            _this.second -= 1
		          }
		        }, 1000)
		      },
			getorededata(){
				this.orderid=this.$route.query.orderId;
				this.$http({
	            method:'post',
	            url:'/order/confirm',
	            data:{
	              orderId:this.orderid
            	}
        		}).then((j) => {
        			this.orderinfo = j.data.data;
        			var maxtime = this.orderinfo.order_pay_time_left;
        			this.minute = Math.floor(maxtime / 60);
        			this.second = Math.floor(maxtime % 60);
        			this.timer()
        		})	
			},
			gotopay(){
				this.$router.push({name:'optionspay',query:{orderId:this.orderid}});
			}
		}
	}
</script>