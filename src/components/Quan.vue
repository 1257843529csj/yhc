<template>
	<div class="box">
		<van-nav-bar title="兑换券" fixed :z-index="999" />
			<div class="quanslist" id="quanbox">
					<div class="nobody" v-if="shownobody">
						<div class="big_ico"></div>
						<p class="text1">神马，我还没电影卡？</p>
						<a href="javascript:void(0)" class="addcard">马上绑定</a>
					</div>
					<div class="giftbox" v-if="!shownobody" id="quanlist">
						<ul>
						  <li v-for="quan_list in quanlist" @click="quanclick($event,quan_list.val,quan_list.useType,quan_list.useType1)" :data-id="quan_list.id" :data-quanmoney="quan_list.val">
	                            <p>兑换券</p>
	                            <p>有效期：{{quan_list.expired_txt}}</p>
	                            <p>卡号：{{quan_list.pin}}</p>
	                            <div class="bottom_line"></div>
	                            <div class="d_line"></div>
	                            <div class="money"><em>{{quan_list.val}}</em>元</div>
	                            <div class="gg"><img src="../assets/img/gg.png"></div>
	                        </li>
	                       <li v-for="noquan in quannolist" class="Unavailable">
								              <p>兑换券</p>
	                            <p>有效期：{{noquan.expired_txt}}</p>
	                            <p>卡号：{{noquan.pin}}</p>
	                            <div class="bottom_line"></div>
	                            <div class="d_line"></div>
	                            <div class="money"><em>{{noquan.val}}</em>元</div>
	                        </li>
						</ul>
            <div class="add_card" @click="openaddquan">
                <a href="javascript:void(0)" class="addcard"><i>+</i>添加兑换券</a>
            </div>
					</div>
			</div>
				<div class="gift_foot">已选择
				<em id="cardNum">{{ylength}}</em>张，还需支付
				<em class="cardRmb" v-if="total>0">{{total/100}}</em>
				<em class="cardRmb" v-if="total<=0">0</em>元 <i id="qd2" @click="qd">返回</i>
		</div>
     <addquan :class="showaddquan ? 'fixleft translateX':'fixleft'"  @goback="goback"></addquan>
	</div>
</template>
<script type="text/javascript">
import $ from 'jquery';
import {Dialog} from 'vant';
import addquan from './addquan'


