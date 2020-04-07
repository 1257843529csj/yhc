<template>
	<div class="box">
		<van-nav-bar
		  :title="title"
		  left-arrow
		  @click-left="onClickLeft"
		  fixed
		  :z-index="1000"
		>
		<van-icon name="share" slot="right"  size="26px" color="#555" @click="sharePage" v-if="!if_wechat"/>
		<!-- <van-icon name="search" slot="right" color="#ff9c22" size="26px"/> -->
	    </van-nav-bar>
		<div class="lookbigimg" v-show="pshow">
			<div class="swiper-container3" style="height:100%">
	            <div class="swiper-wrapper">
	                <div class="swiper-slide" v-for="item in imageList" @click="closeImg">
	                	<img :src="item">
	                </div>
	            </div>
	        </div>
		</div>
		<header class="boxcon">
	        <div class="movie_bg" :style="{backgroundImage: 'url(' + baseInfo.poster + ')',backgroundSize:'cover'}" v-if="baseInfo.poster!=''">
	        </div>
	        <div class="movie_bg" :style="{backgroundImage: 'url(' + baseInfo.cover + ')',backgroundSize:'cover'}" v-else>
	        </div>
	        <div class="movie_bg2">
	        </div>
	        <div class="m_info_box1">
	            <div class="spic"> 
	                <div class="youhui3" v-if="psl"></div>
	                <div v-if="videos.length!=0">
	                    <img :src="baseInfo.cover" >
	                    <i class="iconfont playing"></i>
	                </div>
	                <div v-else>
	                    <img :src="baseInfo.cover" >
	                    
	                </div> 
	            </div>
	            <div class="moive_text">
	                <div class="moive_text_love" >
	                <!--     <span :class="[baseInfo.has_fav=='1'?'movie_love':'movie_nolove']" @click="likeSee(baseInfo)"></span> -->
	                    <van-icon class="movie_love" name="like-o" v-if="baseInfo.has_fav=='0'" @click="likeSee(baseInfo)"/>
	                    <van-icon class="movie_love" name="like" v-if="baseInfo.has_fav=='1'" @click="likeSee(baseInfo)"/>
	                    <span class="moive_text_txt">想看</span>
	                    
	                </div>
	                <h2>
	                    <font>{{baseInfo.title}}</font>

	                    <div class="movie-style" v-if="getVersions(baseInfo.versionsFormat)==2">
	                        <em>{{baseInfo.versionsFormat}}</em>
	                    </div>
	                    <em class="yh" v-if="psl">{{psl_tab}}</em>
	                </h2>
	                <h3>{{baseInfo.ename}}</h3>
	                <p>{{baseInfo.genres}}</p>
	                <p> {{baseInfo.countries}}/{{baseInfo.runtime}}</p>
	                <p>{{baseInfo.release_time}}</p> 
	                <a href="/wap/movie/info?movie_id=8034"><i class="iconfont jt"></i></a>
	            </div>
	        </div>
	        <div class="pinfen_info">
	            <div class="pinfen_info_list">
	                
	                <div v-if="baseInfo.sale_status==1||baseInfo.sale_status==0" class="pinfen_no">
	                    <span class="pinfen_info_title">观众评分</span>
	                    <span class="pinfen_no_txt">尚未上映</span>    
	                </div>
	                <div v-else>
	                    <!-- {{reviewsPeopleNum}}人 -->
	                    <span class="pinfen_info_title">观众评分</span> 
	                    <div class="pinfen_info_detail">
	                        <p>{{baseInfo.rates}}</p>
	                        <div class="comment-score2"> 
	                            <span class="stars2"> 
	                                <van-rate allow-half v-model="starsvalue" color="#FF9C22" void-icon="star" void-color="#666" readonly />
	                            </span> 
	                        </div> 
	                    </div>
	                </div>
	            </div>
	            <div class="pinfen_info_list">
	                <span class="pinfen_info_title">想看人数</span>
	                <div class="look_people">
	                    <span>{{wish_count}}</span>   
	                </div>
	            </div>
	            
	        </div>
	    </header>
	    <div v-if="activity.length!=0">
	        <div class="movie-cd" v-for="item in activity" v-if="item.intro!=''" @click="goIframe(item.url)">{{item.intro}}</div>
	    </div>
	    <div class="m_info">
	        <div class="js_text"  @click="ypView">
	            <h5>影片简介</h5>
	            <span v-html="baseInfo.short_intro" class="short_intros"></span>
	            <p id="txts1" :class="fold?'jj_more':''" v-html="baseInfo.long_intro"></p>
	            <div class="textbiao js_text_img"> 
	                <van-icon name="arrow-down" v-if="!fold&&isLow"/>
                    <van-icon name="arrow-up" v-else-if="fold&&isLow"/>
	            </div>
	        </div>
	    </div>
	    <div class="per" v-show="actorInfo!='' ||directorInfo!=''">
	        <div class="pre_h" @click="goMore">
	        <a style="z-index:99" v-if="actorInfo!=''">更多<van-icon name="arrow" /></a> 
	        </div>
	        <div class="pre_box">
	            <h3 v-show="directorInfo!=''">导演</h3>
	            <h4 v-show="actorInfo!=''" id="actor" :style="directorInfo.length==0 && actorInfo.length!=0?'margin:0':''">演员</h4>
	            <div class="pre_detail">
	            	<div class="swiper-container2">
			            <div class="swiper-wrapper">
			               
			                <div class="swiper-slide"  v-for="item in directorInfo" @click="Detail(item,1)">
			                	<p >
			                        <img :src="item.avatar">
			                        <!-- <em :class="[item.has_fav!=0? 'love':'nolove']"></em> -->
	                                <van-icon class="love" name="like" v-if="item.has_fav!=0"/>
			                        <van-icon class="love" name="like-o" v-else/>
			                        <span class="pre_detail_xb">
			                            <span class="pre_detail_num"><font class="piao">{{item.num}}</font>票
			                            </span> 
			                             <span class="actor_zan">
				                             <van-icon name="good-job-o" class="my-goodjob-icon" size="20" color="#FF9C22" v-if="item.has_support==0" @click.stop="love(item)" />
	      									<van-icon name="good-job" class="my-goodjob-icon" size="20" color="#FF9C22" v-else @click.stop="love(item)" />
      									</span>
			                        </span>
			                    </p>
			                    <p>{{item.name}}</p>
			                </div> 
			                <div class="swiper-slide"  v-for="(item,index) in actorInfo" @click="Detail(item,2)">
			                	<p>
			                        <img :data-src="item.avatar" class="swiper-lazy">
			                        <!-- <em :class="[item.has_fav!=0? 'love':'nolove']"></em> -->
			                        <!-- <em class="love"> -->
		                        	<van-icon class="love" name="like" v-if="item.has_fav!=0"/>
		                            <van-icon class="love" name="like-o" v-else/>
			                        <!-- </em> -->
			                        
			                        <span class="pre_detail_xb">
			                            <span class="pre_detail_num"><font class="piao">{{item.num}}</font>票</span> 
			                             <!-- <span class="zan2" :class="[item.has_support==1?'actor_zan2':'actor_zan']"  @click.stop="love(item)"></span> -->
			                             <span class="actor_zan">
				                             <van-icon name="good-job-o" class="my-goodjob-icon" size="20" color="#FF9C22" v-if="item.has_support==0" @click.stop="love(item)" />
	      									<van-icon name="good-job" class="my-goodjob-icon" size="20" color="#FF9C22" v-else @click.stop="love(item)" />
      									</span>
			                        </span>
			                    </p>
			                    <p>{{item.name}}</p>
			                    <p v-if="item.play!=''">饰：{{item.play}}</p>
			                    <div class="swiper-lazy-preloader"></div>
			                </div> 
			            </div>
			        </div>
	            </div>
	        </div>
	    </div>
	    <div class="line"></div>
	    <div class="media" v-show='(videos&&videos.length!=0)||(photoList&&photoList.length!=0)'>
	    <!-- <div class="media"> -->
	        <div class="media_title">
	            <div class="m1" v-if='videos!=false' @click="goVideo(0)">预告片<a>{{videos.length}}<van-icon name="arrow" /></van-icon></a>
	            </div>
	            <div class="m2" @click="goVideo(1)" v-if='photoList!=false' :style="photoList.length!=0 &&videos.length==0?'width:100%':''">剧照<a>{{photoList.length}}<van-icon name="arrow" /></van-icon></a>
	            </div>    
	        </div>
	        <div class="movie_pic">
                <div class="swiper-container">
		            <div class="swiper-wrapper">
		                <div class="swiper-slide videocss"  v-if='videos!=false && index<1' v-for="(item,index) in videos" @click="goVideo(0)">
		                	<img :src="item.cover" class="videoimg">
		                	<van-icon name="play-circle-o" size="40" class="my-play-icon" color="#fff"/>
		                </div> 
		                <div class="swiper-slide"  v-for="(item,index) in photoList" v-if="index<10" @click="photoShow(index)">
		                	<img class="swiper-lazy" :data-src="[item.url_thumb!=''?item.url_thumb:item.url]">
		                	<div class="swiper-lazy-preloader"></div>
		                </div> 
		            </div>
		        </div>
		
	        </div>  
	    </div>
	    <div class="line"></div>
	    <div class="ask">
	        <div class="ask_title">
	            <h2><i></i>热门影评</h2>
	            <a href="javascript:void(0)" class="fb" @click="goEvaluate">写评价</a>
	        </div>
	        <div class="askbox">
	            <ul id="review_list">        
	                <li v-for="(item,index) in reviewlist"  v-if="index<2" @click="reviesDetail(item)">
	                   <!--   弹窗 -->
	                   <div class="deletewindow" :class="isSelect==index? 'windowShow' :''" @click.stop="closeShareBtn">
	                        <div>
	                            <span @click.stop="delectBth(item.id)" v-if="isMyreview==index">删除</span>
	                            <span @click.stop="shareBth(item.id)">分享</span>
	                        </div>
	                   </div>
	                    <em @click.stop="deleteTip(item,index)">...</em>
	                    <div class="face">
	                        <img :src="item.avatar">
	                    </div>
	                    <div class="use_txt">
	                        <div class="who_pl"><font>{{item.member}}</font>的影评</div>
	                        <div class="pfen">
	                            <div class="pfen_detail">
	                                <span class="stars3">
	                                    <van-rate allow-half v-model="item.rates/2" color="#FF9C22" void-icon="star" void-color="#666" readonly />
	                                </span>
	                                <p>{{item.rates}}分</p>
	                            </div>
	                            <div class="pinglun">{{item.content}} </div>
	          
	                            <div class="times"> 
	                                <span>{{item.stamp}}</span> 
	                                <span>
	                                	<p @click.stop="prZan(item,index)">
	                                		<van-icon name="good-job-o" v-if="item.has_vote==0"></van-icon>
	                                        <van-icon name="good-job" color="#555" v-if="item.has_vote==1"/></van-icon>
	                                	</p>
	                                    
	                                    <font>{{item.vote}}</font> 
	                                </span>
	                               
	                                
	                            </div>
	                        </div>
	                    </div>
	                </li>
	            </ul>
	            <div class="reviewbtn" @click="moreReview" v-if="count>2">查看全部{{count}}条评论</div>
	            <div class="reviewbtn" v-if="count==0">暂无评论</div>
	        </div>
	        <!--<a href="#" class="look_all" style="">查看全部</a>-->
	    </div>
	    <!-- 点评 -->
	    <van-popup
		  v-model="reviewshow"
		  position="top"
		  :style="{ height: '100%' }"
		>
			<div class="close" @click="closeEvaluate">x</div>
	        <div class="main">
	            <div class="num"><em class="hints">{{score}}</em>分</div>
	            <div class="texts">{{reviewtxt[reviewindex]}}</div>
	            <div class="comment-score" id="comment-score"> 
	            	<van-rate v-model="revalue" allow-half void-icon="star" color="#FF9C22" void-color="#666" @change="changeScore"/>
	            </div>
	            <div style="position:relative;">
	            	<van-cell-group>
						<van-field
						    v-model="messagevalue"
						    autosize
						    type="textarea"
						    placeholder="快来说说你的看法吧"
						    show-word-limit

						/>
					</van-cell-group>
	                <div class="tip_text" v-if="messagevalue.length<5">至少还需输入{{5-messagevalue.length}}字</div>
	                <div class="tip_text" v-else-if="messagevalue.length<=50">还能输入{{50-messagevalue.length}}字</div>
	                <div class="tip_text" v-else>超过{{messagevalue.length-50}}字</div>

	            </div>
	        </div>
	        <div class="sub" id="dp_sub" @click="rev">确定</div>

	    </van-popup>

	    <!--     热门推荐 -->
	    <div class="hosttj">
	        <div class="hosttj_title">热门推荐</div>
	        <ul>
	            <li v-for="(item,key) in hostMovie" @click="movieDetail(item.movie_id)">
	                <img :src="item.cover">
	                <i v-if="item.versions!=''&&item.versions!=' 2D'&&item.versions!='2D'">{{item.versionsFormat}}</i>
	                <span>{{item.title}}</span>
	                <p v-if="item.sale_status==2">观众评分<font>{{item.rates}}分</font></p>
	                <p v-else-if="item.sale_status==1">{{item.wish_count}}人想看</font></p>
	                <!-- <a @click.stop="hostGoBuy(item)">购票</a> -->
	            </li>
	        </ul>		
	    </div>
        <a @click="goBuy" class="buy" v-if="baseInfo.sale_status==2">选座购票</a>
        <a @click="goBuy" class="buy" v-else-if="baseInfo.sale_status==1">超前预售</a>
	</div>
