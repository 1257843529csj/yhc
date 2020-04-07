<template>
  <div class="box">
    <div class="movie-box">
      <div class="hymovie">
        <div class="my-position font30 font333" @click="cityView">{{cityname}}<van-icon name="arrow-down" size="10" style="margin-left: 0.19rem;top:.03rem"/></div>
        <van-icon name="search" size="26" color="#FF9C22" class="my-search" @click="goSearch"/>
        <!-- <van-tabs v-model="active" color="#ff9a00" title-active-color="#ff9a00" line-width="85" animated swipeable class="my-tabs-container" @change="tabChangeHandle" :border='false'> -->
        <nav>
            <div class="navgation">
                <span class="cur">正在热映</span><span>即将上映</span><i></i>
            </div>
        </nav>
      </div>
       <div style="height:46px"></div>
       <div class="banner" v-if="bannerlist.length!=0">
          <div class="swiper-containers">
              <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="item in bannerlist">
                      <img :src="item.img" @click="goIframe(item.url)"/>
                  </div>
              </div>
              <!-- Add Pagination -->
              <div class="swiper-pagination"></div>
          </div>
        </div>
      <div class="swiper-container containers1" >
          <div class="swiper-wrapper" id="swiper-h">
              <div class="swiper-slide">
                  <div class="hotlive" v-if="!lshow">
                    <div v-for="item in movielist" :key="item.movie_id">
                      <div class="hotlist"  @click-thumb="movieThumbClick(item)" @click="movieDetail(item.movie_id)">

                        <div slot="thumb" class="my-card-thumb ">
                          <img :src="item.cover" alt class="my-thumb-img" />
                          <van-icon name="play-circle-o" size="40" class="my-play-icon" color="#fff" v-if="item.has_video != 0" />
                          <div slot="tag" class="youhui2">
                            <img src="../assets/img/movie_pic2.png" alt class="my-tag-icon" v-if="item.sale_status == 1" />
                            <img src="../assets/img/yh_hu.png" alt class="my-tag-icon" v-if="item.psl" />
                          </div>
                        </div>
                        
                        <div slot="desc" class="m_text">
                          <h2>
                            <font>{{item.title}}</font>
                            <em v-if="getVersions(item.versionsFormat)==2">{{item.versionsFormat}}</em>
                          </h2>
                          <p class="my-desc" v-if="item.sale_status == 1">{{item.wish_count}}人想看 {{item.show_info}}</p>
                          <h3 class="my-desc" v-if="item.sale_status == 2">观众评分：{{item.rates}}分</h3>
                          <p class="van-ellipsis" v-if="item.casts">主演：{{item.casts}}</p>
                          <p class="van-ellipsis" v-if="item.directors">导演：{{item.directors}}</p>
                          
                          <div slot="tags">
                            <van-button type="warning" size="mini" v-if="item.todayHot == 1">今日最热</van-button>
                            <van-button type="primary" size="mini" v-if="item.weekHotMovie == 1">一周最热</van-button>
                            <van-button type="danger" size="mini" v-if="item.maxRateMovie == 1">口碑最佳</van-button>
                          </div>
                          <div slot="num" class="my-desc-btn">
                        
                            <van-button plain type="primary" size="small" round v-if="item.sale_status == 1" @click.stop="goBuy(item.movie_id)" :class="item.psl ? 'redBtn':''">预售</van-button>
                            <van-button type="warning" size="small" round v-if="item.sale_status == 2" @click.stop="goBuy(item.movie_id)" :class="item.psl ? 'redBtn':''">购票</van-button>
                          </div>
                        </div>
                        
                      </div>
                      <!-- </van-card> -->
                    </div>
                  </div>
                  <van-loading type="spinner" class="loadingz" v-if="lshow" />
              </div>
              <div class="swiper-slide">
                  
                  <van-cell value="近期最受期待影片" />
                  <div class="hotmovie">
                    <div class="swiper-container3">
                      <div class="swiper-wrapper">
                          <div class="swiper-slide" v-for="(item,index) in wishList" v-if="index<12"
                              @click="movieDetail(item.movie_id)">
                              <!-- <div class="youhui3" v-if="item.psl"></div> -->
                              <img class="beonmovie-img" :src="item.cover">
                              <i class="wish-counts">{{item.wish_count}}人想看</i>
                              <span class="beonmovie-name">{{item.title}}</span>
                              <p class="beonmovie-time">{{item.release_time}}</p>
                              <div class="my-swipe-like df-c" @click.stop="moiveLike(item)">
                                <van-icon name="like-o" color="#555" v-if="item.has_fav == '0'" />
                                <van-icon name="like" color="rgb(255,0,0)" v-if="item.has_fav == '1'" />
                              </div>
                              <em class="upcoming-style" v-if="getVersions(item.versionsFormat)==2">{{item.versionsFormat}}</em>

                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="paddingBottom">
                    <div class="coming-item" v-for="(item,key,index) in comingList" :key="index">
                      <van-cell title :value="key + '年'" class="my-cell-title" />
                      <div v-for="(items,keys) in item" :key="keys">
                        <van-cell :title="keys + '月'" class="my-cell-title2" />
                        <div class="df-sw-fs coming-ele" v-for="ele in items" :key="ele.movie_id">
                          <span class="font28 font666 date-text2">{{formatDateTime(ele.release_time,1)}}日</span>
                          <!-- <van-card :title="ele.title" class="my-van-card my-van-card2" @click-thumb="movieThumbClick(ele)" @click="movieDetail(ele.movie_id)"> -->
                          <div class="hotlist" @click-thumb="movieThumbClick(ele)" @click="movieDetail(ele.movie_id)">  
                            <div slot="thumb" class="my-card-thumb">
                              <img alt class="my-thumb-img" v-lazy="ele.cover" />
                              <van-icon name="play-circle-o" size="40" class="my-play-icon" color="#fff" v-if="ele.has_video != 0" />
                            </div>
                            
                            <div slot="desc" class="m_text" style="width:4.5rem;">
                              <h2>
                                <font>{{ele.title}}</font>
                                <em v-if="getVersions(item.versionsFormat)==2">{{ele.versionsFormat}}</em>
                              </h2>
                              <h3 class="my-desc">{{ele.wish_count}}人想看 {{ele.show_info}}</h3>
                              <p class="my-desc2 van-ellipsis" v-if="ele.casts">主演：{{ele.casts}}</p>
                              <p class="my-desc2 van-ellipsis" v-if="ele.directors">导演：{{ele.directors}}</p>
                              <div slot="tags">
                                <van-button type="warning" size="mini" v-if="ele.todayWish == 1">最受期待</van-button>
                              </div>
                              <div slot="num" class="my-desc-btn" style="right:.2rem;">
                                <van-button plain type="primary" size="small" round v-if="ele.sale_status == 1" @click.stop="goBuy(ele.movie_id)">预售</van-button>
                                <van-button plain type="warning" size="small" round v-if="ele.sale_status != '1' && ele.has_fav == '0'" @click.stop="moiveLike(ele)">想看</van-button>
                                <van-button plain type="warning" size="small" round v-if="ele.sale_status != '1' && ele.has_fav == '1'" @click.stop="moiveLike(ele)">已想看</van-button>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      <!-- </van-tabs> -->
    </div>
    <van-popup
      v-model="cityShow" closeable
      position="top"
      :style="{ height: '100%',background: '#eee'}"
    >
        <Citys @func="getNameFormCity"></Citys>
     </van-popup>
  </div>
