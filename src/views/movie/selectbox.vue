<template>
  <div class="box">
    <van-nav-bar
      title="搜索"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <div class="boxcon">
      <form action="/">
        <van-search
          v-model="kyeword"
          :placeholder="placeholderValue"
          show-action
          :clearable="clearableValue"
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>
    </div>
  <div class="select-key" v-if="!isShow&&!isempty">
      <span>搜索指定内容</span>
      <ul>
          <li @click="movieSelect(1)" id="movies" :style="isSelect==1||isSelect==0?'color:#ff9c22':'color:#ccc'">影片</li>
          <li @click="movieSelect(2)" id="cinemas" :style="isSelect==2||isSelect==0?'color:#ff9c22':'color:#ccc'">影院</li>
      </ul>
  </div>
  <!--  搜索结果（影片） -->
  <div class="result" v-if="isShow">
      <div class="hotlive" v-if="mlist&&mlist.count!=0&&mlist!=''&&mlist.length!=0"> 
         <div class="hotlive-title">
             <span>影片</span>   
         </div>
         <ul>
             <li v-for="item in mlist.list">
                 <div class="hostcon">
                     <div class="mphoto">
                         <div class="youhui2" v-if="item.istime==2"></div>
                         <i class="iconfont playing"></i><img :src="item.cover">
                         <van-icon name="play-circle-o" size="40" class="my-play-icon" color="#fff" v-if="item.has_video != 0" />
                     </div>
                     <div class="m_text">
                         <a @click="movieDetail(item.movie_id)">
                             <h2>
                              
                                <span v-html="brightenKeyword(kyeword,item.title)"></span>
                                   
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
                             <em v-else>{{item.show_info}}</em></h3>

                             <p class="c9" v-if="item.casts!=''">主演：<font v-html="brightenKeyword(kyeword,item.casts)"></font></p> 
                             <p class="c9" v-if="item.directors!=''">导演：<font v-html="brightenKeyword(kyeword,item.directors)"></font></p> 
                             <div class="movie-biao">
                                 <span v-if="item.isbest">今日最佳</span>
                                 <span v-if="item.iswelcom">最受期待</span>   
                             </div>
                         </a>   
                         <div class="seachbtndiv">
                              <a class="gpiao" v-if="item.sale_status==2"  @click.stop="goBuy(item.movie_id)">购票</a>
                              <a class="yspiao" v-if="item.sale_status==1"  @click.stop="goBuy(item.movie_id)">预售</a>
                          </div>
                     </div>
                 </div>
             </li>
         </ul>
         <div class="hotlive-more" @click="moreMovie">
             <span>查看全部{{mlist.count}}部影片</span>
         </div>
      </div>
      <!--  搜索结果（影院） -->
      <div v-if="clist&&clist.count!=0&&clist!=''&&clist.length!=0" :class="clist||clist.list.length==0?'':'select_cinema'">
        
      
          <div class="cinemabox" style="margin: 0rem 0 0 0.2rem">
              <div class="hotlive-title">
                 <span>影院</span>   
             </div>
              <ul id="list1">
                  <li v-for="item in clist.list">
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
                  </li>
              </ul>
              <div class="hotlive-more" @click="moreCinema">
                 <span>查看全部{{clist.count}}家影院</span>
             </div>
          </div>
      </div>
      <div class="line2"> </div>
  </div>
  <Emptys v-if="isempty"></Emptys>
  </div>
</template>
<script type="text/javascript">
import Emptys from "../../components/empty.vue"
export default {
  data() {
    return {
      placeholderValue:'搜影片、影院',
      types:'',
      isSelect:0,
      kyeword:"",
      mlist:[],
      clist:[],
      result:[],
      isShow:false,
      isempty:false,
      clearableValue:false,
    };
  },
  mounted() {
  },
  methods: {
    onClickLeft() {
      this.$router.goBack()
    },

    onSearch(){
      var that=this;
      that.selectResult();

    },
    onCancel(){
        this.$router.goBack()
    },
    selectResult:function(){
        var that=this;
        if(that.kyeword.length>0){
          console.log(1)
            var data={
                kw:that.kyeword,
                types:that.types,
                lat:localStorage.getItem("lat"),
                lng:localStorage.getItem("lng"),
            };
            this.$http.post('/cinema/search',data).then((j) => {
                if(j.data.code==0){
                    that.mlist=j.data.data.movie;  
                    that.clist=j.data.data.cinema;
                    that.result=j.data.data;
                    if(that.types==""){
                        if((that.mlist&&that.mlist.list.length==0) && (that.clist&&that.clist.list.length==0)){
                          that.isempty=true;
                          that.isShow=false;
                          console.log(1)

                        }
                        else{
                            that.isempty=false;
                            that.isShow=true;
                            console.log(2)

                        }
                    }
                    else{
                        if((that.mlist&&that.mlist.list.length==0) || (that.clist&&that.clist.list.length==0)){
                            that.isempty=true;
                            that.isShow=false;

                        }
                        else{
                            that.isempty=false;
                            that.isShow=true;

                        }

                    }
                }
            })
        }
    },
    moreMovie:function(){
        var that=this;
        this.$router.push({name:'selectallbox',query:{kw:that.kyeword,types:'movie'}});
    },
    moreCinema:function(){
        var that=this;
        this.$router.push({name:'selectallbox',query:{kw:that.kyeword,types:'cinema'}});
    },
    movieSelect:function(index){
      var that=this;
      that.isSelect=index;
      if(index==1){
        that.types="movie";
        that.placeholderValue="搜影片";
      }
      else{
        that.types="cinema";
        that.placeholderValue="搜影院";
      }
    },
    goBuy:function(id){
        this.$router.push({name:'cinemabox',query:{movieId:id}});

    },
    movieDetail(id){
      this.$router.push({name:'showbox',query:{movieId:id}});

    },
    btnUrl(id){
      this.$router.push({name:'movies',query:{cinemaId:id}});
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
    }
  },
  components:{Emptys}
};
</script>
