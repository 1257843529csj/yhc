<template>
	<div class="box">
		<van-nav-bar
		  title="活动"
		  fixed
		/>
		<div id="list" style="margin-top: 46px;">
			<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  @load="onLoad"
			>
		        <van-cell class="hdbox" v-for="(item,key) in activeList">

		            <a :href="item.url">
		                <div class="hdpic">
		                    <img :src="item.cover">
		                    <div class="hdpic">{{item.cat}}<i></i>
		                    </div>
		                </div>
		                <div class="hd_cont">
		                    <div class="jiaobao2"><font>已结束</font></div>
		                    <div class="hd_jt"></div>
		                    <div class="hd_times" >
		                        <p>{{item.starttime.slice(8,10)}}</p>
		                        <p>{{item.starttime.slice(5,7)}}月</p>
		                    </div>
		                    <div class="text">
		                        <h2>{{item.title}}</h2>
		                        <p>开始时间:{{item.starttime}}<!--  至{{item.endtime}}  --></p>
		                        <div v-if="item.intro.length!=0">
		                        <!-- <p>{{item.intro[0]}}</p> -->
		                            <!-- <div v-for="items in item.intro">
		                                 <p>{{items['name']}}:{{items['value']}}</p>
		                                <p>{{item.intro[1]['name']}}:{{item.intro[1]['value']}}</p> 
		                            </div> -->
		                        </div>
		                    </div>
		                </div>
		            </a>
		        </van-cell>
	        </van-list>   
	    </div> 
	    <div class="kong"></div>
	</div>
</template>
<script type="text/javascript">
import 'swiper/css/swiper.css';
export default {
	data() {
	    return {
	    	activeList:[],
            times:[],
            loading: false,
            finished: false,
            page:1,
	    
	    }
	  },
	mounted() {
		
	},
	methods:{
	    onLoad:function(){
            var that=this;
            var data={
                "page":that.page,
            }
            this.$http.post('/activity/list',data).then((j) => {
                  
                var result=j.data.data;
                if(result.length!=0){
                	that.times=j.data.data[0].intro;
                    that.activeList = that.activeList.concat(result);
                    that.page+=1;
                    this.loading = false;
                } 
                else{
                    this.finished = true;
                    this.loading = false;
                } 
                //console.log(j.data)
            }, function() {

            })
        },
	}
};
</script>