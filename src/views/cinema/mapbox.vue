<template>
  <div class="box">
    <van-nav-bar
      :title=title
      left-arrow
      @click-left="onClickLeft"
    />
    <div id="allmap"></div>
</div>
</template>
<script type="text/javascript">
import $ from 'jquery';
export default {
  data() {
    return {
        title:"",
        txt:'',
        addr:'',
        tel:'',
        lat:'',
        lng:'',
        cinemaId:'',
    };
  },

  mounted() {
    var that=this;
    that.cinemaId=this.$route.query.cinemaId;
    that.getData();
  },

  methods: {
    onClickLeft(){
      this.$router.goBack()
    },
    getData(){
      var that=this;
        this.$http({
        methods: "get",
        url: "/cinema/info",
        params: {
          cinemaId: that.cinemaId,
        }
        }).then(j => {
            if(j.data.code==0){
              that.txt=j.data.data.name;
              that.addr=j.data.data.addr;
              that.tel=j.data.data.tel;
              that.lat=j.data.data.lat;
              that.lng=j.data.data.lng;
              that.title=j.data.data.name+'地址';
              that.map(that.txt,that.addr,that.tel,that.lat,that.lng);
               
              }
            else{
              this.$dialog.alert({
                  message: j.data.msg
                }).then(() => {
                  // on close
                })
            }
        })
    },
    map(txt,addr,tel,lat,lng){
    // 百度地图API功能
        var point = new BMap.Point(lng,lat);
        var mp = new BMap.Map("allmap");

        var client = {
            lat: '',
            lng: '',
            city: '',
        };
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                onSuccess(r);
            }
            else {
                onError();
            }
        },{enableHighAccuracy: true});


        function onSuccess(r) {
            client.city = r.address.city;
            client.lat = r.point.lat;
            client.lng = r.point.lng;
        }

        mp.centerAndZoom(point, 18);
        mp.enableScrollWheelZoom();
  // 添加带有定位的导航控件
        var navigationControl = new BMap.NavigationControl({
            // 靠左上角位置
            anchor: BMAP_ANCHOR_TOP_LEFT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            enableGeolocation: true
       });
       mp.addControl(navigationControl);
//  var marker = new BMap.Marker(point);// 创建标注
//  mp.addOverlay(marker);             // 将标注添加到地图中
//  marker.disableDragging();
  // 复杂的自定义覆盖物
        function ComplexCustomOverlay(point, text, addr, tel){
          this._point = point;
          this._text = text;
          this._addr = addr;
          this._tel = tel;
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function (map) {
            this._map = map;
            var div = this._div = document.createElement("div");
            div.setAttribute('class', 'title-add');
            div.style.position = "absolute";
            /*div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);*/
            //  div.style.zIndex = 999;
            // div.style.backgroundColor = "#333333";
            //div.style.opacity = ".7";console.log(window.innerWidth)
            div.style.width = window.innerWidth * .85 + "px";
            //div.style.border = "1px solid #67a700";
            //div.style.color = "white";
            //div.style.height = "18px";
            div.style.padding = "14px 14px 14px 14px";
            // div.style.lineHeight = "18px";
            div.style.whiteSpace = "nowrap";
            //div.style.MozUserSelect = "none";
            div.style.fontSize = "14px"
            div.style['border-radius'] = "4px";
            var span = this._span = document.createElement("div");
            //span.setAttribute('class', '');
            span.innerHTML = '<h3 class="openMap">' + this._text + '</h3>' + '<p class="p"><van-icon name="location-o" color="#1989fa" size="20px" ></van-icon>' + this._addr + '</p><p class="tel1"><a id="tt" href="tel:' + this._tel + '">' + this._tel + '</a></p>' + '<em class="address">' + '</em>';

            div.appendChild(span);
            //span.appendChild(document.createTextNode(this._text));
            var that = this;

            var arrow = this._arrow = document.createElement("div");
            arrow.style.position = "absolute";
            arrow.style.background = "#fff";
            arrow.style.opacity = "1";
            arrow.style.width = "10px";
    //      arrow.style.height = window.innerHeight*.1+"px";
            arrow.style.height = "10px";
            arrow.style.bottom = "-5px";
    //      arrow.style.top = "0px";
            arrow.style.left = window.innerWidth * .45 + "px";
            arrow.style.right = "0px";
            arrow.style.overflow = "hidden";
            arrow.style['-webkit-transform'] = "rotate(45deg)";
            div.appendChild(arrow);

          div.addEventListener("touchstart",function(){
              $(".openMap").click();
              //window.open("http://map.baidu.com/mobile/");
    //      var href=document.getElementById("tt").href;
            var href=document.getElementById("toMap").href;
    //      alert(href);
    //      document.getElementById("tt").click();
        //  document.getElementsByClassName("openMap").click();
            window.open(href);

          })
          mp.getPanes().labelPane.appendChild(div);
          
          return div;
        }
        ComplexCustomOverlay.prototype.draw = function(){
          var map = this._map;
    //      var pixel = map.pointToOverlayPixel(this._point);
          var pixel = map.pointToOverlayPixel(this._point);
          console.log(pixel.y);
    //      this._div.style.left = pixel.x + "px";
    //      this._div.style.top  = pixel.y + "px";
          this._div.style.left = pixel.x - parseInt(this._arrow.style.left)  + "px";
          this._div.style.top  = pixel.y - 140 + "px";
        }
        
        var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(lng,lat), txt, addr, tel);

        mp.addOverlay(myCompOverlay);
    }
  }
};
</script>
<style>
#allmap {
    width: 100%;
    height: 100%;
}
.map {
    width: 100%;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
    position: relative;
}
.title-add {
    width: 80%;
    margin: 0 auto;
    padding: 14px 5%;
    position: absolute;
    left: 5%;
    top: 17%;
    background: #fff;
    border-radius: 5px;
}

.title-add h3 {
    font-size: .32rem;
    color: #303030;
    font-weight: normal;
    margin: 0;
}

.title-add .p {
    font-size: .26rem;
    color: #666;
    margin: 5px 0;
}

.title-add .tel {
    font-size: .26rem;
    color: #666;
    margin: 0;
}


.title-add .jt {
    bottom: -.22rem;
    width: .55rem;
    z-index: 2;
    height: .26rem;
    margin-left: -.275rem;
    position: absolute;
}

.title-add .address {
    bottom: -.84rem;
    width: .45rem;
    z-index: 2;
    height: .58rem;
    margin-left: -.225rem;
    position: absolute;
}

#tt {
    color: #666;
    text-decoration: none
}
</style>
