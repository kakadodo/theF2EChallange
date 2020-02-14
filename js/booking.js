'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var vm = null;

window.onload = function () {
  vm = new Vue({
    el: '#app',
    data: function data() {
      return {
        axios: null,
        roomsInfo: [],
        roomDetail: [],
        bookingStep: 1,
        roomDetailisLoading: true,
        submitLoading: false,
        pickerOptions: {
          disabledDate: function disabledDate(time) {
            var booking = vm.roomDetail.booking;
            var isDisabled = false;
            booking.forEach(function (date) {
              if (time.getFullYear() == new Date(date.date).getFullYear() && time.getMonth() == new Date(date.date).getMonth() && time.getDate() == new Date(date.date).getDate()) {
                isDisabled = true;
              }
            });
            return isDisabled ? isDisabled : time.getTime() < new Date().getTime() || time.getTime() > new Date().getTime() + 1000 * 60 * 60 * 24 * 92;
          }
        },
        formBooking: {
          name: '',
          tel: '',
          email: ''
        },
        formDate: null,
        formDateSeparate: [null, null],
        formBookingRule: {
          name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
          tel: [{ required: true, message: '請輸入聯絡電話', trigger: 'blur' }],
          email: [{ required: true, message: '請輸入 email', trigger: 'blur' }, {
            type: 'email',
            message: '請輸入正確的 email 格式',
            trigger: ['blur', 'change']
          }]
        },
        submitDialogVisible: false
      };
    },

    computed: {
      bookingTotalDays: function bookingTotalDays() {
        var start = new Date(this.formDate[0]).getTime();
        var end = new Date(this.formDate[1]).getTime();
        var days = (end - start) / 1000 / 60 / 60 / 24;
        return days;
      },
      bookingTotalDates: function bookingTotalDates() {
        var start = new Date(this.formDate[0]).getTime();
        var dates = [this.formDate[0]];
        for (var i = 1; i <= this.bookingTotalDays; i++) {
          var dayTime = 1000 * 60 * 60 * 24;
          var newDay = new Date(start + dayTime * i);
          var year = newDay.getFullYear();
          var month = (newDay.getMonth() + 1).toString().padStart(2, 0);
          var date = newDay.getDate().toString().padStart(2, 0);
          dates.push(year + '-' + month + '-' + date);
        }
        return dates;
      },
      bookingTotalPrice: function bookingTotalPrice() {
        return this.formDate ? this.roomDetail.room[0].normalDayPrice * this.bookingTotalDays : 0;
      }
    },
    methods: {
      scrollToRooms: function scrollToRooms() {
        this.bookingStep = 1;
        this.scrollToElement('.title');
      },
      scrollToElement: function scrollToElement(el) {
        var roomsTitleOffset = document.querySelector('' + el).getBoundingClientRect().top - document.querySelector('.title').offsetHeight * 2;
        var scrollY = window.scrollY;
        var currentScroll = scrollY;
        var scrollSpeed = 5;
        var scrollTimer = null;
        if (roomsTitleOffset > 0) {
          scrollTimer = setInterval(function () {
            if (currentScroll < roomsTitleOffset + scrollY) {
              window.scrollTo(0, currentScroll);
              currentScroll += scrollSpeed;
            } else {
              clearInterval(scrollTimer);
            }
          }, 0);
        } else {
          scrollTimer = setInterval(function () {
            if (currentScroll > roomsTitleOffset + scrollY) {
              window.scrollTo(0, currentScroll - scrollSpeed);
              currentScroll -= scrollSpeed;
            } else {
              clearInterval(scrollTimer);
            }
          }, 0);
        }
      },
      formatToFormDate: function formatToFormDate() {
        // 將小螢幕的 datePick 值轉換到 formDate
        // 如果開始與結束日沒有輸入完全就直接跳過
        if (!this.formDateSeparate[0] || !this.formDateSeparate[0]) return;
        if (this.formDateSeparate[0] === this.formDateSeparate[1]) {
          this.$message.error('開始及結束日期不能相同');
          this.formDateSeparate = [null, null];
          return;
        }
        // 如果兩個都有輸入就轉換，轉換會把日期順序重新排列
        if (this.formDateSeparate[0] && this.formDateSeparate[1]) {
          var tempArr = this.formDateSeparate.slice().sort(function (a, b) {
            var aa = new Date(a).getTime();
            var bb = new Date(b).getTime();
            return aa - bb;
          });
          this.formDateSeparate = tempArr;
          this.formDate = tempArr;
        }
      },
      checkIfSameDate: function checkIfSameDate() {
        if (this.formDate[0] === this.formDate[1]) {
          this.$message.error('開始及結束日期不能相同');
          this.formDate = null;
          return;
        }
        this.formDateSeparate = [].concat(_toConsumableArray(this.formDate));
      },
      showRoomDetail: function showRoomDetail(roomId) {
        var _this = this;

        this.bookingStep = 2;
        this.roomDetailisLoading = true;
        this.axios.get('/room/' + roomId).then(function (res) {
          if (res.data.success) {
            _this.roomDetail = res.data;
            _this.roomDetailisLoading = false;
            setTimeout(function () {
              _this.scrollToElement('.title');
            }, 500);
          }
        });
      },
      showSubmitDialog: function showSubmitDialog() {
        if (!this.formDate) {
          this.$message.error('請選擇開始及結束日期');
        } else {
          this.submitDialogVisible = true;
        }
      },
      submitBooking: function submitBooking() {
        var _this2 = this;

        this.$refs.formBooking.validate(function (valid) {
          if (valid) {
            _this2.submitLoading = true;
            var bodyFormData = new FormData();
            bodyFormData.append('name', _this2.formBooking.name);
            bodyFormData.append('tel', _this2.formBooking.tel);
            _this2.bookingTotalDates.forEach(function (date, i) {
              bodyFormData.append('date[' + i + ']', date);
            });
            _this2.axios.post('/room/' + _this2.roomDetail.room[0].id, bodyFormData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            }).then(function (res) {
              if (res.data.success) {
                _this2.bookingStep = 3;
                _this2.submitDialogVisible = false;
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm: function resetForm() {
        this.submitDialogVisible = false;
        this.$refs.formBooking.resetFields();
      },
      resetAllData: function resetAllData() {
        this.formDate = null;
        this.formBooking = {
          name: '',
          tel: '',
          email: ''
        };
        this.formDateSeparate = [null, null];
      },
      fixScrollDisappear: function fixScrollDisappear() {
        document.body.style.overflow = 'initial';
      }
    },
    watch: {
      bookingStep: function bookingStep(val) {
        if (val === 2) {
          this.resetAllData();
        }
      }
    },
    created: function created() {
      var _this3 = this;

      this.axios = axios.create({
        baseURL: 'https://challenge.thef2e.com/api/thef2e2019/stage6',
        timeout: 5000,
        headers: {
          Acctept: 'application/json',
          Authorization: 'Bearer euQEgajjI9dbwkiVreUIsLvRDdKbqDQKAhnj678BLygJKajkPchRzS9COCc'
        }
      });
      this.axios.get('/rooms').then(function (res) {
        if (res.data.success) {
          _this3.roomsInfo = res.data.items;
        }
      });
    }
  });
};
//# sourceMappingURL=booking.js.map
