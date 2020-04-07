<template>
	<div class="box">
		<van-nav-bar
	      title=''
	      left-arrow
	      @click-left="onClickLeft"
	      :z-index="10001"
	    />
	    <div>
	    	<iframe class="iframek" :src="srcLink" frameborder="no" border="1" marginwidth="0" marginheight="0" scrolling="no" allowTransparency="true"  ></iframe>
	    </div>
	   	
	</div>
</template>
<script type="text/javascript">	
export default {
	data() {
		return {
			srcLink:"",
		}
	},

	mounted(){
		var that=this;
		that.srcLink=this.$route.query.srclink;
		console.log(this.srclink)

	},
	methods:{
		onClickLeft(){
          this.$router.goBack()
        },
		
	}
}
</script>