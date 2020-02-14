"use strict";var vm=null,routeMapping={index:1,setUserData:2,roomLobby:3,chatRoom:4},firebaseConfig={apiKey:"AIzaSyA4P_r_EK-DXuXETYaSsVybrChSCI25FFs",authDomain:"chatroom-52faa.firebaseapp.com",databaseURL:"https://chatroom-52faa.firebaseio.com"};firebase.initializeApp(firebaseConfig);var database=firebase.app().database();Vue.use(EmojiPicker),$(function(){vm=new Vue({el:"#app",data:{currentRoute:routeMapping.index,inValid:!1,isMaskOpen:!1,isMenuOpen:!1,maskTitle:null,controlTransition:{enter:"",leave:""},userData:{username:null,userdate:null,usergender:null},inputStatus:{getUsername:!0,getUserdate:!1,getUsergender:!1},setUsernameDialogs:[{target:"robot",text:"歡迎你使用我們的匿名聊天室，該怎麼稱呼你呢?"}],chatRoomDialogs:{},roomList:[],newRoomData:{name:null,description:null},currentRoomData:{},chatData:{search:"",input:"",imageUrl:""}},filters:{formatTime:function(t){return new Date(t).getHours().toString().padStart(2,0)+" : "+new Date(t).getMinutes().toString().padStart(2,0)}},watch:{currentRoute:function(t){var e=this;t===routeMapping.chatRoom&&(this.chatData={search:"",input:"",imageUrl:""},setTimeout(function(){e.$refs.chatRoomList.scrollTo(0,e.$refs.chatRoomList.scrollHeight+500)},1e3))}},methods:{initialUserData:function(){this.userData={username:null,userdate:null,usergender:null},this.inputStatus={getUsername:!0,getUserdate:!1,getUsergender:!1},this.setUsernameDialogs=[{target:"robot",text:"歡迎你使用我們的匿名聊天室，該怎麼稱呼你呢?"}]},validateAndGoRoute:function(t){t===routeMapping.index&&this.initialUserData(),this.changeTransition(t),this.currentRoute=t},changeTransition:function(t){this.currentRoute<t?(this.controlTransition.enter="",this.controlTransition.leave="animated slideOutLeft faster"):(this.controlTransition.enter="animated slideInLeft faster",this.controlTransition.leave="")},submitUserData:function(t){var e=this;switch(t){case"name":if(!this.userData.username)return;this.setUsernameDialogs.push({target:this.userData.username,text:this.userData.username}),this.inputStatus.getUsername=!1,setTimeout(function(){e.setUsernameDialogs.push({target:"robot",text:e.userData.username+"你好~你幾號出生呢！告訴我\v方便幫你配對年紀相仿的對象喔~"}),e.inputStatus.getUserdate=!0},1e3);break;case"date":if(!this.userData.userdate)return;this.setUsernameDialogs.push({target:this.userData.username,text:this.userData.userdate}),this.inputStatus.getUserdate=!1,setTimeout(function(){e.setUsernameDialogs.push({target:"robot",text:"好吧!其實我根本不 care 你生日，即使你亂打我也沒差，因為我沒時間寫驗證。欸~那不知道是男是女呢?"}),e.inputStatus.getUsergender=!0},1e3);break;case"gender":if(!this.userData.usergender)return;this.setUsernameDialogs.push({target:this.userData.username,text:this.userData.usergender}),this.inputStatus.getUsergender=!1,this.maskTitle="資料確認完成",this.isMaskOpen=!0,setTimeout(function(){e.currentRoute=routeMapping.roomLobby,e.isMaskOpen=!1},2e3);break;default:return}},showRoomCommentAmount:function(t){return t.chatData?Object.keys(t.chatData).length:0},toggleMenu:function(){this.newRoomData={name:null},this.isMenuOpen=!this.isMenuOpen},goChatRoom:function(t){this.listenRoomData(t),this.currentRoomData.roomId=t.id,this.currentRoomData.name=t.name,this.changeTransition(routeMapping.chatRoom),this.currentRoute=routeMapping.chatRoom},createNewRoom:function(){var t=this,e=!0;for(var a in this.newRoomData)if(!this.newRoomData[a]){e=!1;break}if(!e)return this.inValid=!0,void setTimeout(function(){t.inValid=!1},3e3);this.maskTitle="創建成功",this.isMaskOpen=!0;var i={id:"room"+(new Date).getTime(),name:this.newRoomData.name,description:this.newRoomData.description,chatData:{}};this.writeRoomsData(i),this.goChatRoom(i),setTimeout(function(){t.isMaskOpen=!1,t.isMenuOpen=!1},2e3)},appendEmoji:function(t){this.chatData.input+=t},addChat:function(t){var e=this;switch(t){case"text":if(!this.chatData.input)return;this.writeRoomData(this.currentRoomData.roomId,{target:this.userData.username,text:this.chatData.input,timeStamp:(new Date).getTime(),imageUrl:null});break;case"imageUrl":if(!this.chatData.imageUrl)return;this.writeRoomData(this.currentRoomData.roomId,{target:this.userData.username,text:null,timeStamp:(new Date).getTime(),imageUrl:this.chatData.imageUrl}),$("#setImageModal").modal("hide");break;default:return}this.chatData={search:"",input:"",imageUrl:""},setTimeout(function(){e.$refs.chatRoomList.scrollTo(0,e.$refs.chatRoomList.scrollHeight+500)},0)},listenRoomsData:function(){var e=this;database.ref().on("value",function(t){e.roomList=t.val()})},writeRoomsData:function(t){database.ref(t.id).set({id:t.id,name:t.name,description:t.description,chatData:{}})},listenRoomData:function(t){var e=this;database.ref(t.id+"/chatData").on("value",function(t){e.chatRoomDialogs=t.val()})},writeRoomData:function(t,e){database.ref(t+"/chatData").push({target:e.target,text:e.text,timeStamp:e.timeStamp,imageUrl:e.imageUrl})}},created:function(){this.listenRoomsData()}})});
//# sourceMappingURL=chatroom.js.map
