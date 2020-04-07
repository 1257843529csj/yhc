<template>
  <div class="box" style="background:#fff">
    <van-nav-bar
      :title='title'
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="mymovie boxcon">
        <van-tabs v-model="active" swipeable>
            <van-tab title="我想看">
                <ul class="mymovie-like">
                    <li v-for="item in loveMovie" @click="movieDetail(item.movie_id)">
                        <div class="mphoto">
                            <i class="iconfont playing"></i>
                            <img :src="item.movie.cover">
                        </div> 
                        <div class="my_text">
                            <h2>
                                <font class="my-text-title">{{item.movie.title}}</font>
                                <div class="movie-style" v-if="item.movie.versions!='' && item.movie.versions!=' 2D'&& item.movie.versions!='2D'">
                                    <em>{{item.movie.versions}}</em>
                                </div>
                                <div class="my_fs" v-if="item.saleStatus==2||item.saleStatus==4">观众评分<font>{{item.rates}}分</font></div>
                                <div class="my_fs" v-else><font style="margin-left: 0">{{item.wish_count}}人想看</font></div>
                            </h2>
                            <p>{{item.movie.casts}}</p>
                            <p class="c9">{{getdata(item.movie.release_time,2)}}上映</p>
                            <div class="gpiaocon">
                                <a class="gpiao" v-if="item.saleStatus==2">购票</a>
                                <a class="yspiao" v-if="item.saleStatus==1">预售</a>
                            </div>
                        </div> 
                    </li>
                    <Emptys v-if="isempty1"></Emptys>
                </ul>  
            </van-tab>
            <van-tab title="我看过">
                <ul class="mymovie-see">
                    <li v-for="item in watchedMovie" @click="movieDetail(item.movie_id)">
                        <div class="mphoto">
                            <i class="iconfont playing"></i>
                            <img :src="item.movie.cover">
                        </div> 
                        <div class="my_text">
                            <h2>
                                <font class="my-text-title">{{item.movie.title}}</font>
                                <div class="movie-style" v-if="!item.movie.versions && item.movie.versions!=' 2D'&& item.movie.versions!='2D'&& item.movie.versions!=false">
                                    <em>{{item.movie.versions}}</em>
                                </div>
                                <div class="my_fs">观众评分<font>{{item.rates}}分</font></div>
                            </h2>
                            <p>{{item.movie.casts}}</p>
                            <p class="c9">{{getdata(item.movie.release_time,0)}}</p>
                            <div class="gpiaocon" v-if="item.comment.length==0">
                                <a class="evaluate">评价</a>
                               <!--  <a class="gpiao" v-if="item.isshow==2">预售</a>
                               <a class="gpiao" v-if="item.isshow==3">停售</a> -->
                            </div>
                        </div>
                        <div class="evaluate-con" v-if="item.comment.length!=0">
                            <div class="evaluate-fen">
                                <h2>我的评价</h2>
                                <div class="pfen_detail">
                                    <span class="stars3"> 
                                      <van-rate
                                          v-model="item.comment.rates/2"
                                          allow-half
                                          void-icon="star"
                                          void-color="#666"
                                          color="#ff9c22"
                                        />
                                    </span>
                                    <p>{{item.comment.rates}}分</p>
                                </div>
                            </div>
                            <div class="evaluate-txt">
                                <span>{{item.comment.content}}</span>
                            </div>
                            <div class="evaluate-time">
                                <span class="evaluate-time-txt">{{getdata(item.comment.stamp,3)}}</span> 
                                <span class="evaluate-zan">
                                    <p class="reviewzan review_zan"></p>
                                    <font>{{item.comment.votes}}</font>
                                </span>
                            </div>
                            
                        </div>  
                    </li>
                    <Emptys v-if="isempty3"></Emptys>
                </ul>
                
            </van-tab>
            <van-tab title="点评过">
                <div class="mymovie-evaluate-list" v-for="item in evaluateList"> 

                    <div class="evaluate_detail">
                        <ul>
                            <li @click="movieDetail(item.movie_id)">
                                <div class="mphoto">
                                    <i class="iconfont playing"></i>
                                    <img :src="item.movie.cover">
                                </div> 
                                <div class="my_text">
                                    <h2>
                                        <font class="my-text-title">{{item.movie.title}}</font>
                                             <div class="movie-style" v-if="!item.movie.versions && item.movie.versions!=' 2D'&& item.movie.versions!='2D'&& item.movie.versions!=false">
                                        <em>{{item.movie.versions}}</em>
                                    </div>
                                        <div class="my_fs">观众评分<font>{{item.audRates}}分</font></div>
                                    </h2>
                                    <p>{{item.movie.casts}}</p>
                                    <p class="c9">{{getdata(item.movie.release_time,2)}}</p>
                                </div> 
                            </li>
                        </ul>
                    </div>
                    <div class="evaluate-con">
                        <div class="evaluate-fen">
                            <h2>我的评价</h2>
                            <div class="pfen_detail">
                                <span class="stars3">
                                  <van-rate
                                    v-model="item.rates/2"
                                    allow-half
                                    void-icon="star"
                                    void-color="#666"
                                    color="#ff9c22"
                                  />
                                </span>
                                <p>{{item.rates}}分</p>
                            </div>
                        </div>
                        <div class="evaluate-txt">
                            <span>{{item.content}}</span>
                        </div>
                        <div class="evaluate-time">
                            <span class="evaluate-time-txt">{{getdata(item.stamp,3)}}</span> 
                            <span class="evaluate-zan">
                                <van-icon name="good-job-o" />
                                <font>{{item.votes}}</font>
                            </span>
                        </div>
                        
                    </div>  
                </div>  
                <Emptys v-if="isempty2"></Emptys>
            </van-tab>

        </van-tabs>
        
    </div>
    
</div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"我的电影",
        loveMovie:[],
        watchedMovie:[], 
        evaluateList:[],
        isempty1:false,
        isempty2:false,
        isempty3:false,
        active:0,
    };
  },

  mounted() {
      var that = this;
      that.getLoveMovie();
     
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
    getLoveMovie:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/favMovie",
        }).then(j => {
            that.loveMovie=j.data.data;
            if(j.data.data.length==0){
                that.isempty1=true;
            }
            that.getEvaluate();
            //console.log(j.data)
        })
    },
    getEvaluate:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/reviewMovie",
        }).then(j => {
            that.evaluateList=j.data.data;
            if(j.data.data.length==0){
                that.isempty2=true;
            }
            that.getWatched(); 
            //console.log(j.data)
        }, function() {

        })
    },
    getWatched:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/watchedMovie",
        }).then(j => {
            that.watchedMovie=j.data.data;
            if(j.data.data.length==0){
                that.isempty3=true;
            }
            //console.log(j.data)
        })
    },
    movieDetail:function(id){
        this.$router.push({name:'showbox',query:{movieId:id}});
    }

     
  },
  components:{Emptys}
};
</script>
