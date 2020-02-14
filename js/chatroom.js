"use strict";

var vm = null;
var routeMapping = {
  index: 1,
  setUserData: 2,
  roomLobby: 3,
  chatRoom: 4
};
// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA4P_r_EK-DXuXETYaSsVybrChSCI25FFs",
  authDomain: "chatroom-52faa.firebaseapp.com",
  databaseURL: "https://chatroom-52faa.firebaseio.com"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.app().database();

Vue.use(EmojiPicker);
$(function () {
  vm = new Vue({
    el: "#app",
    data: {
      currentRoute: routeMapping.index,
      inValid: false,
      isMaskOpen: false,
      isMenuOpen: false,
      maskTitle: null,
      controlTransition: {
        enter: '',
        leave: ''
      },
      userData: {
        username: null,
        userdate: null,
        usergender: null
      },
      inputStatus: {
        getUsername: true,
        getUserdate: false,
        getUsergender: false
      },
      setUsernameDialogs: [{
        target: 'robot',
        text: '歡迎你使用我們的匿名聊天室，該怎麼稱呼你呢?'
      }],
      chatRoomDialogs: {},
      roomList: [],
      newRoomData: {
        name: null,
        description: null
      },
      currentRoomData: {},
      chatData: {
        search: '',
        input: '',
        imageUrl: ''
      }
    },
    filters: {
      formatTime: function formatTime(timeStamp) {
        var hours = new Date(timeStamp).getHours().toString().padStart(2, 0);
        var minutes = new Date(timeStamp).getMinutes().toString().padStart(2, 0);
        return hours + " : " + minutes;
      }
    },
    watch: {
      currentRoute: function currentRoute(val) {
        var _this = this;

        if (val === routeMapping.chatRoom) {
          this.chatData = {
            search: '',
            input: '',
            imageUrl: ''
          };
          setTimeout(function () {
            _this.$refs.chatRoomList.scrollTo(0, _this.$refs.chatRoomList.scrollHeight + 500);
          }, 1000);
        }
      }
    },
    methods: {
      initialUserData: function initialUserData() {
        this.userData = {
          username: null,
          userdate: null,
          usergender: null
        };
        this.inputStatus = {
          getUsername: true,
          getUserdate: false,
          getUsergender: false
        };
        this.setUsernameDialogs = [{
          target: 'robot',
          text: '歡迎你使用我們的匿名聊天室，該怎麼稱呼你呢?'
        }];
      },
      validateAndGoRoute: function validateAndGoRoute(routeNum) {
        if (routeNum === routeMapping.index) {
          this.initialUserData();
        }
        this.changeTransition(routeNum);
        this.currentRoute = routeNum;
      },
      changeTransition: function changeTransition(routeNum) {
        // 跳轉前改變 transtion 動態
        if (this.currentRoute < routeNum) {
          this.controlTransition.enter = '';
          this.controlTransition.leave = 'animated slideOutLeft faster';
        } else {
          this.controlTransition.enter = 'animated slideInLeft faster';
          this.controlTransition.leave = '';
        }
      },
      submitUserData: function submitUserData(type) {
        var _this2 = this;

        switch (type) {
          case 'name':
            if (!this.userData.username) return;
            this.setUsernameDialogs.push({
              target: this.userData.username,
              text: this.userData.username
            });
            this.inputStatus.getUsername = false;
            setTimeout(function () {
              _this2.setUsernameDialogs.push({
                target: 'robot',
                text: _this2.userData.username + "\u4F60\u597D~\u4F60\u5E7E\u865F\u51FA\u751F\u5462\uFF01\u544A\u8A34\u6211\x0B\u65B9\u4FBF\u5E6B\u4F60\u914D\u5C0D\u5E74\u7D00\u76F8\u4EFF\u7684\u5C0D\u8C61\u5594~"
              });
              _this2.inputStatus.getUserdate = true;
            }, 1000);
            break;
          case 'date':
            if (!this.userData.userdate) return;
            this.setUsernameDialogs.push({
              target: this.userData.username,
              text: this.userData.userdate
            });
            this.inputStatus.getUserdate = false;
            setTimeout(function () {
              _this2.setUsernameDialogs.push({
                target: 'robot',
                text: '好吧!其實我根本不 care 你生日，即使你亂打我也沒差，因為我沒時間寫驗證。欸~那不知道是男是女呢?'
              });
              _this2.inputStatus.getUsergender = true;
            }, 1000);
            break;
          case 'gender':
            if (!this.userData.usergender) return;
            this.setUsernameDialogs.push({
              target: this.userData.username,
              text: this.userData.usergender
            });
            this.inputStatus.getUsergender = false;
            this.maskTitle = '資料確認完成';
            this.isMaskOpen = true;
            setTimeout(function () {
              _this2.currentRoute = routeMapping.roomLobby;
              _this2.isMaskOpen = false;
            }, 2000);
            break;
          default:
            return;
        }
      },
      showRoomCommentAmount: function showRoomCommentAmount(room) {
        return room.chatData ? Object.keys(room.chatData).length : 0;
      },
      toggleMenu: function toggleMenu() {
        this.newRoomData = {
          name: null
        };
        this.isMenuOpen = !this.isMenuOpen;
      },
      goChatRoom: function goChatRoom(room) {
        this.listenRoomData(room);
        this.currentRoomData.roomId = room.id;
        this.currentRoomData.name = room.name;
        this.changeTransition(routeMapping.chatRoom);
        this.currentRoute = routeMapping.chatRoom;
      },
      createNewRoom: function createNewRoom() {
        var _this3 = this;

        var isAble = true;
        for (var key in this.newRoomData) {
          if (!this.newRoomData[key]) {
            isAble = false;
            break;
          }
        }
        if (!isAble) {
          this.inValid = true;
          setTimeout(function () {
            _this3.inValid = false;
          }, 3000);
          return;
        } else {
          this.maskTitle = '創建成功';
          this.isMaskOpen = true;
          var roomData = {
            id: "room" + new Date().getTime(),
            name: this.newRoomData.name,
            description: this.newRoomData.description,
            chatData: {}
          };
          this.writeRoomsData(roomData);
          this.goChatRoom(roomData);
          setTimeout(function () {
            _this3.isMaskOpen = false;
            _this3.isMenuOpen = false;
          }, 2000);
        }
      },
      appendEmoji: function appendEmoji(emoji) {
        this.chatData.input += emoji;
      },
      addChat: function addChat(type) {
        var _this4 = this;

        switch (type) {
          case 'text':
            if (!this.chatData.input) return;
            this.writeRoomData(this.currentRoomData.roomId, {
              target: this.userData.username,
              text: this.chatData.input,
              timeStamp: new Date().getTime(),
              imageUrl: null
            });
            break;
          case 'imageUrl':
            if (!this.chatData.imageUrl) return;
            this.writeRoomData(this.currentRoomData.roomId, {
              target: this.userData.username,
              text: null,
              timeStamp: new Date().getTime(),
              imageUrl: this.chatData.imageUrl
            });
            $('#setImageModal').modal('hide');
            break;
          default:
            return;
        }
        this.chatData = {
          search: '',
          input: '',
          imageUrl: ''
        };
        setTimeout(function () {
          _this4.$refs.chatRoomList.scrollTo(0, _this4.$refs.chatRoomList.scrollHeight + 500);
        }, 0);
      },
      listenRoomsData: function listenRoomsData() {
        var _this5 = this;

        var roomRef = database.ref();
        roomRef.on('value', function (snapshot) {
          _this5.roomList = snapshot.val();
        });
      },
      writeRoomsData: function writeRoomsData(roomData) {
        database.ref(roomData.id).set({
          id: roomData.id,
          name: roomData.name,
          description: roomData.description,
          chatData: {}
        });
      },
      listenRoomData: function listenRoomData(room) {
        var _this6 = this;

        var roomRef = database.ref(room.id + "/chatData");
        roomRef.on('value', function (snapshot) {
          _this6.chatRoomDialogs = snapshot.val();
        });
      },
      writeRoomData: function writeRoomData(room, chatData) {
        database.ref(room + "/chatData").push({
          target: chatData.target,
          text: chatData.text,
          timeStamp: chatData.timeStamp,
          imageUrl: chatData.imageUrl
        });
      }
    },
    created: function created() {
      this.listenRoomsData();
    }
  });
});
//# sourceMappingURL=chatroom.js.map
