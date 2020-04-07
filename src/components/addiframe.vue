<template>
	<div class="box">
		<van-nav-bar
	      title=''
	      left-arrow
	      @click-left="onClickLeft"
	      :z-index="10001"
	    />
	    <div>
	    	<iframe :src="srcLink" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>
	    </div>
	   	
	</div>
</template>
<script type="text/javascript">	
import Vant from 'vant';
export default {
	props:{
	    //porpcityinfo:Object,
	    srclink:String,
	},
	data() {
		return {
			srcLink:"",
		}
	},

	mounted(){
		var that=this;
		that.srcLink=this.srclink;
		console.log(this.srclink)

	},
	methods:{
		onClickLeft(ok){
			this.$emit('goback',true,ok);
		},
		
	}
}
</script>