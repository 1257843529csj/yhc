
<template>
  <div class="box">
     <van-nav-bar :title="cinema_name" fixed :z-index="999"  left-arrow  @click-left="onClickLeft"/>
      <div class="info_seat">
        <h2>{{movie_title}}</h2>
        <p>{{time_format}} {{copy_language}} {{copy_type}}</p>
        <div class="shuoming">
          <span class="s1"><i></i>可选</span>
          <span class="s2"><i></i>已选</span>
          <span class="s3"><i></i>已售</span>
          <span class="s4"><i></i>情侣</span>
        </div>
      </div>
    <seat-area
    :propYMax="yMax" :propSeatScale="seatScale" :propSeatHeight="positionDistin" :propSeatToolArr="seatToolArr"
    :propSeatAreaWidthRem="seatAreaWidthRem" :propSeatAreaHeightRem ="seatAreaHeightRem"
    :propSeatBoxHeight="seatBoxHeight" :propMiddleLine="middleLine" :propHorizontalLine="horizontalLine" :propname="ting_name" ref="seatArea">
      <!--以下为座位图具名插槽 开始-->
      <template slot="seat-area-solt">
        <div class="seatBox" :style="{transform: 'scale('+seatScale+')',height:seatBoxHeight +'rem',
        width:seatBoxWidth +'rem',marginLeft:seatBoxCenterMargin+'rem'}">
         <!--中轴线-->
          <div v-show="seatList.length>0" class="middle-line" :style="{height:seatBoxHeight +'rem',left: middleLine +'rem'}"></div>
          <template v-for="(seatItem,index) in seatList" >
            <div class="seatClass" @click="clickSeat(index)" :style="{height:height +'rem',width:width +'rem',
            top:seatItem.GraphRow * positionDistin +'rem',left:seatItem.GraphCol * positionDistin +'rem'}" v-if="seatItem.SeatState != -2"
            >
              <img class="seatImgClass" :seatId="seatItem.id" :seatIndex="index" :src="seatItem.nowIcon" />
            </div>
          </template>
        </div>
      </template>
      <!--以上为座位图具名插槽 结束-->
    </seat-area>
    <keep-alive>
        <component
        v-bind:is="selectedTabComponents"
        :propSeatList="seatList" :propSelectedSeat="selectedSeatList"
        @quickSelect="processUnSelected" @cancelSelect="processSelected"></component>
    </keep-alive>
    <confirm-lock
    :propSelectedSeat="selectedSeatList"
    :propSeatList="seatList"
    :propPlanId="planId"
    :proparea = "seatarea"
    ></confirm-lock>
  </div>
