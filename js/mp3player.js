'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player = null;

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

var vm = null;

$(function () {
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
      volumn: 0.5
    },
    computed: {
      currentSong: function currentSong() {
        if (this.currentPlaylist.list) {
          return this.currentPlaylist.list[this.currentSongIndex];
        }
        return '';
      },
      currentSongTotalTime: function currentSongTotalTime() {
        if (this.currentPlaylist.list) {
          return this.currentPlaylist.list[this.currentSongIndex].list_duration;
        }
        return '';
      }
    },
    methods: {
      toggleList: function toggleList(e) {
        this.showList ? $(e.target).next().slideUp('fast') : $(e.target).next().slideDown('fast');
        this.showList = !this.showList;
      },
      showMenuList: function showMenuList(cataType, payload) {
        var tempArr = [];
        switch (cataType) {
          case 1:
            this.activePlaylistIndex = payload;
            this.menuList = this.playlist[payload];
            break;
          case 2:
            this.playlist.forEach(function (list) {
              tempArr = [].concat(_toConsumableArray(tempArr), _toConsumableArray(list.list));
            });
            tempArr.sort(function (a, b) {
              var aa = a['artist_name'].toLowerCase().trim();
              var bb = b['artist_name'].toLowerCase().trim();
              return aa === bb ? 0 : aa < bb ? -1 : 1;
            });
            this.menuList = {
              title: '歌手',
              list: tempArr
            };
            this.activePlaylistIndex = null;
            break;
          case 3:
            this.playlist.forEach(function (list) {
              tempArr = [].concat(_toConsumableArray(tempArr), _toConsumableArray(list.list.filter(function (l) {
                return l.favorite;
              })));
            });
            this.menuList = {
              title: '我的最愛',
              list: tempArr
            };
            this.activePlaylistIndex = null;
            break;
          default:
            break;
        }
      },
      onPlayerStateChange: function onPlayerStateChange(e) {
        if (e.data === YT.PlayerState.ENDED) {
          this.playSong(1);
        }
      },
      playSong: function playSong(step, from) {
        this.currentPlaylist = this.menuList;
        // 從播放清單選取
        if (from === 'list') {
          this.currentSongIndex = step;
          this.callPlayer();
          return;
        }
        // 隨機播放清單歌曲
        if (this.isRandom) {
          var randomIndex = this.getRandomNum(this.currentPlaylist.list.length);
          if (randomIndex === this.currentSongIndex) {
            randomIndex = this.getRandomNum(this.currentPlaylist.list.length);
          }
          this.currentSongIndex = randomIndex;
          this.callPlayer();
          return;
        }
        // 依照順序播放上下首
        var tempSong = this.currentPlaylist.list[this.currentSongIndex + step];
        if (!tempSong) {
          if (step === 1) {
            this.currentSongIndex = 0;
          } else {
            this.currentSongIndex = this.currentPlaylist.list.length - 1;
          }
        } else {
          this.currentSongIndex += step;
        }
        this.callPlayer();
      },
      callPlayer: function callPlayer() {
        // 讀取 youtube 音源
        if (this.isPlay) {
          player.loadVideoById({
            videoId: this.currentPlaylist.list[this.currentSongIndex].id
          });
          this.setSongTimer();
        } else {
          player.cueVideoById({
            videoId: this.currentPlaylist.list[this.currentSongIndex].id
          });
        }
      },
      changeSongState: function changeSongState(boolean) {
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
      getRandomNum: function getRandomNum(length) {
        return Math.floor(Math.random() * length);
      },
      setSongTimer: function setSongTimer() {
        var _this = this;

        this.songTimer = setInterval(function () {
          if (!_this.isSlide) {
            _this.currentSongTime = Math.floor(player.getCurrentTime());
          }
        }, 1000);
      },
      switchAds: function switchAds() {
        var _this2 = this;

        $('.ads').css({
          display: 'none'
        });
        if (this.activeAdIndex === this.ads.length) {
          this.activeAdIndex = 0;
        }
        $('.ads').eq(this.activeAdIndex).css({
          display: 'block'
        });
        this.activeAdIndex++;
        setTimeout(function () {
          _this2.switchAds();
        }, 5000);
      },
      setVolumn: function setVolumn() {
        player.setVolume(this.volumn * 100);
      },
      setCurrentSongTime: function setCurrentSongTime() {
        player.seekTo(this.currentSongTime, true);
      }
    },
    filters: {
      formatTime: function formatTime(val) {
        var minute = '00' + Math.floor(val / 60);
        var second = '00' + val % 60;
        return minute.substr(-2) + ':' + second.substr(-2);
      }
    },
    created: function created() {
      var _this3 = this;

      $.getJSON('../json/mp3player.json', function (res) {
        _this3.playlist = res.playlist;
        _this3.ads = res.ads;
        _this3.menuList = _this3.playlist[_this3.activePlaylistIndex];
        _this3.currentPlaylist = _this3.menuList;
      });
    },
    mounted: function mounted() {
      this.switchAds();
    }
  });
});
//# sourceMappingURL=mp3player.js.map
