<template>
  <div class="box">
      <van-nav-bar
        :title=title
        left-arrow
        @click-left="onClickLeft"
      />
<!--       <van-tabs v-model="active" swipeable>
          <van-tab title="影片订单">
          </van-tab>
          <van-tab title="商城订单">
          </van-tab>
      </van-tabs> -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
          <van-cell class="order_box" v-for="item in ordrtList" v-if="show">
              <div class="z1" v-if="item.status==1"></div>
              <div class="z2" v-else-if="item.status==3"></div>
              <div class="z3" v-else-if="item.status==4"></div>
              <div class="z4" v-else-if="item.status==5||item.status==6"></div>
              <div class="yingyuan" @click="goCinema(item)">
                  <font class="iconfont cinema_jump">
                      <i class="cinemaname">{{item.cinema_name}}</i>
                      <van-icon name="arrow" color="#d6d6d6" size="20px"/>
                  </font>
                  <div class="order_time" >
                      <div class="order_time_con" v-if="item.status==0">
                          <van-icon name="underway-o" color="#ff9c22" size="15px"/>
                          <em>剩余付款时间：{{runtime}}</em>
                      </div>
                      <van-icon name="delete" color="#acacac" size="20px" v-else  @click.stop="deleteOrder(item)"/>
                      
                  </div>
              </div>
              <div class="dindan" @click="goOrderDetail(item)">
                  <div class="moviepic">
                      <img :src="item.movie_cover">
                  </div>
                  <div class="movie_txt">
                      <h3>{{item.movie_title}}</h3>
                      <p>{{item.plan_date}}</p>
                      <p>{{item.hall_name}}:<font v-for="items in item.seats">{{items}}</font></p>
                  </div>
              </div>
              <div class="tool">
                  <div class="money">
                      {{item.total_fee_show}}
                      <!-- <em class="newem" style="display: none;">出票成功</em> -->
                    
                  </div>
                  <div class="pay" v-if="item.status==0">
                      <a href="javascript:void(0)">付款</a>
                  </div>
              </div>
          </van-cell>
      </van-list>
        
  </div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
export default {
  data() {
    return {
      active:0,
      ordrtList:[],
      loading: false,
      finished: false,
      page:1,
      runtime:'',
      title:'我的订单',
      show:true

  }
  },
  mounted() {
      var that=this;

  },
  methods: {
      onClickLeft(){
        this.$router.goBack()
      },
      onLoad(){
          var that=this;
          var data={
              "page":that.page,
          }
          that.$http.post('/order/all',data).then((j) => {
              var result=j.data.data.list;
              if(result.length!=0){
                  that.ordrtList = that.ordrtList.concat(result);
                  that.ordrtList.forEach(el=>{
                      if(el.order_pay_time_left>0){
                          that.runtimes(el.order_pay_time_left);
                      }
                  })
                  that.page+=1;
                  this.loading = false;
              } 
              else{
                  this.show = false;
                  this.finished = true;
                  this.loading = false;
              }   

          })

      },
      getdata(k,i){
        var time;
        time=times(k,i);
        return time;
      },
      runtimes: function (t) {
          var that = this
          var sstr, timestr, ii;
          var etime = t;
          function timer() {
              sstr = etime;
              timestr = /*hstr + ":"+ mstr + "分" + */ sstr;
              etime = etime - 1;
              if (etime > 0) {
                  that.runtime = that.getdata(timestr,5);
              } else {
                  clearInterval(ii);
              }
          }

          ii = setInterval(function () {
              timer()
          }, 1000);
      },
      goCinema(item){
          this.$router.push({ name: "movies", query: { cinemaId: item.cinema_id } });

      },
      goOrderDetail(item){
          var that=this;
          if(item.status==0){
              this.$router.push({ name: "optionspay", query: { orderId: item.id } });
          }
          else{
              this.$router.push({ name: "orderdetail", query: { orderId: item.id } });
          }
      },
      deleteOrder(item){
          var that=this;
          var data={
              "orderId":item.id,
          }
          this.$dialog.confirm({
            message: '确定要删除吗'
          }).then(() => {
            // on confirm
            that.$http.post('/order/del',data).then((j) => {
                if(j.data.code==0){
                  this.$dialog.alert({
                    message: j.data.data
                  }).then(() => {
                    // on close
                  });

                }
            })
          }).catch(() => {
            // on cancel
          })
      }
  }
   
};
</script>
