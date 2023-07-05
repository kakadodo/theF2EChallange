"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}var vm=null,projectData=[{id:1,type:"project",name:"工作",children:[{id:11,type:"folder",parentId:[1],name:"老闆給的",colorTag:"red",isMarkBoxOpen:!1,children:[{id:111,type:"img",parentId:[11],name:"螢幕截圖",colorTag:"orange",isMarkBoxOpen:!1},{id:112,type:"pdf",parentId:[11],name:"後端 API 串接說明",colorTag:"purple",isMarkBoxOpen:!1},{id:113,type:"folder",parentId:[1,11],name:"巢狀資料夾",colorTag:"red",isMarkBoxOpen:!1,children:[{id:1131,type:"img",parentId:[113],name:"另一個螢幕截圖",colorTag:"orange",isMarkBoxOpen:!1},{id:1132,type:"pdf",parentId:[113],name:"另一個後端 API 串接說明",colorTag:"purple",isMarkBoxOpen:!1},{id:1567352504087,type:"folder",children:[{id:1567352520733,type:"pdf",name:"巢到爆的PDF檔",colorTag:null,parentId:1567352504087,isMarkBoxOpen:!1},{id:1567352534492,type:"img",name:"巢到爆的JPG",colorTag:null,parentId:1567352504087,isMarkBoxOpen:!1}],name:"巢到爆",colorTag:"red",parentId:[1,11,113],isMarkBoxOpen:!1}]}]},{id:12,type:"word",parentType:"project",parentId:[1],name:"工作排程表",colorTag:"",isMarkBoxOpen:!1},{id:13,type:"folder",parentType:"project",parentId:[1],name:"已完成專案",colorTag:"green",isMarkBoxOpen:!1,children:[{id:131,type:"word",parentId:[13],name:"會議記錄",colorTag:"red",isMarkBoxOpen:!1},{id:132,type:"pdf",parentId:[13],name:"作品整理",colorTag:"purple",isMarkBoxOpen:!1}]}]},{id:2,type:"project",name:"宜蘭出遊",children:[{id:22,type:"folder",parentId:[2],name:"行前準備",colorTag:"orange",isMarkBoxOpen:!1,children:[{id:222,type:"word",parentId:[22],name:"兩天行程表",colorTag:"green",isMarkBoxOpen:!1},{id:223,type:"mp4",parentId:[22],name:"狼人殺教學影片",colorTag:"purple",isMarkBoxOpen:!1},{id:224,type:"word",parentId:[22],name:"行李清單",colorTag:"green",isMarkBoxOpen:!1}]},{id:23,type:"img",parentType:"project",parentId:[2],name:"獨木舟",colorTag:"",isMarkBoxOpen:!1}]}];$(function(){vm=new Vue({el:"#app",data:{projectData:null,currentDriveTarget:null,modalTodo:{addProject:{title:"新增專案目錄",name:null},addFile:{title:"新增檔案",name:null,colorTag:null,type:null},addFolder:{title:"新增資料夾",name:null,colorTag:null}},currentModalTodo:"addProject",searchMode:{isSearch:!1,searchInput:null,searchContent:null,searchResult:null}},computed:{getCurrentDrivePath:function(){var t=this,o=void 0;if("project"===this.currentDriveTarget.type)o=this.currentDriveTarget.name;else{var a=void 0;this.currentDriveTarget.parentId.forEach(function(r,e){0===e?(a=t.getProject(r),o=a.name):(a=a.children.find(function(e){return e.id===r}),o+="/"+a.name)}),o=o+"/"+this.currentDriveTarget.name}return o}},methods:{changeCurrentDriveTarget:function(e){this.currentDriveTarget=e,this.searchMode.isSearch=!1},showColorTag:function(e){if(e)return e},showTypeIcon:function(e){switch(e){case"folder":return"fa-folder-open";case"img":return"fa-image";case"mp4":return"fa-play-circle";case"word":return"fa-file-word";case"pdf":return"fa-file-pdf";default:return}},backToParent:function(){var t=this,o=void 0;this.currentDriveTarget.parentId.forEach(function(r,e){o=0===e?t.getProject(r):o.children.find(function(e){return e.id===r})}),this.currentDriveTarget=o},toggleMarkBox:function(e){e.isMarkBoxOpen=!e.isMarkBoxOpen},setColorTag:function(e,r){r.colorTag=e,r.isMarkBoxOpen=!1},intoFolder:function(e){"folder"===e.type&&(this.currentDriveTarget=e,this.searchMode.isSearch=!1)},getProject:function(r){return this.projectData.find(function(e){return e.id===r})},showModal:function(e){switch(e){case"addProject":this.currentModalTodo="addProject";break;case"addFile":this.currentModalTodo="addFile";break;case"addFolder":this.currentModalTodo="addFolder";break;default:return}$("#modal").modal("show")},addColorTag:function(e){this.modalTodo[this.currentModalTodo].colorTag=e},addFileType:function(e){this.modalTodo[this.currentModalTodo].type=e},resetModalData:function(){var e=this.modalTodo[this.currentModalTodo];for(var r in e)"title"!==r&&(e[r]=null);$("#modal").modal("hide")},submitModalData:function(){switch(this.currentModalTodo){case"addProject":if(!this.modalTodo[this.currentModalTodo].name)return;this.projectData.push({id:(new Date).getTime(),type:"project",children:[],name:this.modalTodo[this.currentModalTodo].name});break;case"addFile":if(!this.modalTodo[this.currentModalTodo].name||!this.modalTodo[this.currentModalTodo].type)return;this.currentDriveTarget.children.push({id:(new Date).getTime(),type:this.modalTodo[this.currentModalTodo].type,name:this.modalTodo[this.currentModalTodo].name,colorTag:this.modalTodo[this.currentModalTodo].colorTag,parentId:this.currentDriveTarget.id,isMarkBoxOpen:!1});break;case"addFolder":if(!this.modalTodo[this.currentModalTodo].name)return;var e=this.currentDriveTarget.parentId?[].concat(_toConsumableArray(this.currentDriveTarget.parentId),[this.currentDriveTarget.id]):[this.currentDriveTarget.id];this.currentDriveTarget.children.push({id:(new Date).getTime(),type:"folder",children:[],name:this.modalTodo[this.currentModalTodo].name,colorTag:this.modalTodo[this.currentModalTodo].colorTag,parentId:e,isMarkBoxOpen:!1});break;default:return}this.resetModalData()},getSearchResult:function(t){var o=this,a=[];if(t)this.projectData.forEach(function(e){e.children.forEach(function(e){!function r(e){e.children||e.colorTag!==t||a.push(e),"folder"===e.type&&e.children&&(e.colorTag===t&&a.push(e),e.children.forEach(function(e){r(e)}))}(e)})}),this.searchMode.searchContent=t+" tag";else{if(!this.searchMode.searchInput)return;this.projectData.forEach(function(e){e.children.forEach(function(e){!function r(e){e.children||-1===e.name.indexOf(o.searchMode.searchInput)||a.push(e),"folder"===e.type&&e.children&&(-1!==e.name.indexOf(o.searchMode.searchInput)&&a.push(e),e.children.forEach(function(e){r(e)}))}(e)})}),this.searchMode.searchContent=this.searchMode.searchInput,this.searchMode.searchInput=""}this.searchMode.searchResult=a,this.searchMode.isSearch=!0}},created:function(){this.projectData=projectData,this.currentDriveTarget=this.projectData[0]}})});
//# sourceMappingURL=cloud-drive.js.map