</template>
<script>
  import SeatArea from '../../components/SeatArea'
  import SelectedTab from '../../components/SelectedTab'
  import ConfirmLock from '../../components/ConfirmLock'
  import {Toast,Dialog} from 'vant'
  var testarea = [
    {id: "9",areaNo:"1", areaPrice:20},
    {id: "10",areaNo:"2", areaPrice:30},
    {id: "11",areaNo:"3", areaPrice:35}
  ]
  export default {
  name: 'hallseat',
  data () {
    return {
      planId:"",
      movie_title:"",
      cinema_name:"",
      time_format:"",
      copy_language:"",
      copy_type:"",
      price:"",
      positionDistin: 0.2, // 每个座位偏移距离
      width: 0.2, // 每个座位的宽
      height: 0.2, // 每个座位的高
      seatAreaWidthRem: 7.5, // 座位区域横向rem最大值 用于和 seatAreaHeightRem 共同计算区域缩放比例
      selectedSeatList: [], // 已选择座位
      maxSelect: 4, // 最大选择座位数量 改动可改变最大选择座位数
      load: false, // 加载dom的控制
      seatList: [], // 座位对象list
      seatTypeList: [
        {icon:require("../../assets/img/image1.png"),type:"0",SeatCouple:""},//可选
        {icon:require("../../assets/img/image3.png"),type:"1",SeatCouple:""},//已售
        {icon:require("../../assets/img/image2.png"),type:"3",SeatCouple:""},//已选
        {icon:require("../../assets/img/seat_love_emt_l.png"),type:"L0",SeatCouple:"L"},//左边情侣空
        {icon:require("../../assets/img/seat_love_emt_r.png"),type:"R0",SeatCouple:"R"},//右边情侣空
        {icon:require("../../assets/img/seat_love_over_l.png"),type:"L1",SeatCouple:"L"},//左边情侣已售
        {icon:require("../../assets/img/seat_love_over_r.png"),type:"R1",SeatCouple:"R"},//右边情侣已售
        {icon:require("../../assets/img/seat_love_l.png"),type:"L3",SeatCouple:"L"},//左边情侣已选
        {icon:require("../../assets/img/seat_love_r.png"),type:"R3",SeatCouple:"R"}//右边情侣已选
      ],
      seatarea:[],
      ting_name:""
    }
  },
  components: {
     SeatArea,
     SelectedTab,
     ConfirmLock
  },
  mounted () {
      this.planId = this.$route.query.planid;
      this.getSeatList();
      this.check_ifpay();
  },
  methods: {
      //检查是否有待支付
      check_ifpay(){
       this.$http({
              method:'post',
              url:'/order/unpaid',
          }).then((j) => {
            
              if(j.data.data.length != 0){
                  Dialog.confirm({
                      message: '您有一个本场次订单还未完成支付，请选择以下操作',
                      confirmButtonText:"继续支付",
                      cancelButtonText:"取消重选"
                    }).then(() => {
                       this.$router.push({name:'optionspay',query:{orderId:j.data.data[0].id}});
                    }).catch(() => {
                       
                       return false
                    });
              }
          })
      },
     getSeatList(){
        this.$http({
            method:'get',
            url:'/cinema/seats',
            params:{
              planId:this.planId
            }
        }).then((j) => {
            if(!j){ return false;}
            this.movie_title = j.data.data.movie_title;
            this.cinema_name = j.data.data.cinema_name;
            this.time_format = j.data.data.time_format;
            this.seatarea = j.data.data.area;//区域
            this.ting_name = j.data.data.hall_name;
            //this.seatarea = testarea;
            this.copy_language = j.data.data.copy_language;
            this.copy_type = j.data.data.copy_type;
            this.price = j.data.data.price;
            //console.log(j.data.data.seats.length)
            for(var i=0; i<j.data.data.seats.length;i++){
                  for(var q=0; q<j.data.data.seats[i].length;q++){
                    this.seatList.push(j.data.data.seats[i][q])
                  }
              }
              this.seatList.forEach(element => {
                  //let firstNumber = element.type.substr(0, 1)
                  // 在原来的对象中加入两个属性  otherLoveSeatIndex 对应情侣座位的原数组下标 otherLoveSeatId  对应情侣座位的Id
                  element.otherLoveSeatIndex = null
                  element.otherLoveSeatId = null;
                  if(element.SeatCouple == "L"){
                       element.yeslove = true
                       for (const index in this.seatList) {
                          if (parseInt(this.seatList[index].GraphRow) === parseInt(element.GraphRow) &&
                            parseInt(this.seatList[index].GraphCol) === parseInt(element.GraphCol) + 1) {
                            element.otherLoveSeatIndex = index
                            element.otherLoveSeatId = this.seatList[index].SeatNo
                          }
                        }
                   }
                   if(element.SeatCouple == "R"){
                      element.yeslove = true
                      for (const index in this.seatList) {
                        if (parseInt(this.seatList[index].GraphRow) === parseInt(element.GraphRow) &&
                          parseInt(this.seatList[index].GraphCol) === parseInt(element.GraphCol) - 1) {
                          element.otherLoveSeatIndex = index
                          element.otherLoveSeatId = this.seatList[index].SeatNo
                        }
                      }
                   }
                  //测试数据  
                   //element.areano = Math.round(Math.random()+2);
                   
                  //
                  if(this.seatarea.length == 0){
                    element.price = this.price
                  }else{
                    this.seatarea.forEach((item,index,array)=>{
                        if(item.areaNo == element.SeatArea){
                          element.price = item.areaPrice
                        }
                    })
                  }
                   //console.log(this.seatTypeList)
                   for (const item of this.seatTypeList) {
                      element.selectedIcon = this.seatTypeList[2].icon;
                      if(element.SeatCouple == "" || element.SeatCouple == undefined){//不是情侣座
                          if(element.SeatState == item.type){
                            element.nowIcon = item.icon;
                            element.defautIcon = item.icon;
                          }
                      }else{//是情侣座
                         if(element.SeatCouple+element.SeatState == item.type){
                             element.nowIcon = item.icon;
                             element.defautIcon = item.icon;
                         }
                         if(element.SeatCouple+element.SeatState == "L3" || element.SeatCouple+element.SeatState == "R3"){
                            element.selectedIcon = item.icon
                         }
                      }
                      if(item.type == "1"){
                        element.soldedIcon = item.icon
                      }
                      if(item.type == "3"){
                        element.selectedIcon = item.icon
                      }
                      if(item.type == "L1"){
                         element.soldedIcon_love_l = item.icon
                      }
                      if(item.type == "R1"){
                         element.soldedIcon_love_r = item.icon
                      }
                      if(item.type == "L3"){
                        element.selectedloveIcon_l = item.icon
                      }
                      if(item.type == "R3"){
                        element.selectedloveIcon_r = item.icon
                      }
                      if (element.defautIcon === element.soldedIcon || element.defautIcon === element.fixIcon || element.defautIcon === element.soldedIcon_love_l || element.defautIcon === element.soldedIcon_love_r) {
                          element.canClick = false
                        } else {
                          element.canClick = true
                        }
                   }
              })
            })
       },
    clickSeat:function (index) {
      if (this.seatList[index].canClick) {
        if (this.seatList[index].nowIcon === this.seatList[index].selectedIcon || this.seatList[index].nowIcon === this.seatList[index].selectedloveIcon_l || this.seatList[index].nowIcon === this.seatList[index].selectedloveIcon_r) {
          this.processSelected(index)
        } else {
          this.processUnSelected(index)
        }
      }else{
        Toast('该座位已选');
      }
    },  
        // 处理已选的座位
    processSelected: function (index) {
      let _selectedSeatList = this.selectedSeatList;
      let otherLoveSeatIndex = this.seatList[index].otherLoveSeatIndex;
        if (otherLoveSeatIndex !== null) {
          // 如果是情侣座位
        // 改变这些座位的图标为初始图标
        this.$set(this.seatList[index], 'nowIcon', this.seatList[index].defautIcon)
        this.$set(this.seatList[otherLoveSeatIndex], 'nowIcon', this.seatList[otherLoveSeatIndex].defautIcon);
        for (const key in _selectedSeatList) {
          // 移除id一样的座位
          if (_selectedSeatList[key].SeatNo === this.seatList[index].SeatNo) {
            _selectedSeatList.splice(key, 1)
          }
        }
        // 移除对应情侣座位
        for (const key in _selectedSeatList) {
          if (_selectedSeatList[key].SeatNo === this.seatList[otherLoveSeatIndex].SeatNo) {
            _selectedSeatList.splice(key, 1)
          }
        }
      }else{

        // 改变这些座位的图标为初始图标 并 移除id一样的座位
        this.$set(this.seatList[index], 'nowIcon',this.seatList[index].defautIcon);
        //this.$set(this.seatList[otherLoveSeatIndex], 'nowIcon', this.seatList[otherLoveSeatIndex].defautIcon)
        for (const key in _selectedSeatList) {
          if ( _selectedSeatList[key].SeatNo === this.seatList[index].SeatNo) {
             _selectedSeatList.splice(key,1)
          }
        }
      }
        
    },
    // 处理未选择的座位
    processUnSelected: function (index) {
      // 如果是选择第一个座位 放大区域并移动区域 突出座位 增加用户体验
      if (this.selectedSeatList.length === 0) {
        let top = ((this.seatList[index].GraphRow * this.positionDistin) - this.horizontalLine) * this.seatScale
        let left = ((this.seatList[index].GraphCol * this.positionDistin) - this.middleLine) * this.seatScale
        top = top > 0 ? -top - this.positionDistin : -top + this.positionDistin
        left = left > 0 ? -left - this.positionDistin : -left + this.positionDistin
        this.$refs.seatArea.changeScale()
        this.$refs.seatArea.changePosition(top, left)
      }
      let _selectedSeatList = this.selectedSeatList;
      let otherLoveSeatIndex = this.seatList[index].otherLoveSeatIndex
      if (otherLoveSeatIndex !== null) {
        // 如果选中的是情侣座位 判断选择个数不大于 maxSelect
        if (_selectedSeatList.length >= this.maxSelect) {
          Toast('一次最多购买' + this.maxSelect + '张票~')
          return false
        }
       // console.log(this.seatTypeList[2].icon)
        // 改变这些座位的图标为已选择图标
        if(this.seatList[index].SeatCouple == "R"){
          this.$set(this.seatList[index],'nowIcon',this.seatList[index].selectedloveIcon_r);
          this.$set(this.seatList[otherLoveSeatIndex], 'nowIcon', this.seatList[otherLoveSeatIndex].selectedloveIcon_l)
        }else if(this.seatList[index].SeatCouple == "L"){
          this.$set(this.seatList[index],'nowIcon',this.seatList[index].selectedloveIcon_l);
          this.$set(this.seatList[otherLoveSeatIndex], 'nowIcon', this.seatList[otherLoveSeatIndex].selectedloveIcon_r)
        }
        
        // 记录 orgIndex属性 是原seatList数组中的下标值
        this.seatList[index].orgIndex = index;
        this.seatList[otherLoveSeatIndex].orgIndex = otherLoveSeatIndex
        // 把选择的座位放入到已选座位数组中
        _selectedSeatList.push(this.seatList[index]);
        _selectedSeatList.push(this.seatList[otherLoveSeatIndex])
      }else{
         // 如果选中的是非情侣座位 判断选择个数不大于 maxSelect
        if (_selectedSeatList.length >= this.maxSelect) {
          Toast('一次最多购买' + this.maxSelect + '张票~')
          return
        }
        // 改变这些座位的图标为已选择图标
        this.$set(this.seatList[index], 'nowIcon', this.seatList[index].selectedIcon)
        // 记录 orgIndex属性 是原seatList数组中的下标值
        this.seatList[index].orgIndex = index
        // 把选择的座位放入到已选座位数组中
        _selectedSeatList.push(this.seatList[index])
      }
    },
    onClickLeft(){
      this.$router.goBack()
    }
  },
  computed:{
     // 座位区域高度rem
    seatAreaHeightRem: function () {
      let screenRem = (document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth) / 10
      let height = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
      // 除了座位区域的大小
      let otherDom = 4 +1.5+ 2.4// 头+排期信息+座位示例 +底部快捷选择+确认按钮
     
      // 剩下的座位区域的大小
      return height / screenRem - otherDom
    },
    // 取最大横坐标
    xMax: function () {
      var i = 0
      for (let index in this.seatList) {

        if (parseInt(this.seatList[index].GraphCol) > i) {
          i = this.seatList[index].GraphCol
        }
      }
      //console.log(i)
      return parseInt(i)
    },
    // 取最大纵坐标
    yMax: function () {
      var i = 0
      for (let index in this.seatList) {
        if (parseInt(this.seatList[index].GraphRow) > i) {
          i = this.seatList[index].GraphRow
        }
      }
      return parseInt(i)
    },
    // 竖中轴线
    middleLine: function () {
      return ((this.xMax / 2) + 1) * this.positionDistin
    },
    // 横中轴线
    horizontalLine: function () {
      return ((this.yMax / 2) + 1) * this.positionDistin
    },
    // 根据影厅的大小缩放比例(需要把影厅全部显示出来)
    seatScale: function () {
      let seatScaleX = 1
      let seatScaleY = 1
      seatScaleX = this.seatAreaWidthRem / this.seatBoxWidth
      seatScaleY = this.seatAreaHeightRem / this.seatBoxHeight
      if(seatScaleX>5){
        seatScaleX =2
      }
      return seatScaleX < seatScaleY ? seatScaleX : seatScaleY
      
    },
    // 让影厅居中展示的偏移值
    seatBoxCenterMargin: function () {
      return -(this.seatBoxWidth * this.seatScale) / 2
    },
    // class 为 seatBox 的高度值 单位为rem
    seatBoxHeight: function () {
      return (this.yMax + 1) * this.positionDistin + this.height
    },
    // class 为 seatBox 的宽度值 单位为rem
    seatBoxWidth: function () {
      //console.log(this.xMax)
      return (this.xMax + 1) * this.positionDistin + this.width
    },
    // 快速选择和选择座位组件component on-bind:is的值
    selectedTabComponents: function () {
      return 'SelectedTab'
    },
    // 座位左边栏的数组
    seatToolArr: function () {
      let seatToolArr = []
      let yMax = this.yMax;
      function g(item,i){
         if(item.GraphRow == i){
               if(item.SeatState === '-2'){
                   return false
               }else{
                   return true
               }
           }
      }
      for (let i = 1; i <= yMax; i++) {
        let el = this.seatList.find((item) => (
            g(item,i)
          
        ))
        if (el){
          seatToolArr.push(el.SeatRow)
        } else {
          seatToolArr.push('')
        }
      }
     // console.log(seatToolArr)
      return seatToolArr
    }
  }
}
</script>

