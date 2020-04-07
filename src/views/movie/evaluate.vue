<template>
  <div class="box">
    <van-nav-bar
      title="分享影片"
      left-arrow
      fixed
      @click-left="onClickLeft"
    >
    <van-icon name="share" slot="right"  size="26px" color="#555" @click="sharePage" v-if="!if_wechat"/>
   </van-nav-bar>
    <div class="sharemovie-head">
        <img :src="memberList.avatar">
        <div>
            <span>{{memberList.nick}}</span>
            <p>{{content}}<a id="more" class="more1" v-if="islong&&!isShow" @click="showMore">查看更多</a><a class="more2" v-if="islong&&isShow"  @click="showMore">收起</a></p>        
        </div> 
    </div>
    <div class="que-con"> 
        <div class="que"></div>
    </div>
    <div class="sharemovie-name">
        <span>《{{movieList.title}}》</span>
    </div>
    <div class="sharemovie-txt">
        <img :src="movieList.cover" @click="goIndex">
        <span class="share-evaluate" @click="ypView" :class="fold?'jj_more':''">{{summary}}</span>
    </div>
    <div class="textbiao js_text_img"> 
      <van-icon name="arrow-down" v-if="!fold"  @click="ypView"/>
      <van-icon name="arrow-up" v-else  @click="ypView"/>
    </div>

    <div class="sharemovie-logo">
        
    </div>
  </div>
</template>
<script type="text/javascript">
import { isWeiXin } from '@/assets/js/date.js';

export default {
  data() {
    return {
        memberList:[],
        reviewList:[],
        movieList:[],
        summary:'',
        fold:false,
        content:"",
        contents:"",
        isShow:false,
        islong:false,
        if_wechat:isWeiXin()
    };
  },
  mounted() {
    var that=this;
    that.getShare();
  },
  methods: {
    onClickLeft() {
        this.$router.goBack()
      },
    getShare:function(){
        var that=this;
        var reviewId=this.$route.query.reviewId;
        console.log(reviewId)
        this.$http({
          methods: "get",
          url: "/review/share",
          params: {
              reviewId:reviewId,
            }
          }).then(j => {
            that.memberList=j.data.data.member;
            that.reviewList=j.data.data.review;
            that.movieList=j.data.data.movie;
            that.contents=j.data.data.review.content;
            if(j.data.data.review.content.length>50){
                that.islong=true;
                that.content=j.data.data.review.content.substr(0,50)+'...';

            }
            else{
                that.islong=false;
                that.content=j.data.data.review.content;
            }
            that.summary=j.data.data.movie.summary;
        })
    },
    goIndex:function(){
        this.$router.push({name:'moviebox'});
    },
    ypView: function() {
        var that=this;
        that.fold=!that.fold;
    },
    showMore(){
      var that=this;
      that.isShow=!that.isShow;
      if(!that.isShow){
        that.content=that.contents.substr(0,50)+'...';
      }
      else{
        that.content=that.contents.substr(0,that.contents.length);
      }
    },
    sharePage(){
      var that=this;
      if(!isWeiXin()){
        window.WebViewJavascriptBridge.callHandler(
            'Share'  //分享定义的方法名称
            , {
             'title':"《"+that.movieList.title+"》点评的太到位了！",//标题
             'desc':that.content,//内容
             'img':that.movieList.cover,//图片
             'link':location.href,
            }  //请求参数
            , function(responseData) { //回调数据接口
               console.log(responseData)
            }
        ); 
      }

    }
  }
};
</script>
