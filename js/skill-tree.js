"use strict";$(function(){new Vue({el:"#app",data:{skillDatas:[],ranks:[{name:"NOOB",picUrl:"./img/week9/img-ship-noob@2x.png",sentence:'Welcome to aboard. Your mission is: <span class="highline">Collect the resources and learn the skills to upgrade the ship.</span><br>Good luck, captain!'},{name:"BEGINNER",picUrl:"./img/week9/img-ship-beginner@2x.png",sentence:'<b>Congradulations!</b> You become the <span class="highline">“Front-end Beginnner”</span>. Keep searching the resources to upgrade to the next level.'},{name:"DEVELOPER",picUrl:"./img/week9/img-ship-developer@2x.png",sentence:'<b>You’re doing well!</b> Now you’re a <span class="highline">“Front-end Developer”</span>. It’s close to complete the upgrading program.<br>Next level: Front-end Master.'},{name:"MASTER",picUrl:"./img/week9/img-ship-master@2x.png",sentence:'<b>Excellent!</b> You’re a <span class="highline">“Front-end Master”</span> now. But a new galary was just detected by the system.<br>Captain, make your choice.'}],currentRank:0,currentBranch:{}},methods:{currentComplete:function(e){return null==e?0:e.filter(function(e){return 1==e.complete}).length},focusList:function(e){this.skillDatas.forEach(function(e){e.branch.forEach(function(e){e.active=!1})}),e.active=!0,this.currentBranch=e},toggleListComplete:function(e){e.complete=!e.complete,this.checkBranchComplete()},checkBranchComplete:function(){if(null!=this.currentBranch.recommend)return this.currentBranch.recommendComplete=this.currentBranch.recommend.every(function(e){return 1==e.complete}),this.currentBranch.recommendComplete&&this.checkLevelComplete()},checkLevelComplete:function(){var n=0;this.skillDatas.forEach(function(e){e.levelComplete=e.branch.every(function(e){return 1==e.recommendComplete}),n=1==e.levelComplete?++n:n}),this.currentRank=0==n?n:n-1}},created:function(){var n=this;$.getJSON("https://raw.githubusercontent.com/kakadodo/theF2EChallange/gh-pages/json/skill-tree.json",function(e){n.skillDatas=e,n.currentBranch=n.skillDatas[0].branch[0]})}})});
//# sourceMappingURL=skill-tree.js.map