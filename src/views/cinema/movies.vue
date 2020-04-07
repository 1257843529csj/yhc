<template>
<div class="box">
	<van-nav-bar :title="cinemadetail.name" fixed :z-index="999" @click-left="onClickLeft" left-arrow>
		<van-icon name="share" slot="right"  size="26px" color="#555" @click="sharePage" v-if="!if_wechat"/>
	</van-nav-bar>
	 <div class="cinema_detial">
        <div class="cinema_name">
            <a style="width:5.8rem; display:block" @click="goInfo(cinemadetail)">
           <!--  @click="goInfo(cinemadetail)" -->
                <h2>
                <font style="max-width: 80%; overflow: hidden;">{{cinemadetail.name}}</font>
                    <i class="fav" @click.stop="getFav(cinemadetail.fav)" v-if="cinemadetail.fav==0"></i>
                    <i class="fav2" @click.stop="getFav(cinemadetail.fav)" v-if="cinemadetail.fav==1"></i>
                </h2>
                <div class="cinemaadderz">
                <div style="max-width: 90%; height: .32rem;">{{cinemadetail.addr}}</div><van-icon name="arrow" /></div>
                <p style="margin:0.2rem 0 0 0"><em>座</em> <!-- <em id="tuan_tag" v-if="tuan!=''">团</em> --> </p>
                
            </a>
            <a @click.stop="goMap()" class="maps">
                  <van-icon name="map-marked" color="#ff8200 "/>
                    <p>地图</p>
                  <div class="lines"></div>
            </a>
        </div>
    </div>
    <div class="moiveboxselect">
    	<div class="swiper-container">
	    <div class="swiper-wrapper" v-cloak>
	      <div class="swiper-slide" v-for="item in movielist"><img :src="item.cover" :psl="item.psl" :psltan="item.psl_tab" :alt="item.title" :mid="item.id" :rate="item.rates" :run="item.runtime" :rt="item.release_time"/></div>
	    </div> 
  		</div>
    </div>
     <div class="movie_name" v-cloak>
        <h2> <em class="movie_title">{{movieTitle}}</em> 
        	<span style="margin-left: 0.2rem"><font id="rates">{{rates}}</font><em>分</em></span>
        	<em class="yh" style="display: none;"></em></h2>
        <p><em id="rt">{{release_time}}</em>上映&nbsp;&nbsp;/&nbsp;&nbsp;<font id="runtime">{{runtime}}分钟</font></p>
    </div>
    <div class="hint">温馨提示：电影开场前{{min}}分钟关闭在线售票</div>
    <van-tabs background="#fafafa" color="#ff8200" v-model="mtab" @change="tabs">
	  <van-tab v-for="index in plan_dates" :title="index.date_show" :name="index.date" >
	   
	  </van-tab>
	</van-tabs>
	<div id="wrap1">
			<ul>
				<li v-for="items in planslist">
					<span>
						<h3>{{items.FeatureTime}}</h3>
						<p>{{items.TotalTime}}散场</p>
					</span>
						<span class="spantype"><p>{{items.CopyLanguage}}/{{items.CopyType}}</p>
							<p>{{items.HallName}}</p></span>
							<span style="text-align: left;">
							<p class="red red2" v-if="items.isPsl">
                                <em>¥</em>{{items.price}}<em>特惠</em>          
                            </p>
                            <p class="red" v-else>
                                <em>¥</em>{{items.price}}               
                            </p>
                            <del><em>¥</em>{{items.StandPric}}</del>
						</span>
					<a class="buy stopbuy" v-if="items.status==0">停售</a>
                    <a class="buy" :class="items.isPsl?'reds2':''" v-if="items.status==1" @click='buyTickets(items.plan_id)'>{{items.btn}}</a>
				</li>
			</ul>
	   </div>
