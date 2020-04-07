<template>
<div class="box">	
	<router-view v-if='ifshow'/>	
	<Tabs></Tabs>
</div>
</template>
<script type="text/javascript">

import $ from 'jquery';
import { Dialog } from 'vant';
import Tabs from "../components/foot.vue"
export default {
  data() {
    return {
    	cityobj:"",
    	cityInfo:"",
    	citysname:"",
    	ifshow:false
    }
  },
  methods:{
  	 cinemaadd(){
  	 	this.getadder(0);
  	 },
  	 getmap(){
  	 	var that = this;
  	 	var latstorage = localStorage.getItem("lat");
  	 	var lngstorage = localStorage.getItem("lng");
  	 	var address = localStorage.getItem("address");
  	 	if(latstorage==null || lngstorage==null || address == null){
  	 		that.getadder();
  	 	}else{
	        this.cityInfo = JSON.parse(localStorage.getItem("cityInfo"));
	  	 	this.citysname = localStorage.getItem("cityname");
	  	 	this.ifshow = true
  	 	}
	  },
	  getadder(e){
	  	var that = this;
  		var geolocation = new BMap.Geolocation();
  		geolocation.enableSDKLocation();
  		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				localStorage.setItem("lat",r.point.lat);
				localStorage.setItem("lng",r.point.lng);
				var geoc = new BMap.Geocoder();    
	  	        geoc.getLocation(r.point, function(rs){
	  	        	if(e==0){
	  	        		localStorage.setItem("address",rs.address);
	  	        		that.$children[1].address = rs.address
	  	        	}else{
		  	        	localStorage.setItem("cityname",rs.addressComponents.city);
		  	        	localStorage.setItem("cityname_loc",rs.addressComponents.city);
		  	        	localStorage.setItem("address",rs.address);
		  	    		that.citysname = rs.addressComponents.city;
		  	    		that.ifshow = true;
		  	    		that.getCitys()
	  	    		}
	  	    		 
	  	        })
			}
			else {
				alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true})
	  },
	  getCitys:function() {
	        var that = this;
	        this.$http({
	          methods: "get",
	          url: "/city/allcity",
	        }).then(j => {	
	        	that.cityInfo=j.data.data;
	        	//alert(localStorage.getItem("cityname"))
                localStorage.setItem("cityInfo",JSON.stringify(j.data.data));
		          j.data.data.city.forEach(el=>{
		                if(el.name==localStorage.getItem("cityname")){
		                    localStorage.setItem("cityid",el.id);
		                }
		           })
	        })
	    }
  },
  
  mounted(){
  	 this.getmap();
  },
  components:{Tabs}
}
</script>