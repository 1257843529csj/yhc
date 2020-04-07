<template>
<div class="box" style="background:#f5f5f5" fixed>
	 <van-nav-bar
      title="兑换券"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
	
    <div class="my_card_list">
    <div class="guize"><a @click="gotorule(2)">如何绑定</a></div>
    	<ul>
			<li v-for="quans in quanarr">
				<p>兑换券</p>
                <p>有效期：{{quans.expired_txt}}</p>
                <p>券号：{{quans.pin}}<span style="margin-left: 12px;"></span></p>
                <div class="money"><em>{{quans.val}}</em>点</div>   
			</li>
    	</ul>
    	<div class="addcard_list" @click="add(3)"><img src="../../assets/img/add.png"> <span>添加兑换券</span></div>
    	<div class="more_zll" v-if="isExpired">没有更多可用券&nbsp;&nbsp;<a @click="goto_expired(2)">查看失效券&gt;&gt;</a></div>
    </div>
    <addquan :class="act == 3?'fixleft translateX':'fixleft'"  @goback="goback"></addquan>
</div>
</template>
<script type="text/javascript">
    import addquan from '../../components/addquan'
	export default {
		data() {
		    return {
		      quanarr:[],
		      act:"",
		      isExpired:true,
		    };
		 },	
		mounted() {
			this.getcardarr();
			this.getexpired();
		},
		components: {
		     addquan
		},
		methods:{
			onClickLeft(){
		      this.$router.goBack()
		    },
		    goto_expired(num){
		    	this.$router.push({name:'expired',query:{expired:num}});
		    },
		    gotorule(num){
		    	this.$router.push({name:'rule',query:{rule:num}});
		    },
		    add(e){
				if(e){
					this.act = e
				}
			},
		    getcardarr(){
		    	this.$http({
			        methods: "post",
			        url: "/my/quans",
			        params:{
			        	type:1
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	this.quanarr = j.data.data.qArr
			        })
		    },
		    getexpired(){
		    	this.$http({
			        methods: "post",
			        url: "/my/quans",
			        params:{
			        	type:2
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	if(j.data.data&&j.data.data.qArr.length==0){
			        		this.isExpired=false;
			        	}
			        	
			        })
		    },
		    goback(data){
		    	if(data){
			 		this.act = 0;
			 		this.getcardarr()
			 	}
		    },
		}

	}
</script>