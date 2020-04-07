<template>
	<div class="box">
		<van-nav-bar
		  :title="title"
		  left-arrow
		  fixed
		  @click-left="onClickLeft"
		/>
		<div class="boxcon">
		    <div class="title" v-if="directorInfo!=''">导演 Director({{directorInfo.length}})</div>
		    <ul class="list" v-for="item in directorInfo" @click="actirInfo(item,1)">
		        <li>
		            <div class="face">
		            <img :src="item.avatar"></div>
		            <div class="txt">
		                <span class="film_name">{{item.name}}</span>
		                <!-- <span :class="[item.has_fav==1?'film_love':'film_nolove']" @click.stop="love(item)"></span> -->
                        <van-icon class="film_love" name="like-o" v-if="item.has_fav=='0'" @click.stop="love(item)"/>
	                    <van-icon class="film_love" name="like" v-if="item.has_fav=='1'" @click.stop="love(item)"/>
		            </div>
		        </li>
		    </ul>
		    <div class="title">演员 Actor({{list.length}})</div>
		    <ul class="list" v-for="(item,index) in list" @click="actirInfo(item,2)">
		        <li>
		            <div class="face">
		                <img :src="item.avatar">
		            </div>
		            <div class="txt">
		                <p>
		                    <p class="film_name">{{item.name}}</p>
		                     <span :class="[item.has_fav==1?'film_love':'film_nolove']" @click.stop="love(item)"></span>
		                     <van-icon class="film_love" name="like-o" v-if="item.has_fav=='0'" @click.stop="love(item)"/>
	                         <van-icon class="film_love" name="like" v-if="item.has_fav=='1'" @click.stop="love(item)"/>
		                     <p v-if="item.play!=''">饰：{{item.play}}</p>
		                </p>
		                <p v-if="item.rolename!=''" class="rolename">{{item.rolename}}</p>
		            </div>
		        </li>
		    </ul> 
	    </div>
	</div>
</template>
<script type="text/javascript">
export default {
	data() {
	    return {
	    	title:"",
	    	list:[],
            directorInfo:[], 
	    	
	    }
	  },
	mounted() {
		var that=this;
		that.getInfo();
	},
	methods:{
		onClickLeft(){
			this.$router.goBack()
		},
		getInfo(){
			var that=this;
			that.getMovieId=this.$route.query.movieId;
	        var data = {
	                movieId: that.getMovieId,
	            };
	        this.$http.post('/movie/celebrity',data).then((j) => {
	            that.list=j.data.data.cats;
	            that.directorInfo=j.data.data.directors;
	            //console.log(j.data.data.cats.keys.length)
	            that.title=j.data.data.title+"演职人员";
	        }, function() {
	            /*reviewObj.reviewing = 0;*/

	        })
		},
		love:function(item){
            //console.log(item.has_fav)
            var that=this;
            var data={
                celebrityId:item.pid,
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
        actirInfo:function(item,type){
            this.$router.push({name:'starinfo',query:{celebrityId:item.pid,type:type}});
        },
        
		
	}
};

</script>