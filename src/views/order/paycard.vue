<template>
	<div class="box">
		<van-nav-bar
	      title="卡充值"
	      left-arrow
	      @click-left="onClickLeft"
	      fixed
	    />
		<div class="cipayinput" v-if="type != 2">
			<div class="inputs cf">
		        <div class="txt">次数</div>
		        <input name="" type="number" id="s" placeholder="最多可充值500元" v-model="ciinput">
		    </div>
		    <div id="sb" :class="okbtn == 0 ?'sub not_btn':'sub'" @click="ci_click">确定</div>
			<div class="info_z1">
		        <p>充值说明：</p>
		        <p>1、单次充值次数不能超过5次；</p>
		        <p>2、有效期自充值当日起延期一年。</p>
		    </div>
		</div>
		<div class="cipayinput" v-if="type ==2">
			<div class="inputs cf">
		        <div class="txt">金额</div>
		        <input name="" type="number" id="s" placeholder="最多可充值500元" v-model="moneyinput">
		    </div>
		    <div id="sb" :class="okbtn1 == 0 ?'sub not_btn':'sub'" @click="monye_click">确定</div>
			<div class="info_z1">
		        <p>充值说明：</p>
		        <p>1、单次充值金额不能超过500元；</p>
		        <p>2、有效期自充值当日起延期一年。</p>
		    </div>
		</div>
	</div>
</template>
<script type="text/javascript">	
	import { Toast } from 'vant';
	export default {
		data() {
		    return{
		    	ciinput:"",
		    	moneyinput:"",
		    	okbtn:0,
		    	okbtn1:0,
		    	cardid:"",
		    	type:""
		    }
		 },
		watch:{
			ciinput(){
				
				if(this.ciinput.length > 0){
					this.okbtn = 1
				}else{
					this.okbtn = 0
				}
				let str = '' + this.ciinput
				      if (str.indexOf('.') !== -1) {
				        let arr = str.split('')
				        arr.splice(arr.length - 1)
				        let str2 = arr.join('')
				        this.ciinput = ""
				}
			},
			moneyinput(){
				if(this.moneyinput.length > 0){
					this.okbtn1 = 1
				}else{
					this.okbtn1 = 0
				}
				let str = '' + this.moneyinput
				      if (str.indexOf('.') !== -1) {
				        let arr = str.split('')
				        arr.splice(arr.length - 1)
				        let str2 = arr.join('')
				        this.moneyinput = ""
				}
			}
		},
		mounted() {
			this.type = this.$route.query.types;
			this.cardid = this.$route.query.cardId;
		},
		methods:{
			onClickLeft(){
		      this.$router.goBack()
		    },
		    ci_click(){
		    	if(this.okbtn != 0){
		    		if(this.ciinput > 5){
		    			Toast('不能超过5次');
		    			return false;
		    		}
		    	}
		    	this.$router.push({name:'paycardopt',query:{cardId:this.cardid,num:this.ciinput,amount:this.moneyinput}});

		    },
		    monye_click(){
		    	if(this.okbtn1 != 0){
		    		if(this.moneyinput > 500){
		    			Toast('充值不能超过500');
		    			return false;
		    		}
		    	}
		    	this.$router.push({name:'paycardopt',query:{cardId:this.cardid,num:this.ciinput,amount:this.moneyinput}});
		    }
		}

	}
</script>