export default {
  props:{
 	   propquanlist:Array,
 	   propnoquanlist:Array,
     proptotal:"",
     propcancel:Boolean,
     proporiginal:"",//原价
     propmaketype:Number//使用类型
  },
  components: {
         addquan
  },
  watch: {
  	ylength(){
  		//console.log(this.ylength)
  		if(this.ylength > 0){
  			$("#qd2").html("确定")
  		}else{
  			$("#qd2").html("返回")
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
     	   $(".giftbox li").removeClass("curs_z")
    	}
  	},
  	propquanlist(){
  		this.quanlist = this.propquanlist;
  	},
  	propnoquanlist(){
  		this.quannolist = this.propnoquanlist;
  		//this.quannolist = testarr
  	},
  	proptotal(){
  		this.total = this.proptotal;
  		this.nowtotal = this.proptotal
  	}
  },
  data() {
    return {
       quanlist:this.propquanlist,
       quannolist:this.propnoquanlist,
       shownobody:false,
       total:"",
       nowtotal:"",
       ylength:0,//张数
       original_price:Number(this.proporiginal),
       ifcancel:"",
       maketypes:this.propmaketype,
       g:0,
       onlyquan:[],
       if_quyu:false,
       showaddquan:false
    };
  },

  mounted() {
     
  },
  methods: {
    openaddquan(){
      this.showaddquan = true
    },
    goback(data,data1){
        if(data){
          if(data1 == "ok"){
            this.$parent.getpaydata()
          }
          this.showaddquan = false
        }
    },
  	gotoback(){
  		if(this.$parent.maketype != 2 && this.$parent.maketype !=0){
  			$("#quanlist li").removeClass('curs_z');
  			this.ylength = 0;
  			this.g = 0;
  			this.total = this.nowtotal
  		}
  		this.$emit('goback_card',true)
  	},
  	qd(){
  		var quanelemt = $("#quanlist .curs_z");
  		var quanarr_id=[];
  		if(quanelemt.length > 0){
  			for(var i=0; i<quanelemt.length;i++){
  				quanarr_id.push(quanelemt.eq(i).attr("data-id"))
  			}
  		}
  		this.$emit('quan_pay_info',this.total,quanarr_id);
  		this.gotoback();
  	},
  	reset(){//重置
  		$("#quanlist li").removeClass('Unavailablez');
  		this.g = 0
  		this.total = this.original_price;
  		this.ylength = 0;
  	},
  	qtype(e,quantype,quantype1,leixing){
      var that = this;
  		if(leixing == "+"){
  			this.g++;
  			this.quanlist.forEach(function(val,index){
  				if(val.useType != quantype || val.useType1 != quantype1){
            that.onlyquan.push(val)
  					$("#quanlist li").eq(index).addClass("Unavailablez")
  				}
  			})
  		}else{
  			this.g--;
  			if(this.g == 0){
  				$("#quanlist li").removeClass("Unavailablez")
  			}
  		}
  		
  	},
    goodmoney(e,seatjg_arr){//一券一换可补差价
            var allseatjg = this.permute(seatjg_arr);//所有座位价格排列
            //var seatjg_px = seatjg_arr.sort();
            var e_dom = $("#quanlist .curs_z")
            var seletquan_moneyarr = [];
            if(e_dom.length>0){
              for(var i=0; i<e_dom.length; i++){
               seletquan_moneyarr.push(e_dom.eq(i).attr("data-quanmoney")*10000)
              }
            }else{
              this.total = this.original_price
              return false
            }
            var totalarr = []
                 for(var i=0; i<allseatjg.length; i++){
                     totalarr.push(this.original_price*100)
                 }
                 // console.log(allseatjg);
                 // console.log('所选的数组:'+seletquan_moneyarr);
                 // console.log('每组总价:'+totalarr)

                 seletquan_moneyarr.forEach(function(selectmoney,index){
                      allseatjg.forEach(function(all,index1){
                          if(selectmoney < all[index]){
                             totalarr[index1] = totalarr[index1] - selectmoney
                          }else{
                             $(e.currentTarget).attr("total_money",all[index])
                             totalarr[index1] = totalarr[index1] - all[index]
                          }
                      })
                 })
                 this.total = Math.min.apply(null,totalarr)/100;
                 
    },
    goodmoney1(e,seatjg_arr,moneyval){//一券一换不可补差价
          var allseatjg = this.permute(seatjg_arr);//所有座位价格排列
          var seletquan_moneyarr = [];
          var ok = true;
          var arrs = seatjg_arr.sort();
          var e_dom = $("#quanlist .curs_z");
            if(e_dom.length > 0){
              for(var i=0; i<e_dom.length; i++){
                 seletquan_moneyarr.push(e_dom.eq(i).attr("data-quanmoney")*10000)
              }
            }else{
              this.total = this.original_price;
              return false;
            }
          var all_length = allseatjg.length;
          var selet_length = e_dom.length;
          var n = 0
          arrs.forEach(function(item,index){
               seletquan_moneyarr.forEach(function(item1,index1){
                    if(item1 < item){
                        n++;
                        if(n >= all_length){
                          alert("不能在选了");
                          ok = false
                        }
                    }
               })
          })
          console.log(all_length)
          var totalarr = []
            for(var i=0; i<allseatjg.length; i++){
                totalarr.push(this.original_price*100)
            }
          seletquan_moneyarr.forEach(function(selectmoney,index){
              allseatjg.forEach(function(all,index1){
                 if(selectmoney > all[index]){
                    totalarr[index1] = totalarr[index1] - all[index];
                 }
              })
          })
          this.total = Math.min.apply(null,totalarr)/100; 
          if(ok){
            return true
          }else{
            $(e.currentTarget).removeClass("curs_z");
            return false
          }
    },
    seatmoney(e,moneyval,quantype,quantype1,seatjg_arr){
          //var seatjg = this.$parent.payinfo.seatPrice;
            var that = this;
            
            if(quantype1 == 1){
               $(e.currentTarget).addClass("curs_z");
               this.ylength ++;
              this.goodmoney(e,seatjg_arr);
              this.qtype(e,quantype,quantype1,'+');
             
            }else if(quantype1 == 0){
                $(e.currentTarget).addClass("curs_z");
                
                if(this.goodmoney1(e,seatjg_arr,moneyval)){
                  this.ylength ++;
                  this.qtype(e,quantype,quantype1,'+');
                }else{
                  return false
                }
            } 
            
            
    },
    permute(input){//所有座位票价排列组合
      var permArr = [],
        usedChars = [];
        function main(input){
          var i, ch;
          for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
              permArr.push(usedChars.slice());
            }
            main(input);
            input.splice(i, 0, ch);
            usedChars.pop();
          }
          return permArr
        }
        return main(input);
    },
  	quanclick(e,moneyval,quantype,quantype1){
      var seatjg = this.$parent.payinfo.seatPrice;
          var seatjg_arr = []
          // var seatjg ={
          //          '0000000000000001-I-05$0000000000': "34.9000",
          //          '0000000000000001-I-06$0000000000': "30.9000",
          //          '0000000000000001-I-07$0000000000': "32.9000",
          //          '0000000000000001-I-08$0000000000': "33.9000"}
          for(var key in seatjg){
              seatjg_arr.push(seatjg[key]*10000)
          }
  		if($(e.currentTarget).hasClass("Unavailablez")){
    			Dialog.alert({
  					  message: '影片专属优惠券不能与其他优惠券一起使用！'
  			});
  			return false
  		}
  		if(this.maketypes != 2){
    			this.reset();
    			this.maketypes = 2;
  		}
  		if(!this.ifcancel){
  			this.total = this.original_price;
  			this.ifcancel = true
  		}
  		if($(e.currentTarget).hasClass("curs_z")){
  			this.ylength --;
        $(e.currentTarget).removeClass("curs_z")
        if(quantype == 1 && quantype1 == 1){
           this.goodmoney(e,seatjg_arr)
         }else if(quantype == 1 && quantype1 == 0){
           this.goodmoney1(e,seatjg_arr)
         }else{
            this.total = this.total + moneyval*100
         }
  			this.qtype(e,quantype,quantype1,'-')
  			
  		}else{   
          for(var i=0; i<seatjg_arr.length;i++){
              if(seatjg_arr[0] != seatjg_arr[i]){
                 this.if_quyu = true
              }
          }
    			if(this.total <= 0){
    				return false;
    			}
    			if(quantype == 1){
      			if(this.ylength >= this.$parent.orderinfo.amount){
      					return false;
      			}
            
            this.seatmoney(e,moneyval,quantype,quantype1,seatjg_arr); 
            return false
    			}
          this.ylength ++;
    			this.qtype(e,quantype,quantype1,'+')
    			if(this.total - moneyval*100 < 0){
    				Dialog.alert({
  					  message: '超出票价部分不支持返现'
  				})
    			}
    			this.total = this.total - moneyval*100
  			  $(e.currentTarget).addClass("curs_z")
  		}
  	}
  }
}
</script>