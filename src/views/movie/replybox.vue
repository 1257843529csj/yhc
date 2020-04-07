<template>
  <div class="box">
    <van-nav-bar
      :title='title'
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="pl boxcon">
        <img :src="reply.member_avatar" class="dpimg" />
        <span> 
            <div class="dpname"> 
                <em>{{reply.member_nick}}</em> 
                <span class="stars3" style="width: 60%;">
                    <van-rate allow-half v-model="starsvalue" color="#FF9C22" void-icon="star" void-color="#666" readonly /> 
                </span>
            </div> 
            <div class="dptext">{{reply.content}}</div> 
            <div class="pltxt">
                <van-icon name="good-job-o" v-if="reply.has_voted==0" @click.stop="hasZan()"></van-icon>
                <van-icon name="good-job" color="#555" v-else @click.stop="hasZan()"></van-icon>
                <em>{{reply.votes}}</em>
                <van-icon name="comment-o" />
                <em>{{reply.comments}}</em>
                <font>{{reply.pub_time}}</font>
            </div> 
        </span> 
    </div>
    <div class="yingping cf"> 
        <div class="jts">
            <img src="../../assets/img/jt3.png" />
        </div> 
        <ul id="reply_list">
            <li v-for="(item,index) in getrep">
                <img :src="item.member_avatar" class="dpimg">
                <span>
                    <p><em>{{item.member_nick}}</em><font>{{item.pub_time}}</font></p>
                    <p>{{item.content}}</p>
                </span>
            </li>
        </ul> 
    </div> 
    <div class="kong"></div>
    <div class="huifutext"> 
        <input type="text" placeholder="写回复..." id="reply_input" v-model="content" /> 
        <em id="reply" @click="replys">发送</em> 
    </div>
    
</div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
export default {
  data() {
    return {
        title:"点评",
        getReviewId:'',
        reply: [],
        getrep:[],
        starsvalue:0,
        content:'',
    
    };
  },

  mounted() {
    var that=this;
    that.getReviewId = this.$route.query.reviewId;
    that.getReply();
    that.getRep();

  },
  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getdata(k,i){
      var time;
      time=times(k,i);
      return time;
    },
    getReply: function() {
        var that =this;
        this.$http({
        methods: "get",
        url: "/review/reply",
        params: {
          reviewId: that.getReviewId,
        }
        }).then(j => {
            if(j.data.code==0){
                that.reply = j.data.data;
                that.starsvalue=j.data.data.rates/2;
            }
            else{
                this.$dialog.alert({
                  message: j.data.msg
                }).then(() => {
                  this.$router.goBack();
                });
                
            }
        })
    },
    getRep:function(){
        var that =this;
        this.$http({
        methods: "get",
        url: "/review/get",
        params: {
          reviewId: that.getReviewId,
        }
        }).then(j => {
            if(j.data.code==0){
                that.getrep = j.data.data;
            }
            else{
                this.$dialog.alert({
                  message: j.data.msg
                }).then(() => {
                  this.$router.goBack();
                });
            }
        })
        
    },
    replys:function() {
        var that=this;
        console.log(that.content);
        if (that.content.length < 5 || that.content.length > 50) {
            this.$dialog.alert({
                message: '评论内容在5-50字之间'
            }).then(() => {
              // on close
            });
            return !1;
        }
        var data = {
                reviewId: that.getReviewId,
                content: that.content,
            };
        this.$http.post('/review/comment',data).then((j) => {
            if(!j){
                return false;
            }
            if (j.data.code === 0) {
                this.$dialog.alert({
                    message: '提交成功！'
                }).then(() => {
                    that.getReply();
                    that.getRep();
                    that.content='';

                      // on close
                });
                
            }

        })
    },
    hasZan: function() {
        var that = this;
        var data = {
            reviewId: that.getReviewId,
        };
        this.$http.post('/review/vote',data).then((j) => {
            that.reply.has_voted=='1'?that.reply.has_voted='0':that.reply.has_voted='1';
            that.reply.votes=j.data.data;

        })

    },
    
    
  }
};
</script>