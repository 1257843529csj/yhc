<template>
	<div class="box">
		<van-nav-bar
		  :title='title'
		  fixed
		  left-arrow
		  @click-left="onClickLeft"
		/>
		<!-- :class="videolist.length==0?'videohidehy':''" -->
		<div class="videobox boxcon">
			<van-tabs v-model="active" swipeable animated>
			  <van-tab title="预告片">
			  	<div class="y">
	                <div class="videocon" v-for="(item,index) in videolist" v-if="index==playIndex">
	                    <div class="xvideos">
	                        <!-- <div class="videos">
	                            <video class="video" controls="" :src="item.url" :poster="item.cover" ></video>
	                        </div> -->
	                        <video width="100%" height="100%" controls :poster="item.cover">
							    <source :src="item.url"  type="video/mp4">
							
							    <!-- <source src="movie.ogg"  type="video/ogg"> -->
							</video>
	                    </div>
	                    <div class="videotitle">
	                        <h2><font>{{item.title}}</font><i>{{rates}}分</i></h2>
	                        <p>
	                            <em> {{getdata(item.created_at,0)}}上映 </em>
	                        </p>
	                    </div>
	                </div>
	                <div class="line"></div>
	                <div class="account">共{{videolist.length}}部</div>
	                <ul class="v">
	                <li v-for="(item,index) in videolist" @click="playView(index)">
	                        <img :src="item.cover" class="img">
	                        <span>
	                            <p :style="playIndex==index?'color:red':''">{{item.title}}</p>
	                            <p><em>{{item.duration}}</em> </p>
	                        </span>
	                        <i class="oni" v-if="playIndex==index">播放中</i>
	                        <i class="playimg" v-else><img src="../../assets/img/play.png"></i>
	                  </li>                                
	                </ul>
	            </div>
			  </van-tab>
	          <van-tab title="图库">
	          	<div class="movie_pic">
	                <ul id="pics">
	                    <li v-for="(item,index) in photolist" @click="photoShow(index)">
		                    <img :src="item.url_thumb" v-if="item.url_thumb!=''">
		                    <img :src="item.url" v-else>
	                    </li>
	                </ul>
	            </div>
	            
	          </van-tab>
			</van-tabs>
		</div>
		<div class="lookbigimg" v-show="pshow">
			<div class="swiper-container" style="height:100%">
	            <div class="swiper-wrapper">
	                <div class="swiper-slide" v-for="item in imageList" @click="closeImg">
	                	<img :src="item">
	                </div>
	            </div>
	        </div>
		</div>
	</div>
</template>
<script type="text/javascript">
import Swiper from 'swiper';
import 'swiper/css/swiper.css';
import { times } from '@/assets/js/date.js';

export default {
	data() {
	    return {
	    	title:"预告片&图集",
	    	active:0,
	    	photolist:[],
	    	getMovieId:'',
	    	videolist:[],
	    	pshow:false,
	    	imageList:[],
	    	startPosition:0,
	        playIndex:0,
	        rates:0,
	    }
	  },
	mounted() {
		var that=this;
		
		that.getMovieId=this.$route.query.movieId;
		that.active=this.$route.query.num;
		that.getVideos();

	},
	methods:{
		onClickLeft(){
			this.$router.goBack()
		},
		getdata(k,i){
	      var time;
	      time=times(k,i);
	      return time;
	    },
		getVideos(){
			var that=this;
	        this.$http({
				method:'get',
				url:'/movie/videos',
            	params:{
         		  movieId: that.getMovieId
            	}
			}).then((j) => {
				that.photolist=j.data.data.photos;
	            that.videolist=j.data.data.videos;
	            that.rates=j.data.data.movie.rates;
	            var data1 = that.photolist;
	            data1.forEach(el=>{
                    console.log(el.url)
	                that.imageList.push(el.url)
	            })

	           
			})
		},
		photoShow(index){
            var that=this;
            that.pshow=true;
            // var swipers;
            that.$nextTick(function(){
	            var swipers = new Swiper('.swiper-container')
	            swipers.slideTo(index, 0, false)
	        })
	        
            // that.startPosition=index;
            
	    },
	    closeImg(){
            var that=this;
            that.pshow=false;
            that.startPosition=0;
	    },
	    playView:function(index){
            var that=this;
            that.playIndex=index;
            // $(".v li .oni").hide();
            // $(".v li .playimg").show();
            // $(".v li .oni").eq(index).show();
            // $(".v li .playimg").eq(index).hide();

        }
		
		
	}
};

</script>