</template>
<script type="text/javascript">
// import $ from 'jquery';
import { isWeiXin } from '@/assets/js/date.js';

import Swiper from 'swiper';
import 'swiper/css/swiper.css';
export default {
	data() {
	    return {
	    	title:"",
	    	baseInfo: [],
	    	getMovieId:'',
	    	psl:'',
            psl_tab:'',
            videos:[],
            reviewsPeopleNum:'',
            count:"",
            wish_count:'',
            starsvalue:0,
            activity:[],
            actorInfo: [],
            directorInfo: [],
            photoList: [],
            imageList:[],
            reviewlist: [],
            isSelect:-1,
            isMyreview:-1,
            value:1,
            hostMovie:[],
            myId:'',
            pshow:false,
            startPosition:0,
            reviewshow:false,
            revalue:10,
            score:10,
            reviewtxt:['糟糕透顶','勉强看看','可以考虑','值得推荐','叹为观止'],
            reviewindex:4,
            messagevalue:'',
            isreadonly:false,
            title:'',
            fold:false,
            isLow:false,
            isindex:1,
            if_wechat:isWeiXin()
	    }
	},
	mounted() {
		var that=this;
		that.getMovieId=this.$route.query.movieId;
		that.getMovie();
		that.getHotMovie();
		
		 
	},
	methods:{
		sharePage(){
		      var that=this;
		      if(!isWeiXin()){
		        window.WebViewJavascriptBridge.callHandler(
		            'Share'  //分享定义的方法名称
		            , {
		             'title':"《"+that.baseInfo.title+"》最爱的电影与你分享！",//标题
		             'desc':that.baseInfo.long_intro,//内容
		             'img':that.baseInfo.cover,//图片
		             'link':location.href,
		            }  //请求参数
		            , function(responseData) { //回调数据接口
		               console.log(responseData)
		            }
		        ); 
		      }
    	},
		onClickLeft() {
			var that=this;
			var i=-that.isindex;
	        this.$router.goBack(i)
	    },
	    getMovie(){

	    	var that=this;
	        var data={
	            movieId: that.getMovieId,
	        }
	        this.$http.post('/movie/show',data).then((j) => {
	            that.baseInfo = j.data.data.movie;
	            that.starsvalue=j.data.data.movie.rates/2;
	            console.log(that.starsvalue)
	            that.psl=j.data.data.psl;
	            that.psl_tab=j.data.data.psl_tab;
	            that.myId=j.data.data.mid;
	            that.activity=j.data.data.activity;
	            that.reviewsPeopleNum=j.data.data.reviewsPeopleNum;
	            that.title=j.data.data.movie.title;
	            that.count=j.data.data.reviewsCount;
	            that.wish_count=~~j.data.data.movie.wish_count;
	            console.log(that.baseInfo.sale_status)
	            that.actorInfo=j.data.data.casts;
	            that.reviewlist=j.data.data.reviews;
	            that.photoList=j.data.data.photos;
	            that.directorInfo=j.data.data.directors;
	            that.videos=j.data.data.videos;

	            document.title = that.baseInfo.title;
	            var data1 = that.photoList;
	            data1.forEach(info=>{
	            	that.imageList.push(info.url);
	            })
	            that.$nextTick(function(){

	            	var swipers = new Swiper('.swiper-container2',{
                    	lazy: {
						    loadPrevNext: true,
						    loadPrevNextAmount: 4,
						},
                        observer:true,
                        observeParents:true,
                        slidesPerView : 'auto',
                        centeredSlides:false, 
                        /*slidesOffsetBefore:0,*/
                    })
                	var swipers = new Swiper('.swiper-container',{
                    	lazy: {
						    loadPrevNext: true,
						    loadPrevNextAmount: 3,
						},
                        observer:true,
                        observeParents:true,
                        slidesPerView : 'auto',
                        centeredSlides:false, 
                        /*slidesOffsetBefore:0,*/
                    })
                    var a=document.getElementById('txts1');
                    var b=parseFloat(getComputedStyle(a)["lineHeight"]);
                    var ah=parseInt(a.offsetHeight/b);
                    if(ah>2){
                    	that.isLow=true;
                    }

                })
	            
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
		    	console.log("a")
		    	this.$router.push({name:'iframebox',query:{srclink:item}});
		    }
            // 
		},
	    photoShow(index){
            var that=this;
            that.pshow=true;
            that.$nextTick(function(){
	            var swipers = new Swiper('.swiper-container3')
	            swipers.slideTo(index, 0, false)
	        })
	    },
	    closeShareBtn(){
            var that=this;
            that.isSelect=-1;

	    },
	    closeImg(){
            var that=this;
            that.pshow=false;
            that.startPosition=0;
	    },
	    getHotMovie(){
            var that=this;
            var data={
	            movieId: that.getMovieId,
	        }
            this.$http.post('/index/recommend',data).then((j) => {
	            that.hostMovie=j.data.data; 
	           // console.log(that.hostMovie) 

	        })
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
        getRates:function(rates){
            var rate=parseFloat(rates);
            //console.log(rate)
            return rate;
        },
        ypView: function() {
            var that=this;
            that.fold=!that.fold;
        },
        goMore:function(){
        	this.$router.push({name:'filmcrew',query:{movieId:this.getMovieId}});
        },
        prZan: function(item, index) {
            var that = this;
            var data = {
                reviewId: item.id,
                //has_vote: item.has_vote ? 1 : 0,
            };
            this.$http.post('/review/vote',data).then((j) => {
            	if(j.data.code==0){
            		if(item.has_vote=='1'){
            			item.has_vote='0';
            			item.vote--;
            		}
            		else{
            			item.has_vote='1';
            			item.vote++;
            		}
            	}
            	
                // $(".reviewzan").eq(index).next("font").html(j.data.data)

            })

        },
        goEvaluate: function() {
            var that = this;
            that.reviewshow = true;
        },
        closeEvaluate: function() {
            var that = this;
            that.reviewshow = false;
        },
        moreReview:function(){
            var that=this;
            this.$router.push({name:'morereviewbox',query:{movie_id:that.getMovieId,movieName:that.title,myId:that.myId}});
            // window.location.href="morereview.html?movie_id="+getMovieId+"&&movieName="+that.name+"&&myId="+that.myId;

        },
        goBuy:function(){
        	var that=this;
        	console.log(that.getMovieId)
        	this.$router.push({name:'cinemabox',query:{movieId:that.getMovieId}});
        },
        deleteTip:function(item,index){
            var that=this;
            console.log(index)
            if(item.member_id==that.myId&&item.invisible=='0'){
                that.isSelect=index
                that.isMyreview=index;    
            }
            else if(item.member_id==that.myId&&item.invisible=='1'){
                that.isSelect=-1
                that.isMyreview=-1;
                that.delectBth(item.id);
            }
            else{
                that.isSelect=-1;
                this.$router.push({name:'evaluate',query:{reviewId:item.id}});
            }
            /*that.isSelect=index;*/
        },
        delectBth:function(id){
            var that=this;
            that.deleteId=id;
            this.$dialog.confirm({
			  message: '确认删除这条评论？'
			}).then(() => {
			  // on confirm
			  that.delectFun();

			}).catch(() => {
			  // on cancel
			});
            that.isSelect=-1;
        },
        delectFun:function () {
            var that=this;
            console.log(that)
            var data={
                reviewId:that.deleteId,
            };
            this.$http.post('/review/delReview',data).then((j) => {
            	console.log(j)
                if(j.data.code==0){
                    location.reload() 
                }
                else{
                	this.$dialog.alert({
					   message: j.data.msg
					}).then(() => {
					});
                }

                
            })
        },
        goVideo:function(num){
            this.$router.push({name:'videosbox',query:{movieId:this.getMovieId,num:num}});

        },
        changeScore(value){
        	var that=this;
        	that.score=value*2;
        	if(that.score==1||that.score==2){
        		that.reviewindex=0;
        	}
        	else if(that.score==3||that.score==4){
        		that.reviewindex=1;
        	}
        	else if(that.score==5||that.score==6){
        		that.reviewindex=2;
        	}
        	else if(that.score==7||that.score==8){
        		that.reviewindex=3;
        	}
        	else if(that.score==9||that.score==10){
        		that.reviewindex=4;
        	}
        },
        rev: function() {
            var that=this;
            if(that.messagevalue.length<5||that.messagevalue.length>50){
            	this.$dialog.alert({
				   message: '评论内容在5-50字之间'
				}).then(() => {
				});
				return false;
            }
            var data = {
                    movieId: that.getMovieId,
                    content: that.messagevalue,
                    rates: that.score
                };

            this.$http.post('/review/post',data).then((j) => {
            	if(!j){return false;}
                if (j.data && ('code' in j.data) && j.data.code === 0) {
                	// this.$toast('提示文案')
                	var toast = this.$toast.loading({
					  duration: 3000, // 持续展示 toast
					  forbidClick: true,
					  message: '评论已提交！',
					  onClose:function(){
					  	window.location.reload();
					  }
					});
                }

            })
        
        },
        likeSee:function(item){
            //alert(1)
            //console.log(item.id)
            var that=this;
            var data={
                "fav":item.has_fav=='1'?0:1,
                "movieId":item.id,
            }
            this.$http.post('/movie/fav',data).then((j) => {
                //that.fav_count=parseFloat(that.baseInfo.fav_count)
                if(!j){return false;}
                console.log(j)
                if(j.data.code==0){
                    if(item.has_fav=='1'){
                        item.has_fav=0;
                        this.$toast('想看电影已取消');
                        that.wish_count=that.wish_count-1;
                    }
                    else if(item.has_fav=='0'){
                        item.has_fav=1;
                        this.$toast('已添加为想看电影');
                        that.wish_count=that.wish_count+1;
                    }
                }
            })
        },
        shareBth:function(id){
            var that=this;
            window.location.href="../share/evaluate.html?reviewId="+id;
            that.isSelect=-1;
        },
        love:function(item){
            //console.log(item.has_fav)
            var that=this;
            var data={
                celebrityId:item.pid,
            };
            this.$http.post('/celebrity/celebritySupport',data).then((j) => {
                if(j.data.code==0){
                    if(j.data.data==1){
                    	this.$toast(j.data.msg);
                        item.has_support=1;
                        item.num=~~item.num+1;
                    }
                }
                else if(j.data.code==-1){
                    this.$toast(j.data.msg);
                }

                
            })
        },
        Detail:function(item,type){
            this.$router.push({name:'starinfo',query:{celebrityId:item.pid,type:type}});

        },
        reviesDetail:function(item){
            if(item.invisible=='0'){
            	this.$router.push({name:'replybox',query:{reviewId:item.id}});
            }     
        },
        movieDetail(id){
        	var that=this;
        	that.getMovieId=id;
        	that.getMovie();
		    that.getHotMovie();
		    window.location.href=that.changeURLArg(window.location.href,'movieId',id);
		    that.isindex=that.isindex+1;

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
	    }
	}
};

</script>