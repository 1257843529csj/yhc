<template>
  <div class="box">
        <div class="fixtop">
        <van-nav-bar title="影院" :border='false'>
          <van-icon style="line-height:.5rem"   slot="left" size=".3rem" @click="cityView">{{cityname}}
              <van-icon name="arrow-down" size="10" style="margin-left: 0.1rem" /></van-icon>
          </van-icon>
          <van-icon name="search" slot="right" color="#ff9c22" size="26px" @click="goSearch"/>
        </van-nav-bar>
        <van-tabs title-active-color="#FF9C22"  :swipe-threshold='3' v-if="showtimes" @click="changetime">
          <van-tab v-for="times in plan_date" :title="times.date_show" :name="times.date">
        </van-tab>
      </van-tabs>
        <van-dropdown-menu active-color="#ff9c22" v-cloak>
            <van-dropdown-item v-model="value" :options="arealist" @change="areaselect"/>
            <van-dropdown-item v-model="value1" :options="bandlist"  @change="bandselect"/>
            <van-dropdown-item v-model="value2" :options="selectarr"  @change="typeselect"/>
        </van-dropdown-menu>
        </div>
      <div :class="showtimes ? 'cinemabox mt280':'cinemabox'">
          <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad" 
        >
        <van-cell v-for="(item,index) in list" @click="gotocinemainfo(item.cinema_id)">
             <font class="iconfont sc_icon" v-if="item.has_fav==1"><img src="../assets/img/jiaobiao.png"></font>
                        <div class="cname">
                            <h2>{{item.name}}</h2>
                        </div>
                        <p class="address">{{item.addr}}</p>
                        <p>
                            <i>座</i>
                            <!-- <i v-if="item.has_tuan==1">团</i> -->
                            <i v-if="item.can_refund">退</i>
                            <span class="q"><em>￥{{item.min_price}}</em>起</span>
                            <!-- <em class="yh" v-if="movieInfo.psl">{{movieInfo.psl_tab}}</em> -->
                        </p>
                        <div class="timebox" v-if="movieId!=''&&item.allplan&&item.allplan.length!=0"> 
                            <div class="tbox" v-for="item2 in item.allplan" v-if="item2.p_stamp>nowdateTime">
                                <p>{{item2.p_stime}}</p>
                                <p>{{item2.CopyLanguage}}{{item2.CopyType}}</p>
                                <p>¥{{item2.price}}</p>
                            </div>
                        </div>
                        <div class="juli">{{item.distance}}</div>
          </van-cell>
        </van-list>
        <div class="loc">
          <i class="loc_ico1"></i>
          <em id="myAddress">{{address}}</em>
          <i @click="locs()" class="loc_ico2"></i>
        </div>
      </div>
      <van-popup
      v-model="cityShow" closeable
      position="top"
      :style="{ height: '100%',background: '#eee'}"
    >
        <Citys @func="getNameFormCity"></Citys>
     </van-popup>
  </div>
</template>
<script type="text/javascript">
import { DropdownMenu,DropdownItem,List} from 'vant';
import { inapp } from "@/assets/js/date.js";
import Citys from "../components/city.vue"
export default{
  data() {
    return {
      value:0,
      arealist:[],
      value1:0,
      bandlist:[],
      value2:1,
      selectarr:[{'text':'离我最近',value:1},{'text':'价格最低',value:2}],
      lng:"",
      lat:"",
      list:[],
      loading: false,
      finished: false,
      page:1,
      movieId:"",
      area:"",
      band:"",
      types:"",
      nowdateTime:0,
      plan_date:"",
      showtimes:false,
      pq_date:"",
      cityShow:false,
      cityname:'',
      address:"定位失败"
    }
  },
  components:{Citys},
  beforeRouteLeave(to, form, next) {
      next();
      if(inapp()){
        window.WebViewJavascriptBridge.callHandler(
                          'isIndex' 
                          , {
                             isindex : false 
                          }  //请求参数
                          , function(responseData) { //回调数据接口
                            
                          }
       );
      }
  },
  methods:{
     tagback_moblie(){
       window.WebViewJavascriptBridge.callHandler(
                        'isIndex' 
                        , {
                           isindex : true 
                        }  //请求参数
                        , function(responseData) { //回调数据接口
                          
                        }
     );
    },
    locs(){
      this.$parent.cinemaadd();
    },
    getName(){
      var that = this;
      this.locs()
      var name;
      name=localStorage.getItem("cityname");
      if(name != null){
        if(name.length>3){
            that.cityname=name.substring(0, 2)+'...';
          }
          else{
            that.cityname=name.replace('市', '');
          }
        }
    },
    cityView(){
            var that=this;
            that.cityShow=true;
    },
    getNameFormCity(data){
        var that=this;
        if(data.length>3){
          that.cityname=data.substring(0, 2)+'...';
        }
        else{
          that.cityname=data.replace('市', '');
        }
        
        //localStorage.setItem("selectname",data);
        that.cityShow=false;
        this.init();
        that.get_tjdata();
        this.onLoad()

    },
    goSearch(){
        this.$router.push({name:'selectbox'});
    },
    init(){
      this.page = 1;
      this.list = [];
    },
    areaselect(e){
      this.area = e;
      this.init();
      this.onLoad();
    },
    bandselect(e){
      this.band = e;
      this.init();
      this.onLoad();
    },
    typeselect(e){
      this.types = e;
      this.init();
      this.onLoad();
    },
    onLoad(){
       this.nowdateTime=parseInt(new Date().getTime()/1000+1800);
       setTimeout(() => {
          this.$http({
            method:'get',
            url:'/cinema/list',
            params:{
             'movieId':this.movieId,
             'lng':this.lng,
             'lat':this.lat,
             'area':this.area,
             'band':this.band,
             'types':this.types,
             'page':this.page,
             'date':this.pq_date
            }}).then((res) => {
              if(res.data.data.list.length == 0){
                this.finished = true;
                //return false;
              }
              this.plan_date = res.data.data.plan_date;
              for (var i = 0; i < res.data.data.list.length; i++) {
                this.list.push(res.data.data.list[i]);
              }
              this.page=this.page+1;
              this.loading = false;
        })
       },500)
     },
     get_tjdata(){
       this.lng = localStorage.getItem("lng");
       this.lat = localStorage.getItem("lat");
       this.$http.get('/cinema/area').then((res) => {
        var arr =[]
        for (let i in res.data.data) {
          arr.push(res.data.data[i]);
        }
        arr.forEach(function(val, index) {
          val.text = arr[index].name+'('+arr[index].num+'家)';
          val.value = arr[index].id;
       })
        arr.unshift({"text":"区域",value:0});
        this.arealist = arr;
      });
       this.$http.get('/cinema/band').then((res) => {
        var arr =[]
        for (let i in res.data.data) {
          arr.push(res.data.data[i]);
        }
        arr.forEach(function(val, index) {
          val.text = arr[index].name+'('+arr[index].num+'家)';
          val.value = arr[index].id;
       })
        arr.unshift({"text":"品牌",value:0});
        this.bandlist = arr;
     });
     },
     gotocinemainfo(id){
        this.$router.push({name: "movies", query: {cinemaId: id,date:this.pq_date,movieid:this.movieId}});
     },
     changetime(e){
      this.page = 1;
       this.pq_date =e;
       this.list = []
       this.onLoad()
     }
  },
  mounted() {
     if(this.$route.query.movieId){
       this.movieId=this.$route.query.movieId;
       this.showtimes = true;
     }
     if(inapp()){
      this.tagback_moblie();
     }
     this.get_tjdata();
     this.getName()
  }
}
</script>