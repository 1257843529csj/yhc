<template>
  <div class="box" style="background:#fff">
    <van-nav-bar
      :title='title'
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div class="boxcon">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad">    
          <van-cell class="topped-list" v-for="(item,index) in achieveList">
              <div class="topped-left" >
                  <div class="head">
                      <img :src="item.avatar" class="userhead">
                      <div>
                          <img src="../../assets/img/pai1.jpg" v-if="item.rank==1">
                          <img src="../../assets/img/pai2.jpg" v-else-if="item.rank==2">
                          <img src="../../assets/img/pai3.jpg" v-else-if="item.rank==3">
                          <span v-else>{{item.rank}}</span>
                      </div>
                  </div>
                  <div class="user-name">
                      <span>{{item.nick}}</span>
                      <span v-if="item.rank==1">第一靠的不仅是勤奋，更多的还是天赋</span>  
                      <span v-else="messageArr" v-html="messageArr(index)"> {{messageArr(index)}}</span> 
                  </div>    
              </div>
              <div class="topped-right">
                  <span>{{item.achievement}}</span> 
                  <span>成就值</span> 
              </div>    
          </van-cell>
      </van-list>
    </div>
    <div class="kong" style="height: 2.2rem"></div>
    <div class="mycontribute">
      <div class="topped-list contribute-list">
          <div class="topped-left" >
              <div class="head">
                  <img :src="myachieve.avatar" class="userhead"> 
              </div>
              <div class="ourinfo">
                  <span>{{myachieve.nick}}</span>
                    <span v-if="myachieve.rank!=0">我的排名：{{myachieve.rank}}</span>
                  <span v-if="myachieve.rank==1">只想稳稳守住第1~</span> 
                    <span v-else-if="myachieve.diff!=0&&myachieve.rank!=0">距离上一名差<font style="color: red;padding: 0 .1rem;">{{myachieve.diff}}</font>成就值</span>
                    <span v-else-if="myachieve.diff==0&&myachieve.rank!=0">距离上一名只差一点时间</span>
                    <span v-else-if="myachieve.rank==0">暂未上榜</span>    
              </div>    
          </div>
          <div class="contribute-right">
              <span class="contribute-right-span">成就值：{{myachieve.achievement}}</span> 
                <a class="goupdate" @click="goList">去提升</a>
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
        title:"成就排行",
        achieveList:[], 
        isempty:false,
        myachieve:[],
        loading: false,
        finished: false,
        page:1,
        
    };
  },

  mounted() {
      var that = this;
      document.title = '成就排行';
     
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    onLoad:function(){
        var that=this;
        this.$http({
          methods: "get",
          url: "/my/achievementSort",
          params: {
             "page":that.page,
            }
        }).then(j => {
            var result=j.data.data.list;
            if(result.length!=0){
                that.achieveList = that.achieveList.concat(result);
                that.page+=1;
                this.loading = false;
            } 
            else{
                this.finished = true;
                this.loading = false;
            } 
            that.myachieve=j.data.data.my;
            if(that.page==1&&j.data.data.list.length==0){
               that.isempty=true; 
            }
        })

    },
    messageArr:function(index){
            //var arr=[];
        for(var i=0;i<this.achieveList.length-1;i++){
            if(this.achieveList[index].achievement!=this.achieveList[index-1].achievement){
                return "距离上一名差"+this.achieveList[index].diff+"成就值";
            }
            if(this.achieveList[index].achievement==this.achieveList[index-1].achievement /*&& this.contributeList[index].support==this.contributeList[index+1].support*/){
                return "距离上一名只差一点时间";
            }
            else{

            }
        }

    },
    goList(){
      this.$router.push({name:'moviebox'});
    }
    

     
  },
  components:{Emptys}
};
</script>
