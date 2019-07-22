/**
 * 牌號規則
 * 愛心 - 1~13
 * 梅花 - 14~26
 * 黑桃 - 27~39
 * 方塊 - 40~52
*/
const vm = new Vue({
  el: '#app',
  data: {
    gameTime: 1000*60*1,
    timer: null,
    isPlaying: false,
    showModal: true,
    panelCode: {
      options: 1,
      success: 2,
      fail: 3,
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
    returnSteps: [],
  },
  computed: {
    displayTime() {
      const minute = Math.floor(this.gameTime/1000/60).toString().padStart(2,0);
      const second = Math.floor((this.gameTime - minute*60*1000)/1000).toString().padStart(2,0);
      return `${minute}:${second}`;
    },
  },
  methods: {
    shuffle(arr) {
      for(let i = arr.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    generateRandomCards() {
      const cardArr = Array.from(new Array(52))
        .map((card, index) => index + 1);
      const shuffleCards = this.shuffle(cardArr);
      this.ignoreCardId.forEach((cardId, i) => {
        if (shuffleCards.indexOf(cardId) !== -1) {
          shuffleCards.splice(shuffleCards.indexOf(cardId), 1);
        }
      });
      for(let i = 0; i < this.deckUnorder.length; i++) {
        for(let j = 0; j < 6; j++) {
          this.deckUnorder[i].push(shuffleCards.shift());
        }
      }
    },
    findCardPattern(cardId) {
      const index = Math.ceil(cardId / 13);
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
    displayCardParttern(cardId, deckIndex) {
      let cardNumber = cardId % 13;
      if (cardNumber === 0) cardNumber = 13;
      const cardPattern = this.findCardPattern(cardId);
      return `./img/2nd-week2/${cardPattern}-${cardNumber}.png`;
    },
    ondragStart(cardId, deckIndex, deckName) {
      // 清空上一回的 drop 內容
      this.ondropDeckName = null;
      this.ondropDeckIndex = null;
      this.ondragCardId = cardId;
      this.ondragDeckIndex = deckIndex;
      this.ondragDeckName = deckName;
      // console.log('ondragStart');
    },
    ondragEnter(e, deckIndex, deckName) {
      e.preventDefault();
      this.ondropDeckName = deckName;
      this.ondropDeckIndex = deckIndex;
      // console.log(this.ondropDeckName, this.ondropDeckIndex);
      // console.log('ondragEnter');
    },
    ondragEnd(e, cardId, deckIndex) {
      e.preventDefault();
      // 狀況一: unorder 移動到 holder
      if (this.ondropDeckName === 'deckHolder') {
        if (this.deckHolder[this.ondropDeckIndex] !== 0) return;
        this.deckHolder.splice(this.ondropDeckIndex, 1, this.ondragCardId);
        this.deckUnorder[this.ondragDeckIndex].pop();
      }
      // 狀況二: unorder 或 holder 移動到 done
      else if (this.ondropDeckName === 'deckDone') {
        const doneDeck = this.deckDone[this.ondropDeckIndex];
        const lastDoneDeckCardId = doneDeck[doneDeck.length - 1];
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
        const dropUnorderDeck = this.deckUnorder[this.ondropDeckIndex];
        const lastUnorderDeckCardId = dropUnorderDeck[dropUnorderDeck.length - 1];
        const dragUnorderDeck = this.deckUnorder[this.ondragDeckIndex];
        // 比對大小及顏色
        const dragCardColorIndex = Math.ceil(this.ondragCardId / 13);
        const unorderDeckCardColorIndex = Math.ceil(lastUnorderDeckCardId / 13);
        const numberCompare = (this.ondragCardId % 13) === (lastUnorderDeckCardId % 13) - 1 || (this.ondragCardId % 13) === (lastUnorderDeckCardId % 13) + 12;
        if ( (dragCardColorIndex + unorderDeckCardColorIndex !== 5)
          && dragCardColorIndex !== unorderDeckCardColorIndex
          && numberCompare ) {
          dropUnorderDeck.push(this.ondragCardId);
          dragUnorderDeck.pop();
        }
      }
      this.returnSteps.push({
        ondragCardId: this.ondragCardId,
        ondragDeckName: this.ondragDeckName,
        ondragDeckIndex: this.ondragDeckIndex,
        ondropDeckName: this.ondropDeckName,
        ondropDeckIndex: this.ondropDeckIndex,
      });
    },
    startGame() {
      this.switchPanel({
        isPlaying: true,
        showModal: false,
      });
      this.countTime();
    },
    pauseGame() {
      this.switchPanel({
        isPlaying: false,
        showModal: true,
        currentPanel: this.panelCode.options,
      });
    },
    continueGame() {
      this.switchPanel({
        isPlaying: true,
        showModal: false,
      });
    },
    restartGame() {
      this.resetAllData();
      setTimeout(() => {
        this.generateRandomCards();
      }, 400);
      this.countTime();
      this.showModal = false;
      this.isPlaying = true;
    },
    resetAllData() {
      this.gameTime = 1000*60*30;
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
    returnGameSteps() {
      if (this.returnSteps.length === 0) {
        alert('No more step return.');
      } else {
        const lastStep = this.returnSteps.pop();
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
    countTime() {
      this.timer = setInterval(() => {
        if (this.gameTime <= 0) {
          this.switchPanel({
            isPlaying: false,
            showModal: true,
            currentPanel: this.panelCode.fail
          });
          clearInterval(this.timer);
          return;
        }
        if (this.isPlaying) {
          this.gameTime -= 1000;
        }
      }, 1000);
    },
    switchPanel(config) {
      this.currentPanel = config.currentPanel || 0;
      this.isPlaying = config.isPlaying;
      this.showModal = config.showModal;
    },
    aniCardEnter(el) {
      const delay = el.dataset.index * 100;
      el.style.animationDelay = `${delay/1000}s`;
      el.classList.add('animated', 'fadeInUp');
      function handleAnimationEnd() {
        el.classList.remove('animated', 'fadeInUp');
        el.removeEventListener('animationend', handleAnimationEnd);
      }
      el.addEventListener('animationend', handleAnimationEnd);
    },
  },
  created() {
    // 產生隨機 unorder 牌組
    this.generateRandomCards();
  }
});