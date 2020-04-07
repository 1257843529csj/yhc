<template>
	<div class="box">
		<van-nav-bar
	      title='添加卡券'
	      left-arrow
	      @click-left="onClickLeft"
	    />
	    <div id="addcard_list">
		    <div class="addcard_list" @click="add(1)"><img src="../../assets/img/add.png"> <span>添加兑换券</span></div>
		    <div class="addcard_list" @click="add(2)"><img src="../../assets/img/add.png"> <span>添加红包</span></div>
		    <div class="addcard_list" @click="add(3)"><img src="../../assets/img/add.png"> <span>添加观影通</span></div>
		</div>
		<addcard :class="act == 3?'fixleft translateX':'fixleft'" @goback="goback"></addcard>
	    <addquan :class="act == 1?'fixleft translateX':'fixleft'"  @goback="goback"></addquan>
	    <addhongbao :class="act == 2?'fixleft translateX':'fixleft'"  @goback="goback"></addhongbao>
	</div>
</template>
<script type="text/javascript">
import addcard from '../../components/addcard'
import addquan from '../../components/addquan'
import addhongbao from '../../components/addhongbao'
export default {
	data() {
		return {
			act:0
		}
	},
	methods:{
		
	},
	mounted(){

	},
	components: {
		     addcard,
		     addquan,
		     addhongbao  
	},
	methods:{
		onClickLeft(){
			this.$router.goBack()
		},
		goback(data){
				if(data){
			 		this.act = 0
			 	}
		},
		add(e){
			if(e){
				this.act = e
			}
		}
	}
}
</script>