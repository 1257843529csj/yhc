<template>
	<div class="box">
		<van-nav-bar title="确认支付" fixed :z-index="999" @click-left="goback" left-arrow/>
		<div class="payend_time boxcon">
			剩余支付时间：<em>{{minute}}分{{second}}秒</em>
		</div>
		<div class="youhui">
		    <p class="f26">
		    	<span id="cp-txt">{{toptext}}</span> 
		    	<em id="cp-st" v-if="toptext != '请选择卡券/红包支付'" @click="cancel"><img src="../../assets/img/qx1.png"></em>
		    </p>
		    <ul>
		        <li tindex="card" id="kaTri" @click="Use">
		        	<p>观影通</p>
		        	<i class="yh_num">{{payinfo.canUseCardNum}}</i>
		        </li>
		        <li tindex="quan" id="quanTri" @click="quanopen">
		            <p>兑换券</p>
		            <i class="yh_num">{{payinfo.canUseQuanNum}}</i>
		        </li>
		        <li tindex="hongbao" id="hongbaoTri" @click="hongbaoop">
		           <p>红包</p>
		           <i class="yh_num">{{payinfo.canUseNum}}</i>
		        </li>
		    </ul>
		</div>
		<div class="confirm_minfo_line"></div>
		<!-- <div>{{checkpays}}</div> -->
		<div class="select_pay">
			<ul>
				<li @click="paytype($event)" :class="paytypes ==  -1 ? 'cur':'' " data-id="-1" data-index="-1" v-model="paytypes">
				<div class="s_p_l">
						<em><img src="../../assets/img/account.png"></em>
						 <div class="text_pay">
						 	<p>可用余额：<em style="color: #ff9a00">¥ {{payinfo.rmb}}</em></p>
						 </div>
					</div>
					<div class="s_p_r" v-if="showbalance">
						<i></i>
					</div>	
				</li>
				<li v-for="(pay,index) in payinfo.payOptions" @click="paytype($event)" :class="paytypes ==  index ? 'cur':'' " v-model="paytypes" :data-id="pay.type" :data-cat="pay.cat" :data-type="pay.title" :data-index="index">
					<div class="s_p_l">
						<em :class="pay.title == '手机pay'? 'mpays':''"><img :src="pay.icon"></em>
						 <div class="text_pay">
						 	<p :class="pay.title == '手机pay'? 'mpaystitle':''">{{pay.title}}</p>
						 	<p :style="{color:pay.info_color}">{{pay.info}}</p>
						 </div>
					</div>
					<div class="s_p_r">
						<i></i>
					</div>
				</li>
			</ul>
		</div>
		<div class="sub" id="goPay" @click="lastpay">
			<em class="payBtnTxt">确认支付</em>&nbsp;<em class="needPay">¥{{(orderinfo.total_fee/100).toFixed(2)}}</em>
		</div>
		<van-action-sheet v-model="showsheet" title="验证码">
		  <div class="box1">
            <input type="tel" value="" placeholder="请输入图形验证码" id="captcha" v-model="code">
            <img style="position: absolute;right: 0.25rem;top:0.1rem; width: 2rem" id="captchaImg" src="http://m21.filmfly.cn/wap/pub/code1?svc=2&_=1" @click="reCaptcha">
          </div>
          <div class="box1">
          	<input type="tel" value="" placeholder="请输入验证码" id="verif-code" v-model="verifcode">
          	<a id="verif-send" class="huoqu" @click="yzmbtn" v-if="ishuoqu">发送验证码</a>
          	<a class="huoqu yanz" v-else >{{inittime}}s</a>
          </div>
          <p class="tstxt">*手机短信验证，以确保账户安全</p>
          <div class="sub" id="verif-sub" @click="postpay()"><em class="payBtnTxt">确认</em></div>
		</van-action-sheet>
		<card class="fixleft" id="card_pay"
		 @goback_card="cardback"
		 @card_pay_info="card_pay_info" 
		 :propcardlist="payinfo.cards" 
		 :proptotal="orderinfo.total_fee" 
		 :propcancel="cancelz" 
		 :proporiginal="original" 
		 :propmaketype="maketype" 
		 ref="cardchild"></card>

		<quan class="fixleft" id="quan_pay"
		 @goback_card="cardback" 
		 @quan_pay_info="quan_pay_info" 
		 :propquanlist="payinfo.quans" 
		 :proptotal="orderinfo.total_fee" 
		 :propnoquanlist="payinfo.quans_cant" 
		 :propcancel="cancelz" 
		 :proporiginal="original" 
		 :propmaketype="maketype"
		 ref="quanchild"
		 ></quan>

		 <Hongbao class="fixleft" id="hongbao_pay"
		 @goback_card="cardback" 
		 @hongbao_pay_info="hongbao_pay_info" 
		 :prophongbaolist="payinfo.coupons" 
		 :proptotal="orderinfo.total_fee" 
		 :propnohongbaolist="payinfo.coupons_cant" 
		 :propcancel="cancelz" 
		 :proporiginal="original" 
		 :propmaketype="maketype"
		 ref="hongbaochild"
		 ></Hongbao>

	   </div>
