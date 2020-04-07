<template>
  <div class="box">
    <van-nav-bar
      :title=title
      fixed
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="star-movie-recent" style="border-bottom: 0">
        <div class="star-movie-recent-title">共{{count}}部电影作品</div>

        <ul v-if="recentList.length!=0">
            <div class="historytitle">近期影片</div>
            <li v-for="(item,index) in recentList" @click="movieDetail(item.id)">
                <div class="mphoto">
                    <i class="iconfont playing"></i>
                    <img :src="item.cover">
                </div> 
                <div class="m_text">
                    <h2>
                        <font class="my-text-title">{{item.title}}</font>

                        <div class="movie-style" v-if="getVersions(item.versionsFormat)==2">
                            <em>{{item.versionsFormat}}</em>
                        </div>
                        <div class="fs" v-if="item.sale_status==2||item.sale_status==4">观众评分<font>{{item.rates}}分</font></div>
                        <div class="fs" v-else-if="item.sale_status==1||item.sale_status==0" style="color: #FF9C22">{{item.wish_count}}人想看</div>
                    </h2>
                    <p v-if="item.plays=='导演'">导演</p>
                    <p v-else>演员</p>
                    <p class="c9">{{getdata(item.release_time,0)}}</p>
                    <div class="gpiaodiv" @click.stop="goCinema(item.id)">
                        <a class="gpiao" v-if="item.sale_status==2">购票</a>
                        <a class="yspiao" v-if="item.sale_status==1">预售</a>
                    </div>
                </div> 
            </li>
        </ul>
        <ul v-if="historyList.length!=0">
            <div class="historytitle">历史作品</div>
            <li v-for="(item,index) in historyList" @click="movieDetail(item.id)">
                <div class="mphoto">
                    <i class="iconfont playing"></i>
                    <img :src="item.cover">
                </div> 
                <div class="m_text">
                    <h2>
                        <font class="my-text-title">{{item.title}}</font>

                        <div class="movie-style" v-if="getVersions(item.versionsFormat)==2">
                            <em>{{item.versionsFormat}}</em>
                        </div>
                        <div class="fs">观众评分<font>{{item.rates}}分</font></div>
                        
                    </h2>
                    <p v-if="item.plays=='导演'">导演</p>
                    <p v-else>演员</p>
                    <p class="c9">{{getdata(item.release_time,0)}}</p>
                    <div class="gpiaodiv" @click.stop="goCinema(item.id)">
                        <a class="gpiao" v-if="item.sale_status==2">购票</a>
                        <a class="yspiao" v-if="item.sale_status==1">预售</a>
                    </div>
                </div> 
            </li>
        </ul>
    </div>
    
  </div>
</template>
<script type="text/javascript">
import $ from 'jquery';
import { times } from '@/assets/js/date.js';
export default {
  data() {
    return {
      title:'',
      recentList:[],
      historyList:[],
      count:'',
      getActorId:'',
    };
  },

  mounted() {
    var that=this;
    that.getActorId=this.$route.query.actorId;
    that.getHistoryList();

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
    getHistoryList:function(){
        var that=this;
        this.$http({
            methods: "get",
            url: "/celebrity/works",
            params: {
              celebrityId:that.getActorId,
            }
        }).then(j => {
            that.recentList=j.data.data.list1;
            that.historyList=j.data.data.list2;
            that.count=j.data.data.count;
            that.title=this.$route.query.name+"的电影作品";
        });
    },
    movieDetail:function(id){
        this.$router.push({name:'showbox',query:{movieId:id}});
    },
    goCinema:function(id){
        this.$router.push({name:'cinemabox',query:{movieId:id}});
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
    }
    
  }
};
</script>