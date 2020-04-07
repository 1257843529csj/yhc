<template>
	<div class="box">
		<van-nav-bar
	      title='添加券'
	      left-arrow
	      @click-left="onClickLeft"
	    />
	    <div class="guize" style="margin-right:0.2rem;"><a @click="gotorule(2)">如何绑定</a></div>
	    <div class="box_addbox">
		    <p><input type="text" placeholder="请输入您的兑换券码" name="" id="quanPin" v-model="quan_num"></p>
		    <p> <input type="password" placeholder="请输入您的密码" name="" id="pwd" v-model="quan_password"></p>
	    </div>
	   	<div class="next" id="addQuan" @click="addquan_btn">确认添加</div>
	   	<div class="sm">
		  <p>温馨提示：</p>
		  <p>持有特殊券（券码为英文+数字组合）的用户，绑定券操作如下：</p>
		  <p>1、将英文+数字券码输入兑换券码输入框；</p>
		  <p>2、密码为空，点击“立即绑定”即可完成验证。</p>
		</div>
	</div>
</template>
<script type="text/javascript">
import md5 from 'js-md5'
import { Dialog } from 'vant'	
export default {
	data() {
		return {
			quan_password:"",
			quan_num:""
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
			if(this.quan_num == ""){
				Dialog.alert({ message: '请输入您的兑换券码' })
				return false
			}
			if(this.quan_password == ""){
				Dialog.alert({ message: '请输入密码' })
				return false
			}
			this.$http({
	          methods: "post",
	          params:{
	          	pin:this.quan_num,
	          	pwd:''+md5(that.quan_password)
	          },
	          url: "/my/bindquan",
	          }).then(j => {
	          		if(!j){return false}
	          		if(j.data.code == 0){
	          			Dialog.alert({
						  message:"添加成功"
					}).then(() => {
					  that.quan_password = "";
					  that.quan_num =""
					  that.onClickLeft("ok")
					});
	          		}
	          		

	          })
		}
	}
}
</script>