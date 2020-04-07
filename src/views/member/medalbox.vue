<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title='title'
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="medal_title boxcon">
        <span>共获得<font>{{medalList.count}}</font>枚</span>
       <!--  <span @click="exprssView">如何获得></span> -->
    </div>
    <div class="medal_con">
        <ul>
            <li v-for="(item,index) in medalList.list" @click="detail(index)">
                <img :src="item.url">
                <span>{{item.name}}</span>
                <!--   勋章弹窗 -->
                <div class="xzwindow" v-if="isSelect==index">
                    <div class="medal_window_con">
                        <em @click.stop="closeWindow">X</em>
                        <img class="medalimg" :src="item.url">
                        <span class="medaltxt">{{item.name}}</span>
                        <p class="medaltip">{{item.info}}</p>
                    </div>
                </div>
            </li>   
        </ul>
      
    </div>
    <Emptys v-if="isempty"></Emptys>
</div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
        title:"我的勋章",
        medalList:[],
        isempty:false,
        isSelect:-2, 
    };
  },

  mounted() {
      var that = this;
      that.getMedal();
     
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getMedal:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/my/medal",
        }).then(j => {
            that.medalList=j.data.data;
            if(j.data.data.list.length==0){
                that.isempty=true;
            }
        })
    },
    detail:function(index){
        var that=this;
        that.isSelect=index;
        console.log(index)
        
    },
    closeWindow:function(){
        var that=this;
        that.isSelect=-1;
        console.log(that.isSelect)
    },
     
  },
  components:{Emptys}
};
</script>
