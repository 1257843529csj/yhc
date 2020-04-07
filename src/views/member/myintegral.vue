<template>
  <div class="box">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="integral_img">
        <div class="integral_img_con">
            <span>积分余额</span>
            <span class="integral_img_txt">{{infoList.total.total}}</span>
            <!-- <a @click="goMall">会员商城，享受优惠<van-icon name="arrow" color="#fff" /></a> -->
        </div>
        <!-- <div class="integral_img_active"  @click="goExchange" >
            <span>查看点卡兑换积分规则</span>
            <span>分<font>享</font>多一点 优<font>惠</font>多一点</span>
        </div> -->
    </div>
    <div class="integral_info">
        <div class="integral_info_con">
            <span><img src="../../assets/img/icon-jf.png"> 积分明细</span>
            <span>收入：{{infoList.total.input}} 支出：{{returnNum(infoList.total.output)}}</span>
        </div>
        <div class="integral_info_div">
            <div class="integral_info_list" v-if="infoList.list&&infoList.list.length>0" v-for="item in infoList.list" @click="goDetail(item)">
                <span>{{item.reason1}}<font>{{item.created}}</font></span>
                <p v-if="item.opt_type==-1">{{item.point}}</p>
                <p v-else>{{item.point}}</p>

            </div>
            <Emptys v-if="isempty"></Emptys>
        </div>
        
    </div>
   
  </div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"我的积分",
        infoList:{
            total:{},
            list:[],
        },
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
          url: "/my/point",
          }).then(j => {
            if(j.data.code==0){
                that.infoList={
                    total:j.data.data.total,
                    list:j.data.data.list,
                }; 
                if(j.data.data.list.length==0){
                    that.isempty=true;
                }
            }            
        })
    },
    goMall(){
        // window.location.href="wap21/mall/index.html";
    },
    goExchange(){
        this.$router.push({name:'integralinfo'});
    },
    returnNum(num){
        var that=this;
        if(num==0){
            return num;
        }
        var a=Math.abs(num);
        return a.toFixed(2);

    },
    goDetail(item){
        // this.$router.push({name:'integraldetail',query:{id:item.id}});

    },
      
  },
  components:{Emptys}
};
</script>

