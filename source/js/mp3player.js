const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player = null;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('js_player', {
    height: '0',
    width: '0',
    videoId: 'lzkKzZmRZk8',
    events: {
      'onStateChange': vm.onPlayerStateChange
    }
  });
}

let vm = null;

$(function() {
  vm = new Vue({
    el: '#app',
    data: {
      slideMenu: true,
      showList: true,
      playlist: [],
      ads: [],
      activePlaylistIndex: 0,
      activeAdIndex: 0,
      menuList: {},
      currentPlaylist: {},
      currentSongIndex: 0,
      currentSongTime: 0,
      songTimer: null,
      isRandom: false,
      isPlay: false,
      volumn: 0.5,
      isSlide: false,
      pos: {
        originX: 0,
        moveX: 0,
        innerWidth: 0,
        outerWidth: 0,
      }
    },
    computed: {
      currentSong() {
        if (this.currentPlaylist.list) {
          return this.currentPlaylist.list[this.currentSongIndex];
        }
        return '';
      },
      displayTimeBar() {
        if (this.currentPlaylist.list) {
          const currentSongTotalTime = this.currentPlaylist.list[this.currentSongIndex].list_duration;
          const percent = this.currentSongTime / currentSongTotalTime * 100;
          return {
            width: percent + '%',
          }
        }
        return '';
      },
      displayVolBar() {
        const percent = this.volumn / 1 * 100;
        return {
          width: percent + '%',
        }
      }
    },
    methods: {
      toggleList(e) {
        this.showList ? $(e.target).next().slideUp('fast')
          : $(e.target).next().slideDown('fast');
        this.showList = !this.showList;
      },
      showMenuList(cataType, payload) {
        let tempArr = [];
        switch(cataType) {
          case 1:
            this.activePlaylistIndex = payload;
            this.menuList = this.playlist[payload];
            break;
          case 2:
            this.playlist.forEach(list => {
              tempArr = [...tempArr, ...list.list];
            });
            tempArr.sort((a,b) => {
              const aa = a['artist_name'].toLowerCase().trim();
              const bb = b['artist_name'].toLowerCase().trim();
              return aa === bb ? 0 : aa < bb ? -1 : 1;
            });
            this.menuList = {
              title: '歌手',
              list: tempArr,
            };
            this.activePlaylistIndex = null;
            break;
          case 3:
            this.playlist.forEach(list => {
              tempArr = [...tempArr, ...list.list.filter(l => l.favorite)];
            });
            this.menuList = {
              title: '我的最愛',
              list: tempArr,
            };
            this.activePlaylistIndex = null;
            break;
          default:
            break;
        }
      },
      onPlayerStateChange(e) {
        if (e.data === YT.PlayerState.ENDED) {
          this.playSong(1);
        }
      },
      playSong(step, from) {
        this.currentPlaylist = this.menuList;
        // 從播放清單選取
        if (from === 'list') {
          this.currentSongIndex = step;
          this.callPlayer();
          return;
        }
        // 隨機播放清單歌曲
        if (this.isRandom) {
          let randomIndex = this.getRandomNum(this.currentPlaylist.list.length);
          if (randomIndex === this.currentSongIndex) {
            randomIndex = this.getRandomNum(this.currentPlaylist.list.length);
          }
          this.currentSongIndex = randomIndex;
          this.callPlayer();
          return;
        }
        // 依照順序播放上下首
        const tempSong = this.currentPlaylist.list[this.currentSongIndex + step];
        if (!tempSong) {
          if (step === 1) {
            this.currentSongIndex = 0;
          } else {
            this.currentSongIndex = this.currentPlaylist.list.length-1;
          }
        } else {
          this.currentSongIndex += step;
        }
        this.callPlayer();
      },
      callPlayer() {
        // 讀取 youtube 音源
        if (this.isPlay) {
          player.loadVideoById({
            videoId: this.currentPlaylist.list[this.currentSongIndex].id,
          });
          this.setSongTimer();
        } else {
          player.cueVideoById({
            videoId: this.currentPlaylist.list[this.currentSongIndex].id,
          });
        }
      },
      changeSongState(boolean) {
        this.isPlay = boolean;
        player.setVolume(this.volumn*100);
        if (this.isPlay) {
          player.playVideo();
          this.setSongTimer();
        } else {
          player.pauseVideo();
          clearInterval(this.songTimer);
        }
      },
      getRandomNum(length) {
        return Math.floor(Math.random() * length);
      },
      setSongTimer() {
        this.songTimer = setInterval(() => {
          if (!this.isSlide) {
            this.currentSongTime = Math.floor(player.getCurrentTime());
          }
        }, 1000);
      },
      switchAds() {
        $('.ads').css({
          display: 'none',
        });
        if (this.activeAdIndex === this.ads.length){
          this.activeAdIndex = 0;
        }
        $('.ads').eq(this.activeAdIndex).css({
          display: 'block',
        })
        this.activeAdIndex++;
        setTimeout(() => {
          this.switchAds();
        }, 5000);
      },
      onmouseDown(e) {
        this.isSlide = true;
        this.pos.originX = e.x;
        this.pos.innerWidth = $(e.target).parent().width();
        this.pos.outerWidth = $(e.target).parent().parent().width();
      },
      onmouseMove(e) {
        if (this.isSlide) {
          this.pos.moveX = e.x;
          const distance = this.pos.moveX - this.pos.originX;
          let totalWidth = this.pos.innerWidth + distance;
          if (totalWidth >= this.pos.outerWidth) {
            totalWidth = this.pos.outerWidth;
          } else if (totalWidth < 0) {
            totalWidth = 0;
          }
          $(e.target).parent().width(totalWidth);
        }
      },
      onmouseUp(e, type) {
        this.isSlide = false;
        this.pos.innerWidth = $(e.target).parent().width();
        const percent = (this.pos.innerWidth / this.pos.outerWidth).toFixed(1);
        if (type === 'vol') {
          this.volumn = +percent;
          player.setVolume(this.volumn*100);
        } else if (type === 'time') {
          this.currentSongTime = Math.floor(this.currentPlaylist.list[this.currentSongIndex].list_duration * percent);
          player.seekTo(this.currentSongTime, true);
        }
      },
    },
    filters: {
      formatTime(val) {
        const minute = '00' + Math.floor(val/60);
        const second = '00' + (val%60);
        return `${minute.substr(-2)}:${second.substr(-2)}`;
      },
    },
    created() {
      $.getJSON('../json/mp3player.json', (res) => {
        this.playlist = res.playlist;
        this.ads = res.ads;
        this.menuList = this.playlist[this.activePlaylistIndex];
        this.currentPlaylist = this.menuList;
      });
    },
    mounted() {
      this.switchAds();
    },
  });
});