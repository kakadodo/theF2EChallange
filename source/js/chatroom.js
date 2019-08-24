let vm = null;
const routeMapping = {
  index: 1,
  setUserData: 2,
  roomLobby: 3,
  chatRoom: 4,
};
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4P_r_EK-DXuXETYaSsVybrChSCI25FFs",
  authDomain: "chatroom-52faa.firebaseapp.com",
  databaseURL: "https://chatroom-52faa.firebaseio.com",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.app().database();

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
        usergender: null,
      },
      inputStatus: {
        getUsername: true,
        getUserdate: false,
        getUsergender: false,
      },
      setUsernameDialogs: [
        {
          target: 'robot',
          text: '歡迎你使用我們的匿名聊天室，該怎麼稱呼你呢?'
        }
      ],
      chatRoomDialogs: {},
      roomList: [],
      newRoomData: {
        name: null,
        description: null,
      },
      currentRoomData: {},
      chatData: {
        search: '',
        input: '',
        imageUrl: '',
      },
    },
    filters: {
      formatTime(timeStamp) {
        const hours = new Date(timeStamp).getHours().toString().padStart(2, 0);
        const minutes = new Date(timeStamp).getMinutes().toString().padStart(2, 0);
        return `${hours} : ${minutes}`;
      },
    },
    watch: {
      currentRoute(val) {
        if (val === routeMapping.chatRoom) {
          this.chatData = {
            search: '',
            input: '',
            imageUrl: '',
          };
          setTimeout(() => {
            this.$refs.chatRoomList.scrollTo(0, this.$refs.chatRoomList.scrollHeight + 500);
          }, 1000);
        }
      }
    },
    methods: {
      initialUserData() {
        this.userData = {
          username: null,
          userdate: null,
          usergender: null,
        };
        this.inputStatus = {
          getUsername: true,
          getUserdate: false,
          getUsergender: false,
        };
        this.setUsernameDialogs = [
          {
            target: 'robot',
            text: '歡迎你使用我們的匿名聊天室，該怎麼稱呼你呢?'
          }
        ];
      },
      validateAndGoRoute(routeNum) {
        if (routeNum === routeMapping.index) {
          this.initialUserData();
        }
        this.changeTransition(routeNum);
        this.currentRoute = routeNum;
      },
      changeTransition(routeNum) {
        // 跳轉前改變 transtion 動態
        if (this.currentRoute < routeNum) {
          this.controlTransition.enter = '';
          this.controlTransition.leave = 'animated slideOutLeft faster';
        } else {
          this.controlTransition.enter = 'animated slideInLeft faster';
          this.controlTransition.leave = '';
        }
      },
      submitUserData(type) {
        switch (type) {
          case 'name':
            if (!this.userData.username) return;
            this.setUsernameDialogs.push({
              target: this.userData.username,
              text: this.userData.username
            });
            this.inputStatus.getUsername = false;
            setTimeout(() => {
              this.setUsernameDialogs.push({
                target: 'robot',
                text: `${this.userData.username}你好~你幾號出生呢！告訴我方便幫你配對年紀相仿的對象喔~`
              });
              this.inputStatus.getUserdate = true;
            }, 1000);
            break;
          case 'date':
            if (!this.userData.userdate) return;
            this.setUsernameDialogs.push({
              target: this.userData.username,
              text: this.userData.userdate
            });
            this.inputStatus.getUserdate = false;
            setTimeout(() => {
              this.setUsernameDialogs.push({
                target: 'robot',
                text: '好吧!其實我根本不 care 你生日，即使你亂打我也沒差，因為我沒時間寫驗證。欸~那不知道是男是女呢?'
              });
              this.inputStatus.getUsergender = true;
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
            setTimeout(() => {
              this.currentRoute = routeMapping.roomLobby;
              this.isMaskOpen = false;
            }, 2000);
            break;
          default: return;
        }
      },
      showRoomCommentAmount(room) {
        return room.chatData ? Object.keys(room.chatData).length : 0;
      },
      toggleMenu() {
        this.newRoomData = {
          name: null,
        };
        this.isMenuOpen = !this.isMenuOpen;
      },
      goChatRoom(room) {
        this.listenRoomData(room);
        this.currentRoomData.roomId = room.id;
        this.currentRoomData.name = room.name;
        this.changeTransition(routeMapping.chatRoom);
        this.currentRoute = routeMapping.chatRoom;
      },
      createNewRoom() {
        let isAble = true;
        for (let key in this.newRoomData) {
          if (!this.newRoomData[key]) {
            isAble = false;
            break;
          }
        }
        if (!isAble) {
          this.inValid = true;
          setTimeout(() => {
            this.inValid = false;
          }, 3000);
          return;
        } else {
          this.maskTitle = '創建成功';
          this.isMaskOpen = true;
          const roomData = {
            id: `room${new Date().getTime()}`,
            name: this.newRoomData.name,
            description: this.newRoomData.description,
            chatData: {},
          };
          this.writeRoomsData(roomData);
          this.goChatRoom(roomData);
          setTimeout(() => {
            this.isMaskOpen = false;
            this.isMenuOpen = false;
          }, 2000);
        }
      },
      appendEmoji(emoji) {
        this.chatData.input += emoji;
      },
      addChat(type) {
        switch (type) {
          case 'text':
            if (!this.chatData.input) return;
            this.writeRoomData(this.currentRoomData.roomId, {
              target: this.userData.username,
              text: this.chatData.input,
              timeStamp: new Date().getTime(),
              imageUrl: null,
            });
            break;
          case 'imageUrl':
            if (!this.chatData.imageUrl) return;
            this.writeRoomData(this.currentRoomData.roomId, {
              target: this.userData.username,
              text: null,
              timeStamp: new Date().getTime(),
              imageUrl: this.chatData.imageUrl,
            });
            $('#setImageModal').modal('hide');
            break;
          default: return;
        }
        this.chatData = {
          search: '',
          input: '',
          imageUrl: '',
        };
        setTimeout(() => {
          this.$refs.chatRoomList.scrollTo(0, this.$refs.chatRoomList.scrollHeight + 500);
        }, 0);
      },
      listenRoomsData() {
        const roomRef = database.ref();
        roomRef.on('value', (snapshot) => {
          this.roomList = snapshot.val();
        });
      },
      writeRoomsData(roomData) {
        database.ref(roomData.id).set({
          id: roomData.id,
          name: roomData.name,
          description: roomData.description,
          chatData: {},
        });
      },
      listenRoomData(room) {
        const roomRef = database.ref(`${room.id}/chatData`);
        roomRef.on('value', (snapshot) => {
          this.chatRoomDialogs = snapshot.val();
        });
      },
      writeRoomData(room, chatData) {
        database.ref(`${room}/chatData`).push({
          target: chatData.target,
          text: chatData.text,
          timeStamp: chatData.timeStamp,
          imageUrl: chatData.imageUrl,
        });
      }
    },
    created() {
      this.listenRoomsData();
    }
  });
});
