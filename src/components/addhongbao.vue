<template>
	<div class="box">
		<van-nav-bar
	      title='添加红包'
	      left-arrow
	      @click-left="onClickLeft"
	    />
	    <div class="guize" style="margin-right:0.2rem;"><a @click="gotorule(3)">如何绑定</a></div>
	    <div class="box_addbox">
		    <p><input type="text" placeholder="请输入您的红包兑换券码" name=""  v-model="hongbao_num"></p>
	    </div>
	   	<div class="next" id="addQuan" @click="addquan_btn">确认添加</div>
	   	
	</div>
</template>
<script type="text/javascript">
import md5 from 'js-md5'
import { Dialog } from 'vant'	
export default {
	data() {
		return {
			hongbao_num:""
		}
	},

	mounted(){

	},
	methods:{
		onClickLeft(ok){
			this.$emit('goback',true,ok);
		},
		gotorule(num){
		    	this.$router.push({name:'rule',query:{rule:num}});
		},
		addquan_btn(){
			var that = this;
			if(this.hongbao_num == ""){
				Dialog.alert({ message: '请输入红包兑换券' })
				return false
			}
			this.$http({
	          methods: "get",
	          params:{
	          	pin:this.hongbao_num,
	          },
	          url: "/my/bindcoupon",
	          }).then(j => {
	          		if(!j){return false}
	          		if(j.data.code == 0){
	          		Dialog.alert({
						  message:"添加成功"
					}).then(() => {
					  that.hongbao_num='';
					  that.onClickLeft("ok");
					});
				}
	          })
		}
	}
}
</script>