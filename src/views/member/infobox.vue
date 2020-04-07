<template>
  <div class="box" style="background:#eee">
    <van-nav-bar
      :title='title'
      left-arrow
      fixed
      @click-left="onClickLeft"
    />
    <div class="m-info boxcon">
        <van-cell title="头像">
            <div id="face">
                
                <img id="j_thumb" :src="myInfo.avatar"></em></a><i></i>
            </div>
            <van-icon name="arrow" color="#999" size="18px"/>
            <input type="file" accept="image/*" id="cameraInput" name="cameraInput" style="opacity: 0;display:none;"/>
            
            <!-- <van-uploader :after-read="afterRead" style="display:none" id='m-img'/> -->
        </van-cell>
        <van-cell title="昵称" value="内容">
            <input type="text" id="nick" class="m-name" v-model="nick">
            <van-icon name="arrow" color="#999" size="18px"/>
        </van-cell>
        <van-cell title="性别" value="内容">
            <select id="gender" v-model="myInfo.gender" dir="rtl" style="direction: rtl;">
                <option v-for="item in selectList" :value="item.id">{{item.text}}</option>
            </select>
            <van-icon name="arrow" color="#999" size="18px"/>
        </van-cell>
        <van-cell title="生日">
            <input type="date"  v-model="birth" id="birth">
            <van-icon name="arrow" color="#999" size="18px"/>
        </van-cell>
        <van-cell :title="'V'+myInfo.level+myInfo.levelName"  @click="goLeaguer">
            <span style="position: absolute; right:.5rem;">会员说明</span>
            <van-icon name="arrow" color="#999" size="18px"/>
        </van-cell>

    </div>
    <div class="m-info">
        <van-cell title="绑定手机"  :value="fn(myInfo.mobile)" />
        <van-cell title="登录密码" @click="goRpwd">
            <span style="position: absolute; right:.5rem;">修改</span>
            <van-icon name="arrow" color="#999" size="18px"/>
        </van-cell>
        <van-cell title="注册时间" :value="getdata(myInfo.reg_stamp,0)" />
    </div>
    <div id="sb" class="m-next" @click="changeInfo">修改资料</div>
</div>
</template>
<script type="text/javascript">
import { times } from '@/assets/js/date.js';
import $ from 'jquery';

export default {
  data() {
    return {
        title:"我的资料",
        myInfo:[], 
        isClick:false,
        value1:0,
        selectList:[
            {id:0,text:"请选择"},
            {id:1,text:"男"},
            {id:2,text:"女"},
        ],
        nick:'',
        birth:'',
        gender:'',
    };
  },

  mounted() {
    var that=this;
    that.getInfo();

    $('#face').click(function() {
        $('#cameraInput').trigger("click");
    });

    $('#cameraInput').change(function() {
        var file = document.getElementById('cameraInput').files[0];
        that.drawOnCanvas(file);
    });
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
    drawOnCanvas(file) {
        var that=this;
        var reader = new FileReader();
        reader.onload = function(e) {
            var dataURL = e.target.result,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                img = new Image();
            img.onload = function() {
                var square = 150;
                canvas.width = square;
                canvas.height = square;
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, square, square);
                var imageWidth;
                var imageHeight;
                var offsetX = 0;
                var offsetY = 0;
                if (this.width > this.height) {
                    imageWidth = Math.round(square * this.width / this.height);
                    imageHeight = square;
                    offsetX = -Math.round((imageWidth - square) / 2);
                } else {
                    imageHeight = Math.round(square * this.height / this.width);
                    imageWidth = square;
                    offsetY = -Math.round((imageHeight - square) / 2);
                }
                context.drawImage(this, offsetX, offsetY, imageWidth, imageHeight);
                var base64 = canvas.toDataURL('image/jpeg', 1);
                var data={
                    b64: base64
                }
                that.$http.post('/member/avatar',data).then((j) => {
                    if (j.data.code === 0) {
                        that.myInfo.avatar=base64
                    } else {
                        that.$dialog.alert({
                          message: j.data.msg
                        }).then(() => {
                          // on close
                        });
                    }

                })

            };
            img.src = dataURL;
        };
        reader.readAsDataURL(file);
    },

    getInfo:function(){
        var that=this;
        this.$http({
        methods: "get",
        url: "/member/info",
        }).then(j => {
            that.myInfo=j.data.data; 
            that.nick=j.data.data.nick;
            that.birth=that.getdata(j.data.data.birth,0);
            if(j.data.data.gender=='1' ||j.data.data.gender=='2'){
               that.value1=parseInt(j.data.data.gender);
            }
        })
    },
    // 手机加密
    fn(phone2) {
        if(phone2){
          var phone;
          phone = phone2.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
          return phone;
        }
    },
    changeInfo:function(){
        var that=this;
        var data={
            nick:that.nick,
            birth:that.birth,
            gender:that.value1,
        };
        that.$http.post('/member/info',data).then((j) => {
            if(j.data.code==0){
                that.$dialog.alert({
                  message: "修改成功"
                }).then(() => {
                  // on close
                });
            }
            else{
                that.$dialog.alert({
                  message: j.data.msg
                }).then(() => {
                  // on close
                });
            }
            

        })
    },
    goLeaguer(){
      this.$router.push({name:'leaguer'});

    },
    goRpwd(){
        var that=this;
        this.$router.push({name:'rpwdway',query:{phone: that.fn(that.myInfo.mobile)}});
    },
  }
};
</script>