</div>
</template>
<script type="text/javascript">
import Swiper from 'swiper';
import $ from 'jquery';
import { isWeiXin } from '@/assets/js/date.js';
import { Tab, Tabs } from 'vant';
export default {
	data() {
	    return {
	    	cinemadetail:"",
	    	cinemaId:"",
	    	movieId:"",
	    	tuan:"",
	    	movielist:[],
	    	movieTitle:"",
	    	rates:"",
	    	release_time:"",
	    	runtime:"",
	    	min:"",
	    	mtab:"",
	    	plan_dates:[],
	    	planslist:[],
	    	allplans:"",
	    	if_wechat:isWeiXin()
	    }
	},
	mounted(){
		this.getCinema();
	},
	methods:{
		sharePage(){
		      var that=this;
		      if(!isWeiXin()){
		        window.WebViewJavascriptBridge.callHandler(
		            'Share'  //分享定义的方法名称
		            , {
		             'title':"我在"+that.cinemadetail.name+"影院，想和你一起在这里看电影！",//标题
		             'desc':"位于"+that.cinemadetail.addr,//内容
		             'img':"//m.filmfly.cn/up/mv/34/95/55298.jpeg",//图片
		             'link':location.href,
		            }  //请求参数
		            , function(responseData) { //回调数据接口
		               console.log(responseData)
		            }
		        ); 
		      }
    	},
		onClickLeft(){
			  this.$router.goBack()
			//this.goback();
		},
		tabs(){
			this.selectdate();
		},
		getCinema(){
			var that = this;
			this.cinemaId = this.$route.query.cinemaId;
			this.mtab = this.$route.query.date;
			this.movieId = this.$route.query.movieid;
			this.$http({
				method:'get',
				url:'/cinema/detail',
            	params:{
         		 cinemaId:this.cinemaId,
         		 movieId:this.movieid
            	}
			}).then((j) => {
				if(!j){return false;}
				this.cinemadetail = j.data.data.cinema;
				this.movielist = j.data.data.movies;
				this.min = j.data.data.min;
				this.$nextTick(function(){
					var numstart;
					if(that.movieId){
					  	    		 for(var i=0;i<that.movielist.length;i++){
					  	    		 	 if(that.movielist[i].id == that.movieId){
					  	    		 	 	numstart = i
					  	    		 	 }
					  	    		 }
					 }
					var swiper = new Swiper('.swiper-container', {
				      slidesPerView: 4,
				      spaceBetween:9,
				      initialSlide :numstart,
				      centeredSlides : true,
					  centeredSlidesBounds: true,
					  slideToClickedSlide: true,
					  on: { 
					  	    init: function(){
					  	    	//that.mtab = 0
					  	    	
					  	    	this.emit('slideChangeTransitionEnd');
					  	    },
						    slideChangeTransitionEnd: function(){
						       that.movieTitle = that.movielist[this.activeIndex].title;
						       that.rates = that.movielist[this.activeIndex].rates;
						       that.release_time =that.movielist[this.activeIndex].release_time;
						       that.runtime = that.movielist[this.activeIndex].runtime;
						       that.movieId =  that.movielist[this.activeIndex].id;
						       that.getplans();
						    }
						  }
				    });
				 })
			})
		},
		getplans(e){
			this.$http({
				method:'get',
				url:'/cinema/plans',
            	params:{
         		 cinemaId:this.cinemaId,
         		 movieId:this.movieId
            	}
			}).then((j) => {
				if(!j){return false;}
				this.plan_dates = j.data.data.dates;
				this.allplans = j.data.data.plans;
				this.$nextTick(function(){
					this.selectdate()
				})
			})
		},
		selectdate(){
			console.log(this.mtab)
			for(var key in this.allplans){
						if(this.mtab == key){
							this.planslist = this.allplans[key]					
			    }
			}
		},
		buyTickets(id){
			this.$router.push({ name: "hallseat", query: {planid: id} });
		},
		goInfo(cinemadetail){
			this.$router.push({ name: "info", query: {cinemaId: cinemadetail.cinema_id} });
		},
		getFav(item){
			this.$http({
				method:'get',
				url:'/cinema/fav',
            	params:{
            	 fav:item==1?0:1,
         		 cinemaId:this.cinemaId
            	}
			}).then((j) => {
				if(item==1){
		            this.cinemadetail.fav=0;
		          }
		          else{
		            this.cinemadetail.fav=1;

		          }
			})
		},
		goMap(){
			this.$router.push({ name: "mapbox", query: {cinemaId: this.cinemaId} });
		},
	}
}
</script>