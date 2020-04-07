<template>
	<div class="box">
		<van-nav-bar
		  title="贡献榜"
		  left-arrow
		  fixed
		  @click-left="onClickLeft"
		/>
		<div class="topped-list toppedactor-list boxcon" @click="goStar(myLove)">
	        <div class="topped-left" >
	            <div class="head">
	                <img :src="myLove.avatar" class="userhead">
	                <div>
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
		<div class="fentitle">
		    <span>粉丝排行：</span>
		</div>
		<van-list
			v-model="loading"
			:finished="finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<van-cell class="topped-list" v-for="(item,index) in contributeList">
	            <div class="topped-left">
		            <div class="head">
		                <img :src="item.avatar" class="userhead">
		                <div>
		                    <img src="../../assets/img/pai1.jpg" v-if="item.rank==1">
		                    <img src="../../assets/img/pai2.jpg" v-else-if="item.rank==2">
		                    <img src="../../assets/img/pai3.jpg" v-else-if="item.rank==3">
		                    <span v-else>{{item.rank}}</span>
		                </div>
		            </div>
		            <div class="user-name">
		                <span>
		                  {{item.nick}}
		                </span>
		                <span v-if="item.rank==1">头号真爱粉</span>
		                <!-- <span v-else-if>距离上一名差{{myInfo.diff}}热爱值</span> -->
		                <span v-else="messageArr" v-html="messageArr(index)"> {{messageArr(index)}}</span> 
		            </div>    
		        </div>
		        <div class="topped-right">
		            <span>{{item.support}}</span> 
		            <span>热爱值</span> 
		        </div>  
	        </van-cell>
        </van-list>
        <div class="kong" style="height: 2.2rem"></div>
	    <div class="mycontribute">
	    	<div class="topped-list contribute-list">
		        <div class="topped-left" >
		            <div class="head">
		                <img :src="myInfo.avatar" class="userhead"> 
		            </div>
		            <div class="ourinfo">
		                <span>
		                   {{myInfo.nick}}
		                </span>
	                    <span v-if="myInfo.rank!=0">我的排名：{{myInfo.rank}}</span>
	                    <span v-if="myInfo.rank==1 && myInfo.support!=0">头号真爱粉</span> 
	                    <span v-else-if="myInfo.support==0">未上榜，还没为Ta冲榜</span> 
	                    <span v-else="contributeArr" v-html="contributeArr(myInfo.member_id)"></span> 
		            </div>    
		        </div>
		        <div class="contribute-right">
		            <span>热爱值：{{myInfo.support}}</span> 
		        </div>    
		    </div>
	    </div>
	</div>
</template>
<script type="text/javascript">
export default {
	data() {
	    return {
	    	myLove:[],
	    	contributeList:[],
	    	myInfo:[],
            count:'',
	    	actorId:"",
	        page:1,
	        loading: false,
            finished: false
	    }
	  },
	mounted() {
		var that=this;
		that.actorId=this.$route.query.actorId;
		that.getMyLove();
	},
	methods:{
		onClickLeft() {
	         this.$router.goBack()
	    },
	    getMyLove:function(){
            var that=this;
            this.$http({
		        methods: "get",
		        url: "/celebrity/supportDetail",
		        params: {
		            celebrityId:that.actorId,
		        }
		    }).then(j => {
                that.myLove = j.data.data;
                that.count=j.data.data.fav_count;
            })   
        },
		onLoad:function() {
            var that=this;
            var data={
               page:that.page,
               celebrityId:that.actorId,
            }
            this.$http.post('/my/supportSort',data).then((j) => {
                var result=j.data.data.list; 
                if(result.length!=0){
                    that.myInfo=j.data.data.my;
                    

                    that.contributeList = that.contributeList.concat(result);
                    that.page+=1;
                    this.loading = false;
                } 
                else{
                    this.finished = true;
                    this.loading = false;
                }                                    
            })
               
        },
        linkUrl:function(){
            window.history.go(-1);

        },
        messageArr:function(index){
            //var arr=[];
            for(var i=0;i<this.contributeList.length-1;i++){
                if(this.contributeList[index].support!=this.contributeList[index-1].support){
                    return "距离上一名差"+this.contributeList[index].diff+"热爱值";
                }
                if(this.contributeList[index].support==this.contributeList[index-1].support /*&& this.contributeList[index].support==this.contributeList[index+1].support*/){
                    return "距离上一名只差一点时间";
                }
                else{

                }
            }
  
        },
        contributeArr:function(id){
            //console.log(id)
            for(var i=0;i<this.contributeList.length;i++){
                if(this.contributeList[i].member_id==id){
               
                    if(this.contributeList[i].support==this.contributeList[i-1].support){
                        return "距离上一名只差一点时间";    
                    }
                    else if(this.contributeList[i].support!=this.contributeList[i-1].support){
                        return "距离上一名差<font style='color: red;padding: 0 .1rem;'>"+this.contributeList[i].diff+"</font>热爱值"
                    }
                    
                    
                }
                /*else{
                    return "未上榜，还没为Ta冲榜";    
                }*/
                
            }    
        },
        love:function(item){
            //console.log(item.has_fav)
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
        goStar(item){
        	this.$router.push({name:'starinfo',query:{celebrityId:item.celebrity_id}});
        }
	}
};

</script>