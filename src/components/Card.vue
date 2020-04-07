<template>
	<div class="box">
		<van-nav-bar title="观影通" fixed :z-index="999"/>
		<van-tabs v-model="active" class="mt80" title-active-color="#ff9a00" color="#ff9a00">
			  <van-tab title="点卡">
				<div class="cardslist">
					<div class="nobody" v-if="shownobody">
						<div class="big_ico"></div>
						<p class="text1">神马，我还没电影卡？</p>
						<a href="javascript:void(0)" class="addcard">马上绑定</a>
					</div>
					<div class="giftbox card_boxz" v-if="!shownobody" id="dcandbox">
						<ul>
						  <li v-for="d_card in card1" @click="cardclick($event,d_card.balance,d_card.ratio,1)" :data-id="d_card.id">
	                            <p>{{d_card.title}}</p>
	                            <p>有效期：{{d_card.expired_txt}}</p>
	                            <p>卡号：{{d_card.cardNo}}</p>
	                            <div class="bottom_line"></div>
	                            <div class="d_line"></div>
	                            <div class="money"><em>{{d_card.balance/100}}</em>点</div>
	                            <div class="gg"><img src="../assets/img/gg.png"></div>
	                        </li>
						</ul>
              <div class="add_card" @click="openaddcard">
                  <a href="javascript:void(0)" class="addcard"><i>+</i>添加观影通</a>
              </div>
					</div>
				</div>
			  </van-tab>
			  <van-tab title="次卡">
					<div class="giftbox card_boxz" v-if="!shownobody" id="ccandbox">
						<ul>
						  <li v-for="c_card in card2"  @click="cardclick($event,c_card.val/c_card.coupon_num_left,c_card.ratio,2)" :data-id="c_card.id">
	                            <p>次卡</p>
	                            <p>有效期：{{c_card.expired_txt}}</p>
	                            <p>卡号：{{c_card.cardNo}}</p>
	                            <div class="bottom_line"></div>
	                            <div class="d_line"></div>
	                            <div class="money"><em>{{c_card.val/100/c_card.coupon_num_left}}</em>点/次</div>
	                            <div class="gg"><img src="../assets/img/gg.png"></div>
	                        </li>
						</ul>
            <div class="add_card" @click="openaddcard">
                <a href="javascript:void(0)" class="addcard"><i>+</i>添加观影通</a>
            </div>
					</div>
			  </van-tab>
		</van-tabs>
		<div class="gift_foot">已选择<em id="cardNum">{{ylength}}</em>张，还需支付
				<em class="cardRmb" v-if="total>0">{{total/100}}</em>
				<em class="cardRmb" v-if="total<=0">0</em>元 <i id="qd1" @click="qd">返回</i>
		</div>
    <addcard :class="showaddcard ?'fixleft translateX':'fixleft'" @goback="goback" ></addcard>
	</div>
