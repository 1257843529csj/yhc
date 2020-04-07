<template>
	<div class="box">
		<van-nav-bar title="红包" fixed :z-index="999" />
		<div class="hongbaolist" id="hongbaobox">
			<div class="nobody" v-if="shownobody">
						<div class="big_ico"></div>
						<p class="text1">神马，我还没电影卡？</p>
						<a href="javascript:void(0)" class="addcard">马上绑定</a>
			</div>
			<div class="giftbox" v-if="!shownobody" id="hongbaolist">
				<ul>
				 <li v-for="hongbao_list in hongbaolist" @click="hongbaoclick($event,hongbao_list.val)" :data-id="hongbao_list.id">
					 <p>普通红包</p>
	                 <p>有效期：{{hongbao_list.expired}}</p>
	                 <p>{{hongbao_list.txt0}}</p>
	                            <div class="bottom_line"></div>
	                            <div class="d_line"></div>
	                            <div class="money"><em>{{hongbao_list.val}}</em>元</div>
	                            <div class="gg"><img src="../assets/img/gg.png"></div>
				 </li>
				 <li v-for="nohongbao in hongbaonolist" class="Unavailable">
								<p>普通红包</p>
	                            <p>有效期：{{nohongbao.expired}}</p>
	                            <p>卡号：{{nohongbao.txt0}}</p>
	                            <div class="bottom_line"></div>
	                            <div class="d_line"></div>
	                            <div class="money"><em>{{nohongbao.val}}</em>元</div>
	               </li>
				</ul>
				  <div class="add_card" @click="openaddhongbao">
	                <a href="javascript:void(0)" class="addcard"><i>+</i>添加红包</a>
	            </div>
			</div>
		</div>
		<div class="gift_foot">已选择
				<em id="cardNum">{{ylength}}</em>张，还需支付
				<em class="cardRmb" v-if="total>0">{{total/100}}</em>
				<em class="cardRmb" v-if="total<=0">0</em>元 <i id="qd3" @click="qd">返回</i>
		</div>
		<addhongbao :class="showaddhongbao ?'fixleft translateX':'fixleft'"  @goback="goback"></addhongbao>
	</div>
</template>
<script type="text/javascript">
import $ from 'jquery';
import {Dialog} from 'vant';
import addhongbao from './addhongbao'
export default {
	props:{
      prophongbaolist:Array,
      propnohongbaolist:Array,
      proptotal:"",
      propcancel:Boolean,
      proporiginal:"",//原价
      propmaketype:Number//使用类型
 	},
 	components: {
         addhongbao
  	},
 	watch: {
	  	ylength(){
	  		if(this.ylength > 0){
	  			$("#qd3").html("确定")
	  		}else{
	  			$("#qd3").html("返回")
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
	     	   this.total = this.proporiginal;
	     	   this.ylength = 0;
	     	   $("#hongbaolist li").removeClass("curs_z")
	    	}
	  	},
	  	prophongbaolist(){
	  		this.hongbaolist = this.prophongbaolist;
	  	},
	  	propnohongbaolist(){
	  		this.hongbaonolist = this.propnohongbaolist;
	  		//this.quannolist = testarr
	  	},
	  	proptotal(){
	  		this.total = this.proptotal;
	  		this.nowtotal = this.proptotal
	  	}
 	 },
  	data() {
    	return {
    		hongbaolist:this.prophongbaolist,
    		hongbaonolist:this.propnohongbaolist,
    		total:"",
    		ifcancel:"",
    		original_price:Number(this.proporiginal),
    		ylength:0,//张数
    		shownobody:false,
    		nowtotal:"",
    		showaddhongbao:false
    	}
    },
	mounted() {
	     
	},
    methods: {
    	openaddhongbao(){
    		this.showaddhongbao = true;
    	},
    	goback(data,data1){
        if(data){
          if(data1 == "ok"){
            this.$parent.getpaydata()
          }
          this.showaddhongbao = false
	        }
	    },
    	hongbaoclick(e,moneyval){
    		if($(e.currentTarget).hasClass("curs_z")){
    			$(e.currentTarget).removeClass("curs_z");
    			this.total = this.total +moneyval*100
    			this.ylength = 0;
    			//console.log(this.total)
    		}else{
    			$("#hongbaolist li").removeClass('curs_z');
  				this.total = this.original_price - moneyval*100;
  				this.ylength = 1;
  				$(e.currentTarget).addClass("curs_z");
  				//console.log(this.total)
    		}
    		
    	},
    	gotoback(){
  		if(this.$parent.maketype != 3 && this.$parent.maketype !=0){
  			$("#hongbaolist li").removeClass('curs_z');
  			this.ylength = 0;
  			this.total = this.nowtotal
  		}
  		this.$emit('goback_card',true)
  		},
    	qd(){
  		//console.log(this.total)
  		var hongbao_elemt = $("#hongbaolist .curs_z");
  		var hongbao_id="";
  		if(hongbao_elemt.length > 0){
  			hongbao_id = hongbao_elemt.attr("data-id")
  		}
  		this.$emit('hongbao_pay_info',this.total,hongbao_id);
  		this.gotoback();
  		}
    }
}
</script>