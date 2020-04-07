<template>
  <div class="box">
      <van-nav-bar
        :title=title
        left-arrow
        @click-left="onClickLeft"
      />
      <div class="detail_box">
          <div class="codebtn" v-if="nationalQr.length>0" @click="windowShow=true">扫码进场</div>
          <div class="z4 detail_z"></div>
          <p class="detail_name">{{detailInfo.movie_title}}</p>
          <p class="detail_name" style="font-size: .26rem; color: #999">{{detailInfo.cinema_name}}</p>
              <p class="detail_c1">{{detailInfo.plan_date}}  （{{detailInfo.plan_versionsFormat}}）</p>
          <p>{{detailInfo.hall_name}}<em v-for="item in detailInfo.seats">{{item}}</em></p>
          <p class="tline"><b>手机号：{{detailInfo.mobile}}</b> </p>
          <p><b>取票码：{{detailInfo.ticket_pin}}</b></p>
          <div class="code" style="display:none">
      <!--        <img src="--><!--/upfile/code.jpg">-->
          </div>
      </div>
      <div class="line">
      </div>
      <div class="detail_box">
          <p class="detail_name"><i class="icos"></i>请到影院内自助取票机取票</p>
          <div class="flex">
              <div class="t">取票机位置：</div>
              <div class="t1">
                  售票处旁边        
              </div>
          </div>
          <div class="flex"><div class="t">如 何 取 票：</div><div class="t1">凭取票机提示，输入相关取票信息（如订单号、取票码，部分影城需要同时输入订单号+验证码取票，请以影城取票机提示为准）</div></div>
      </div>
      <div class="line">
      </div>
      <div class="detail_box">
          <p class="f30" style="display: none">订单号：</p>
          <p class="f30" style="position:relative; top:0.09rem;">总价：¥{{detailInfo.total_fee}}</p>
          <p class="cc iconfont" style="color:red">该场次不可退票</p>
      </div>
      <div class="line">
      </div>
      <div class="lianxi" @click="goCinema">
          <div class="lx_info">
              <p class="f32">{{detailInfo.cinema_name}}</p>
              <p>{{detailInfo.cinema_addr}}</p>
              <p style="display: none"><i class="iconfont dd"></i>3.9km</p>
          </div>
          <div class="tel" @click.stop="goTel"><div class="j"></div></div>
      </div>
      <div class="codecon">
          <van-popup
            v-model="windowShow"
            position="bottom"
            :style="{ height: '8rem' }" closeable lock-scroll
          >
              <van-nav-bar
                title="扫码进场"
              />
              <van-swipe :autoplay="10000000" indicator-color="#f69e39">
                  <van-swipe-item v-for="(item,index) in nationalQr">
                      <div class="codeimg">
                        <div :id="index">
                            <!-- <img src="http://m.filmfly.cn/up/mv/24/49/69221.jpeg"> -->
                        </div>
                        <p>{{item.seat}}</p>
                      </div>
                  </van-swipe-item>
            </van-swipe>
            <span class="spantxt">温馨提示：尊敬的用户，请您购票后，直接可凭此核销码至影院入场口核验进场，每张电影票对应一个核销码，如多张影票，可点击切换按钮核销。</span>
          </van-popup>  
      </div>
      
  </div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
       title:"订单详情",
       detailInfo:[],
       orderId:'',
       windowShow:false,
       nationalQr:[],

  }
  },
  mounted() {
      var that=this;
      that.orderId=this.$route.query.orderId;
      that.getDetail();

  },
  methods: {
      onClickLeft(){
        this.$router.goBack()
      },
      getDetail(){
          var that=this;
          var conf={}
          var data={
              orderId:that.orderId,
          }
          that.$http.post('/order/detail',data).then((j) => {
              that.detailInfo=j.data.data;
              that.nationalQr=j.data.data.nationalQr;
              that.nationalQr.forEach((el,i)=>{
                console.log(el)
                conf = {
                    text: el.qr,
                    width: 150,
                    height: 150,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                };
                new QRCode(document.getElementById(i), conf);  // 生成二维码
            })
          })

      },
      goCinema(){
          var that=this;
          this.$router.push({ name: "movies", query: { cinemaId: that.detailInfo.cinema_id } });
      },
      goTel(){
          window.location.href="tel://18106052385";
      },
      qrcode() {
        let qrcode = new QRCode('qrcode', {
          width: 132,  
          height: 132,
          text: 'https://www.baidu.com', // 二维码地址
          colorDark : "#000",
          colorLight : "#fff",
        })
      },
  }
   
};
</script>

