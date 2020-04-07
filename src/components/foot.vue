<template>
<div class="foot">
		<van-tabbar v-model="active" @change="nav" active-color="#ff9c22">
		   <van-tabbar-item>
        <span>首页</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.active : icon.normal"
        >
      </van-tabbar-item>
		  <van-tabbar-item>
        <span>电影</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon1.active : icon1.normal"
        >
      </van-tabbar-item>
     <van-tabbar-item>
        <span>影院</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon2.active : icon2.normal"
        >
      </van-tabbar-item>
		  <van-tabbar-item v-show="this.isweixin">
        <span>商城</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon3.active : icon3.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item>
        <span>我的</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon4.active : icon4.normal"
        >
      </van-tabbar-item>
		</van-tabbar>
</div>
</template>
<script type="text/javascript">
import { isWeiXin } from '../assets/js/date';
export default {
  data() {
    return {
      active:"",
      isweixin:isWeiXin(),
      icon:{
        normal: require('../assets/img/home1.png'),
        active: require('../assets/img/home2.png')
      },
      icon1: {
        normal: require('../assets/img/Film1.png'),
        active: require('../assets/img/Film2.png')
      },
      icon2: {
        normal: require('../assets/img/cinema1.png'),
        active: require('../assets/img/cinema2.png')
      },
      icon3: {
        normal: require('../assets/img/find1.png'),
        active: require('../assets/img/find2.png')
      },
      icon4: {
        normal: require('../assets/img/my1.png'),
        active: require('../assets/img/my2.png')
      }
    }
  },
  watch:{
    '$route.name'(){
      this.pagename()
    }
  },
  methods:{
     nav(){
        switch(this.active){
          case 0:
          this.$router.push({name:'indexbox'});
          break;
          case 1:
          this.$router.push({name:'moviebox'});
          break;
          case 2:
          if(this.$route.query.movieId){
            return false;
          }
          this.$router.push({name:'cinemabox'});
          break;
          case 3:
          var token = localStorage.getItem("token");
          if(token != ""){
             window.location.href="https://m21.filmfly.cn/wap21/mall/goods/index.html?token="+ token
           }else{
              this.$router.push({name:'loginbox'});
           }
          //this.$router.push({name:'activitybox'});
          break;
          case 4:
          this.$router.push({name:'usebox'});
          break;
        }
     },
     pagename(){
        if(this.$route.name == "indexbox" || this.$route.name == 'Index'){
           this.active = 0
        }else if(this.$route.name == "moviebox"){
           this.active = 1
        }else if(this.$route.name == "cinemabox"){
           this.active = 2 
        }else if(this.$route.name == "activitybox"){
           this.active = 3 
        }else if(this.$route.name == "usebox"){
           this.active = 4 
        }
        this.nav();
     }
  },
  mounted(){
     this.pagename()
  }
}
</script>