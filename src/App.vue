<template>
  <div id="app">
     <!-- @before-leave="beforeLeave" @before-enter="beforeEnter" -->
      <!-- <transition :name="transitionName" v-if="$route.meta.keepAlive">
        <keep-alive><router-view class="child-view" v-if="$route.meta.keepAlive"></router-view></keep-alive>
      </transition> -->
   <transition :name="transitionName">
      <router-view  class="child-view"></router-view>
  </transition>
  </div>
</template>
<script type="text/javascript">
import $ from 'jquery';
export default { 
　　data() {
　　　　return {
　　　　　　transitionName: 'slide-right',// 默认动态路由变化为slide-right
           changecity:true,
           isBack:false
　　　　}
　　},
  mounted () {
     
  },
  methods: {
  },
　　watch: {
    '$route' (to, from) {
        let isBack = this.$router.isBack
         if (isBack) {
            this.transitionName = 'slide-right'
            to.meta.keepAlive=true;
         } else {
            this.transitionName = 'slide-left'
            to.meta.keepAlive=false;
         }
        this.$router.isBack = false;
        
      }
  
　  }
　};
</script>


