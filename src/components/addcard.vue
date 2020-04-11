<template>
	<div class="box">
		<van-nav-bar
	      title='绑定卡'
	      left-arrow
	      @click-left="onClickLeft"
	    />
	    <div class="guize" style="margin-right:0.2rem;"><a @click="gotorule(1)">如何绑定</a></div>
	    <div class="box_addbox">
			
		    <p><input type="text" placeholder="请输入您的卡号" name=""  v-model="card_num"></p>
		    <p> <input type="password" placeholder="请输入您的密码 " name="" id="pwd" v-model="card_password"></p>
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
			card_password:"",
			card_num:""
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
			if(this.card_num == ""){
				Dialog.alert({ message: '请输入您的卡号' })
				return false
			}
			if(this.card_password == ""){
				Dialog.alert({ message: '请输入密码' })
				return false
			}
			this.$http({
	          methods: "post",
	          params:{
	          	cn:this.card_num,
	          	pwd:''+md5(that.card_password)
	          },
	          url: "/my/bindcard",
	          }).then(j => {
	          		console.log(j)
	          		if(!j){return false}
	          		alert(j.code)
	          		if(j.data.code == 0){
	          			Dialog.alert({
						  message:"添加成功"
						}).then(() => {
						  that.card_password="";
						  that.card_num="";
						  that.onClickLeft("ok")
						});
	          		}
	          		
	          })
		}
	}
}
</script>