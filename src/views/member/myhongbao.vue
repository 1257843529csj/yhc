<template>
<div class="box" style="background:#f5f5f5" fixed>
	 <van-nav-bar
      title="红包"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="my_card_list">
        <div class="guize"><a @click="gotorule(3)">如何绑定</a></div>
    	<van-list
			  v-model="loading"
			  error-text="请求失败，点击重新加载"
			  @load="getcardarr"
			   :finished="finished"
      			finished-text=""
			><ul>
			  <li v-for="hongbao in hongbaoarr">
			  	
					<p>电影红包</p>
	                <p>有效期：{{hongbao.expired}}</p>
	                <p>有效期内，不限时段抵用</p>
	                <div class="money"><em>{{hongbao.val}}</em>点</div>   
				
			  </li>
			</ul>
			</van-list>
    	<div class="addcard_list" @click="add(3)"><img src="../../assets/img/add.png"> <span>添加红包</span></div>
    </div>
    <addhongbao :class="act == 3?'fixleft translateX':'fixleft'"  @goback="goback"></addhongbao>
    <div class="more_zll" v-if="isExpired">没有更多可用红包&nbsp;&nbsp;<a @click="goto_expired(3)">查看失效红包&gt;&gt;</a></div>
</div>
</template>
<script type="text/javascript">
	import addhongbao from '../../components/addhongbao'
	export default {
		data() {
		    return {
		      hongbaoarr:[],
		      loading:false,
		      finished:false,
		      pages:1,
		      act:"",
		      isExpired:true,
		    };
		 },	
		mounted() {
			this.getcardarr2()
		},
		components: {
		     addhongbao  
		},
		methods:{
			onClickLeft(){
		      this.$router.goBack()
		    },
		    gotorule(num){
		    	this.$router.push({name:'rule',query:{rule:num}});
		    },
		     goto_expired(num){
		    	this.$router.push({name:'expired',query:{expired:num}});
		    },
		    goback(data){
		    	if(data){
			 		this.act = 0;
			 		this.pages = 1;
			 		this.hongbaoarr =[]; 
			 		this.getcardarr();
			 	}
		    },
		    add(e){
				if(e){
					this.act = e
				}
			},
		    getcardarr(){
		    	  setTimeout(() => {
		    	  		this.$http({
			        methods: "post",
			        url: "/my/coupons",
			        params:{
			        	type:1,
			        	page:this.pages
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	if(j.data.data.list.length == 0){
			                this.finished = true;
			                //return false;
			              }
			        	for (let i = 0; i < j.data.data.list.length; i++) {
				           this.hongbaoarr.push(j.data.data.list[i]);
				        }
				        this.pages++
				        // 加载状态结束
				        this.loading = false;
			        	//this.hongbaoarr = j.data.data.list
			        })
			        
			      }, 500);
		    },	
		    getcardarr2(){
	    	    this.$http({
		        methods: "post",
		        url: "/my/coupons",
		        params:{
		        	type:2,
		        },
		        }).then(j => {
		        	if(!j){return false}
	        		if(j.data.data&&j.data.data.list.length==0){
		        		this.isExpired=false;
		        	}
		        	
		        })
			        
		    }
		}

	}
</script>