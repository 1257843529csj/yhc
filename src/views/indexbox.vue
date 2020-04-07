<template>
	<div class="box">
		<van-nav-bar title="首页" fixed :z-index="1000">
			<van-icon style="line-height:.5rem"   slot="left" size=".3rem"  @click="cityView">{{cityname}}
				<van-icon name="arrow-down" size="10" style="margin-left: 0.1rem" /></van-icon>
			</van-icon>
			<van-icon name="search" slot="right" color="#ff9c22" size="26px" @click="goSearch" style="margin-right:.5rem;"/>	
		</van-nav-bar>
		<img src="../assets/img/qdimg.png" class="qidaoming" @click="calendar">
		 <!-- v-show="isbannershow" -->
		<div class="banner" v-show="isbannershow">
	        <div class="swiper-containers">
	            <div class="swiper-wrapper">
	                <div class="swiper-slide" v-for="item in bannerlist">
	                    <img :src="item.img" @click="goIframe(item.url)"/>
	                </div> 
	                <!-- <div class="swiper-slide">
	                    <img src="http//m.filmfly.cn/up/maoyan/mv/cover/b17eaf433f77dea73deec5a07f2c17d0.jpg" @click="goIframe('http://m21.filmfly.cn/app/index.html#/Showbox?movieId=14130')"/>
	                </div>  -->
	
	            </div>
	            <!-- Add Pagination -->
	            <div class="swiper-pagination"></div>
	        </div>
	    </div>
	    <div class="hostmovie" :class="!isbannershow?'hostmovietop':''">
	    	<div class="hostmovie-title" @click="hostMore">
	            <span>热映影片</span>
	            <span>全部{{arrlength}}部
	            	<van-icon name="arrow" />
	            </span>

	        </div>

	        <div class="swiper-container2 hostmovie-detail">
	            <div class="swiper-wrapper">
	                <div class="swiper-slide list" v-for="(item,index) in hostlist" v-if="index<12" @click="movieDetail(item.movie_id)" style="border-bottom: none">
	                    <div class="youhui3" v-if="item.psl"></div>
	                    <p class="hostmovie-versions" v-if="getVersions(item.versionsFormat)==2">{{item.versionsFormat}}</p>
	                    <img :data-src="item.cover" :class="isjz?'swiper-lazy':''">
	                    <em v-if="item.sale_status==2">观众评分:{{item.rates}}分</em>
	                    <em v-else-if="item.sale_status==1">{{item.wish_count}}人想看</em>
	                    <span>{{item.title}}</span>
	                    <a class="gpiao" :class="item.psl?'reds':''" v-if="item.sale_status==2" @click.stop="goBuy(item.movie_id)">购票</a>
	                    <a class="yspiao" :class="item.psl?'reds2':''" v-else-if="item.sale_status==1" @click.stop="goBuy(item.movie_id)">预售</a>
	                    <div class="swiper-lazy-preloader"></div>
	                    
	                </div>
	        
	            </div> 
	        </div>
	        <div class="beonmovie" style="margin: 0">
		        <div class="beonmovie-title" @click="upcomMore">
		            <span>即将上映</span> 
		            <span>全部{{lens}}部<van-icon name="arrow" /></span> 
		        </div>
		        <div class="swiper-container3 beonmovie-detail">
		            <div class="swiper-wrapper">
		                <div class="swiper-slide beonmovie-list" v-for="(item,index) in indexlist.upcoming" v-if="index<12" @click="movieDetail(item.movie_id)">
                            
		                    <img class="beonmovie-img" :class="isjz?'swiper-lazy':''" :data-src="item.cover" @click="movieDetail(item.movie_id)">
		                    <em>{{item.wish_count}}人想看</em>
		                    <span>{{item.title}}</span>
		                    <p>{{getdata(item.release_time,1)}}</p> 
		                    <div class="my-swipe-like df-c" @click.stop="likeSee(item)">
			                  <van-icon name="like-o" color="#555" v-if="item.has_fav == '0'" />
			                  <van-icon name="like" color="rgb(255,0,0)" v-if="item.has_fav == '1'" />
			                </div>
		                    <em class="upcoming-style" v-if="getVersions(item.versionsFormat)==2">{{item.getVersions}}</em>
		                    <div class="swiper-lazy-preloader"></div>
		                    
		                </div>
		        
		            </div> 
		        </div>
		              
		    </div>
	        <div class="topmonth" @click="goTopped">
	            <div class="topmonth-title">
	                <span>本月热榜</span> 
	            </div>
	            <div class="topmonth-con">
	                <div class="topmonth-list" v-for="(item,index) in celebrity">
	                    <img class="jpai" src="../assets/img/p1.jpg" v-if="index==0">
	                    <img class="jpai" src="../assets/img/p2.jpg" v-if="index==1"> 
	                    <img class="jpai" src="../assets/img/p3.jpg" v-if="index==2">  
	                    <img class="mxheard" :src="item.avatar">
	                    <div class="mxname">
	                        <span>{{item.name}}</span> 
	                    </div>
	                    <van-icon class="aixin" name="like-o" v-if="item.has_fav=='0'"/>
	                    <van-icon class="aixin"name="like" v-if="item.has_fav=='1'"/>
	                    <span class="ps">{{item.num}}票</span>
	                </div>
	                <span class="topmonth-ts">快为自己的爱豆冲榜吧！</span> 
	            </div> 
	        </div> 
		</div>
		<div class="kong">
    
       </div>
       <van-popup
		  v-model="cityShow" closeable
		  position="top"
		  :style="{ height: '100%',background: '#eee'}"
		>
        <Citys @func="getNameFormCity" :cshow="cityselectShow"></Citys>
	   </van-popup>
		     <!-- v-if="isCalendar" -->
	    <div class="qdwindow" v-show="isShow">
	        <div class="calendar">
	            <div class="calenbox">
	                <div id="calendar"></div>
	            </div>
	            <div class="text-center">
	                <button :class="!isQian?'btn-qiandao':'btn-qiandao-alread'" @click="signIn">马上签到</button>
	                <!-- <button class="btn-qiandao-alread">马上签到</button> -->
	            </div>
	        </div>
	    </div>
	    <!--  签到成功 -->
	    <div class="qdSuccess" v-show='isSuccess'>
	        <div class="qdSuccess_con">
	           <div class="qdSuccess_con_title">
	               <span>获得奖励</span>
	               <em @click="closeqd">X</em>
	           </div>
	           <div class="qdSuccess_detail">
	               <img src="../assets/img/jyz.png">
	               <span>经验值+{{exp}}</span>
	           </div>
	          <!--  <a>已领取</a> -->
	        </div> 
	    </div>
	</div>
