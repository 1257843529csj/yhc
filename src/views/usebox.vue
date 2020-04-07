<template>
  <div class="box paddingBottom">
   <!--  <van-nav-bar
      :title=title
      fixed
    /> -->
    <van-nav-bar
      :title=title
      @click-left=""
      :z-index=999
      fixed
    />
    <div class="mine-info">
      <div class="mine-ava df-c-fs" @click="goInfo">
        <img class="myinfo-con-img" :src="userInfo.avatar">
        <div class="margin-left">
          <p class="font32 font-white">{{userInfo.nick}}</p>
          <div class="font-white font24">
            <img :src="currInfo.img_url" alt />
            {{currInfo.name}}
          </div>
        </div>
      </div>
      <!-- 等级样式 -->
      <div class="myinfo-con-dj">
          <div class="myinfo-con-dj-txt">
              <span v-for="item in levelList" :style="'left:'+item.offleft">v{{item.width}}</span>
          </div>
        <div class="myinfo-con-bar">
            <span class="old-bar" :style="'width:'+oldExp+'%'"></span>
              <span class="all-bar" :style="'width:'+widths+'%'"></span>
        </div>
      </div>
      <div class="mine-fun df-sa">
        <div class="mine-fun-item df-c" @click="goAchieve">
          <img src="../assets/img/icon1.png" />
          <p>我的成就</p>
        </div>
        <div class="mine-fun-item df-c" @click="goMedal">
          <img src="../assets/img/icon2.png" />
          <p>我的勋章</p>
          <van-tag type="danger" round class="my-van-tag" size="medium" v-show="indexInfo.medal!='0'">{{indexInfo.medal}}</van-tag>
        </div>
        <div class="mine-fun-item df-c" @click="goTask">
          <img src="../assets/img/icon3.png" />
          <p>我的任务</p>
          <van-tag type="danger" round class="my-van-tag" size="medium"v-show="indexInfo.task!='0'">{{indexInfo.task}}</van-tag>
        </div>
        <div class="mine-fun-item df-c" @click="goChest">
          <img src="../assets/img/icon4.png" />
          <p>我的宝箱</p>
          <van-tag type="danger" round class="my-van-tag" size="medium"v-show="indexInfo.box!='0'">{{indexInfo.box}}</van-tag>
        </div>
      </div>
      <div class="mine-integral df-c font32" @click="goIntegral">
        我的积分：
        <font class="theme-color font32">{{balance.point}}</font>
        <img src="../assets/img/go-jf.png" alt class="my-icon-link" />
      </div>
      <div class="mine-discount df-sa">
        <div class="mine-fun-item df-c" @click="gomyyhui('mycard')">
          <img src="../assets/img/i1.png" />
          <p>观影通</p>
          <p class="mine-discount-num font999">{{balance.card_num}}张</p>
        </div>
        <div class="mine-fun-item df-c" @click="gomyyhui('myquan')">
          <img src="../assets/img/i2.png" />
          <p>我的券包</p>
          <p class="mine-discount-num font999">{{balance.quan_num}}张</p>
        </div>
        <div class="mine-fun-item df-c" @click="gomyyhui('myhongbao')">
          <img src="../assets/img/i3.png" />
          <p>我的红包</p>
          <p class="mine-discount-num font999">{{balance.coupon_amount}}张</p>
        </div>
        <div class="mine-fun-item df-c">
          <img src="../assets/img/i4.png" @click="gotoaddcard"/>
          <p>添加卡券</p>
        </div>
      </div>
    </div>
    <van-cell-group class="mine-cell-group">
      <van-cell title="我的账户" is-link @click="goLogs">
        <van-icon name="manager-o" slot="icon" color="#999" />
      </van-cell>
      <van-cell title="影片订单" is-link @click="goOrder">
        <van-icon name="orders-o" slot="icon" color="#999" />
      </van-cell>
      <van-cell title="我的电影" is-link @click="goMyMovie">
        <van-icon name="video-o" slot="icon" color="#999" />
      </van-cell>
      <van-cell title="成就排行" is-link @click="goAchieveSort">
        <van-icon name="medel-o" slot="icon" color="#999" />
      </van-cell>
      <van-cell title="购买力排行" is-link @click="goPurchaSort">
        <van-icon name="shopping-cart-o" slot="icon" color="#999" />
      </van-cell>
    </van-cell-group>
  <!--   <van-cell-group class="mine-cell-group">
      <van-cell title="会员商城" is-link >
        <van-icon name="shop-o" slot="icon" color="#999" />
      </van-cell>
    </van-cell-group> -->
      <van-cell-group class="mine-cell-group">
      <van-cell title="建行直销银行" is-link >
        <van-icon name="shop-o" slot="icon" color="#999" />
      </van-cell>
    </van-cell-group>
    <van-cell-group class="mine-cell-group">
      <van-cell title="客服电话" value="400-966-5002" @click="goTel">
        <van-icon name="service-o" slot="icon" color="#999" />
      </van-cell>
    </van-cell-group>
    <van-button type="warning" size="large" class="mine-loginout-btn" color="#ff9c22" @click="Logout">退出登录</van-button>
  </div>
