<template>
	<div class="box">
		<van-nav-bar
		  :title="title"
		  left-arrow
		  @click-left="onClickLeft"
		/>
		<div class="askbox">
	        <ul id="review_list">        
	            <li v-for="(item,index) in reviewlist" @click="reviesDetail(item)">
	                <!--   弹窗 -->
	                <div class="deletewindow" :class="isSelect==index? 'windowShow' :''" @click.stop="closeShareBtn">
	                    <div>
	                        <span @click="delectBth(item)"  v-if="isMyreview==index">删除</span>
	                        <span @click="shareBth(item.id)">分享</span>
	                    </div>
	                </div>
	                <em @click.stop="deleteTip(item,index)">...</em>
	                <div class="face">
	                    <img :src="item.member_avatar">
	                </div>
	                <div class="use_txt">
	                    <div class="who_pl"><font>{{item.member_nick}}</font>的影评</div>
	                    <div class="pfen">
	                        <div class="pfen_detail">
	                            <span class="stars3"> 
	                                <van-rate allow-half v-model="item.rates/2" color="#FF9C22" void-icon="star" void-color="#666" readonly />
	                            </span>
	                            <p>{{item.rates}}分</p>
	                        </div>
	                        <div class="pinglun">{{item.content}} </div>
	      
	                        <div class="times"> 
	                            <span>{{item.pub_time}}</span> 
	                            <span>
	                            	<p @click.stop="prZan(item,index)">
	                                	<van-icon name="good-job-o" v-if="item.has_voted==0"></van-icon>
	                                    <van-icon name="good-job" color="#555" v-if="item.has_voted==1"/></van-icon>
	                                </p>
	                                    
	                                <font>{{item.votes}}</font> 
	                            </span>                          
	                        </div>
	                    </div>
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
	    	title:'',
	    	reviewlist:[],
	    	myId:'',
	    	isSelect:-1,
            isMyreview:-1, 
	    }
	},
	mounted() {
		var that=this;
		that.getMovieId=this.$route.query.movie_id;
		that.myId=this.$route.query.myId;
		that.title=this.$route.query.movieName;
		that.getReview();

		
	},
	methods:{
		onClickLeft() {
	        window.history.go(-1);
	    },
	    getReview(){
	    	var that=this;
	    	var data = {
                movieId: that.getMovieId,
            };
	        this.$http.post('/movie/reviews',data).then((j) => {
	           that.reviewlist=j.data.data;
	        })
	    },
	    deleteTip:function(item,index){
            var that=this;
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
        },
        delectBth:function(id){
            var that=this;
            that.deleteId=id;
            this.$dialog.confirm({
			  message: '确认删除这条评论？'
			}).then(() => {
			  that.delectFun();
			}).catch(() => {
			  // on cancel
			});
            that.isSelect=-1;
        },
        delectFun:function () {
            var that=this;
            var data={
                reviewId:that.deleteId,
            };

            this.$http.post('/review/delReview',data).then((j) => {
                if(j.data.code==0){
                    location.reload() 
                }
                else{
                    this.$dialog.alert({
					  message: j.data.msg
					}).then(() => {
					  // on close
					});
                }

                
            })
        },
        reviesDetail:function(item){

            if(item.invisible=='0'){
            	this.$router.push({name:'replybox',query:{reviewId:item.id}});
            }     
        },
        prZan: function(item, index) {
            var that = this;
            var data = {
                reviewId: item.id,
                //has_vote: item.has_vote ? 1 : 0,
            };
            this.$http.post('/review/vote',data).then((j) => {
            	if(j.data.code==0){
            		if(item.has_voted=='1'){
            			item.has_voted='0';
            			item.votes--;
            		}
            		else{
            			item.has_voted='1';
            			item.votes++;
            		}
            	}
            	
                // $(".reviewzan").eq(index).next("font").html(j.data.data)

            })

        },
        shareBth:function(id){
            var that=this;
            this.$router.push({name:'evaluate',query:{reviewId:id}});
            that.isSelect=-1;
        },
	}
};

</script>