let vm = null;

window.onload = () => {
  vm = new Vue({
    el: "#app",
    data() {
      return {
        axios: null,
        roomsInfo: [],
        roomDetail: [],
        bookingStep: 1,
        roomDetailisLoading: true,
        submitLoading: false,
        pickerOptions: {
          disabledDate(time) {
            const booking = vm.roomDetail.booking;
            let isDisabled = false;
            booking.forEach(date => {
              if (time.getFullYear() == new Date(date.date).getFullYear()
                && time.getMonth() == new Date(date.date).getMonth()
                && time.getDate() == new Date(date.date).getDate()) {
                isDisabled = true;
              }
            });
            return isDisabled ? isDisabled : (time.getTime() < new Date().getTime() || time.getTime() > (new Date().getTime() + 1000 * 60 * 60 * 24 * 92));
          },
        },
        formBooking: {
          name: '',
          tel: '',
          email: '',
        },
        formDate: null,
        formDateSeparate: [null, null],
        formBookingRule: {
          name: [
            { required: true, message: '請輸入姓名', trigger: 'blur' }
          ],
          tel: [
            { required: true, message: '請輸入聯絡電話', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '請輸入 email', trigger: 'blur' },
            { type: 'email', message: '請輸入正確的 email 格式', trigger: ['blur', 'change'] }
          ]
        },
        submitDialogVisible: false,
      }
    },
    computed: {
      bookingTotalDays() {
        const start = new Date(this.formDate[0]).getTime();
        const end = new Date(this.formDate[1]).getTime();
        const days = (end - start) / 1000 / 60 / 60 / 24;
        return days;
      },
      bookingTotalDates() {
        const start = new Date(this.formDate[0]).getTime();
        let dates = [this.formDate[0]];
        for (let i = 1; i <= this.bookingTotalDays; i++) {
          const dayTime = 1000 * 60 * 60 * 24;
          let newDay = new Date(start + (dayTime * i));
          const year = newDay.getFullYear();
          const month = (newDay.getMonth() + 1).toString().padStart(2, 0);
          const date = (newDay.getDate()).toString().padStart(2, 0);
          dates.push(`${year}-${month}-${date}`);
        }
        return dates;
      },
      bookingTotalPrice() {
        return this.formDate ? this.roomDetail.room[0].normalDayPrice * this.bookingTotalDays : 0;
      }
    },
    methods: {
      scrollToRooms() {
        this.bookingStep = 1;
        this.scrollToElement('.title');
      },
      scrollToElement(el) {
        const roomsTitleOffset = document.querySelector(`${el}`).getBoundingClientRect().top - document.querySelector('.title').offsetHeight * 2;
        let scrollY = window.scrollY;
        let currentScroll = scrollY;
        let scrollSpeed = 5;
        let scrollTimer = null;
        if (roomsTitleOffset > 0) {
          scrollTimer = setInterval(() => {
            if (currentScroll < roomsTitleOffset + scrollY) {
              window.scrollTo(0, currentScroll);
              currentScroll += scrollSpeed;
            } else {
              clearInterval(scrollTimer);
            }
          }, 0);
        } else {
          scrollTimer = setInterval(() => {
            if (currentScroll > roomsTitleOffset + scrollY) {
              window.scrollTo(0, currentScroll - scrollSpeed);
              currentScroll -= scrollSpeed;
            } else {
              clearInterval(scrollTimer);
            }
          }, 0);
        }
      },
      formatToFormDate() {
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
          let tempArr = this.formDateSeparate.slice().sort((a, b) => {
            const aa = new Date(a).getTime();
            const bb = new Date(b).getTime();
            return aa - bb;
          });
          this.formDateSeparate = tempArr;
          this.formDate = tempArr;
        }
      },
      checkIfSameDate() {
        if (this.formDate[0] === this.formDate[1]) {
          this.$message.error('開始及結束日期不能相同');
          this.formDate = null;
          return;
        }
        this.formDateSeparate = [...this.formDate];
      },
      showRoomDetail(roomId) {
        this.bookingStep = 2;
        this.roomDetailisLoading = true;
        this.axios.get(`/room/${roomId}`).then((res) => {
          if (res.data.success) {
            this.roomDetail = res.data;
            this.roomDetailisLoading = false;
            setTimeout(() => {
              this.scrollToElement('.title');
            }, 500);
          }
        });
      },
      showSubmitDialog() {
        if (!this.formDate) {
          this.$message.error('請選擇開始及結束日期');
        } else {
          this.submitDialogVisible = true;
        }
      },
      submitBooking() {
        this.$refs.formBooking.validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            const bodyFormData = new FormData();
            bodyFormData.append('name', this.formBooking.name);
            bodyFormData.append('tel', this.formBooking.tel);
            this.bookingTotalDates.forEach((date, i) => {
              bodyFormData.append(`date[${i}]`, date);
            });
            this.axios.post(`/room/${this.roomDetail.room[0].id}`, bodyFormData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            }).then((res) => {
              if (res.data.success) {
                this.bookingStep = 3;
                this.submitDialogVisible = false;
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.submitDialogVisible = false;
        this.$refs.formBooking.resetFields();
      },
      resetAllData() {
        this.formDate = null;
        this.formBooking = {
          name: '',
          tel: '',
          email: '',
        };
        this.formDateSeparate = [null, null];
      }
    },
    watch: {
      bookingStep(val) {
        if (val === 2) {
          this.resetAllData();
        }
      }
    },
    created() {
      this.axios = axios.create({
        baseURL: 'https://challenge.thef2e.com/api/thef2e2019/stage6',
        timeout: 5000,
        headers: {
          Acctept: 'application/json',
          Authorization: 'Bearer euQEgajjI9dbwkiVreUIsLvRDdKbqDQKAhnj678BLygJKajkPchRzS9COCc',
        }
      });
      this.axios.get('/rooms').then((res) => {
        if (res.data.success) {
          this.roomsInfo = res.data.items;
        }
      });
    },
  });
}

