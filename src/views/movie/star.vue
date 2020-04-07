<template>
  <div class="box">
    <van-nav-bar
      title="演职人员"
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div class="star-avat boxcon">
      <img :src="starInfo.avatar" alt class="star-img" />
      <div class="star-lvl df-sa font28 font-white">
        <div @click="goTopped(starInfo.id)">
          <p class="fontblod">{{starInfo.supportCount}}票</p>
          <p class="font999">NO:{{starInfo.rank}}</p>
        </div>
        <div>
          <p class="fontblod">{{starInfo.fav_count}}人</p>
          <p class="font999">粉丝人数</p>
        </div>
        <div @click="goContribute(starInfo.id)">
          <p class="fontblod">{{starInfo.support}}票</p>
          <p class="font999">我的热爱值</p>
        </div>
      </div>
      <div class="star-name font32 font-white fontblod">
        {{starInfo.name}}
        <van-icon v-if="starInfo.has_fav == 0" name="like-o" color="red" size="20" class="my-like-icon" @click="like(starInfo)" />
        <van-icon v-if="starInfo.has_fav == 1" name="like" color="red" size="20" class="my-like-icon" @click="like(starInfo)" />
      </div>
      <van-icon name="good-job-o" class="my-goodjob-icon" size="40" color="#FF9C22"  v-if="starInfo.has_support == 0" @click="goodJob(starInfo)" />
      <van-icon name="good-job" class="my-goodjob-icon" size="40" color="#FF9C22" v-if="starInfo.has_support == 1" @click="goodJob(starInfo)" />
    </div>
    <div class="star-movie-recent" v-if="recentList&&recentList.length!=0">
        <div class="star-movie-recent-title">近期影片</div>
        <ul v-if="recentList.length<4">
            <li v-for="(item,index) in recentList" @click="movieDetail(item.id)">
                <div class="mphoto">
                    <i class="iconfont playing"></i>
                    <img :src="item.cover">
                </div> 
                <div class="m_text">
                    <h2>
                        <font class="my-text-title">{{item.title}}</font>
                        <div class="movie-style" v-if="item.versions!='' && item.versions!=' 2D'&& item.versions!='2D'">
                            <em>{{item.versions}}</em>
                        </div>
                        <div class="fs" v-if="item.sale_status==2||item.sale_status==4">观众评分<font>{{item.rates}}分</font></div>
                        <div class="fs" v-if="item.sale_status==1||item.sale_status==0" style="color: #FF9C22">{{item.wish_count}}人想看</div>
                    </h2>
                    <p v-if="item.plays=='导演'">导演</p>
                    <p v-else>演员</p>
                    <p class="c9">{{getdata(item.release_time,0)}}</p>
                    <div class="gpiaodiv" @click.stop="goCinema(item.id)">
                        <a class="gpiao" v-if="item.sale_status==2" @click.stop="goBuy(item.id)">购票</a>
                        <a class="yspiao" v-else-if="item.sale_status==1" @click.stop="goBuy(item.id)">预售</a>
                    </div>
                </div> 
            </li>
        </ul>
        <div class="hostmovie-detail" v-else="recentList.length>4">
            <div class="hostmovie-detail-con">
                <div class="list" v-for="(item,index) in recentList" @click="movieDetail(item.id)">
                    <p class="hostmovie-versions" v-if="item.versions!=''&&item.versions!='2D'&&item.versions!=' 2D'">{{item.versions}}</p>
                    <img :src="item.cover">
                    <i v-if="item.sale_status==2||item.sale_status==4">观众评分:{{item.rates}}分</i>
                    <i v-else-if="item.sale_status==1||item.sale_status==0">{{item.wish_count}}人想看</i>
                    <span>{{item.title}}</span>
                     <a class="gpiao" v-if="item.sale_status==2" @click.stop="goBuy(item.id)">购票</a>
                    <a class="yspiao" v-if="item.sale_status==1" @click.stop="goBuy(item.id)">预售</a>
                </div>             
            </div>
        </div>
    </div>
    <div class="star-movie-recent" style="border-bottom: 0" v-if="historyList&&historyList.length!='0'">
        <div class="star-movie-recent-title">历史作品</div>
        <ul>
            <li v-for="(item,index) in historyList" @click="movieDetail(item.id)">
                <div class="mphoto">
                    <i class="iconfont playing"></i>
                    <img :src="item.cover">
                </div> 
                <div class="m_text">
                    <h2>
                        <font class="my-text-title">{{item.title}}</font>
                        <div class="movie-style" v-if="item.versions!='' && item.versions!=' 2D'&& item.versions!='2D'">
                            <em>{{item.versions}}</em>
                        </div>
                        <div class="fs">观众评分<font>{{item.rates}}分</font></div>
                    </h2>
                    <p v-if="item.plays=='导演'">导演</p>
                    <p v-else>演员</p>
                    <p class="c9">{{getdata(item.release_time,0)}}</p>
                </div> 
            </li>
        </ul>
    </div>
    <div class="oldtip" @click="getMore" v-if="count!='0'">查看全部{{count}}部电影作品</div> 
    <div class="starcontro" v-if="actorInfo.intro!=null" @click="ypView">
        <div class="starcontro-title">影人介绍</div>
        <div class="std starcontro-detail" :class="fold?'jj_more':''">{{intro}}</div>
        <div class="textbiao js_text_img">
            <van-icon name="arrow-down" v-if="!fold"/>
            <van-icon name="arrow-up" v-else/>
        </div>
        
    </div>
  </div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
