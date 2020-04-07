export var times = function formatDateTime(timeStampm,num) {
    var date = new Date();
    date.setTime(timeStampm * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second; 
    if(num == 0){
       return y + '-' + m + '-' + d;
     }else if(num == 1){
       return m + '月' + d+'日';
     }else if(num == 2){
       return y + '.' + m + '.' + d;
     }else if(num == 3){
        return y+'.'+m + '.' + d + ' ' + h+':'+minute;
     }else if(num == 4){
        return y+'.'+m + '.' + d + ' ' + h+':'+minute+':'+second;
     }else if(num == 5){
        return minute+'分'+second+'秒';
     }else {
        return "参数缺失"
     }
};
export var tel = function isMobile(mobile){
    return /(^13\d{9}$)|(^14\d{9}$)|(^15\d{9}$)|(^16\d{9}$)|(^18\d{9}$)|(^19\d{9}$)|(^17\d{9}$)/.test(mobile);
}

export var getIsApp = function getIsApp(){
      //let ua = window.navigator.userAgent.toLowerCase();
      //console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
      var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/isapp/i) == "isapp") {
            return true;
        }else{
           return false;
        } 
}
//判断安卓或ios
export var mobiletype = function(){
    var u = navigator.userAgent, app = navigator.appVersion; 
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      return 'android'
    }
    if (isIOS) {
      return 'ios'
    }
}
//判断是否是微信浏览器的函数
export var isWeiXin = function isWeiXin(){
  //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
  var ua = window.navigator.userAgent.toLowerCase();
  //通过正则表达式匹配ua中是否含有MicroMessenger字符串
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
  return true;
  }else{
  return false;
  }
}
//判断是否在app里打开
export var inapp = function inapp(){
  //return false;
  var userAgent = navigator.userAgent;
  if(userAgent.match(/filmfly/i) == 'filmfly'){
    return true;
    }else{
    return false;
  }
}

/**
 * 解决两个数相加精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
export var floatAdd = function floatAdd(a, b) {
    var c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return  (floatMul(a, e) + floatMul(b, e)) / e;
}
/**
 * 解决两个数相减精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
export var floatSub = function floatSub(a, b) {
    var c, d, e;
    if(undefined==a||null==a||""==a||isNaN(a)){a=0;}
    if(undefined==b||null==b||""==b||isNaN(b)){b=0;}
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    e = Math.pow(10, Math.max(c, d));
    return (floatMul(a, e) - floatMul(b, e)) / e;
}
/**
 * 解决两个数相乘精度丢失问题
 * @param a
 * @param b
 * @returns {Number}
 */
export var floatMul = function floatMul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
/**
 * 解决两个数相除精度丢失问题
 * @param a
 * @param b
 * @returns
 */
export var floatDiv = function floatDiv(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), floatMul(c / d, Math.pow(10, f - e));
}




/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-10-12 09:26:19
 * @version $Id$
 */
 // 我的任务签到