</template>
<script type="text/javascript">
import Swiper from "swiper";
import "swiper/css/swiper.css";
import { times,inapp } from "@/assets/js/date.js";
import $ from 'jquery';
import Citys from "../components/city.vue"

export default {
  data() {
    return {
      active: "",
      actives: {}, //zzry正在热映 jjsy即将上映 两个属性都存在则都已请求
      bannerlist: [],
      movielist: [],
      wishList: [],
      comingList: [],
      lshow:true,
      cityShow:false,
      cityname:'',
      test:false,
      isJoin:false,
    };
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
  mounted() {
    var that=this;
    this.getName();
    this.initFun();
    if(inapp()){
      that.tagback_moblie();
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
    getName(){
      var that = this;
      var name;
      name=localStorage.getItem("cityname");
      if(name != null){
        if(name.length>3){
            that.cityname=name.substring(0, 2)+'...';
          }
          else{
            that.cityname=name.replace('市', '');
          }
        }
    },
    // 初始化
    initFun() {
      this.fetchBanner();
      this.fetchList();
      this.active = this.$route.query.active
        ? this.$route.query.active
        : "zzry";
      // if (this.active == "zzry") {
      //   this.fetchList();
      // }
      if (this.active == "jjsy") {
        this.fetchWishList();
        this.fetchComingList();
      }
      this.actives[this.active] = 1;
    },
    fetchList() {
      var that=this;
      var arr = [];
      var titleNum = 0;
      var listNum = 0;
      var listHight = 0;
      this.$http.get("/movie/lists").then(res => {
        this.movielist = res.data.data;
        var heightH=this.movielist.length;
        $(".swiper-slide").css("height",heightH*2.9+"rem");
        $("#swiper-h").css("height","auto");
        this.$nextTick(function () {
          var swiper = new Swiper('.containers1', {
                autoHeight: true,
                observer: true,
                observeParents: true,
                height: 1000,
                on:{
                  slideChange: function () {
                    $(".navgation").find("span").eq(this.activeIndex).addClass("cur").siblings().removeClass("cur");
                    if(this.activeIndex==1){
                      $(".navgation").find("i").removeClass("move2").addClass("move");
                      if(!that.isJoin){
                        that.isJoin=true;
                        that.fetchComingList();
                        that.fetchWishList();
                      }
                      
                    }
                    else{
                      $(".navgation").find("i").removeClass("move").addClass("move2");
                    }
                  },
                },
                
            })
            // var a = getUrlQuery("a")
              if (this.active=="jjsy") {
                  swiper.slideTo(1, 0, false);//切换到第一个slide，速度为1秒


              } else {
                  $(".navgation i").removeClass().addClass("move2");
                  swiper.slideTo(0, 0, false);//切换到第一个slide，速度为1秒
              }
            $(".navgation").on("click", 'span', function () {
                $(".navgation span").removeClass("cur");
                $(this).addClass("cur");
                var t = $(this).index();
                if (t == 1) {
                    $(".navgation i").removeClass().addClass("move")
                    swiper.slideTo(1, 1000, false);//切换到第一个slide，速度为1秒
                    if(!that.isJoin){
                        that.isJoin=true;
                        that.fetchComingList();
                        that.fetchWishList();
                      }
                   
                } else {
                    $(".navgation i").removeClass().addClass("move2");
                    swiper.slideTo(0, 1000, false);//切换到第一个slide，速度为1秒
                }
            });
            
        })
      });
      this.$nextTick(function(){
         setTimeout(()=>{this.lshow = false},1000)
      })

    },
    goIframe(item){
      console.log(item)
      if(item==''){
        return false;
      }
      // 获取参数
      var name,value; 
      var csstring='';
      if(item.indexOf("?")!=-1){
           console.log(1)
          var num=item.indexOf("?") 
          var linkcs=item.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
          var arr=linkcs.split("&"); //各个参数放到数组里
          for(var i=0;i < arr.length;i++){ 
              num=arr[i].indexOf("="); 
              if(num>0){ 
                  name=arr[i].substring(0,num);
                  value=arr[i].substr(num+1);
                  this[name]=value;
                      
                      if(i==arr.length-1){
                        csstring=csstring+name+':'+value
                      }
                      else{
                        csstring=csstring+name+':'+value+",";
                      }
              } 
          }
      }
            
        // console.log(arr)
        // 获取跳转地址名字
        var linkdz=item.split("?");
        var namelink=linkdz[0].substring(linkdz[0].lastIndexOf("/")+1);
        if(namelink&&namelink.indexOf("html")<0){
          if(csstring.length>0){
            var csobj="{"+csstring+"}";
            var str=csobj.replace(/(\w+):(\w+)/,'"$1":"$2"');
            var astr=JSON.parse(str);  //字符串转对象
            namelink=namelink.toLowerCase();

            this.$router.push({name:namelink,query:astr});  
          }
          else{
            this.$router.push({name:'iframebox',query:{srclink:item}});
          }

        }
        else{
          this.$router.push({name:'iframebox',query:{srclink:item}});
        }
            // 
    },
    lazyload: function () {
        var n = 0,
        imgNum = $(".my-thumb-img").length;
        // alert(imgNum)
        var img;
        img = $(".my-thumb-img");
        for (var i = n; i < imgNum; i++) {
            if (img.eq(i).offset().top < parseInt($(window).height()) + parseInt($(window).scrollTop())) {
                if (img.eq(i).attr("src") == "../img/default.jpg") {
                    /* alert(1)*/
                    var src = img.eq(i).attr("data-src");
                    img.eq(i).attr("src", src);
                    n = i + 1;
                }
            }
        }
    },
    lazyload2: function () {
        var n = 0,
        imgNum = $(".hotlive .my-thumb-img").length;
        console.log(imgNum)
        var img;
        img = $(".my-thumb-img");
        for (var i = n; i < imgNum; i++) {
            if (img.eq(i).offset().top < parseInt($(window).height()) + parseInt($(window).scrollTop())) {
                if (img.eq(i).attr("src") == "../img/default.jpg") {
                    /* alert(1)*/
                    var src = img.eq(i).attr("data-src");
                    img.eq(i).attr("src", src);
                    n = i + 1;
                }
            }
        }
    },

    fetchBanner() {
      var that=this;
      this.$http({
            methods: "get",
            url: "/movie/getbanner",
            params: {
              site:1
            }
        }).then(j => {
            this.bannerlist = j.data.data;
            that.$nextTick(function () {
                var swipers = new Swiper('.swiper-containers', {
                    autoplay: {
                      autoplay:true,
                      disableOnInteraction: false,
                    },
                    loop : true,
                    pagination: {
                      el: '.swiper-pagination',
                      clickable :true,
                    },
                    observer: true,
                    observeParents: true
                })
            })
        })
    },
    fetchWishList() {
      var that=this;
      this.$http.get("/movie/getWishUpcoming").then(res => {
        res.data.data.forEach(el => {
          el.release_time = times(el.release_time, 1);
        });
        this.wishList = res.data.data;
        that.$nextTick(function () {
            $(".swiper-slide").css("height","auto");
            $("#swiper-h").css("height","auto");
            var swiperss = new Swiper('.swiper-container3',{
              lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 5,
              },
              observer:true,
              observeParents:true,
              slidesPerView : 'auto',
              centeredSlides:false,
              freeMode: true
              /*slidesOffsetBefore:0,*/
          })
        })
      });
    },
    fetchComingList() {
      this.$http.get("/movie/getUpcoming").then(res => {
        var that=this;
        this.comingList = res.data.data;
        
      });
    },
    bannerLink(url) {
      // banner详情
    },
    movieDetail(id) {
      this.$router.push({ name: "showbox", query: { movieId: id } });
    },
    movieThumbClick(item) {
      if (item.has_video == 0) {
        this.$router.push({ name: "showbox", query: { movieId: id } });
      } else {
        // 电影预告播放
      }
    },
    goBuy(id) {
      // 电影购票
      this.$router.push({name:'cinemabox',query:{movieId:id}});
    },
    goSearch(){
      this.$router.push({name:'selectbox'});
    },
    moiveLike(item) {
      // 添加喜欢
      var data = {
        fav: item.has_fav == "1" ? 0 : 1,
        movieId: item.movie_id
      };
      this.$http.post("/movie/fav", data).then(j => {
          if(j.data.code==0){
              if(item.has_fav=='1'){
                  item.has_fav=0;
                  item.wish_count--;
                  this.$toast('想看电影已取消');
              }
              else{
                  item.wish_count++;
                  item.has_fav=1;
                  this.$toast('已添加为想看电影');
              }
          }
        }).catch(err => {});
    },
    formatDateTime(timeStampm) {
      var time = new Date(timeStampm * 1000);
      return time.getDate();
    },
    tabChangeHandle(val) {
      console.log(val)
      switch (this.actives[val]) {
        case 1:
          break;
        default:
          this.actives[val] = 1;
          switch (val) {
            case "jjsy":
              this.fetchWishList();
              this.fetchComingList();
              window.location.href=this.changeURLArg(window.location.href,'active','jjsy');
              break;
            case "zzry":
              this.fetchList();
              window.location.href=this.changeURLArg(window.location.href,'active','zzry');
              break;
          }
      }
    },
    changeURLArg(url,arg,arg_val){
        var pattern=arg+'=([^&]*)';
        var replaceText=arg+'='+arg_val; 
        if(url.match(pattern)){
            var tmp='/('+ arg+'=)([^&]*)/gi';
            tmp=url.replace(eval(tmp),replaceText);
            return tmp;
        }else{ 
            if(url.match('[\?]')){ 
               return url+'&'+replaceText; 
            }else{ 
                 return url+'?'+replaceText; 
            } 
        }
    },
    getNameFormCity(data){
        var that=this;
        if(data.length>3){
          that.cityname=data.substring(0, 2)+'...';
        }
        else{
          that.cityname=data.replace('市', '');
        }
        
        localStorage.setItem("selectname",data);
        this.initFun();
        that.cityShow=false;

    },
    cityView(){
          var that=this;
          that.cityShow=true;
    },
    getVersions:function(versions){
        if(versions==null){
          return false;
        }
        if(versions&&versions.replace(/(^\s*)|(\s*$)/g, "")=='2D'||versions==''||versions==false){
            return 1;  
        }
        else{
            return 2;  
        }
    },
  },
  components:{Citys}
};
</script>
<style>
.van-swipe__indicator{
  width: 8px!important;
  height: 8px!important;
}
.my-tabs-container .van-tabs__wrap {
  width: 60%;
  margin: 0 auto;
}
.movie-box .my-tabs-container .van-tabs__wrap{
  position: fixed;
  width: 100%;
  z-index: 100;
  background: #fff;

}
.movie-box .van-tabs__nav--line{
  width: 60%;
  margin: 0 auto;
}
.movie-box .van-tabs__content{
  position: relative;
  top: 45px;
}

</style>
<style lang="css" scoped>
/*.containers1 .swiper-wrapper{
  height: 100%!important;
}*/
.swiper-container3 {
    height: 3.2rem;
    overflow: hidden;
    border-bottom: .16rem solid #eee;
}
.movie-box, .box{
  height: 100%;
}

.swiper-container3 .swiper-slide {
    width: 1.6rem !important;
    margin-left: .12rem;
}
/*.swiper-container-autoheight, .swiper-container-autoheight .swiper-slide{
  height: 100%;
}*/
.hotlist{
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  border-bottom: solid 1px #eee;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: .2rem 0;
  
}
.my-card-thumb{
  position: relative;
}
.my-card-thumb .van-icon{
  z-index: 10;
  position: absolute;
  top: calc((100% - 40px) / 2);
  left: calc((100% - 40px) / 2);
}
.hotlist img{
    width: 1.6rem;
    height: 2.16rem;
    overflow: hidden;
    position: relative;
}
.m_text {
    position: relative;
    width: 5.15rem;
    margin: 0 0 0 0.2rem;
}
.m_text h2 {
    font-size: .28rem;
    color: #333;
    font-weight: normal;
    overflow: hidden;
    margin: 0.2rem 0;
}
.m_text h2 font {
    float: left;
    height: .35rem;
    line-height: .35rem;
    display: inline-block;
    max-width: 65%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.m_text h2 em{
    position: relative;
    margin-left: .1rem;
    border-radius: 5px;
    padding: 0 .1rem;
    background: #666;
    font-size: .2rem;
    color: #CCCCCC;
    border: 1px solid #666;
}
.m_text h3 {
    display: block;
    font-weight: normal;
    font-size: .28rem;
    color: #FF9C22;
    margin-bottom: .2rem;
}
.my-desc-btn{
    width: 1.05rem;
    height: .48rem;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 1.2rem;
}
.my-position{
  position: fixed;
  left: 16px;
  z-index: 1000;
}
.my-search{
  position: fixed;
  top: .21rem;
  right: 16px;
  z-index: 1000;
}
.banner{
  margin-top: 0;
}
.banner .van-swipe-item{
  width: 100%;
  height: 2.08rem;
}
.banner-img {
  width: 100%;
  height: 100%;
}
.my-van-card.van-card {
  padding: 8px 0;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.my-van-card .van-card__title {
  font-size: 0.28rem;
  font-weight: bold;
  color: #2b2b2b;
}
.my-van-card .van-card__thumb {
  width: 1.6rem;
  height: 2.16rem;
}
.my-thumb-img {
  width: 100%;
}
.my-van-card .my-desc {
  margin: 0.2rem 0;
  font-size: 0.28rem;
  color: #ff9c22;
}
.my-desc2 {
  width: 65%;
  color: #999;
  line-height: 1.8;
}
.my-van-card .van-card__bottom {
  position: relative;
  top: -1rem;
  height: 1px;
}
.hotlive {
  box-sizing: border-box;
  padding: 0rem 0.2rem 1rem;
  margin: 0!important;
}
.banner img{
  width: 100%;
  height: 2.08rem;
}
.my-tag-icon {
  width: 0.77rem;
}
.my-van-card .van-card__tag {
  top: 1px;
}
.my-van-card .van-button--warning {
  background-color: #ff9c22;
}
.my-van-card .van-button--plain.van-button--primary {
  color: #88cc22;
  border-color: #88cc22;
}
.my-van-card .van-button--plain.van-button--warning {
  color: #ff9c22;
  background-color: #fff;
  border-color: #ff9c22;
}
.van-card__thumb {
  position: relative;
}
.my-van-card .my-play-icon {
  z-index: 10;
  position: absolute;
  top: calc((100% - 40px) / 2);
  left: calc((100% - 40px) / 2);
}
.my-van-card .van-button--mini.van-button--warning {
  background-color: #f56430;
}
.redBtn {
  background-color: red !important;
  color: #fff !important;
}
.hotmovie {
  height: 3.2rem;
  /* overflow: hidden; */
  border-bottom: 0.16rem solid #eee;
}
.my-swipe-item {
  padding-left: 6px;
  box-sizing: border-box;
}
.my-swipe-img {
  width: 100%;
  height: 2.16rem;
}
.date-text {
  margin: 0.12rem 0;
}
.wish-nums {
  width: calc(100% - 6px);
  color: #ff9c22;
  text-align: center;
  position: absolute;
  top: 1.84rem;
  height: 0.32rem;
  font-size: .18rem;
  font-style: normal;
  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0.3)),to(rgba(0,0,0,1)));
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.3),rgba(0,0,0,1));
  opacity: 0.8;
  overflow: hidden;
  font-weight: bold;
}
.my-swipe-like {
  position: absolute;
  top: 0;
  right: 0;
  width: 0.5rem;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.6);
  background-size: 0.5rem 0.5rem;
  border-bottom-left-radius: 8px;
}
.my-swipe-versions {
  display: block;
  position: absolute;
  top: 0;
  left: 6px;
  border-bottom-right-radius: 5px;
  padding: 0 .1rem;
  height: .4rem;
  line-height: .4rem;
  font-size: .16rem;
  color: #FF9C22;
  background: rgba(0,0,0,.7);
}
.my-van-card2.my-van-card.van-card {
  width: 85%;
}
.coming-ele {
  box-sizing: border-box;
  padding: 0 0.2rem;
}
.my-cell-title .van-cell__value--alone {
  text-align: right;
  color: #ff9c22;
  font-size: 0.32rem;
}
.my-cell-title2 .van-cell__title span {
  font-weight: bold;
  color: black;
}
.date-text2 {
  position: relative;
  top: 0.3rem;
}
.font30 {font-size: .3rem;}
</style>