<template>
  <div class="box" style="background: #eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="exchange_con">
        <span class="exchange_con_title">兑换比例：1点=0.75积分</span>
        <div class="exchange_con_list_div">
            <div class="exchange_con_list" v-for="item in infoList">
                <div class="exchange_list_flex">
                    <div class="selectimg"><div :class="selectIds.indexOf(item.id) >= 0 ? 'selectd' : 'select'" @click="chooseGood(item)"></div></div>
                    <div class="exchange_con_detail">
                        <span>{{item.title}}</span>
                        <span> 有效期：{{item.expired}}</span>
                        <!-- onkeyup="value=value.replace(/^0(0+)|[^\d]+/g,'')" -->
                        <div class="exchange_con_num" v-if="!isSelectAll">
                            <p class="prv" :class="item.balance>1&&selectIds.indexOf(item.id) >= 0?'canactive':''" @click="preNum(item)">-</p>
                            <input type="tel" v-model="item.balance" :class="(item.balance>1||item.balance<item.max)&&selectIds.indexOf(item.id) >= 0?'canactive':''" :readonly="selectIds.indexOf(item.id) <0"  @keyup="inputNum(item)" @blur="blurInputNum(item)">
                            <!-- <em :class="(item.balance>1||item.balance<item.max)&&selectIds.indexOf(item.id) >= 0?'canactive':''">{{item.balance}}</em> -->
                            <p class="add"  :class="item.balance<item.max&&selectIds.indexOf(item.id) >= 0?'canactive':''" @click="addNum(item)">+</p>
                        </div>
                        <div class="exchange_con_num" v-else>
                          <!--   <p class="prv" :class="item.balance>1&&selectIds.indexOf(item.id) >= 0?'canactive':''" @click="preNum(item)">-</p> -->
                            <em>{{item.max}}</em>
                            <!-- <p class="add"  :class="item.balance<item.max&&selectIds.indexOf(item.id) >= 0?'canactive':''" @click="addNum(item)">+</p> -->
                        </div>
                        
                    </div>
                </div>
               <span class="exchange_list_card">卡号：{{item.cardNo}}</span>
            </div>
            <Emptys v-if="isempty"></Emptys>
        </div>
        <div class="kong">
            
        </div>
        <div class="exchange_con_totle">
            <div class="selected_all" @click="selectPro" :class="isHaveList?'':'onselected_all'">
                <div class="select_img"  :class="[isSelect==1?'selectd':'select']"></div> 
                <span class="sh_allselect" style="padding: 0 .2rem 0 0">全部兑换</span>
            </div> 
            <span class="sh_all_jf">总计兑换积分：<font class="totalm">{{totalMoney*0.75}}</font><br><font>兑换点数：{{parseInt(totalMoney)}}</font></span> 
            <a @click="confirmDh" :class="isHaveList?'':'onconfirm'">确认兑换</a>
        </div>
    </div>
    
   
  </div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"点卡兑换积分",
        infoList:[],
        selectIds: [],
        // selectGoods:{},
        totalMoney:0,
        isSelect: 0,
        isAll:false,
        isHaveList:true,
        isSelectAll:false,
        readonlys:false,
        isempty:false,
    };
  },

  mounted() {
    var that=this;
    that.getInfo();
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getInfo(){
        var that=this;
        this.$http({
          methods: "get",
          url: "/mall/card2Point",
          }).then(j => {
            if(j.data.code==0){
                that.infoList=j.data.data;
                if(j.data.data.length==0){
                    that.isempty=true;
                    that.isHaveList=false;
                }

            }
            else{
              this.$dialog.alert({
                message: j.data.msg
              });
            }
        })
    },
    addNum(item) {
        var that = this;
        var proNum;
        if (that.selectIds.indexOf(item.id) >= 0) {
            if(item.balance<item.max){
                item.balance = ~~item.balance + 1;
            // this.updateNum(item.goods_id,item.in_num);
                
            }
            that.calcTotalMoney();
        }
        
    },
    preNum(item) {
        var that = this;
        if (that.selectIds.indexOf(item.id) >= 0) {
            if (~~item.balance > 1) {
                item.balance = ~~item.balance - 1;
                // this.updateNum(item.goods_id,item.in_num);
             
            }
            that.calcTotalMoney();
            
        }
        
    },
    inputNum(item){
        var that = this;
        var sch = setInterval(function () {
            if (that.selectIds.indexOf(item.id) >= 0) {
                if(item.balance!=''){
                    item.balance=item.balance.replace(/^0(0+)|[^\d]+/g,'');
                }
                if (~~item.balance > ~~item.max) {
                    this.$dialog.alert({
                      message: '您输入的点数超过余额，请重新输入'
                    }).then(()=>{
                        that.getInfo(); 
                    });
                    return false;
                    // this.updateNum(item.goods_id,item.in_num);
                 
                }
                else{
                    clearTimeout(sch);
                    that.calcTotalMoney();
                }    
            }

        },1000)
        

    },
    blurInputNum(item){
        var that = this;
        console.log(111)
        if (that.selectIds.indexOf(item.id) >= 0) {
            if(item.balance==''){
                item.balance=0;
            }
        }

    },
    calcTotalMoney() {
        var that=this;
        // console.log(that.selectIds)
        var selectIds = that.selectIds;
        var money = 0;
        var infoList = that.infoList;
        var items = [];
        if(!that.isSelectAll){
            if (selectIds.length <= 0) {
                that.totalMoney = 0;
                return;
            }
            
            
            infoList.forEach(el => {
                if (selectIds.indexOf(el.id) >= 0) {
                    items.push(el);
                }
            })
            
            items.forEach(item => {
                money +=~~item.balance;
            })
        }
        else{
           infoList.forEach(el => {
                if (selectIds.indexOf(el.id) >= 0) {
                    items.push(el);
                }
            })
            
            items.forEach(item => {
                money +=~~item.max;
            })
        }
        console.log(money)
        that.totalMoney = money.toFixed(2);
    },
    selectPro: function () {
        var that=this;
        if(!that.isHaveList){
            return false;
        }
        
        var infoList = that.infoList;
        var selectIds = that.selectIds;
        var isSelect = that.isSelect;

        if (isSelect === 0) {
            that.isAll=true;
            infoList.forEach(item => {
                if (selectIds.indexOf(item.id) < 0) {
                    that.isSelectAll=true;
                    selectIds.push(item.id);
                }
            });
        } else {
            that.isAll=false;
            that.isSelectAll=false;
            infoList.forEach(item => {
                item.balance=item.max;
            });
            that.selectIds = [];
        }
        that.isSelect = isSelect === 0 ? 1 : 0;
        that.calcTotalMoney();
    },
    chooseGood: function (item) {
        var that=this;
        console.log(item.id)
        var selectIds = that.selectIds;
        var index = selectIds.indexOf(item.id);
        if (index >= 0) {
            // delete selectIds[index];
            // that.selectIds = [...selectIds];
            selectIds.splice(index, 1);
            that.selectIds = selectIds; 
        } else {
            selectIds.push(item.id);
            that.selectIds = selectIds;  
        }
        that.calcTotalMoney();

        // that.checkAll();
    },
    confirmDh(){
        var that=this;
        if(that.isHaveList){
            if(that.selectIds.length>0){
                for(var i=0; i<that.selectIds.length; i++){
                    for(var j=0; j<that.infoList.length;j++){
                        if(that.selectIds[i]==that.infoList[j].id){
                            if(that.infoList[j].balance==0){
                                this.$dialog.alert({
                                  message: '兑换点数不能为0'
                                })
                                return false;

                            }
                            
                        }
                    }
                }
                this.$dialog.confirm({
                  message: '您确定要将这些点数兑换为积分吗？兑换为积分后不可转回点数'
                }).then(() => {
                  that.submitConfirm();
                  // on confirm
                }).catch(() => {
                  // on cancel
                });  
                            
            }
            else{
                this.$dialog.alert({
                  message: '请选择点卡'
                })
            }
        }
        
    },
    submitConfirm(){
        var that=this;
        var data={};
        that.selectIds.forEach(item=>{
            that.infoList.forEach(el=>{
                // console.log(el)
                if(that.isAll){
                    if(item==el.id){
                        data['card[' + item + ']'] = el.max;
                    }

                }
                else{
                    if(item==el.id){
                        if(el.balance==0){
                            this.$dialog.alert({
                              message: '兑换点数不能为0'
                            })
                            return false;
                        }
                        data['card[' + item + ']'] = el.balance;

                    }
                }
                
            })
            
            // that.code_min.push(item.code_min);
            // that.code_max.push(item.code_max);
        })
        this.$http.post('/mall/card2Point',data).then((j) => {
            if(j.data.code==0){
                this.$dialog.alert({
                  message: '兑换成功！'
                }).then(()=>{
                  this.$router.push({name:'myintegral'});
                })
            }
            else{
                this.$dialog.alert({
                  message: j.data.msg
                })
            }
        })
    },

  },
  components:{Emptys} 
};
</script>

