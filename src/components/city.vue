<template>

<div class="city">
  
  <van-nav-bar title="选择城市" fixed :z-index="999"></van-nav-bar>
  <div class="boxcon" style="z-index:100;position: relative;">
      <form action="/">
        <van-search
          v-model="kyeword"
          placeholder="输入城市名称"
          show-action
          @focus="isShowCity=true"
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>
    </div>
  <div class="search_list" :class="isShowCity?'cityshow':'cityhide'">
    <ul>
        <li class="selectCity" :data-cityid="item.id" :data-cityname="item.name" v-for="item in scityList" @click="getCityName(item,2)"><a>{{item.name}}</a></li>
    </ul>
  </div>
	<div class="city-wrap" :class="isShowCity?'cityhide':'cityshow'">

  	<van-index-anchor index="定位城市"  id="topz"/>
  	<div class="city_dw">
  		<span @click="getCityName(cityname,1)">{{cityname}}</span>
  		
  	</div>
  	<van-index-anchor index="热门城市"/>
  	<div class="city_dw">
  		<ul class="hotcity">
          <li :data-cityid="item.id" :data-cityname="item.name" class="selectCity" v-for="item in hostcity"  @click="getCityName(item,2)"><a href="javascript:;">{{item.name}}</a></li>
      </ul>
  		
  	</div>
  	<div class="city-list">
  		<div v-for="(item,key,index) in citylist" >
  	        <div class="city-category" :id="key">
  	            <h3>{{key.toUpperCase()}}</h3>
  	            <ul>
  	                <li :data-cityid="items.id" :data-cityname="items.name"  class="selectCity" v-for="items in item" @click="getCityName(items,2)"><a href="javascript:;">{{items.name}}</a></li>
  	            </ul>
  	        </div>
  	    </div>
  	</div>
  	<div class="city-index left-in">
        <ul>
            <li><a href="#dq" @click="forshort('')">当前</a></li>
            <li><a href="#rm" @click="forshort('')">热门</a></li>
            <li v-for="(item,key) in citylist">
                <a @click="forshort(key)">{{key.toUpperCase()}}</a>
            </li>   
        </ul>
    </div>
  </div>
		
</div>
</template>
<script type="text/javascript">

export default {
  props:{
    //porpcityinfo:Object,
    pagenum:Number,
    cshow:Boolean,
  },
  data() {
    return {
    	citylist:[],
    	hostcity:[],
    	cityJson:[],
    	CityIddw:[],
    	cityname:'定位失败，请手动选择',
      cityinfo:"",
    	newname:'',
      kyeword:'',
      isShowCity:false,
      scityList:[],
      num:0,

      
    }
  },
  watch:{
    cityname(){
      if(localStorage.getItem("cityname_loc")){
         this.cityname= localStorage.getItem("cityname_loc");
      }
    }
  },
  mounted(){
  	var that=this;
    that.isShowCity=this.cshow;
    console.log(this.cshow)
    var cityinfo = JSON.parse(localStorage.getItem("cityInfo"));
    var arr= []
    if(cityinfo){
         this.cityinfo = cityinfo;
         that.citylist = that.cityinfo.all;
         that.hostcity = that.cityinfo.hot;
         that.cityJson = that.cityinfo.city;
    }else{
        this.getCitys()
    }
    if(localStorage.getItem("cityname_loc")){
      that.cityname = localStorage.getItem("cityname_loc")
    }
  },
  methods:{
    getCitys:function() {
          var that = this;
          this.$http({
            methods: "get",
            url: "/city/allcity",
          }).then(j => {  
             that.cityinfo=j.data.data;
             localStorage.setItem("cityInfo",JSON.stringify(j.data.data)||{});
              that.citylist = that.cityinfo.all;
             that.hostcity = that.cityinfo.hot;
             that.cityJson = that.cityinfo.city;
          })
    },
    forshort: function (item) {
      if(item == ""){
        window.location.href = "#topz"
      }
      window.location.href = "#" + item;

    },
    getCityName(item,num){
        var that=this;
        if(num == 1){
           if(this.cityname == '定位失败，请手动选择'){
            return false
           }
        }
        this.getselectcity(item,num);
        that.isShowCity=false;
        that.kyeword='';
        that.scityList=false;
        that.$emit('func',that.newname);
              
            
    },
    getselectcity(item,num){
       var that = this;
       if(num==2){
            that.newname=item.name;
            localStorage.setItem("cityid",item.id);
        }
        else{
            that.newname=item;
            that.cityJson.forEach(el=>{
                if(el.name==item){
                    localStorage.setItem("cityid",el.id);
                }
            })
        }
        localStorage.setItem("cityname",that.newname);
    },
    checkSelect(){
      var that=this;
      that.isShowCity=true;

      // that.num=that.num+1;
      // console.log(that.num)
      
    },
    onCancel(){
      var that=this;
      that.isShowCity=false;
    },
    onSearch(){
      var that=this;
      that.selectResult();

    },
    selectResult:function(){
        var that=this;
        if (!that.kyeword) return !1;
        this.$http({
        methods: "get",
        url: "/city/so",
        params: {
          kw: that.kyeword,
        }
        }).then(j => {
          if (j.data.code === 0) {
            // onSo(j.data);
            that.scityList=j.data.data;
          }
          else if (j.data.code === -1) {
            // onSo(j.data);
          }
            
        })

    },
 }
  
};
</script>