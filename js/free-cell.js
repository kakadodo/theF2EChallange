'use strict';

/**
 * 牌號規則
 * 愛心 - 1~13
 * 梅花 - 14~26
 * 黑桃 - 27~39
 * 方塊 - 40~52
*/
var vm = new Vue({
  el: '#app',
  data: {
    gameTime: 1000 * 60 * 1,
    timer: null,
    isPlaying: false,
    showModal: true,
    panelCode: {
      options: 1,
      success: 2,
      fail: 3
    },
    currentPanel: 0,
    deckHolder: [0, 0, 0, 0],
    deckDone: [[1], [14], [27], [40]],
    deckUnorder: [[], [], [], [], [], [], [], []],
    ignoreCardId: [1, 14, 27, 40],
    ondragCardId: null,
    ondragDeckName: null,
    ondragDeckIndex: null,
    ondropDeckName: null,
    ondropDeckIndex: null,
    returnSteps: []
  },
  computed: {
    displayTime: function displayTime() {
      var minute = Math.floor(this.gameTime / 1000 / 60).toString().padStart(2, 0);
      var second = Math.floor((this.gameTime - minute * 60 * 1000) / 1000).toString().padStart(2, 0);
      return minute + ':' + second;
    }
  },
  methods: {
    shuffle: function shuffle(arr) {
      for (var i = arr.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var _ref = [arr[j], arr[i]];
        arr[i] = _ref[0];
        arr[j] = _ref[1];
      }
      return arr;
    },
    generateRandomCards: function generateRandomCards() {
      var cardArr = Array.from(new Array(52)).map(function (card, index) {
        return index + 1;
      });
      var shuffleCards = this.shuffle(cardArr);
      this.ignoreCardId.forEach(function (cardId, i) {
        if (shuffleCards.indexOf(cardId) !== -1) {
          shuffleCards.splice(shuffleCards.indexOf(cardId), 1);
        }
      });
      for (var i = 0; i < this.deckUnorder.length; i++) {
        for (var j = 0; j < 6; j++) {
          this.deckUnorder[i].push(shuffleCards.shift());
        }
      }
    },
    findCardPattern: function findCardPattern(cardId) {
      var index = Math.ceil(cardId / 13);
      switch (index) {
        case 1:
          return 'heart';
        case 2:
          return 'club';
        case 3:
          return 'spade';
        case 4:
          return 'diamond';
        default:
          return;
      }
    },
    displayCardParttern: function displayCardParttern(cardId, deckIndex) {
      var cardNumber = cardId % 13;
      if (cardNumber === 0) cardNumber = 13;
      var cardPattern = this.findCardPattern(cardId);
      return './img/2nd-week2/' + cardPattern + '-' + cardNumber + '.png';
    },
    ondragStart: function ondragStart(cardId, deckIndex, deckName) {
      // 清空上一回的 drop 內容
      this.ondropDeckName = null;
      this.ondropDeckIndex = null;
      this.ondragCardId = cardId;
      this.ondragDeckIndex = deckIndex;
      this.ondragDeckName = deckName;
      // console.log('ondragStart');
    },
    ondragEnter: function ondragEnter(e, deckIndex, deckName) {
      e.preventDefault();
      this.ondropDeckName = deckName;
      this.ondropDeckIndex = deckIndex;
      // console.log(this.ondropDeckName, this.ondropDeckIndex);
      // console.log('ondragEnter');
    },
    ondragEnd: function ondragEnd(e, cardId, deckIndex) {
      e.preventDefault();
      // 狀況一: unorder 移動到 holder
      if (this.ondropDeckName === 'deckHolder') {
        if (this.deckHolder[this.ondropDeckIndex] !== 0) return;
        this.deckHolder.splice(this.ondropDeckIndex, 1, this.ondragCardId);
        this.deckUnorder[this.ondragDeckIndex].pop();
      }
      // 狀況二: unorder 或 holder 移動到 done
      else if (this.ondropDeckName === 'deckDone') {
          var doneDeck = this.deckDone[this.ondropDeckIndex];
          var lastDoneDeckCardId = doneDeck[doneDeck.length - 1];
          if (this.ondragCardId !== lastDoneDeckCardId + 1) return;
          doneDeck.push(this.ondragCardId);
          if (this.ondragDeckName === 'deckHolder') {
            this[this.ondragDeckName].pop();
          } else {
            this[this.ondragDeckName][this.ondragDeckIndex].pop();
          }
        }
        // 狀況三: unorder 移動到 unorder
        else if (this.ondropDeckName === 'deckUnorder') {
            var dropUnorderDeck = this.deckUnorder[this.ondropDeckIndex];
            var lastUnorderDeckCardId = dropUnorderDeck[dropUnorderDeck.length - 1];
            var dragUnorderDeck = this.deckUnorder[this.ondragDeckIndex];
            // 比對大小及顏色
            var dragCardColorIndex = Math.ceil(this.ondragCardId / 13);
            var unorderDeckCardColorIndex = Math.ceil(lastUnorderDeckCardId / 13);
            var numberCompare = this.ondragCardId % 13 === lastUnorderDeckCardId % 13 - 1 || this.ondragCardId % 13 === lastUnorderDeckCardId % 13 + 12;
            if (dragCardColorIndex + unorderDeckCardColorIndex !== 5 && dragCardColorIndex !== unorderDeckCardColorIndex && numberCompare) {
              dropUnorderDeck.push(this.ondragCardId);
              dragUnorderDeck.pop();
            }
          }
      this.returnSteps.push({
        ondragCardId: this.ondragCardId,
        ondragDeckName: this.ondragDeckName,
        ondragDeckIndex: this.ondragDeckIndex,
        ondropDeckName: this.ondropDeckName,
        ondropDeckIndex: this.ondropDeckIndex
      });
    },
    startGame: function startGame() {
      this.switchPanel({
        isPlaying: true,
        showModal: false
      });
      this.countTime();
    },
    pauseGame: function pauseGame() {
      this.switchPanel({
        isPlaying: false,
        showModal: true,
        currentPanel: this.panelCode.options
      });
    },
    continueGame: function continueGame() {
      this.switchPanel({
        isPlaying: true,
        showModal: false
      });
    },
    restartGame: function restartGame() {
      var _this = this;

      this.resetAllData();
      setTimeout(function () {
        _this.generateRandomCards();
      }, 400);
      this.countTime();
      this.showModal = false;
      this.isPlaying = true;
    },
    resetAllData: function resetAllData() {
      this.gameTime = 1000 * 60 * 30;
      this.deckHolder = [0, 0, 0, 0];
      this.deckDone = [[1], [14], [27], [40]];
      this.deckUnorder = [[], [], [], [], [], [], [], []];
      this.ondragCardId = null;
      this.ondragDeckIndex = null;
      this.ondropDeckName = null;
      this.ondropDeckIndex = null;
      this.returnSteps = [];
      clearInterval(this.timer);
      this.timer = null;
    },
    returnGameSteps: function returnGameSteps() {
      if (this.returnSteps.length === 0) {
        alert('No more step return.');
      } else {
        var lastStep = this.returnSteps.pop();
        if (lastStep.ondragDeckName === 'deckHolder') {
          this[lastStep.ondragDeckName].splice(lastStep.ondragDeckIndex, 1, lastStep[ondragCardId]);
        } else {
          this[lastStep.ondragDeckName][lastStep.ondragDeckIndex].push(lastStep.ondragCardId);
        }
        if (lastStep.ondropDeckName === 'deckHolder') {
          this[lastStep.ondropDeckName].splice(lastStep.ondropDeckIndex, 1, 0);
        } else {
          this[lastStep.ondropDeckName][lastStep.ondropDeckIndex].pop();
        }
      }
    },
    countTime: function countTime() {
      var _this2 = this;

      this.timer = setInterval(function () {
        if (_this2.gameTime <= 0) {
          _this2.switchPanel({
            isPlaying: false,
            showModal: true,
            currentPanel: _this2.panelCode.fail
          });
          clearInterval(_this2.timer);
          return;
        }
        if (_this2.isPlaying) {
          _this2.gameTime -= 1000;
        }
      }, 1000);
    },
    switchPanel: function switchPanel(config) {
      this.currentPanel = config.currentPanel || 0;
      this.isPlaying = config.isPlaying;
      this.showModal = config.showModal;
    },
    aniCardEnter: function aniCardEnter(el) {
      var delay = el.dataset.index * 100;
      el.style.animationDelay = delay / 1000 + 's';
      el.classList.add('animated', 'fadeInUp');
      function handleAnimationEnd() {
        el.classList.remove('animated', 'fadeInUp');
        el.removeEventListener('animationend', handleAnimationEnd);
      }
      el.addEventListener('animationend', handleAnimationEnd);
    }
  },
  created: function created() {
    // 產生隨機 unorder 牌組
    this.generateRandomCards();
  }
});
//# sourceMappingURL=free-cell.js.map
