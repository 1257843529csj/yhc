<template>
  <div class="box">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="result boxcon" style="display: block;">
        <div class="hotlive" v-if="mlist!=''"> 
           <div class="hotlive-title">
               <span>影片</span>   
           </div>
           <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList"
          >
               <van-cell v-for="item in mlist" @click="movieDetail(item.movie_id)">
                   <div class="hostcon">
                       <div class="mphoto">
                           <div class="youhui2" v-if="item.istime==2"></div>
                           <i class="iconfont playing"></i><img :src="item.cover">
                       </div>
                       <div class="m_text">
                           <a @click="movieDetail(item.movie_id)">
                               <h2>
                                   <font v-html="brightenKeyword(kyeword,item.title)"></font>
                                   <div class="movie-style" v-if="item.style==1">
                                       <em>3D</em>
                                       <span>IMAX</span>  
                                   </div>
                                   <div class="movie-style" v-if="item.style==2">
                                       <em>2D</em>  
                                       <span>IMAX</span>  
                                   </div>
                                   <div class="movie-style" v-if="item.style==3">
                                       <em>3D</em>
                                   </div>
                               </h2>
                               <h3>
                                   <em v-if="item.sale_status==1">{{item.wish_count}}人想看</em> 
                                   <em v-else>{{item.show_info}}</em>
                              </h3>
                               <p class="c9" v-if="item.casts!=''">主演：<font v-html="brightenKeyword(kyeword,item.casts)"></font></p> 
                               <p class="c9" v-if="item.directors!=''">导演：<font v-html="brightenKeyword(kyeword,item.directors)"></font></p> 
                               <div class="movie-biao">
                                   <span v-if="item.isbest">今日最佳</span>
                                   <span v-if="item.iswelcom">最受期待</span>   
                               </div>
                           </a>   
                           <div class="gpiaodiv">
                                <a class="gpiao" v-if="item.sale_status==2"  @click.stop="goBuy(item.movie_id)">购票</a>
                                <a class="yspiao" v-if="item.sale_status==1" @click.stop="goBuy(item.movie_id)">预售</a>
                            </div>
                       </div>
                   </div>
               </van-cell>
            </van-list>
        </div>
        <!--  搜索结果（影院） -->
        <div class="cinemabox" v-if="clist!=''" style="margin: 0rem 0 0 0.2rem">
            <div class="hotlive-title">
               <span>影院</span>   
            </div>
            <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList"
          >
                <van-cell v-for="item in clist" @click="btnUrl(item.id)">
                    <a @click="btnUrl(item.id)">
                        <font class="iconfont sc_icon" v-if="item.has_fav==1"></font>
                        <div class="cname">
                            <h2 v-html="brightenKeyword(kyeword,item.name)"></h2>
                        </div>
                        <p class="address" v-html="brightenKeyword(kyeword,item.addr)"></p>
                        <p>
                            <i>座</i>
                            <!-- <i v-if="item.has_tuan==1">团</i> -->
                            <i v-if="item.can_refund">退</i>
                            <span class="q"><em>￥{{item.min_price}}</em>起</span>
                        </p>
                       <!--  <div class="cinema-ratio">
                            <div class="ratio-man">
                                <p>男:{{item.male}}%</p>
                                <div><span :style="{width:item.male+'%'}"></span></div>
                            </div>
                            <div class="ratio-man">
                                <p>女:{{item.female}}%</p>
                                <div><span :style="{width:item.female+'%'}"></span></div>
                            </div>
                            
                        </div> -->
                        <div class="juli">{{item.distance}}</div>
                    </a>
                </van-cell>
            </van-list>
        </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
        title:'',
        kyeword:"",
        mlist:[],
        clist:[],
        page:1,
        loading: false,
        finished: false

    };
  },
  mounted() {
      var that=this;
      that.kyeword=this.$route.query.kw;
      that.getList();
  },
  methods: {
    onClickLeft() {
      this.$router.goBack()
    },
    getList:function(){
        var that=this;
        var kw=this.$route.query.kw;
        var types=this.$route.query.types;
        var data={
            kw:kw,
            types:types,
            page: that.page,
            lat:localStorage.getItem("lat"),
            lng:localStorage.getItem("lng"),
        };
        this.$http.post('/cinema/searchList',data).then((j) => {
            if(j.data.code==0){
                if(types=="movie"){
                    that.clist="";
                    var result=j.data.data;
                    document.title = "全部电影";
                    that.title = "全部电影";
                    if(result.length!=0){
                        that.mlist = that.mlist.concat(result);
                        that.page+=1;
                        this.loading = false;
                    } 
                    else{
                        this.finished = true;
                        this.loading = false;
                    }
                }
                else if(types=="cinema"){
                    that.mlist="";
                    var result=j.data.data;
                    document.title = "全部影院";
                    that.title = "全部影院";
                    if(result.length!=0){
                        that.clist = that.clist.concat(result);
                        that.page+=1;
                        this.loading = false;
                    } 
                    else{
                        this.finished = true;
                        this.loading = false;
                    }
                }             
            }
        })
    },
    goBuy:function(id){
        this.$router.push({name:'cinemabox',query:{movieId:id}});
    },
    //正则搜索高亮
    brightenKeyword:function (searchKeyword, value) { // searchKeyword搜索关键字, value正文内容
      /*if(searchKeyword && searchKeyword.length > 0){
           value = value.replace(replaceReg, '<b style="color: red ">' + searchKeywords[i] + '</b>');  
      }*/
      if (value) {      
          value = value + ''    //转化为字符串类型
      } else {
        return
      }
      if (searchKeyword && searchKeyword.length > 0) {
          var searchKeywords = searchKeyword.split(' ');
          for (var i = 0; i < searchKeywords.length; i++) {
              if (searchKeywords[i] !== '') {      //排除掉空字符串，开始没有考虑空值、空格情况，导致 
                                                   //全文都被匹配
                var replaceReg = new RegExp(searchKeywords[i], 'gi');
                var replaceString = '<b style="color: red ">' + searchKeywords[i] + '</b>';
                value = value.replace(replaceReg, replaceString);
              }
          }
          return value   //返回替换后加上高亮样式的正文内容
        } else {
          return value;
        }
    },
    btnUrl(id) {
        this.$router.push({name:'movies',query:{cinemaId:id}});
    },
    movieDetail:function(id){
        this.$router.push({name:'showbox',query:{movieId:id}});
    },

  },
};
</script>
