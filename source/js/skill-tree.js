$(function () {
  const data = 'https://raw.githubusercontent.com/kakadodo/theF2EChallange/gh-pages/json/skill-tree.json';
  const vm = new Vue({
    el: '#app',
    data: {
      skillDatas: [],
      ranks: [{
          name: 'NOOB',
          picUrl: './img/week9/img-ship-noob@2x.png',
          sentence: 'Welcome to aboard. Your mission is: <span class="highline">Collect the resources and learn the skills to upgrade the ship.</span><br>Good luck, captain!'
        },
        {
          name: 'BEGINNER',
          picUrl: './img/week9/img-ship-beginner@2x.png',
          sentence: '<b>Congradulations!</b> You become the <span class="highline">“Front-end Beginnner”</span>. Keep searching the resources to upgrade to the next level.'
        },
        {
          name: 'DEVELOPER',
          picUrl: './img/week9/img-ship-developer@2x.png',
          sentence: '<b>You’re doing well!</b> Now you’re a <span class="highline">“Front-end Developer”</span>. It’s close to complete the upgrading program.<br>Next level: Front-end Master.'
        },
        {
          name: 'MASTER',
          picUrl: './img/week9/img-ship-master@2x.png',
          sentence: '<b>Excellent!</b> You’re a <span class="highline">“Front-end Master”</span> now. But a new galary was just detected by the system.<br>Captain, make your choice.'
        }
      ],
      currentRank: 0,
      currentBranch:{}
    },
    methods: {
      currentComplete(lists) {
        return lists == null ? 0 : lists.filter((list) => list.complete == true).length;
      },
      focusList(branch) {
        this.skillDatas.forEach((skill) => {
          skill.branch.forEach((branch) => {
            branch.active = false;
          });
        });
        branch.active = true;
        this.currentBranch = branch;
      },
      toggleListComplete(list){
        list.complete = !list.complete;
        this.checkBranchComplete();
      },
      checkBranchComplete(){
        //如果沒recommend就跳過下面檢查
        if(this.currentBranch.recommend == null) return;
        this.currentBranch.recommendComplete = this.currentBranch.recommend.every((list)=> list.complete == true);
        //如果當前的branch有完成，就檢查當前level的branch是否都完成
        return this.currentBranch.recommendComplete && this.checkLevelComplete();
      },
      checkLevelComplete(){
        let levelCompleteCount = 0;
        this.skillDatas.forEach((skill)=>{
          skill.levelComplete = skill.branch.every((branch)=> branch.recommendComplete == true);
          levelCompleteCount = skill.levelComplete == true? ++levelCompleteCount : levelCompleteCount;
        });
        this.currentRank = levelCompleteCount == 0? levelCompleteCount: levelCompleteCount-1;
      }
    },
    created() {
      $.getJSON(data, (data) => {
        this.skillDatas = data;
        //初始化為第一個branch
        this.currentBranch = this.skillDatas[0].branch[0];
      });
    }
  });
});