</template>
<script type="text/javascript">
import $ from 'jquery';
import { Tab,Tabs,Dialog} from 'vant';
import addcard from './addcard'
export default {
  props:{
      propcardlist:Array,
      proptotal:"",
      propcancel:Boolean,
      proporiginal:"",//原价
      propmaketype:Number//使用类型
  },
  data() {
    return {
       active:0,
       cardlist:this.propcardlist,
       card1:[],//点卡
       card2:[],//次卡
       shownobody:false,
       total:"",//价格
       nowtotal:"",//当前价格
       ylength:0,//张数
       nowtype:"",//当前所选类型
       ifcancel:this.propcancel,
       original_price:Number(this.proporiginal),//原价
       maketypes:this.propmaketype,
       showaddcard:false
    };
  },
  components: {
         addcard
  },
  watch: {
  	ylength(){
  		if(this.ylength > 0){
  			$("#qd1").html("确定")
  		}else{
  			$("#qd1").html("返回")
  		}
  	},
  	propmaketype(){
  		this.maketypes = this.propmaketype;
  	},
  	proporiginal(){
  		this.original_price = Number(this.proporiginal)
  	},
  	propcancel(){
  		this.ifcancel = this.propcancel;
  		if(this.ifcancel){
     	this.ylength = 0;
     		$(".giftbox li").removeClass("curs_z")
    	}
  	},
  	propcardlist(){
      this.card1 = [];
      this.card2 = [];
  		this.cardlist = this.propcardlist;
  		for(var i=0;i < this.cardlist.length;i++){
  			if(this.cardlist[i].type == 2){
  				this.card1.push(this.cardlist[i])
  			}else{
  				if(this.cardlist[i].coupon_num_left > 1){
  					for(var j=0; j<= this.cardlist[i].coupon_num_left.length; j++){
  						this.card2.push(this.cardlist[i])
  					}
  				}else{
  					this.card2.push(this.cardlist[i])
  				}
  				
  			}
  		}
  		if(this.card1.length < 0){
  			this.shownobody = true
  		}else{
  			this.shownobody = false
  		}
  		
  	},
  	proptotal(){
  		this.total = this.proptotal;
  		this.nowtotal = this.proptotal
  	}
  },
  mounted() {

  },
  methods: {
  	qd(){
  		var dcardid = "";
  		if($("#dcandbox .curs_z").attr("data-id")){
  			dcardid = $("#dcandbox .curs_z").attr("data-id");
  		}
  		var ccardidarr = [];
  		var elem_cika = $("#ccandbox .curs_z");
  		var ccardid = '';
  		if(elem_cika.length > 0){
  		for(var i=0; i<elem_cika.length;i++){
  					ccardidarr.push(elem_cika.eq(i).attr("data-id"))
  	
  		}
      var objz = {};
      var arrz = [];
      for(var i= 0, l = ccardidarr.length; i< l; i++){ 
            var item = ccardidarr[i]; 
            objz[item] = (objz[item] +1 ) || 1; 
      } 
      for (let i in objz) {
          arrz.push(i+"_"+objz[i]); 
      }
			ccardid = arrz.join(",")
		}
		
  		this.$emit('card_pay_info',dcardid,ccardid,this.total);
  		this.gotoback();
  	},
    openaddcard(){
     
      this.showaddcard = true
    },
    goback(data,data1){

        if(data){
          console.log(data1)
          if(data1 == "ok"){
            this.$parent.getpaydata()
          }
          this.showaddcard = false
        }
    },
  	gotoback(){
  		if(this.$parent.maketype != 1 && this.$parent.maketype !=0){
  			$(".card_boxz li").removeClass('curs_z');
  			this.ylength = 0;
  			this.total = this.nowtotal
  		}
  		this.$emit('goback_card',true)
  	},
  	reset(){//重置
  		$(".card_boxz li").removeClass('curs_z');
  		this.total = this.original_price;
  		this.ylength = 0;
  	},
  	cardclick(e,cardy,ratio,nowtype){
  		if(this.maketypes != 1){
  			this.reset();
  			this.maketypes = 1;
  		}
  		if(this.nowtype != nowtype){
  			this.nowtype = nowtype;
  			this.reset();
  		}
  		if($(e.currentTarget).hasClass("curs_z")){
  			this.total = this.total + cardy*ratio;
  			this.ylength --;
  			$(e.currentTarget).removeClass("curs_z")
  		}else{
  			if(nowtype == 1){//点卡 单选
  				$(".card_boxz li").removeClass('curs_z');
  				this.ylength = 0;
  				this.total = this.original_price - cardy*ratio;
  				this.ylength ++;
  				$(e.currentTarget).addClass("curs_z")
  				return false;
  			}
  			if(this.total < 0){
  				return false
  			}
  			this.ylength ++;
  			if(this.total - cardy*ratio < 0){
  				Dialog.alert({
					  message: '超出票价部分不支持返现'
				})
  			}
  			this.total = this.total - cardy*ratio;
  			$(e.currentTarget).addClass("curs_z")
  		}
  		
  	}
  }
}
</script>