</template>
<script type="text/javascript">
	import $ from 'jquery';
	import {Dialog,ActionSheet}  from 'vant'
	import { isWeiXin,mobiletype,floatMul,inapp} from '@/assets/js/date.js';
	import Card from '../../components/Card'
	import Quan from '../../components/Quan'
	import Hongbao from '../../components/Hongbao'
	var domain = "http://m21.filmfly.cn"
	
	export default {
		data(){
			return{
				orderid:"",
				second:"",
				minute:"",
				payinfo:"",
				orderinfo:"",
				pay_parameter:{
					quanid:"",
					cardid1:"",
					cardid2:"",
					hongbaoid:""
				},
				toptext:"请选择卡券/红包支付",
				original:"",//原价
				cancelz:false,//取消
				maketype:0,//使用哪种优惠
				paytypes:"-2",//支付方式
				useBalance:"",//余额
				showbalance:false,
				showsheet:false,
				code:"",
				inittime:60,
				ishuoqu:true,
				verifcode:"",
				checkpays:"",
				mobiletypes:mobiletype()
			}
		},
		components: {
		     Card,
		     Quan,
		     Hongbao  
		},
		mounted() {
			this.getpaydata();
			if(inapp()){
				this.checklist()
			}
			
		},
		watch: {
		checkpays:{
			handler (newVal) {
	          this.checkpays = newVal
	        }
		},
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
			 checklist(){
			 		var that = this;
			 		window.WebViewJavascriptBridge.callHandler(
						        'checkpay' //检查是否某手机pay
						        , {
						        	
						        }  //请求参数
						        , function(responseData) {
						        	if(typeof responseData == "object"){
						        		that.checkpays = responseData
						        	}else{
						        		that.checkpays = JSON.parse(responseData)
						        	}
						        }
					);  
			 },
			 goback(){
			 	this.$router.goBack()
			 },
			 cardback(data){
			 	if(data){
			 		$("#card_pay,#quan_pay,#hongbao_pay").removeClass("translateX")
			 	}
			 },
			 resetquan(){//重置券
			 	this.$refs.quanchild.ylength = 0;
			 	this.$refs.cardchild.g=0
			 	$("#quanlist li").removeClass("Unavailablez");
			 	$("#quanlist li").removeClass("curs_z");
			 	this.cancelz = false;
			 	this.pay_parameter.quanid =""//删除券
			 	this.if_blane()
			 },
			 resetcard(){//重置卡
			 	this.$refs.cardchild.ylength = 0;
			 	$(".card_boxz li").removeClass("curs_z");
			 	this.cancelz = false;
			 	this.pay_parameter.cardid1 =""//删除卡
			 	this.pay_parameter.cardid2 =""//删除卡
			 	this.if_blane()
			 },
			 resethongbao(){//重置红包
			 	this.$refs.hongbaochild.ylength = 0;
			 	$("#hongbaolist li").removeClass("curs_z");
			 	this.cancelz = false;
			 	this.pay_parameter.hongbaoid =""//删除红包
			 	this.if_blane()
			 },
			 card_pay_info(dcandinfo,ccandinfo,total){
			 		if(dcandinfo != "" || ccandinfo != ""){
			 			this.maketype = 1;
			 			var yhui_money;
					 		this.resetquan();
					 		this.resethongbao();
					 		if(total < 0){
					 			yhui_money = this.original/100;
					 			this.orderinfo.total_fee = 0
					 		}else{
					 			yhui_money = (this.original - total)/100;
					 			this.orderinfo.total_fee = total
					 		}
					 	this.if_blane()	
				 		this.toptext = "观影通抵扣"+yhui_money+'元';
				 		this.pay_parameter.cardid1 = dcandinfo;
			 			this.pay_parameter.cardid2 = ccandinfo
				 	 }else{
				 	 	this.cancel();
				 	 }
			 		
			 	
			 },
			 quan_pay_info(total,quanarr_id){
			 	if(quanarr_id.length > 0){
			 		this.maketype = 2;
			 		var yhui_money;
			 		this.resetcard();
			 		this.resethongbao();
			 		this.orderinfo.total_fee = total;
			 		this.pay_parameter.quanid = quanarr_id.join(",");
			 		if(total < 0){
			 			yhui_money = this.original/100;
			 			this.orderinfo.total_fee = 0
			 		}else{
			 			yhui_money = (this.original - total)/100;
			 			this.orderinfo.total_fee = total
			 		}
			 		this.if_blane()
			 		this.toptext = "兑换券抵扣"+yhui_money+'元';
			 	 }else{
			 	 	this.cancel();
			 	 }
			 },
			 hongbao_pay_info(total,hongbao_id){
			 	if(hongbao_id !=''){
			 		this.maketype = 3;
			 		this.resetcard();
			 		this.resetquan();
			 		this.orderinfo.total_fee = total;
			 		this.pay_parameter.hongbaoid = hongbao_id;
			 		var yhui_money;
			 		if(total < 0){
			 			yhui_money = this.original/100;
			 			this.orderinfo.total_fee = 0
			 		}else{
			 			yhui_money = (this.original - total)/100;
			 			this.orderinfo.total_fee = total;
			 			console.log(total)
			 		}
			 		this.if_blane()
			 		this.toptext = "红包抵扣"+yhui_money+'元';
			 	}else{
			 		this.cancel();
			 	}
			 },
			 if_blane(){
			 	    //console.log(floatMul(this.payinfo.rmb,100)+"___" + this.orderinfo.total_fee)
			 		if(floatMul(this.payinfo.rmb,100) >= this.orderinfo.total_fee){
        			 	this.showbalance = true
        			 }else{
        			 	this.showbalance = false
        			 }
			 },
			 num(n) {
		        return n < 10 ? '0' + n : '' + n
		      },
		     timer () {
		        var _this = this;
		        var Dialog_this = Dialog
		        var time = window.setInterval(function () {
		          if (_this.second === 0 && _this.minute !== 0) {
		            _this.second = 59
		            _this.minute -= 1
		          } else if (_this.minute === 0 && _this.second === 0) {
		            _this.second = 0
		            Dialog_this.alert({
					  message: '支付时间超时,请重新选座'
					}).then(() => {
					  	window.location.href="/"
					});
		            window.clearInterval(time);
		            
		          } else {
		            _this.second -= 1
		          }
		        }, 1000)
		     },
		    Use(){
		    	$("#card_pay").addClass("translateX")
		    },
		    quanopen(){
		    	$("#quan_pay").addClass("translateX")
		    },
		    hongbaoop(){
		    	$("#hongbao_pay").addClass("translateX")
		    },
		    cancel(){
		    	this.cancelz = true;
		    	this.toptext="请选择卡券/红包支付";
		    	this.orderinfo.total_fee = this.original;
		    	if(this.maketype == 1){
			    	this.resetcard()
		    	}else if(this.maketype == 2){
		    		this.resetquan();
		    	}else if(this.maketype == 3){
		    		this.resethongbao()
		    	}
		    },
		    paytype(e){
		    	if(!this.showbalance && $(e.currentTarget).attr('data-id') == '-1'){
		    		return false
		    	}else{
		    		if($(e.currentTarget).hasClass("cur")){
		    			this.paytypes = "-2";
			    	}else{
			    		this.paytypes = $(e.currentTarget).attr('data-index')
			    	}	
		    	}
		    	
		    	
		    },
			getpaydata(){
				console.log
				//this.cardarr=[1,2,3];
				var that = this;
				this.orderid= this.$route.query.orderId;
				this.$http({
	            method:'post',
	            url:'/order/options',
	            data:{
	              orderId:this.orderid
            	}
        		}).then((j) => {

        			 if(!j){return false}
        			 this.payinfo = j.data.data;
        			 this.orderinfo = j.data.data.order;
        			 this.original = parseFloat(this.orderinfo.total_fee);
        			 if(this.payinfo.rmb*100 >= this.original){
        			 	this.showbalance = true
        			 }
        			 //console.log(typeof Number(this.orderinfo.total_fee))
        			 var maxtime = this.payinfo.timeLeft;
	        		 this.minute = Math.floor(maxtime / 60);
	        		 this.second = Math.floor(maxtime % 60);
	        		 this.timer()
	        		 this.$nextTick(function(){
	        		 		if(that.checkpays.cat == 0){
	        		 			$(".select_pay li[data-type='手机pay']").hide();
	        		 		}else if(that.checkpays.cat == 1){
	        		 			//alert(this.checkpays.SEType)
	        		 			if(mobiletype() == 'android'){
		        		 			var payimg = require('../../assets/img/payicon/'+that.checkpays.SEType+'.jpeg')
		        		 			$(".mpays img").attr("src",payimg);
		        		 			$(".mpaystitle").html(that.checkpays.title)
	        		 			}else{
	        		 				var payimg = require('../../assets/img/payicon/apple-pay.png');
	        		 				$(".mpays img").attr("src",payimg);
		        		 			$(".mpaystitle").html("苹果支付")
	        		 			}
	        		 		}
	        		 })
        		})
			},
			reCaptcha(){
	        	$("#captchaImg").attr('src',domain+'/wap/pub/code1?svc=2&_='+Math.random());
	        },
	        yzmbtn(){
				if(this.code.length!=4)
                {
                    Dialog.alert({
				  		message: '图形验证码错误！'
					})
                }
                else{
                    this.getCode();
                }
	        },
	        getCode:function(){
		            var that=this;
		            this.$http({
			            method:'get',
			            url:'/order/verif',
		            	params:{
		                  captcha:that.code
		            }}).then((j) => {
		            	if(!j){return false;}
		            	if(j.data.code == -802){
		                    $(".imgcodediv").show();
		                    $("#captchaImg").attr("src",domain+j.data.data.url);
		                    if(that.imgCode!=""){
		                    	  Dialog.alert({
								  		message: j.data.msg
								  })
		                    }
		                    
		              }
		                else if(j.data.code==-801){
		                   Dialog.alert({
								  message: j.data.msg
							})
		                }
		                else if(j.data.code==0){
		                    var timer=setInterval(function(){
		                        that.ishuoqu = false;
		                        that.inittime--;
		                       if(that.inittime<=0){
		                        that.inittime=60;
		                        that.ishuoqu = true;
		                        clearInterval(timer);
		                        }
		                    },1000) 
		                    Dialog.alert({
								  message: "验证码已成功发送至手机"
							})
		                }
		                else{
		                	Dialog.alert({
		                          message: j.data.msg
		                    }).then(() => {
		                         that.code='';
		                         that.reCaptcha();
		                    });
		                }

		            })
        },
		lastpay(){
				if(this.paytypes == -1){
					this.paytypes = "-2";	
					this.useBalance = this.payinfo.rmb;
				}
				
				if(this.toptext != '请选择卡券/红包支付'){
					this.$http({
		            method:'get',
		            url:'/order/verified',
		            params:{
		              orderId:this.orderid
	            	}
	        		}).then((j) => {

	        			if(j.data.data.v == 0 && this.orderinfo.verified == 0){
	        				this.showsheet = true;
	        			}else{
	        				this.postpay()
	        			}
	        			
	        		})
	        		return false
				}else{
					this.postpay()
				}
				
			},
		 postpay(){
		 		if(this.paytypes == 5){
		 			this.bankname = "建设银行"
		 		}else if(this.paytypes == 6){
		 			this.bankname = "农业银行"
		 		}
		 		var paytypes = $(".select_pay .cur").attr("data-id") == undefined ? "" : $(".select_pay .cur").attr("data-id") ;
		 		var paycats = $(".select_pay .cur").attr("data-cat");
		 		//alert("phoneType:"+paycats)
		 		if(paycats == undefined && this.orderinfo.total_fee !=0){
		 			Dialog.alert({
								  message: "请选择支付方式"
					})
					return false;
		 		}
		 		if(this.verifcode == ""&& this.showsheet){
		 			Dialog.alert({
								  message: "请输入验证码"
					})
		 			return false
		 		}
		 		
				this.$http({
	            method:'post',
	            url:'/order/pay',
	            data:{
	              orderId:this.orderid,
	              payType:paytypes,
	              couponId:this.pay_parameter.hongbaoid,
	              useBalance:this.useBalance,
	              quanArr:this.pay_parameter.quanid,
	              cardId:this.pay_parameter.cardid1,
	              cardCiArr:this.pay_parameter.cardid2,
	              veriCode:this.verifcode,
            	}
        		}).then((j) => {
        			if(isWeiXin()){//微信内打开支付方式
        				if(j.data.data.payment_info.data !=""){
        					 pay.wechat(JSON.parse(j.data.data.payment_info.data), function () {
                                alert("a")
                            });
        				}else{
        					 window.location.href = j.data.data.payment_info.url
        				}
        			}else{
        				//不是微信的支付方式
        				if(!inapp()){return false}
	        			if(j.data.data.payment_info.data !=""){
					 			window.WebViewJavascriptBridge.callHandler(
							        'Payment'  //支付定义的方法名称
							        , {
							        	'orderId':this.orderid,//订单ID
							        	'payType':j.data.data.payment_info.type,//支付类型
							        	'paydata':j.data.data.payment_info.data,//支付信息
							        	'bankname':this.bankname,
							        	'phoneType':paycats
							        }  //请求参数
							        , function(responseData) { //回调数据接口
							           console.log(responseData)
							        }
							    );  
					 		
	        			}else{
	        				window.WebViewJavascriptBridge.callHandler(
							        'Payment'  //支付定义的方法名称
							        , {
							        	'orderId':this.orderid,//订单ID
							        	'payType':j.data.data.payment_info.type,//支付类型
							        	'payurl':j.data.data.payment_info.url,//支付信息
							        	'bankname':this.bankname,
							        	'phoneType':paycats
							        }  //请求参数
							        , function(responseData) { //回调数据接口
							           console.log(responseData)
							        }
							    );  
	        			}
        			}
        		

        	})
		 }
		}
	}
</script>