export var datet=function dateUtil(signList){
var calUtil = {
  //当前日历显示的年份
  showYear:2016,
  //当前日历显示的月份
  showMonth:1,
  //当前日历显示的天数
  showDays:1,
  eventName:"load",
  //初始化日历
  init:function(signList){
    calUtil.setMonthAndDay();
    calUtil.draw(signList);
    // calUtil.bindEnvent();
  },
  draw:function(signList){
    console.log(signList)
    //绑定日历
    var str = calUtil.drawCal(calUtil.showYear,calUtil.showMonth,signList);
    document.getElementById('calendar').innerHTML =str;

    //绑定日历表头
    var date = new Date();
    var year=date.getFullYear()
    var month = date.getMonth() + 1;
    if(month<10){
      month=""+date.getMonth() + 1;
    }
    var strDate = date.getDate();
    if(strDate<10){
      strDate="0"+date.getDate();
    }
    var calendarName=year+'-'+month+'-'+strDate;
    document.getElementById('calendar_month_span').innerHTML=calendarName;  
  },
  //获取当前选择的年月
  setMonthAndDay:function(){
    switch(calUtil.eventName)
    {
      case "load":
        var current = new Date();
        calUtil.showYear=current.getFullYear();
        calUtil.showMonth=current.getMonth() + 1;
        break;
      case "prev":
        var nowMonth=$(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth=parseInt(nowMonth)-1;
        if(calUtil.showMonth==0)
        {
            calUtil.showMonth=12;
            calUtil.showYear-=1;
        }
        break;
      case "next":
        var nowMonth=$(".calendar_month_span").html().split("年")[1].split("月")[0];
        calUtil.showMonth=parseInt(nowMonth)+1;
        if(calUtil.showMonth==13)
        {
            calUtil.showMonth=1;
            calUtil.showYear+=1;
        }
        break;
    }
  },
  getDaysInmonth : function(iMonth, iYear){
   var dPrevDate = new Date(iYear, iMonth, 0);
   return dPrevDate.getDate();
  },
  bulidCal : function(iYear, iMonth) {
   var aMonth = new Array();
   aMonth[0] = new Array(7);
   aMonth[1] = new Array(7);
   aMonth[2] = new Array(7);
   aMonth[3] = new Array(7);
   aMonth[4] = new Array(7);
   aMonth[5] = new Array(7);
   aMonth[6] = new Array(7);
   var dCalDate = new Date(iYear, iMonth - 1, 1);
   var iDayOfFirst = dCalDate.getDay();
   var iDaysInMonth = calUtil.getDaysInmonth(iMonth, iYear);
   var iVarDate = 1;
   var d, w;
   aMonth[0][0] = "日";
   aMonth[0][1] = "一";
   aMonth[0][2] = "二";
   aMonth[0][3] = "三";
   aMonth[0][4] = "四";
   aMonth[0][5] = "五";
   aMonth[0][6] = "六";
   for (d = iDayOfFirst; d < 7; d++) {
    aMonth[1][d] = iVarDate;
    iVarDate++;
   }
   for (w = 2; w < 7; w++) {
    for (d = 0; d < 7; d++) {
     if (iVarDate <= iDaysInMonth) {
      aMonth[w][d] = iVarDate;
      iVarDate++;
     }
    }
   }
   return aMonth;
  },
  ifHasSigned : function(signList,day){
   var signed = false;
   if(signList!=null){
       signList.forEach(item=>{
        if(item.signDay == day) {
         signed = true;
         return false;
        }


       })
    }
   // $.each(signList,function(index,item){
    
   // });
   return signed ;
  },
  drawCal : function(iYear, iMonth ,signList) {
    console.log(signList)
   var myMonth = calUtil.bulidCal(iYear, iMonth);
   var htmls = new Array();
   htmls.push("<div class='sign_main' id='sign_layer'>");
   htmls.push("<div class='sign_succ_calendar_title'>");
   htmls.push("<em id='sign_close'>X</em>");
 /*  htmls.push("<div class='calendar_month_next'>下月</div>");
   htmls.push("<div class='calendar_month_prev'>上月</div>");*/
   
   htmls.push("<div class='calendar_month_span' id='calendar_month_span'></div>");
   htmls.push("<div class='calendar_month_day'>已签到<font id='calendar_time'>3</font>天</div>");
   htmls.push("</div>");
   htmls.push("<div class='sign' id='sign_cal'>");
   htmls.push("<div class='calendar-time'>");
   htmls.push("<ul>");
   htmls.push("<li>周日</li>");
   htmls.push("<li>周一</li>");
   htmls.push("<li>周二</li>");
   htmls.push("<li>周三</li>");
   htmls.push("<li>周四</li>");
   htmls.push("<li>周五</li>");
   htmls.push("<li>周六</li>");
   htmls.push("</ul>");
   htmls.push("<table>");
   var d, w;
   for (w = 1; w < 7; w++) {
    htmls.push("<tr>");
    for (d = 0; d < 7; d++) {
     var ifHasSigned = calUtil.ifHasSigned(signList,myMonth[w][d]);
     console.log(ifHasSigned);
     if(ifHasSigned){
      htmls.push("<td class='on'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
     } else {
      htmls.push("<td>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</td>");
     }
    }
    htmls.push("</tr>");
   }
   htmls.push("</table>");
   htmls.push("</div>");
   htmls.push("</div>");
   return htmls.join('');
  }
}
return calUtil.init(signList);
}
