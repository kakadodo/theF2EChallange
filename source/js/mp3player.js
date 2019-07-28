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
    },
    computed: {
      currentSong() {
        if (this.currentPlaylist.list) {
          return this.currentPlaylist.list[this.currentSongIndex];
        }
        return '';
      },
      currentSongTotalTime() {
        if (this.currentPlaylist.list) {
          return this.currentPlaylist.list[this.currentSongIndex].list_duration;
        }
        return '';
      },
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
        this.setVolumn();
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
      setVolumn() {
        player.setVolume(this.volumn * 100);
      },
      setCurrentSongTime() {
        player.seekTo(this.currentSongTime, true);
      }
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