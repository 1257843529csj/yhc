<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="integral_con">
        <span v-if="infoList.baseInfo.opt_type==-1">{{infoList.baseInfo.point}}</span>
        <span v-else>{{infoList.baseInfo.point}}</span>

        <p>{{infoList.baseInfo.reason}}<br>
            <font v-if="infoList.baseInfo.opt_reason==1">{{infoList.baseInfo.point}}</font>
            <font v-else>{{infoList.baseInfo.point}}</font>
        </p>
        
    </div>
   
  </div>
</template>
<script type="text/javascript">

export default {
  data() {
    return {
        title:"积分明细详情",
        infoList:{
            list:[],
            baseInfo:{},
            order:{},
        },
       
    };
  },

  mounted() {
    var that=this;
    that.getInfo();
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getInfo(){
        var that=this;
        var id=this.$route.query.id;
        this.$http({
          methods: "get",
          url: "/my/pointDetail",
          params: {
              id:id
            }
          }).then(j => {
            that.infoList={
                baseInfo:j.data.data,
                list:j.data.data.rows,
                order:j.data.data.order,
            }
            
            
            
        })
    }
    
      
  }
};
</script>

