<template>
<div class="box" style="background:#f5f5f5" fixed>
	 <van-nav-bar
      :title="'失效'+names"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="my_card_list">
        <div class="guize"><a @click="gotorule(3)">如何绑定</a></div>
    	<ul>
			<li v-for="quans in list" v-if="expired == 2">
				<p style="color:#999">{{names}}</p>
                <p>有效期：{{quans.expired_txt}}</p>
                <p>券号：{{quans.pin}}<span style="margin-left: 12px;"></span></p>
                <div class="money" style="color:#999"><em>{{quans.val}}</em>点</div> 
                <div class="shixiao_ico"></div>  
			</li>
			<li v-for="quans in list" v-if="expired == 1">
				<p style="color:#999">{{names}}</p>
                <p>有效期：{{quans.expired_txt}}</p>
                <p>卡号：{{quans.no}}<span style="margin-left: 12px;"></span></p>
                <div class="money" style="color:#999"><em>{{quans.val}}</em>点</div> 
                <div class="shixiao_ico"></div>  
			</li>
			<li v-for="quans in list" v-if="expired == 3">
				<p style="color:#999">{{names}}</p>
                <p>有效期：{{quans.expired}}</p>
                <p>{{quans.txt0}}<span style="margin-left: 12px;"></span></p>
                <div class="money" style="color:#999"><em>{{quans.val}}</em></div> 
                <div class="shixiao_ico"></div>  
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
		       expired:"",
		       list:[],
		       names:""
		    };
		 },	
		mounted() {
			 this.expired = this.$route.query.expired;
			 if(this.expired == 1){
			 	this.names = "观影通";
			 	this.expired_card()
			 }else if(this.expired == 2){
			 	this.names = "兑换券";
			 	this.expired_quan()
			 }else if(this.expired == 3){
			 	this.names = "红包";
			 	this.expired_hongbao()
			 }
			//this.getcardarr()
		},
		methods:{
			onClickLeft(){
		      this.$router.goBack()
		    },
		    expired_hongbao(){
		    	this.$http({
			        methods: "post",
			        url: "/my/coupons",
			        params:{
			        	type:2
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	if(j.data.data.list.length == 0){
			               
			             }
			        	for (let i = 0; i < j.data.data.list.length; i++) {
				           this.list.push(j.data.data.list[i]);
				        }
			        })
		    },
		    expired_quan(){
		    		this.$http({
			        methods: "post",
			        url: "/my/quans",
			        params:{
			        	type:2
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	this.list = j.data.data.qArr
			        })
		     },
		     expired_card(){
		     		this.$http({
			        methods: "post",
			        url: "/my/cards",
			        params:{
			        	type:2
			        },
			        }).then(j => {
			        	if(!j){return false}
			        	this.list = j.data.data.cArr
			        })
		     }
		}

	}
</script>