export default {
  data() {
    return {
      celebrityId: "1740",
      starInfo: {},
      isLike: false,
      recentList:[],
      actorInfo:[],
      historyList:[],
      count:'',
      fold:false,
    };
  },
  mounted() {
    this.initFun();
    this.getActorInfo();
  },
  methods: {
    onClickLeft() {
       this.$router.goBack()
    },
    getdata(k,i){
      var time;
      time=times(k,i);
      return time;
    },
    initFun() {
      this.celebrityId = this.$route.query.celebrityId;
      this.fetchData();
      this.fetchList();
    },
    fetchData() {
      this.$http({
        methods: "get",
        url: "/celebrity/show",
        params: {
          celebrityId: this.celebrityId
        }
      }).then(res => {
        this.starInfo = res.data.data;
      });
    },
    fetchList() {
      var that=this;
      this.$http({
        methods: "get",
        url: "/celebrity/works",
        params: {
          celebrityId: this.celebrityId
        }
      }).then(j => {
          that.count=j.data.data.count;
          that.recentList=j.data.data.list1;
          that.historyList=j.data.data.list2;
      });
    },
    like(item) {
      this.$http({
        methods: "get",
        url: "/celebrity/celebrityFav",
        params: {
          celebrityId: this.celebrityId
        }
      }).then(j => {
        item.fav_count=j.data.data;
        if(item.has_fav==0){
            item.has_fav=1;
            // item.fav_count=~~item.fav_count+1;
            this.$toast('已添加为喜欢');
        }
        else{
          item.has_fav=0;
            this.$toast('取消喜欢');
        }

      });
    },
    goodJob(item){
       this.$http({
        methods: "get",
        url: "/celebrity/celebritySupport",
        params: {
          celebrityId: this.celebrityId
        }
      }).then(j => {
        if(j.data.code==0){
          if(j.data.data==1){
            this.$toast(j.data.msg);
            item.has_support=1;
            item.supportCount=~~item.supportCount+1;
            item.support=~~item.support+1;
          }
        }
        else{
          this.$toast(j.data.msg);
        }

      });
    },
    movieDetail:function(id){
      this.$router.push({name:'showbox',query:{movieId:id}});
    },
    getMore:function(){
      var that=this;
      var getActorId = this.celebrityId;
      this.$router.push({name:'allmovie',query:{actorId:getActorId,name:that.actorName}});
    },
    getActorInfo:function(){
      var getActorId = this.celebrityId;
      var types=this.$route.query.type;
      //console.log(getActorId)
      var that=this;
      this.$http({
        methods: "get",
        url: "/celebrity/show",
        params: {
          celebrityId:getActorId,
        }
      }).then(j => {
        that.actorInfo=j.data.data;
        that.actorName=j.data.data.name;
        that.$nextTick(function(){
            if(j.data.data.intro&&j.data.data.intro.length>100){
                that.intro=j.data.data.intro.substr(0,100)+'...';
                //console.log(j.data.data.review.content.substr(0,2))
                   /* alert(1)*/
                $(".std").on("click",function(){
                    if ($(".textbiao").hasClass("js_text_img")) {
                        that.intro=j.data.data.intro.substr(0,j.data.data.intro.length);
                        $(".textbiao").removeClass("js_text_img").addClass("js_text_img2");
                    } else {
                        that.intro=j.data.data.intro.substr(0,100)+'...';
                        $(".textbiao").removeClass("js_text_img2").addClass("js_text_img");
                    }
                })

            }
            else{
                that.intro=j.data.data.intro;
            }
        })
      })
    },
    goTopped(id){
      var that=this;
      //console.log(this.$router.goBack())
      this.$router.push({name:'toppedbox',query:{actorId:id}});
    },
    goContribute(id){
      var that=this;
      this.$router.push({name:'contribute',query:{actorId:id}});
    },
    ypView: function() {
        var that=this;
        that.fold=!that.fold;
    },
    goBuy(id) {
      // 电影购票
      this.$router.push({name:'cinemabox',query:{movieId:id}});
    },
  }
};
</script>
