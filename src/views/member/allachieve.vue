<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
  
    <Emptys v-if="isempty"></Emptys>
</div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"我的成就",
    };
  },

  mounted() {
      var that = this;
     
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    
     
  },
  components:{Emptys}
};
</script>
