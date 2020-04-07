<template>
	<div class="box">
		<van-nav-bar
		  title="本月热榜"
		  left-arrow
		  @click-left="onClickLeft"
		  fixed
		/>
		<div class="boxcon">
			<div class="toppedactor" v-if="actorId!=undefined">
		        <div class="topped-list toppedactor-list" @click="goCurrent">
		            <div class="topped-left">
		                <div class="head">
		                    <img :src="myLove.avatar" class="userhead">
		                    <div >
		                        <img src="../../assets/img/pai1.jpg" v-if="myLove.rank==1">
		                        <img src="../../assets/img/pai2.jpg" v-else-if="myLove.rank==2">
		                        <img src="../../assets/img/pai3.jpg" v-else-if="myLove.rank==3">
		                        <span v-else>{{myLove.rank}}</span>
		                    </div>
		                </div>
		                <div class="topped-name">
		                    <span>
		                        <font>{{myLove.name}}</font>
		                        <p v-if="myLove.has_fav==1"><van-icon class="aixin"name="like" @click.stop="love(myLove)"/></p>
		                        <p  v-else><van-icon class="aixin" name="like-o" @click.stop="love(myLove)"/></p>
		                    </span>
		                    <span>粉丝数:{{myLove.fav_count}}人</span>   
		                </div>    
		            </div>
		            <div class="topped-right">
		                <span>{{myLove.supportCount}}票</span> 
		                <span>投票数</span> 
		            </div>    
		        </div>
		        <div class="contribute-btn" @click.stop="goContribute">
		            <span>我的热爱值：{{myLove.support}}票</span>    
		        </div>
		    </div>
		    <div id="wrapper">
		    	<van-list
				  v-model="loading"
				  :finished="finished"
				  finished-text="没有更多了"
				  @load="onLoad"
				>
		            <van-cell class="topped-list" v-for="(item,index) in toppedlist" @click="goActior(item.celebrity_id)">
		                <div class="topped-left" >
		                    <div class="head">
		                        <img :src="item.avatar" class="userhead">
		                        <div>
		                            <img src="../../assets/img/pai1.jpg" v-if="index==0">
		                            <img src="../../assets/img/pai2.jpg" v-else-if="index==1">
		                            <img src="../../assets/img/pai3.jpg" v-else-if="index==2">
		                            <span v-else>{{index+1}}</span>
		                        </div>
		                    </div>
		                    <div class="topped-name">
		                        <span>
		                        <font>{{item.name}}</font>
		                        <p v-if="item.has_fav==1"><van-icon class="aixin"name="like" @click.stop="love(item)"/></p>
		                        <p  v-else><van-icon class="aixin" name="like-o" @click.stop="love(item)"/></p>
		                        
		                        
		                        </span>
		                        <span>粉丝数:{{item.fav_count}}人</span>   
		                    </div>    
		                </div>
		                <div class="topped-right">
		                    <span>{{item.num}}票</span> 
		                    <span>投票数</span> 
		                </div>    
		            </van-cell>
	            </van-list>
		    </div>
	    </div>
	    <div class="kong"></div>
        <a class="topper-btn" @click="linkUrl"> 我的爱豆</a>
		
	</div>
</template>
<script type="text/javascript">	
import Swiper from 'swiper';
import $ from 'jquery';

export default {
	data() {
	    return {
	    	toppedlist:[],
	        myLove:[],
	        num:0,
	        page:1,
	        actorId:"",
	        rank:'',
	        loading: false,
            finished: false,
	    }
	  },
	mounted() {
		var that=this;
		that.actorId=this.$route.query.actorId;
		that.getMyLove();
		// that.pullOnLoad();
	},
	methods:{
		onClickLeft() {
	        this.$router.goBack()
	    },
	    getMyLove:function(){
            var that=this;
            if(that.actorId==undefined){
            	return false;
            }
	        this.$http({
	            methods: "get",
	            url: "/celebrity/supportDetail",
	            params: {
	              celebrityId:that.actorId,
	            }
	        }).then(j => {
	            that.myLove = j.data.data;
	        });
        },
		onLoad:function(){
			var that=this;
            var data={
                 "page":that.page,
            }
            this.$http.post('/celebrity/List',data).then((j) => {
                var result=j.data.data;
                if(result.length!=0){
                    that.toppedlist = that.toppedlist.concat(result);
                    that.page+=1;
                    this.loading = false;
                } 
                else{
                    this.finished = true;
                    this.loading = false;
                }                   
            })
           

		},
        goActior:function(id){
            // 跳转到明星
            this.$router.push({name:'starinfo',query:{celebrityId:id}});

        },
        love:function(item){
            console.log(item.has_fav)
            var that=this;
            var data={
                celebrityId:item.celebrity_id,
            };
            this.$http.post('/celebrity/celebrityFav',data).then((j) => {
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
                
            })
        },
        linkUrl:function(){
            this.$router.push({name:'mylovebox'});

        },
        goCurrent:function(){
            var that=this;
            this.$router.push({name:'starinfo',query:{celebrityId:that.myLove.celebrity_id}});
        },
        goContribute:function(){
            var that=this;
            this.$router.push({name:'contribute',query:{actorId:that.actorId}});
        },
	}
};

</script>