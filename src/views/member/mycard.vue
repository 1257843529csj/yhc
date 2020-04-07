<template>
<div class="box" style="background:#f5f5f5">
	 <van-nav-bar
      title="观影通"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="my_card_list">
        <div class="guize"><a @click="gotorule(1)">如何绑定</a></div>
    	<ul>
			<li v-for="cards in cardarr" @click="gotocardinfo(cards.id)">
				<p>观影通</p>
                <p>有效期：{{cards.expired_txt}}</p>
                <p>卡号：{{cards.cardNo}}<span style="margin-left: 12px;"></span></p>
                <div class="money" v-if="cards.type == 2"><em>{{cards.balance/100}}</em>点</div>
                <div class="money" v-if="cards.type != 2"><em>{{cards.coupon_num_left}}</em>次</div>
                <p class="ci" v-if="cards.type != 2">{{cards.coupon_val/100}}点 / 次</p>  
			</li>
			<div class="addcard_list" @click="add(3)"><img src="../../assets/img/add.png"> <span>添加观影通</span></div>
			<div class="more_zll">没有更多可用观影通&nbsp;&nbsp;<a @click="goto_expired(1)">查看失效观影通&gt;&gt;</a></div>
    	</ul>
    </div>
    <addcard :class="act == 3?'fixleft translateX':'fixleft'" @goback="goback"></addcard>
</div>
</template>

<script type="text/javascript">
	import addcard from '../../components/addcard'
	export default {
		data() {
		    return {
		      cardarr:[],
		      act:0 
		    };
		 },
		 components: {
		     addcard
		},	
		mounted() {
			this.getcardarr()
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
		    getcardarr(){
		    	this.$http({
			        methods: "post",
			        url: "/my/cards",
			        params:{
			        	type:1
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	this.cardarr = j.data.data.cArr
			        })
		    },
		    add(e){
			if(e){
				this.act = e
			}
			},
			goback(data){
				if(data){
			 		this.act = 0;
			 		this.getcardarr();
			 	}
			},
			gotocardinfo(e){
				this.$router.push({name:'mycardinfo',query:{id:e}});
			}
		}

	}
</script>