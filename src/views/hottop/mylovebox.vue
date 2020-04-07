<template>
	<div class="box">
		<van-nav-bar
		  title="我的爱豆"
		  left-arrow
		  @click-left="onClickLeft"
		  fixed
		/>
		<div class="boxcon">
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<van-cell class="topped-list" v-for="(item,index) in toppedlist"  @click="goActior(item.celebrity_id)">
		            <div class="topped-left" >
		                <div class="head">
		                    <img :src="item.avatar" class="userhead">
		                    <div>
		                        <img src="../../assets/img/pai1.jpg" v-if="item.rank==1">
		                        <img src="../../assets/img/pai2.jpg" v-else-if="item.rank==2">
		                        <img src="../../assets/img/pai3.jpg" v-else-if="item.rank==3">
		                        <span v-else>{{item.rank}}</span>
		                    </div>
		                </div>
		                <div class="topped-name">
		                    <span>
		                    <font>{{item.name}}</font>
		                    <p class="loveimg"><van-icon class="aixin" name="like"/>
		                    </p>
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
        <div class="kong"></div>
        <a class="topper-btn" @click="linkUrl"> 爱豆排行</a>
	</div>
</template>
<script type="text/javascript">
export default {
	data() {
	    return {
	    	toppedlist:[],
	        num:0,
	        page:1,
	        loading: false,
            finished: false
	    }
	  },
	mounted() {
		var that=this;
	},
	methods:{
		onClickLeft() {
	         this.$router.goBack()
	    },
		onLoad:function() {
            var that=this;
            var data={
             "page":that.page,
            }
            this.$http.post('/celebrity/mylist',data).then((j) => {
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
        linkUrl:function(){
            window.history.go(-1);

        },
        goActior:function(id){
            // 跳转到明星
            this.$router.push({name:'starinfo',query:{celebrityId:id}});

        },
	}
};

</script>