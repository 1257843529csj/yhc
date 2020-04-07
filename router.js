import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import Indexbox from './views/indexbox.vue'//首页
import Moviebox from './views/moviebox.vue'//电影
import Cinemabox from './views/cinemabox.vue'//影院
import Activitybox from './views/activitybox.vue'//活动
import Usebox from './views/usebox.vue'//用户中心
import Logsbox from './views/member/logsbox.vue'//用户中心-我的账户
import Infobox from './views/member/infobox.vue'//用户中心-我的资料
import Rpwdway from './views/member/rpwdway.vue'//用户中心-我的资料-修改密码
import Revisepwd from './views/member/revisepwd.vue'//用户中心-我的资料-修改密码
import Revisecode from './views/member/revisecode.vue'//用户中心-我的资料-修改密码
import Leaguer from './views/member/leaguer.vue'//用户中心-等级说明
import Taskbox from './views/member/taskbox.vue'//用户中心-我的任务
import Achievebox from './views/member/achievebox.vue'//用户中心-我的成就
import allachieve from './views/member/allachieve.vue'//用户中心-我的成就-所有成就
import Medalbox from './views/member/medalbox.vue'//用户中心-我的勋章
import Chestbox from './views/member/chestbox.vue'//用户中心-我的宝箱
import Mymoviebox from './views/member/mymoviebox.vue'//用户中心-我的电影
import Achievementsort from './views/member/achievementsort.vue'//用户中心-成就排行
import Purchasort from './views/member/purchasort.vue'//用户中心-购买力排行
import Myintegral from './views/member/myintegral.vue'//用户中心-我的积分
import Integralinfo from './views/member/integralinfo.vue'//用户中心-我的积分-活动说明
import Cardexchange from './views/member/cardexchange.vue'//用户中心-我的积分-点卡兑换
import Integraldetail from './views/member/integraldetail.vue'//用户中心-我的积分-卡券详情
import Toppedbox from './views/hottop/toppedbox.vue'//榜首
import Contribute from './views/hottop/contribute.vue'//榜首
import Mylovebox from './views/hottop/mylovebox.vue'//我的爱豆
import Showbox from './views/movie/showbox.vue'//电影详情
import Replybox from './views/movie/replybox.vue'//电影详情-回复评论
import Morereviewbox from './views/movie/morereviewbox.vue'//更多评论
import Evaluate from './views/movie/evaluate.vue'//评论分享
import Starinfo from './views/movie/star.vue'//明星
import Selectbox from './views/movie/selectbox.vue'//搜索
import Selectallbox from './views/movie/selectallbox.vue'//搜索
import Allmovie from './views/movie/allmovie.vue'//明星-所有作品
import Filmcrew from './views/movie/filmcrew.vue'//电影详情-演员
import Videosbox from './views/movie/videosbox.vue'//电影详情-图库
import Login from './views/login.vue'//登录
import Getpwd from './views/member/getpwd'//找回密码
import Forgetpwd from './views/member/forgetpwd'//找回密码
import Movies from './views/cinema/movies.vue'//影院详情
import Info from './views/cinema/info.vue'//影院详情
import Hallseat from './views/cinema/hallseat'//选座页
import Mapbox from './views/cinema/mapbox'//影院地图
import Confirm from './views/order/confirm'//订单确认页
import Optionspay from './views/order/optionspay'//支付页面
import Orderlist from './views/order/orderlist'//订单列表
import Orderdetail from './views/order/orderdetail'//订单详情 
import Addyhui from './views/member/addyhui' //添加卡券
import Mycard from './views/member/mycard'//我的卡
import Myquan from './views/member/mycard'//我的券
import Myhongbao from './views/member/mycard'//我的红包
import MycardInfo from './views/member/mycardinfo'//我的卡详情
import Paycard from './views/order/paycard'//卡充值
import Paycardopt from './views/order/paycardopt'//卡充值支付
import Bindmoblie3 from './views/member/bindmoblie3'//第三绑卡
import Status from './views/member/status'// 出票页面
Vue.use(Router) 
Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
   {
      path: '/',
      name: 'Index',
      component:resolve => require(['./views/index.vue'], resolve),
      meta: {
            keepAlive: false
      },
      children: [
       		{
  		      path: 'Indexbox',
  		      name: 'indexbox',
  		      component:resolve => require(['./views/indexbox.vue'], resolve)
		      },
          {
            path: 'Moviebox',
            name: 'moviebox',
            component:resolve =>{require(['./views/moviebox.vue'], resolve)}
          },
          {
            path: 'Cinemabox',
            name: 'cinemabox',
            component:resolve => require(['./views/cinemabox.vue'], resolve)
          },
          {
            path: 'Activitybox',
            name: 'activitybox',
            component:resolve => require(['./views/activitybox.vue'], resolve)
          },
          {
            path: 'Usebox',
            name: 'usebox',
            component:resolve => require(['./views/usebox.vue'], resolve),
            meta:{
               requireAuth: true
            }
          }
       ]
   },
   {
      path: '/Login',
      name: 'loginbox',
      component:resolve => require(['./views/login.vue'], resolve),
      meta: {
            keepAlive: false
      }
   },
   {
      path: '/Getpwd',
      name: 'getpwd',
      component:resolve => require(['./views/member/getpwd.vue'], resolve)
   },
   {
      path: '/Forgetpwd',
      name: 'forgetpwd',
      component:resolve => require(['./views/member/forgetpwd.vue'], resolve)
   },
   {
      path: '/Toppedbox',
      name: 'toppedbox',
      component:resolve => require(['./views/hottop/toppedbox.vue'], resolve),

   },
   {
      path: '/Contribute',
      name: 'contribute',
      component:resolve => require(['./views/hottop/contribute.vue'], resolve)
   },
   {
      path: '/Showbox',
      name: 'showbox',
      component:resolve => require(['./views/movie/showbox.vue'],resolve)
     
    },
    {
      path: '/Replybox',
      name: 'replybox',
      component:resolve => require(['./views/movie/replybox.vue'],resolve)
    },
    {
      path: '/Filmcrew',
      name: 'filmcrew',
      component:resolve => require(['./views/movie/filmcrew.vue'],resolve)
      
    },
    {
      path: '/Videosbox',
      name: 'videosbox',
      component:resolve => require(['./views/movie/videosbox.vue'],resolve)
    },
   {
      path: '/Morereviewbox',
      name: 'morereviewbox',
      component:resolve => require(['./views/movie/morereviewbox.vue'],resolve)
   },
   {
      path: '/Evaluate',
      name: 'evaluate',
      component:resolve => require(['./views/movie/evaluate.vue'],resolve)
   },
   {
      path: '/Mylovebox',
      name: 'mylovebox',
      component:resolve => require(['./views/hottop/mylovebox.vue'],resolve)

   },
   {
     path:'/Starinfo',
     name:'starinfo',
     component:resolve => require(['./views/movie/star.vue'],resolve)
      
   },
    {
     path:'/Selectbox',
     name:'selectbox',
     component:resolve => require(['./views/movie/selectbox.vue'],resolve)
     
   },
   {
     path:'/Selectallbox',
     name:'selectallbox',
     component:resolve => require(['./views/movie/selectallbox.vue'],resolve)
   },
   {
     path:'/Allmovie',
     name:'allmovie',
     component:resolve => require(['./views/movie/allmovie.vue'],resolve)
   },
   {
     path:'/Movies',
     name:'movies',
     component:resolve => require(['./views/cinema/movies.vue'],resolve)
     
   },
   {
     path:'/Info',
     name:'info',
     component:resolve => require(['./views/cinema/info.vue'],resolve)
    
   },
    {
     path:'/Hallseat',
     name:'hallseat',
     component:resolve => require(['./views/cinema/hallseat.vue'],resolve)
     
    },
    {
     path:'/Confirm',
     name:'confirm',
     component:resolve => require(['./views/order/confirm.vue'],resolve)
    },
    {
     path:'/Orderlist',
     name:'orderlist',
     component:resolve => require(['./views/order/orderlist.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Orderdetail',
     name:'orderdetail',
     component:resolve => require(['./views/order/orderdetail.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Infobox',
     name:'infobox',
     component:resolve => require(['./views/member/infobox.vue'],resolve),
      meta:{
          requireAuth: true
      }
    },
    {
     path:'/Rpwdway',
     name:'rpwdway',
     component:resolve => require(['./views/member/rpwdway.vue'],resolve),
      meta:{
          requireAuth: true
      }
    },
    {
     path:'/Revisepwd',
     name:'revisepwd',
     component:resolve => require(['./views/member/revisepwd.vue'],resolve),
      meta:{
          requireAuth: true
      }
    },
    {
     path:'/Revisecode',
     name:'revisecode',
     component:resolve => require(['./views/member/revisecode.vue'],resolve),
      meta:{
          requireAuth: true
      }
    },
    {
     path:'/Logsbox',
     name:'logsbox',
     component:resolve => require(['./views/member/logsbox.vue'],resolve)
    },
    {
     path:'/Mapbox',
     name:'mapbox',
     component:resolve => require(['./views/cinema/mapbox.vue'],resolve)
    },

    {
     path:'/Leaguer',
     name:'leaguer',
     component:resolve => require(['./views/member/leaguer.vue'],resolve)
    },
    {
     path:'/Taskbox',
     name:'taskbox',
     component:resolve => require(['./views/member/taskbox.vue'],resolve)
    },
    {
     path:'/Achievebox',
     name:'achievebox',
     component:resolve => require(['./views/member/achievebox.vue'],resolve)
    },
    {
     path:'/Allachieve',
     name:'allachieve',
     component:resolve => require(['./views/member/allachieve.vue'],resolve)
    },
    {
     path:'/Achievementsort',
     name:'achievementsort',
     component:resolve => require(['./views/member/achievementsort.vue'],resolve)
    },
    {
     path:'/Purchasort',
     name:'purchasort',
     component:resolve => require(['./views/member/purchasort.vue'],resolve)
    },
    {
     path:'/Chestbox',
     name:'chestbox',
     component:resolve => require(['./views/member/chestbox.vue'],resolve)
    },
    {
     path:'/Medalbox',
     name:'medalbox',
     component:resolve => require(['./views/member/medalbox.vue'],resolve)
    },
    {
     path:'/Mymoviebox',
     name:'mymoviebox',
     component:resolve => require(['./views/member/mymoviebox.vue'],resolve)
    },
    {
     path:'/Myintegral',
     name:'myintegral',
     component:resolve => require(['./views/member/myintegral.vue'],resolve)
    },
    {
     path:'/Integralinfo',
     name:'integralinfo',
     component:resolve => require(['./views/member/integralinfo.vue'],resolve)
    },
    {
     path:'/Integralinfo',
     name:'integralinfo',
     component:resolve => require(['./views/member/integralinfo.vue'],resolve)
    },
    {
     path:'/Cardexchange',
     name:'cardexchange',
     component:resolve => require(['./views/member/cardexchange.vue'],resolve),
    },
    {
     path:'/Integraldetail',
     name:'integraldetail',
     component:resolve => require(['./views/member/integraldetail.vue'],resolve),
    },
    {
     path:'/Addyhui',
     name:'addyhui',
     component:resolve => require(['./views/member/addyhui.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Mycard',
     name:'mycard',
     component:resolve => require(['./views/member/mycard.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Myquan',
     name:'myquan',
     component:resolve => require(['./views/member/myquan.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Myhongbao',
     name:'myhongbao',
     component:resolve => require(['./views/member/myhongbao.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/MycardInfo',
     name:'mycardinfo',
     component:resolve => require(['./views/member/mycardinfo'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Optionspay',
     name:'optionspay',
     component:resolve => require(['./views/order/optionspay.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Paycard',
     name:'paycard',
     component:resolve => require(['./views/order/paycard.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Paycardopt',
     name:'paycardopt',
     component:resolve => require(['./views/order/paycardopt.vue'],resolve),
     meta:{
         requireAuth: true
      }
    },
    {
     path:'/Bindmoblie3',
     name:'bindmoblie3',
     component:resolve => require(['./views/member/bindmoblie3.vue'],resolve)
    },
     {
     path:'/Status',
     name:'status',
     component:resolve => require(['./views/member/status.vue'],resolve)
    }
    
  ]
})


