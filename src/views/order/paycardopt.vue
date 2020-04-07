<template>
	<div class="box">
		<van-nav-bar
	      title="卡充值"
	      left-arrow
	      @click-left="onClickLeft"
	      fixed
	    />
	    <div class="money_paycard">
	      <div class="money_ico"><img src="../../assets/img/cz.png"></div>
	      <div class="money_txt">¥{{pay_amount/100}}</div>
	    </div>
	    <div class="select_pay">
			<ul>
				<li v-for="plist in paylist" :data-id="plist.type" v-model="payact" :class="payact ==  plist.type ? 'cur':'' " @click="payclick(plist.type)">
					<div class="s_p_l">
						<em><img :src="plist.icon"></em>
						<div class="text_pay"><p>{{plist.title}}</p></div>
					</div>
					<div class="s_p_r"><i></i></div>
				</li>
			</ul>
	    </div>
	    <div id="gch" class="sub" @click="qrpay">确认支付&nbsp;<em>¥{{pay_amount_showtxt/100}}</em></div>
	</div>
</template>
<script type="text/javascript">	
	import { Toast } from 'vant';
	import wx from 'weixin-js-sdk'
	export default {
		data() {
		    return{
		    	cardid:"",
		    	num:"",
		    	amount:"",
		    	paylist:[],
		    	pay_amount_showtxt:"",
		    	pay_amount:"",
		    	paytype:"",
		    	payact:0
		    }
		 },
		mounted() {
			this.cardid = this.$route.query.cardId;
			this.num = this.$route.query.num;
			this.amount = this.$route.query.amount;
			this.getpaydata();
		},
		methods:{
			onClickLeft(){
		      this.$router.goBack()
		    },
		    getpaydata(){
		    	this.$http({
			        methods: "post",
			        url: "/charge/cardChargeOption",
			        params:{
			        	cardId:this.cardid,
			        	num:this.num,
			        	amount:this.amount
			        },
			        }).then(j => {
			        	if(!j){return false}
			       		 this.paylist = j.data.data.chargeOption;
			       		 if(this.num !=""){
			       		 	this.pay_amount = j.data.data.amount;
			       		 	this.pay_amount_showtxt = j.data.data.pay_amount
			       		 }else{
			       		 	this.pay_amount = j.data.data.amount*100;
			       		 	this.pay_amount_showtxt = j.data.data.pay_amount*100
			       		 }
			        })

		    },
		    payclick(e){
		    	this.payact = e
		    },
		    qrpay(){
		    	 if(this.payact == 0){
		    	 	Toast("请选择支付类型");
		    	 	return false;
		    	 }
		    	 this.$http({
			        methods: "post",
			        url: "/charge/cardChargePay",
			        params:{
			        	optionId:"400000",
			        	cardId:this.cardid,
			        	amount:this.pay_amount/100,
			        	num:this.num,
			        	payType:this.payact
			        },
			        }).then(j => {
			        	if(!j){return false}
			       		if(j.data.data.payment_info.url != ""){
			       			console.log(j.data.data.payment_info.url)
			       			window.location.href = j.data.data.payment_info.url
			       		}else{  
								wx.chooseWXPay({
								  timestamp:j.data.data.payment_info.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
								  nonceStr: j.data.data.payment_info.data.nonceStr, // 支付签名随机串，不长于 32 位
								  package: j.data.data.payment_info.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
								  signType: j.data.data.payment_info.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								  paySign: j.data.data.payment_info.data.paySign, // 支付签名
								  success: function (res) {
								     console.log(res)
								  }
								});
			       		}
			        })

		    }
		}

	}
</script>