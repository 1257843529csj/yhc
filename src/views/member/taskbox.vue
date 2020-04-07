<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title='title'
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div class="task-con boxcon">
        <div class="task-con-title">每日任务</div>
        <ul>
            <li v-for="item in taskList.everyDay"  @click="calendar(item.id,item.link)">
               <img :src="item.img_url">
               <em v-if="item.complete==1"></em>
               <span>{{item.name}}</span> 
               <p>+{{item.exp}} 经验值</p>
            </li>

            <!-- <li v-for="item in taskList.everyDay">
               <img :src="item.img_url">
               <span>{{item.name}}</span> 
               <p>+{{item.exp}} 经验值</p>
            </li> -->
        </ul>
        
    </div>
    <div class="task-con">
        <div class="task-con-title">新手任务</div>
        <ul>
            <li v-for="item in taskList.newMember" @click="calendar(item.id,item.link)">
               <img :src="item.img_url">
               <em v-if="item.complete==1"></em>
               <span>{{item.name}}</span> 
               <p>+{{item.exp}} 经验值</p>
            </li>
        </ul>
    </div>
    <div class="task-con">
        <div class="task-con-title">互动任务</div>
        <ul>
            <li v-for="item in taskList.hu" @click="calendar(item.id,item.link)">
               <img :src="item.img_url">
               <em v-if="item.complete==1"></em>
               <span>{{item.name}}</span> 
               <p>+{{item.exp}} 经验值</p>
            </li>
        </ul>
    </div>
      <!-- v-if="isCalendar" -->
    <div class="qdwindow" v-show="isShow">
        <div class="calendar">
            <div class="calenbox">
                <div id="calendar"></div>
            </div>
            <div class="text-center">
                <button :class="!isQian?'btn-qiandao':'btn-qiandao-alread'" @click="signIn">马上签到</button>
                <!-- <button class="btn-qiandao-alread">马上签到</button> -->
            </div>
        </div>
    </div>
    <!--  签到成功 -->
    <div class="qdSuccess" v-show='isSuccess'>
        <div class="qdSuccess_con">
           <div class="qdSuccess_con_title">
               <span>获得奖励</span>
               <em @click="closeqd">X</em>
           </div>
           <div class="qdSuccess_detail">
               <img src="../../assets/img/jyz.png">
               <span>经验值+{{exp}}</span>
           </div>
          <!--  <a>已领取</a> -->
        </div> 
    </div>
</div>
</template>
<script type="text/javascript">
// import $ from 'jquery';
import { datet } from '@/assets/js/date.js';


export default {
  data() {
    return {
        title:"我的任务",
        taskList:[], 
        signList:[],
        isShow:false,
        isQian:false,
        isSuccess:false,
        exp:'',
    };
  },

  mounted() {
      var that = this;
      that.getTask();
     
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getTask:function(){
        var that = this;
        this.$http({
        methods: "get",
        url: "/my/task",
        }).then(j => {
        //console.log(j)
            that.taskList = j.data.data;

        })  
    },
    calendar:function(id,link){
         /* hbWindow();*/
        var that=this;
        if(id=='6'){
            that.isShow=true;
            that.getSignIn();
        }
        // else if(link!=''){
        //     window.location.href=link;
        // }
    },
    getSignIn:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/member/signIn",
        }).then(j => {
        that.$nextTick(function(){
            if(j.data.code==0){
                that.isShow=true;
                var myDate = new Date();
                var datas=myDate.getDate();
                if (datas >= 0 && datas <= 9) {
                    datas = "0" + datas;
                }
                /*console.log(datas)*/
                
                if(j.data.data.day!=""){
                    that.signList = j.data.data.day;
                    datet(that.signList);
                    document.getElementById('calendar_time').innerHTML =j.data.data.count;
                    // $("#calendar_time").html(j.data.data.count);
                }
                else{
                    that.signList = [{"signDay":""}];
                    console.log(that.signList)
                    datet(that.signList);
                    document.getElementById('calendar_time').innerHTML =j.data.data.count;

                    // $("#calendar_time").html(j.data.data.count);

                }
                for(var i=0;i<j.data.data.day.length; i++){
                    if(j.data.data.day[i].signDay==datas){
                        that.isQian=true;
                        // $(".btn-qiandao-alread").show();
                        // $(".btn-qiandao").hide();    
                    }  
                }
                document.getElementById('sign_close').onclick =function(){
                    that.isShow=false;
                }
               
            }
            else{
               tips1(j.msg);
            }
        })

      })

    },
    signIn:function(){
        var that=this;
        if(that.isQian){
          return false;
        }
        that.$http.post('/member/signIn').then((j) => {
          if(j.data.code==0){
              that.signList = j.data.data.day;
              that.exp=j.data.data.exp;
              datet(that.signList);
              document.getElementById('calendar_time').innerHTML =j.data.data.count;
              if(j.data.data.exp>0){
                that.isShow=false;
                that.isSuccess=true;
              }
          }
          else if(j.code=301){
              that.signList = j.data.data.day;
              that.exp=j.data.data.exp;
              datet(that.signList);
              document.getElementById('calendar_time').innerHTML =j.data.data.count;
              if(j.data.data.exp>0){
                that.isShow=false;
                that.isSuccess=true;
              } 
          }
          else{
            Dialog.alert({
              message: j.data.msg
            }).then(() => {
              // on close
            })

          }

        })

    },
    closeqd:function(){
        var that=this;
        that.isSuccess=false;
        that.getTask();
    } 
     
  }
};
</script>