</template>

<script type="text/javascript">
import Swiper from 'swiper';
import 'swiper/css/swiper.css';
import { times,inapp,datet } from '@/assets/js/date.js';
import Citys from "../components/city.vue"
export default {
	data() {
	    return {
	    	bannerlist:[],
	    	indexlist:[],
	    	hostlist:[],
	    	lens:'',
	    	arrlength:'',
	    	celebrity:[],
	    	isbannershow:true,
	    	k:"",
	    	cityShow:false,
	    	cityselectShow:false,
	    	cityname:'',
	    	istipe:true,
	    	isjz:true,
	    	isShow:false,
	    	isSuccess:false,
            exp:'',
            isQian:false,
            srcLink:'http://m.filmfly.cn/wap21/movie/show.html?movieId=14240',
	    }
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
		that.getName();
		that.getBanner();
		if(inapp()){
			that.tagback_moblie();
		}
		that.k = times;
	
		  /*状态栏变色*/
		 // window.WebViewJavascriptBridge.callHandler(
			// 	'setStatusBarBackground'  //支付定义的方法名称
			// 	, {
			// 		navbgcolor:"#cc0000",
			// 		navfontcolor:1		        
			// 	},function(responseData) {}
			// );  
	},
	methods:{
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
		getdata(k,i){
			var time;
			time=times(k,i);
			return time;
		},
		getBanner:function(){
            var that=this;
            var data={
              site:0
            }
            this.$http.post('/movie/getbanner',data).then((j) => {
            	var datahtml=j.data.data;
                var strObj = JSON.stringify(datahtml);
                var removeHttp = strObj.replace(/http:/g, "");
                that.bannerlist=JSON.parse(removeHttp);
                that.$nextTick(function(){
	                if (j.data.data=="") {
	                	that.isbannershow=false;

	                }
	                else{
	                  that.isbannershow=true;
	                   var swipers = new Swiper('.swiper-containers',{
	                   	 autoplay: {
	                   	 	autoplay:true,
						    disableOnInteraction: false,
						  },
	                      loop : true,
	                      pagination: {
						    el: '.swiper-pagination',
						    clickable :true,
						  },
	                  })
	              }
	            })

            })
            that.getIndexList();
        },
        getIndexList:function(){
            var that=this;
            this.$http.post('/index/index').then((j) => {
                var datahtml2=j.data.data;
                that.isjz=true;
                var strObj2 = JSON.stringify(datahtml2);
                var removeHttp2 = strObj2.replace(/http:/g, "");
                that.indexlist=JSON.parse(removeHttp2);

                that.lens=j.data.data.upcomingCount;
                var datahtml=j.data.data.play_movie.list;
                var strObj = JSON.stringify(datahtml);
                var removeHttp = strObj.replace(/http:/g, "");
                that.hostlist=JSON.parse(removeHttp);
                that.arrlength = Object.keys(j.data.data.play_movie.list).length;
                //console.log(arr.length)
                that.$nextTick(function(){
                	var swiperss = new Swiper('.swiper-container2',{
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
                that.getTopmonth(); 
            })
        },
        hostMore:function(){
        	this.$router.push({name:'moviebox',query:{active:'zzry'}});
        },
        upcomMore:function(){
        	this.$router.push({name:'moviebox',query:{active:'jjsy'}});
        },
        movieDetail:function(id){
        	this.$router.push({name:'showbox',query:{movieId:id}});
            // window.location.href="../movie/show.html?movieId="+id;

        },
        goBuy:function(id){
        	this.$router.push({name:'cinemabox',query:{movieId:id}});
        },
        calendar:function(){
            var that=this;
            that.getSignIn(); 
        },
        getSignIn:function(){
	        var that=this;
	        this.$http({
	        methods: "get",
	        url: "/member/signIn",
	        }).then(j => {
	        that.$nextTick(function(){
	            if(j.data.code==0){
	                that.isShow=true;
	                var myDate = new Date();
	                var datas=myDate.getDate();
	                if (datas >= 0 && datas <= 9) {
	                    datas = "0" + datas;
	                }
	                /*console.log(datas)*/
	                
	                if(j.data.data.day!=""){
	                    that.signList = j.data.data.day;
	                    datet(that.signList);
	                    document.getElementById('calendar_time').innerHTML =j.data.data.count;
	                    // $("#calendar_time").html(j.data.data.count);
	                }
	                else{
	                    that.signList = [{"signDay":""}];
	                    console.log(that.signList)
	                    datet(that.signList);
	                    document.getElementById('calendar_time').innerHTML =j.data.data.count;

	                    // $("#calendar_time").html(j.data.data.count);

	                }
	                for(var i=0;i<j.data.data.day.length; i++){
	                    if(j.data.data.day[i].signDay==datas){
	                        that.isQian=true;
	                        // $(".btn-qiandao-alread").show();
	                        // $(".btn-qiandao").hide();    
	                    }  
	                }
	                document.getElementById('sign_close').onclick =function(){
	                    that.isShow=false;
	                }
	               
	            }
	            else{
	               tips1(j.msg);
	            }
	        })

	      })

	    },
	    signIn:function(){
	        var that=this;
	        if(that.isQian){
	          return false;
	        }
	        that.$http.post('/member/signIn').then((j) => {
	          if(j.data.code==0){
	              that.signList = j.data.data.day;
	              that.exp=j.data.data.exp;
	              datet(that.signList);
	              document.getElementById('calendar_time').innerHTML =j.data.data.count;
	              if(j.data.data.exp>0){
	                that.isShow=false;
	                that.isSuccess=true;
	              }
	          }
	          else if(j.code=301){
	              that.signList = j.data.data.day;
	              that.exp=j.data.data.exp;
	              datet(that.signList);
	              document.getElementById('calendar_time').innerHTML =j.data.data.count;
	              if(j.data.data.exp>0){
	                that.isShow=false;
	                that.isSuccess=true;
	              } 
	          }
	          else{
	            Dialog.alert({
	              message: j.data.msg
	            }).then(() => {
	              // on close
	            })

	          }

	        })

	    },
	    closeqd:function(){
	        var that=this;
	        that.isSuccess=false;
	    },
        getVersions:function(versions){
      //   	if(versions==null){
	    	// 	return false;
	    	// }
            if(versions&&versions.replace(/(^\s*)|(\s*$)/g, "")=='2D'||versions==''||versions==false){
                return 1;  
            }
            else{
                return 2;  
            }
        },
        getTopmonth:function(){
            var that=this;
            this.$http.post('/celebrity/celebrity').then((j) => {
                var datahtml=j.data.data;
                var strObj = JSON.stringify(datahtml);
                var removeHttp = strObj.replace(/http:/g, "");
                that.celebrity=JSON.parse(removeHttp);
            })

        },
        goTopped:function(){
        	// var that=this;
        	this.$router.push({name:'toppedbox'});
        },
        likeSee:function(item){
	        var that=this;

	        var data={
	            "fav":item.has_fav=='1'?0:1,
	            "movieId":item.movie_id,
	        }
	        this.$http.post('/movie/fav',data).then((j) => {
	            if(j.data.code==0){
	                if(item.has_fav=='1'){
	                    item.has_fav=0;
	                    this.$toast('想看电影已取消');
	                }
	                else{
	                    
	                    item.has_fav=1;
	                    this.$toast('已添加为想看电影');
	                }
	            }
	        })

	    },
	    goSearch(){
	    	this.$router.push({name:'selectbox'});
	    },
	    cityView(){
            var that=this;
            that.cityShow=true;
            that.isjz=false;
	    },
	    closeShow(){
	    	var that=this;
            that.cityselectShow=true;
	    },
	    getNameFormCity(data){
	    	var that=this;
	    	console.log(data)
	    	if(data.length>3){
	    		that.cityname=data.substring(0, 2)+'...';
	    	}
	    	else{
	    		that.cityname=data.replace('市', '');
	    	}
	    	
	    	//localStorage.setItem("selectname",data);
	    	that.cityShow=false;
	    	
	    	that.getBanner();
			// that.getIndexList();

	    }

	},
	components:{Citys}
};
</script>