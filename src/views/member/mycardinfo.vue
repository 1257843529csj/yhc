<template>
	<div class="box">
			<van-nav-bar
	      title="观影通详情"
	      left-arrow
	      @click-left="onClickLeft"
	      fixed
	    />
		<div class="cardinfo" style="margin-top:47px;">
		   <div class="cardtitle">观影通信息</div>
		   <div class="cardcont">
		    <div class="cards" style="border: none">
		            <a href="javascript:void(0);">卡号：{{cardinfo.cardNo}}</a>
		    </div>
		   </div>
		</div>
		<div class="cardinfo">
		   <div class="cardtitle">账户</div>
		   <div class="cardcont">
		    <div class="cards" v-if="cardinfo.type == 2"><a href="javascript:void(0);">面值：{{cardinfo.val/100}}点</a></div>
		    <div class="cards" v-if="cardinfo.type == 2"><a href="javascript:void(0)">余额：{{cardinfo.balance/100}}点</a><div class="edit" @click="nowpay(cardinfo.id,2)">观影通充值</div><div class="hover_ico"></div></div>
		    <div class="cards" v-if="cardinfo.type != 2"><a href="javascript:void(0);">次卡面值：{{cardinfo.coupon_val/100}}点/次</a></div>
		    <div class="cards" v-if="cardinfo.type != 2"><a href="javascript:void(0)">剩余次数：{{cardinfo.coupon_num_left}}次</a><div class="edit" @click="nowpay(cardinfo.id,1)">观影通充值</div><div class="hover_ico"></div></div>
		   </div> 
		</div>
	</div>
</template>
<script type="text/javascript">
	
	export default {
		data() {
		    return{
		    	id:"",
		    	cardinfo:""
		    }
		 },
		mounted() {
			this.id = this.$route.query.id;
			this.getcardinfo()
		},
		methods:{
			nowpay(e,types){
				this.$router.push({name:'paycard',query:{cardId:e,types:types}});
			},
			onClickLeft(){
		      this.$router.goBack()
		    },
		    getcardinfo(){
		    	this.$http({
			        methods: "post",
			        url: "/my/cardDetail",
			        params:{
			        	id:this.id
			        },
			        }).then(j => {
			        	if(!j){return false}
			       		this.cardinfo= j.data.data;
			        })
		    }
		
		}

	}
</script>