"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var a=0,e=Array(t.length);a<t.length;a++)e[a]=t[a];return e}return Array.from(t)}$(function(){var a=new Vue({el:"#app",data:{loading:!0,listsData:[],pageData:[],pagination:[],currentPage:1,filterMode:!1,filterData:[],filterInputData:{LocName:"",City:"",District:""},filterOpen:!1,modalLocName:"",googleMap:{map:{},marker:{},infowindow:{}}},computed:{showPages:function(){var e={min:this.currentPage%10==0?this.currentPage-9:10*Math.floor(this.currentPage/10)+1,max:this.currentPage%10==0?this.currentPage:10*Math.ceil(this.currentPage/10)};return e.max>this.pagination.length&&(e.max=this.pagination.length),this.pagination.filter(function(t,a){return t>=e.min-1&&t<=e.max-1})},getCity:function(){return this.listsData.map(function(t,a){return t.City["zh-TW"]}).filter(function(t,a,e){return e.indexOf(t)==a})},getDistrict:function(){var e=this.filterInputData.City;if(""==e)return"";var i=[];return this.listsData.forEach(function(t,a){t.City["zh-TW"]==e&&i.push(t.District["zh-TW"])}),i.filter(function(t,a,e){return e.indexOf(t)==a})}},methods:{getAPIData:function(){axios.get("https://official-site-pro.gogoroapp.com/PartnerService/Gogoro/GetVmList?offset=0&pageSize=10000").then(function(t){a.listsData=t.data.Data,a.combineDataByPages()}).catch(function(t){alert("資料載入有誤，請稍後再試! error: "+t)})},combineDataByPages:function(){for(var t=[].concat(_toConsumableArray(this.listsData)),a=t.length%20==0?t.length/20:parseInt(t.length/20)+1,e=0;e<a;e++)this.pageData.push(t.splice(0,20)),this.pagination.push(e);this.loading=!1},movePage:function(t){"prev"==t?this.currentPage--:"next"==t?this.currentPage++:this.currentPage=parseInt(t)},showMap:function(t){this.modalLocName=t.LocName["zh-TW"];var a={lat:t.Latitude,lng:t.Longitude},e=t.Address["zh-TW"].replace(/\(.+\)/g,""),i="\n          <div>\n            <h5>"+t.LocName["zh-TW"]+"</h5>\n            <p>\n              <a href='https://www.google.com/maps/place/"+e+"' target='_blank'>\n                "+t.Address["zh-TW"]+"\n              </a>\n            </p>\n          </div>\n        ";this.googleMap.map=new google.maps.Map(document.getElementById("map"),{center:a,zoom:15}),this.googleMap.marker=new google.maps.Marker({position:a,map:this.googleMap.map,icon:"https://raw.githubusercontent.com/kakadodo/theF2EChallange/gh-pages/img/week2/battery-icon.png",animation:google.maps.Animation.DROP}),this.googleMap.infowindow=new google.maps.InfoWindow({content:i}),this.googleMap.infowindow.open(this.googleMap.map,this.googleMap.marker)},filterLists:function(){var i=this;""==this.filterInputData.LocName&&""==this.filterInputData.City&&""==this.filterInputData.District?this.filterMode=!1:this.filterMode=!0;function t(e){""!==i.filterInputData[e]&&(a=a.filter(function(t,a){return"LocName"==e?-1!==t[e]["zh-TW"].toLowerCase().indexOf(i.filterInputData[e].toLowerCase()):t[e]["zh-TW"]==i.filterInputData[e]}))}var a=JSON.parse(JSON.stringify(this.listsData));for(var e in this.filterInputData)t(e);this.filterData=a.filter(function(t,a){return!0})}},watch:{"filterInputData.LocName":function(t){this.debounce(t)},"filterInputData.City":function(t){this.filterInputData.District="",a.filterLists()}},created:function(){this.debounce=_.debounce(this.filterLists,500)},mounted:function(){this.getAPIData()}})});
//# sourceMappingURL=filter.js.map