</template>
<script type="text/javascript">
import Tabs from "../components/foot.vue"; 
import { inapp } from "@/assets/js/date.js";
export default {
  data() {
    return {
      userInfo:[],
      currInfo:[],
      indexInfo:[],
      widths:0,
      oldExp:0,
      levelList:[],
      balance:[],
      title:'我的'
    };

  },
  mounted() {
    this.getUserInfo();
    this.getLevel();
    this.getIndex();
    if(inapp()){
      that.tagback_moblie();
    }
  },
  beforeRouteLeave(to, form, next) {
    next()
    if(inapp()){
        window.WebViewJavascriptBridge.callHandler(
                          'isIndex' 
                          , {
                             isindex : false 
                          }  //请求参数
                          , function(responseData) { //回调数据接口
                            
                          }
       );
      }
   
  },
  methods: {
    tagback_moblie(){
       window.WebViewJavascriptBridge.callHandler(
                        'isIndex' 
                        , {
                           isindex : true 
                        }  //请求参数
                        , function(responseData) { //回调数据接口
                          
                        }
     );
    },
    gomyyhui(e){
       this.$router.push({name:e});
    },
    gotoaddcard(){
       this.$router.push({name:'addyhui'});
    },
    getIndex:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/index",
        }).then(j => {
           if(!j){return false}
            that.$nextTick(function(){
                that.indexInfo=j.data.data;
                that.balance=j.data.data.balance;
                // $(".myinfo-con-icon ul li p").show();
            })
            
        })

    },
    getUserInfo:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/member/info",
        }).then(j => {
            if(!j){return false}
            that.userInfo=j.data.data;
        })
    },
    getLevel:function(){
          var that=this;
          this.$http({
          methods: "get",
          url: "/my/level",
          }).then(j => {
              if(!j){return false}
              that.levelInfo=j.data.data;
              that.level=j.data.data.curr.lv;
              that.currInfo=j.data.data.curr;
              var curr=j.data.data.curr.exp;
              var max=j.data.data.max.exp;
              var level=j.data.data.level;
              var clevel=curr-j.data.data.curr.todayExp;
              if(~~clevel<=~~max){
                  that.oldExp=(clevel/max)*100; 
              }
              else if(~~clevel>~~max){
                 that.oldExp=(max/max)*100;
              }

              if(~~curr<=~~max){
                  that.widths=(curr/max)*100;
              }
              else if(~~curr>~~max){
                  that.widths=(max/max)*100;
              }
              for(var i=0;i<level.length; i++){
                  var w=(~~level[i].exp/~~max)*100;
                  var ws=w+"%";
                  var j=i+1;
                  that.levelList.push({'offleft':ws,'width':j})
              }
          })

      },
    goInfo(){
      var that=this;
      this.$router.push({name:'infobox'});
    },
    goAchieve(){
      var that=this;
      this.$router.push({name:'achievebox'});
    },
    goTask(){
      var that=this;
      this.$router.push({name:'taskbox'});
    },
    goMedal(){
      var that=this;
      this.$router.push({name:'medalbox'});
    },
    goChest(){
      this.$router.push({name:'chestbox'});
    },
    goMyMovie(){
      this.$router.push({name:'mymoviebox'});
    },
    goAchieveSort(){
      this.$router.push({name:'achievementsort'});
    },
    goPurchaSort(){
      this.$router.push({name:'purchasort'});
    },
    goTel(){
      window.location.href="tel://400-966-5002";
    },
    goOrder(){
      this.$router.push({name:'orderlist'});
    },
    goLogs(){
      this.$router.push({name:'logsbox'});
    },
    goIntegral(){
      this.$router.push({name:'myintegral'});
    },
    Logout(){
      this.$dialog.confirm({
        message: '确定退出？'
      }).then(() => {
        // on confirm
        localStorage.removeItem("token");
        this.$router.push({name:'indexbox'});
      }).catch(() => {
        // on cancel
      });
      

    }
  },
  components: { Tabs }
};
</script>
<style lang="css" scoped>
.box {
  background-color: #eee;
}
.mine-info {
  margin-top: 46px;
  background: url("../assets/img/bg-top.png") no-repeat;
  background-size: 100% 4.28rem;
  padding-bottom: 0.32rem;
  background-color: #fff;
}
.mine-ava {
  box-sizing: border-box;
  padding: 0.4rem 0.6rem;
}
.margin-left {
  margin-left: 0.1rem;
}
.margin-left img{
  width: .6rem;
  height: auto;
}
.mine-level {
  height: 1rem;
}
.mine-fun {
  width: 6.56rem;
  height: 1.76rem;
  background-color: #fff;
  box-shadow: 1px 3px 3px #eee;
  border-radius: 10px;
  margin: 0 auto;
}
.mine-fun-item {
  flex-direction: column;
  position: relative;
}
.mine-fun-item img {
  width: 0.74rem;
}
.mine-fun-item p {
  text-align: center;
  font-size: 0.24rem;
}
.my-van-tag {
  position: absolute;
  top: -0.15rem;
  right: 0;
}
.mine-integral {
  height: 1.2rem;
}
.my-icon-link {
  width: 0.4rem;
  margin-left: 0.1rem;
  position: relative;
  /*top: 0.05rem;*/
}
.mine-discount {
  margin-bottom: 0.4rem;
}
.mine-discount .mine-fun-item img {
  width: 0.42rem;
  margin-bottom: 0.1rem;
}
.mine-discount-num {
  position: absolute;
  bottom: -0.32rem;
}
.mine-cell-group {
  margin-top: 0.4rem;
  background-color: #fff;
}
.mine-cell-group .van-icon {
  position: relative;
  top: 0.08rem;
  margin-right: 0.1rem;
}
.mine-cell-group .van-cell {
  height: 0.94rem;
}
.mine-loginout-btn.van-button{
  margin: .4rem 0;
}
</style>