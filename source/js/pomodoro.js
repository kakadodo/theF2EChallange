$(function () {
  const playMode = {
    work: {
      name: 'work',
      time: 25,
      color: '#FF4384',
    },
    break: {
      name: 'break',
      time: 5,
      color: '#00A7FF',
    },
  };
  const vm = new Vue({
    el: '#app',
    data: {
      mode: playMode.work.name,
      isPlaying: false,
      dueTime: playMode.work.time*60*1000,
      totalTime: playMode.work.time,
      timer: null,
      todoInput: '',
      todoLists: [
        {
          id: 1,
          title: '完成第一關番茄鐘',
          finished: false,
          pomodoroCount: 2,
        },
        {
          id: 2,
          title: '日用品採買',
          finished: false,
          pomodoroCount: 0,
        },
        {
          id: 3,
          title: '整理房間',
          finished: false,
          pomodoroCount: 0,
        },
        {
          id: 4,
          title: '修理椅子',
          finished: true,
          pomodoroCount: 4,
        },
        {
          id: 5,
          title: '洗衣服',
          finished: true,
          pomodoroCount: 3,
        },
        {
          id: 6,
          title: '曬衣服',
          finished: false,
          pomodoroCount: 0,
        },
      ],
      playingPieChart: null,
      playingPieConfig: {},
      displayPieChart: null,
      isModalShow: false,
      currentDetailModal: 1,
      ringTone: {
        work: 'clown_horn',
        break: 'pastoral',
      }
    },
    computed: {
      playingList() {
        return this.todoLists.filter(list => !list.finished)[0];
      },
      queueLists() {
        return this.todoLists.filter(list => !list.finished).slice(1,4);
      },
      undoLists() {
        return this.todoLists.filter(list => !list.finished);
      },
      doneLists() {
        return this.todoLists.filter(list => list.finished);
      },
      modeBgClass() {
        switch(this.mode) {
          case 'work':
            return 'bg_work';
          case 'break':
            return 'bg_break';
          default:
            break;
        }
      },
      modeDisplayPieClass() {
        return {
          'pie_work': this.mode === playMode.work.name,
          'pie_break': this.mode === playMode.break.name,
          'pie_playing': this.isPlaying,
        };
      },
      modePlayBtnClass() {
        return {
          'work': this.mode === playMode.work.name,
          'break': this.mode === playMode.break.name,
          'playing': this.isPlaying,
        }
      },
      displayDueTime() {
        const minute = Math.floor(this.dueTime/1000/60).toString().padStart(2,0);
        const second = Math.floor((this.dueTime - minute*60*1000)/1000).toString().padStart(2,0);
        return `${minute}:${second}`;
      },
    },
    methods: {
      addTodo() {
        const str = this.todoInput.trim();
        if (!str) return;
        this.todoLists.push({
          id: Date.now(),
          title: str,
          finished: false,
          pomodoroCount: 0,
        });
        this.todoInput = '';
      },
      switchPlayingTodo(list) {
        const index = this.todoLists.findIndex(todo => todo.id === list.id);
        this.todoLists.splice(index, 1);
        this.todoLists.unshift(list);
      },
      createPlayingPie() {
        const playingPie = $('.js_playing_pie');
        this.playingPieChart = new Chart(playingPie, this.playingPieConfig);
      },
      createDisplayPie() {
        const displayPie = $('.js_display_pie');
        this.playingPieConfig = {
          type: 'pie',
          data: {
            datasets: [{
              data: [0, this.totalTime],
              borderColor: playMode[this.mode]['color'],
              backgroundColor: [playMode[this.mode]['color'], 'transparent'],
            }],
          },
        };
        this.displayPieChart = new Chart(displayPie, this.playingPieConfig);
      },
      createChartBar() {
        const chartBar = $('.js_chart_bar');
        this.chartBarConfig = {
          type: 'bar',
          data: {
            labels: ['7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7'],
            datasets: [{
              label: 'FOCUS TIME',
              data: [5, 10, 10, 6, 7, 9, 13],
              backgroundColor: [],
            }],
          },
          options: {
            legend: {
              labels: {
                fontColor: '#fff',
              }
            },
            scales: {
              yAxes: [{
                gridLines: {
                  display: false,
                  color: '#fff',
                },
                ticks: {
                  fontColor: '#fff',
                },
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  color: '#fff',
                },
                ticks: {
                  fontColor: '#fff',
                },
              }]
            },
          }
        };
        const backgroundColor = this.chartBarConfig.data.labels.map((label, i) => {
          return i == this.chartBarConfig.data.labels.length-1 ? playMode.work.color : '#fff';
        });
        this.chartBarConfig.data.datasets[0].backgroundColor = backgroundColor;
        if (this.chartBarChart) {
          this.chartBarChart.destroy();
          this.chartBarChart = null;
        }
        this.chartBarChart = new Chart(chartBar, this.chartBarConfig);
      },
      switchCountdown() {
        // 第一次執行
        if (!this.isPlaying && !this.timer) {
          // 不管怎樣都先歸零鈴聲
          $(`#js_ring_${this.ringTone[this.mode]}`)[0].pause();
          $(`#js_ring_${this.ringTone[this.mode]}`)[0].currentTime=0;
          if (this.mode === playMode.work.name) this.createPlayingPie();
          this.isPlaying = true;
          var tempCount = 0;
          this.timer = setInterval(() => {
            if (this.dueTime <= 0) {
              // 播放音效
              if (this.ringTone[this.mode] !== 'none') {
                $(`#js_ring_${this.ringTone[this.mode]}`)[0].play();
              }
              this.clearCountdown();
              if (this.mode === playMode.work.name) {
                this.todoLists[0]['pomodoroCount']++;
              }
            }
            if (this.isPlaying) {
              this.dueTime -= 1000;
              tempCount += 1;
              const data = this.playingPieConfig.data.datasets[0].data;
              if (Math.floor(tempCount/60) !== data[0]) {
                data[0] = Math.floor(tempCount/60);
                data[1] = this.totalTime - data[0];
                if (this.mode === playMode.work.name) this.playingPieChart.update();
                this.displayPieChart.update();
              }
            }
          }, 1000);
        } else if (this.isPlaying && this.timer) {
          // 暫停倒數
          this.isPlaying = false;
        } else {
          // 恢復倒數
          this.isPlaying = true;
        }
      },
      clearCountdown() {
        clearInterval(this.timer);
        this.timer = null;
        this.isPlaying = false;
        switch(this.mode) {
          case 'work':
            this.dueTime = playMode.work.time*60*1000;
            this.totalTime = playMode.work.time;
            break;
          case 'break':
            this.dueTime = playMode.break.time*60*1000;
            this.totalTime = playMode.break.time;
            break;
          default:
            break;
        }
        if (this.playingPieChart) {
          this.playingPieChart.destroy();
          this.playingPieChart = null;
        }
        if (this.displayPieChart) {
          this.displayPieChart.destroy();
          this.displayPieChart = null;
        }
        this.createDisplayPie();
      },
      switchMode() {
        switch(this.mode) {
          case 'work':
            this.mode = playMode['break']['name'];
            break;
          case 'break':
            this.mode = playMode['work']['name'];
            break;
          default:
            break;
        }
        this.clearCountdown();
      },
      showModal(num) {
        this.currentDetailModal = num;
        this.isModalShow = true;
      },
      backToPlaying() {
        this.isModalShow = false;
        if (this.mode !== playMode.work.name) {
          this.switchMode();
        }
      }
    },
    watch: {
      currentDetailModal(val) {
        if (val == 2) {
          setTimeout(() => {
            this.createChartBar();
          }, 1500);
        }
      },
    },
    mounted() {
      this.createDisplayPie();
    },
  });
});