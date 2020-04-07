<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title='title'
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div class="boxcon">
      <div class="chest-list" v-for="item in boxlist">
          <img :src="item.icon" class="chest-list-bx">
          <div class="chest-detail">
              <span class="chest-detail-txt">{{item.name}}</span> 
              <div class="chest-con" v-if="item.cnt.length!=0">
                  <span class="chest-con-hb" v-for="items in item.cnt">
                     <img src="../../assets/img/hb.png" v-if="items.card_type==5">
                     <img src="../../assets/img/k.png" v-if="items.card_type==3">
                     <img src="../../assets/img/q.png" v-if="items.card_type==1">
                     <p>X<font>{{items.count}}</font></p>
                  </span>
              </div> 
          </div>
          <div class="chest-num">
              <span v-if="item.count>=0"><font>X</font>{{item.count}}</span>
              <span v-else><font>X</font>0</span>
              <a class="lq" v-if="item.get_status==0" @click="getChest(item.box_id)">领取</a> 
             <!--  <a class="chest-go" v-if="item.get_status==2" @click="goFinish(item)">去完成</a>  -->
             <a class="chest-ylq" v-if="item.get_status==1">已领取</a>
          </div>
      </div>
    </div>
    <!--     弹窗 -->
    <div class="chest_window" v-if="isView">
        <div class="chest_window_con">
            <div class="chest_window_con_title">领取成功</div>
            <div class="chest_window_con_detail">
                <div class="chest_img">
                    <div class="chest_img_list" v-for="item in getBoxList" v-if="item.count!=0">
                        <img src="../../assets/img/hb2.png" v-if="item.card_type==5">
                        <img src="../../assets/img/ka2.png" v-if="item.card_type==30">
                        <img src="../../assets/img/quan2.png" v-if="item.card_type==1">
                        <span v-if="item.card_type==5">红包X{{item.count}}</span> 
                        <span v-if="item.card_type==3">观影卡X{{item.count}}</span> 
                        <span v-if="item.card_type==1">兑换券X{{item.count}}</span> 
                    </div>
                </div>
                <div class="chest_tip">可在[我的]-[我的账户]查看奖励<br>详细使用规则</div>
            </div>
            <a @click="closevindow">确认</a>
        </div>
    </div>
    <Emptys v-if="isempty"></Emptys>
</div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"我的宝箱",
        boxlist:[],
        isView:false,
        getBoxList:[],
        isempty:false,
    };
  },

  mounted() {
      var that = this;
      that.get_BoxList();
     
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    get_BoxList:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/box",
        }).then(j => {
            that.boxlist=j.data.data;
            if(j.data.data.length==0){
                that.isempty=true;
            }
        })
    },
    getChest:function(id){
        var that=this; 
        this.$http({
          methods: "get",
          url: "/my/getBox",
          params: {
              cntId:id,
            }
        }).then(j => {
          if (j.data.code==0) {
              that.getBoxList=j.data.data;
              that.isView=true;
          }
          else{
            this.$dialog.alert({
              message: j.data.msg
            }).then(() => {
              // on close
            });
            //console.log(j.data)
          }
        })
    },
    closevindow:function(){
        var that=this;
        that.isView=false;
        that.get_BoxList();
    }

     
  },
  components:{Emptys}
};
</script>
