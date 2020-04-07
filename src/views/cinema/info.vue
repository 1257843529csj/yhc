<template>
  <div class="box">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="box2 cinema-title">
        <p>
            <van-icon name="location-o" color="#ff9c22" size="18px"/>
            <a @click="cinema_map_jump()" style="display:inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 81%;">{{result.addr}}</a>
            <van-icon name="phone" color="#ff9c22" size="18px" style="float:right" @click="call(result.tel)"/>

        </p>                
    </div>
    <div class="cinema-look" v-if="result.watched_count>10" @click="cinemaRatio">
        <span ><font>{{result.watched_count}}</font>人在这看过</span>
        <!-- <van-icon name="arrow" color="#ccc"/> -->
    </div>
    <div class="box2 ggaobox" v-if="result.sale!=''">
        <h3>影院公告</h3>
        <div class="ggao">
            <div id="txts1" class="ggao_cont" :class="fold?'ggao_more':''" @click="moreInfo" v-html="replaceBr(result.sale)"></div>
            <van-icon name="arrow-down" v-if="!fold&&isLow"/>
            <van-icon name="arrow-up" v-else-if="fold&&isLow"/>
        </div>
    </div>
    <div class="box2" style="display:block">
        <h3>影院特色</h3>
        <ul>
            <li v-if="result.goods!=''">
                <em>卖品 </em>
                <span>{{result.goods}}</span>
            </li>
            <li v-if="result.td_glass!=''">
                <em> 3D眼镜 </em>
                <span>{{result.td_glass}}</span>
            </li>
            <li v-if="result.children!=''">
                <em> 儿童优惠</em>
                <span>{{result.children}}</span>
            </li>
            <li v-if="result.parking!=''">
                <em> 停车</em>
                <span>{{result.parking}}</span>
            </li>
        </ul>
    </div>
    <div class="line-box"></div>
    <div class="box2" v-if="result.info!=''">
        <h3>影院介绍</h3>
        <div class="yyuan" v-html="result.info">
        </div>
    </div> 
</div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
export default {
  data() {
    return {
        title:"", 
        result:[],
        getcinemaId:'',
        fold:false,
        isLow:false,
    };
  },

  mounted() {
    var that=this;
    that.getcinemaId = this.$route.query.cinemaId;
    that.getCinemaInfo(that.getcinemaId);

  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getdata(k,i){
      var time;
      time=times(k,i);
      return time;
    },
    getCinemaInfo:function(cinemaId){
        var that=this;
        this.$http({
        methods: "get",
        url: "/cinema/info",
        params: {
          cinemaId: cinemaId,
        }
        }).then(j => {
            that.result=j.data.data;
            if(j.data.data.sale.length!=0){
                that.$nextTick(function(){
                    var a=document.getElementById('txts1');
                    var b=parseFloat(getComputedStyle(a)["lineHeight"]);
                    var ah=Math.round(a.offsetHeight/b);
                    if(ah>2){
                        that.isLow=true;
                    }
                })
            }
            
            var memberId;
            if(j.data.data.member!=''){
                memberId=j.data.data.member.id;
            }
            else{
                memberId="";
            }
            that.title = that.result.name;
        })
    },
    call:function(item){
        window.location.href="tel://"+item;
    },
    moreInfo:function(){
        var that=this;
        that.fold=!that.fold;
        
    },
    cinema_map_jump:function(){
        var that=this;
        this.$router.push({name:'mapbox',query:{cinemaId:that.getcinemaId}});

    },
    cinemaRatio:function(){
        // window.location.href="ratio.html?cinemaId="+getUrlQuery("cinemaid");
    },
    replaceBr(a){
       if(a !=undefined||a !=null){
        // return a
          return a.replace(/[\n\r]/g,'<br>');
       }
      
    }
     
  }
};
</script>
<style lang="css" scoped>
.cinema-title{
    padding: 0.55rem .3rem .55rem .3rem;
}
.cinema-title .van-icon-location-o:before{
    margin-right: .2rem;
}
.cinema-title .van-icon-phone:before{
    float: right;
    margin-left: .2rem;
}
.cinema-look .van-icon-arrow:before{
    line-height: .9rem;
}
.cinema-look{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    width: 100%;
    height: .9rem;
    background: #f5f5f5;
}
.cinema-look span{
    position: relative;
    left: .3rem;
    line-height: .9rem;
    font-size: .28rem;
}
.cinema-look span font{
    color: #ff9c22;
}
.box1 .xialas {
    text-align: center;
    margin: 0;
    border: none;
    padding: 0
}

.jj:before {
    content: '\e658';
    font-size: 20px
}

.ggao_cont {
    font-size: .28rem;
    margin: 0.2rem 0 0 0;
    display: -webkit-box;
    -webkit-box-orient:vertical;
    overflow: hidden;
    -webkit-line-clamp:3;
    line-height: .4rem;
}
.ggao_more{
    -webkit-line-clamp:100 !important;
}
.ggao .van-icon{
    display: block;
    margin-top: .2rem;
}
.ggao .van-icon-arrow-down:before{
    display: block;
    text-align: center;
    margin: 0 auto;
}
.ggao .van-icon-arrow-up:before{
    display: block;
    text-align: center;
    margin: 0 auto;

}
.box2 {
    padding: 0 0.3rem 0.2rem 0.3rem;
}
.cinema-title {
    padding: 0.55rem .3rem .55rem .3rem;
}
.box2 li {
    border-bottom: solid 1px #eee;
    font-size: .28rem;
    padding-top: 0.26rem;
    padding-bottom: 0.26rem;
    display: flex;
    -webkit-display: flex;
    align-items: center
}

.box2 li em {
    display: block;
    color: #ff9c22;
    border: solid 1px #ff9c22;
    width: 1.2rem;
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: center;
    font-size: .2rem;
    margin: 0 0.1rem 0 0;
    -moz-border-radius: 5px;
 /* Firefox */
    -webkit-border-radius: 5px;
 /* Safari 和 Chrome */
    border-radius: 5px;
 /* Opera 10.5+, 以及使用了IE-CSS3的IE浏览器 */
}

.box2 li span {
    width: 6.0rem;
}
.box2 h3 {
    font-size: .32rem;
    margin: .4rem 0 0 0;
    color: #000;
}
.yyuan {
    font-size: .27rem;
    margin: 0.2rem 0 0 0;
}
</style>
