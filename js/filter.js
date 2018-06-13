'use strict';

$(function () {
  //render map
  // $('#googleMapModal').on('show.bs.modal', function (e) {
  //   new google.maps.Map(document.getElementById('map'), {
  //     center: {lat: -34.397, lng: 150.644},
  //     zoom: 8
  //   });
  // });

  var API = 'https://wapi.gogoro.com/tw/api/vm/list';

  var vm = new Vue({
    el: '#app',
    data: {
      loading: true,
      listsData: [],
      pageData: [],
      filterInputData: {
        LocName: '',
        City: '',
        District: '',
        AvailableTime: false
      },
      filterData: [],
      filterMode: false,
      pagination: [],
      currentPage: 1,
      modalLocName: '',
      googleMap: {
        map: {},
        marker: {},
        infowindow: {}
      },
      filterOpen: false
    },
    computed: {
      sliceNum: function sliceNum() {
        //判斷頁數顯示的範圍
        if (this.currentPage > this.pagination.length - 10) {
          return this.pagination.length;
        } else {
          return 9 + this.currentPage;
        }
      },
      showPages: function showPages() {
        //固定顯示10筆頁數
        return this.currentPage + 10 <= this.pagination.length ? this.pagination.slice(this.currentPage - 1, this.sliceNum) : this.pagination.slice(this.pagination.length - 10, this.sliceNum);
      },
      getCity: function getCity() {
        var citys = this.listsData.map(function (list, i) {
          return JSON.parse(list.City).List[1].Value;
        });
        return citys.filter(function (city, i, arr) {
          return arr.indexOf(city) == i;
        });
      },
      getDistrict: function getDistrict() {
        var inputCity = this.filterInputData.City;
        if (inputCity == '') {
          return '';
        } else {
          var district = [];
          this.listsData.forEach(function (list, i) {
            if (JSON.parse(list.City).List[1].Value == inputCity) {
              district.push(JSON.parse(list.District).List[1].Value);
            } else {
              return;
            }
          });
          return district.filter(function (dist, i, arr) {
            return arr.indexOf(dist) == i;
          });
        }
      }
    },
    methods: {
      getAPIData: function getAPIData() {
        axios.get(API).then(function (response) {
          vm.listsData = response.data.data;
          // console.log(vm.listsData);
          vm.combineDataByPages();
        }).catch(function (error) {
          alert('資料載入有誤，請稍後再試! error: ' + error);
        });
      },
      combineDataByPages: function combineDataByPages() {
        //複製一份原始資料
        var dataCopy = JSON.parse(JSON.stringify(vm.listsData));
        //需要render的總頁數 31頁
        var pageCount = dataCopy.length % 20 == 0 ? dataCopy.length / 20 : parseInt(dataCopy.length / 20) + 1;
        //重組成以頁數區分的資料，1頁20筆
        for (var i = 0; i < pageCount; i++) {
          this.pageData.push(dataCopy.splice(0, 20));
          vm.pagination.push(i);
        }
        this.loading = false;
      },
      movePage: function movePage(move) {
        if (move == 'prev') {
          this.currentPage--;
        } else if (move == 'prev') {
          this.currentPage++;
        } else {
          this.currentPage = parseInt(move);
        }
      },
      showMap: function showMap(data) {
        this.modalLocName = JSON.parse(data.LocName).List[1].Value;
        var _this = this;
        var pos = { lat: data.Latitude, lng: data.Longitude };
        var icon = '../img/week2/battery-icon.png';
        var content = '\n          <div>\n            <h5>' + JSON.parse(data.LocName).List[1].Value + '</h5>\n            <p>' + JSON.parse(data.Address).List[1].Value + '</p>\n          </div>\n        ';
        this.googleMap.map = new google.maps.Map(document.getElementById('map'), {
          center: pos,
          zoom: 15
        });
        this.googleMap.marker = new google.maps.Marker({
          position: pos,
          map: _this.googleMap.map,
          icon: icon,
          animation: google.maps.Animation.DROP
        });
        this.googleMap.infowindow = new google.maps.InfoWindow({
          content: content
        });
        this.googleMap.infowindow.open(this.googleMap.map, this.googleMap.marker);
      },
      filterLists: function filterLists() {
        var _this2 = this;

        //判斷是否為 filter mode
        if (this.filterInputData.LocName == '' && this.filterInputData.City == '' && this.filterInputData.District == '' && this.filterInputData.AvailableTime == false) {
          this.filterMode = false;
        } else {
          this.filterMode = true;
        }
        var tempData = JSON.parse(JSON.stringify(this.listsData));

        var _loop = function _loop(key) {
          //檢查 LocName、City、District
          if (_this2.filterInputData[key] !== '' && key !== 'AvailableTime') {
            tempData = tempData.filter(function (list, i) {
              if (key == 'LocName') {
                return JSON.parse(list[key]).List[1].Value.toLowerCase().indexOf(_this2.filterInputData[key].toLowerCase()) !== -1;
              } else {
                return JSON.parse(list[key]).List[1].Value == _this2.filterInputData[key];
              }
            });
          }
          //檢查 AvailableTime
          if (key == 'AvailableTime' && _this2.filterInputData[key]) {
            tempData = tempData.filter(function (list, i) {
              return list[key] == '24HR';
            });
          }
        };

        for (var key in this.filterInputData) {
          _loop(key);
        }
        //將篩選後的結果篩回 filterData
        this.filterData = tempData.filter(function (list, i) {
          return true;
        });
      }
    },
    watch: {
      'filterInputData.LocName': function filterInputDataLocName(val) {
        this.debounce(val);
      },
      'filterInputData.City': function filterInputDataCity(val) {
        this.filterInputData.District = '';
        vm.filterLists();
      },
      'filterInputData.AvailableTime': function filterInputDataAvailableTime(val, oldVal) {
        if (val !== oldVal) vm.filterLists();
      }
    },
    created: function created() {
      //定義 underscore debounce 讓 vue 使用
      this.debounce = _.debounce(this.filterLists, 500);
    },
    mounted: function mounted() {
      this.getAPIData();
    }
  });
});
//# sourceMappingURL=filter.js.map
