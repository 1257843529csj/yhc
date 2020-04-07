<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title='title'
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div class="boxcon">
      <div class="myachieve-list" v-for="item in myachieveList" @click="goAll">
          <div class="myachieve-list-img">
              <img :src="item.icon"> 
              <span>{{item.name}}</span>
          </div>
          <div class="myachieve-list-txt">
              <h3>当前等级：{{item.level}}级</h3>
              <span v-if="item.diff!=0">距下一等级还差{{item.diff}}成就值</span>
              <span v-else>已是最强王者，谁能与我争锋~</span>  
          </div>
          <div class="myachieve-list-num">
              <span>成就值</span>
              <span>{{item.myAch}}/{{item.score}}</span>
          </div>
      </div>
    </div>
    <Emptys v-if="isempty"></Emptys>
</div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"我的成就",
        myachieveList:[],
        isView:false,
        isempty:false,
    };
  },

  mounted() {
      var that = this;
      that.getAchieveList(); 
     
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getAchieveList:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/achievement",
        }).then(j => {
            that.myachieveList=j.data.data;
            if(j.data.data.length==0){
                that.isempty=true;
            }
        })
    },
    goAll:function(){
        this.$router.push({name:'allachieve'});
    }
     
  },
  components:{Emptys}
};
</script>
