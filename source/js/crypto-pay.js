let vm = null;
const formProfile = {
  name: null,
  mobile: null,
  email: null,
  date: '2019/08/09',
  nop: {
    adult: 0,
    child: 0,
  },
  code: null,
  comment: null,
  agree: false,
};
const formPayment = {
  name: null,
  cardNumber: ['', '', '', ''],
  cardNumberInput: null,
  expiredMonth: null,
  expiredYear: null,
  cvv: null,
};

$(function() {
  // 表單驗證 plugin
  Vue.use(VeeValidate, {
    classes: true,
    classNames: {
      valid: 'is-valid',
      invalid: 'is-invalid',
    }
  });
  vm = new Vue({
    el: '#app',
    data: {
      progress: {
        steps: ['profile', 'payby', 'payment'],
        currentStep: 2,
        profile: false,
        payby: false,
        payment: false,
      },
      payby: ['超商代碼 7-11', 'ATM轉帳', '街口支付', '信用卡', 'LINE Pay'],
      formProfile: null,
      formPayby: null,
      formPayment: null,
      hideOrder: true,
      isMobile: false,
    },
    computed: {
    },
    methods: {
      validateBeforeSubmit(stepName) {
        this.$validator.validateAll().then((result) => {
          console.log('work');
          console.log(result);
          if (result) {
            this.progress[stepName] = true;
            this.progress.currentStep++;
            return;
          }
          if (stepName === 'payby') {
            $('.alert_payby').removeClass('hide').addClass('show');
            setTimeout(() => {
              $('.alert_payby').removeClass('show').addClass('hide');
            }, 2000);
          }
        });
      },
      resetForm(formName) {
        switch(formName) {
          case 'formProfile':
            this.formProfile = JSON.parse(JSON.stringify(formProfile));
            this.$validator.reset();
            return;
          case 'formPayby':
            this.formPayby = null;
            this.progress.profile = false;
            this.progress.currentStep--;
            return;
          case 'formPayment':
            this.formPayment = JSON.parse(JSON.stringify(formPayment));
            this.progress.payby = false;
            this.progress.currentStep--;
            return;
          default:
            return;
        }
      },
      checkCardNumberInput(number, index) {
        if (number.length===4 && index<3) {
          this.$refs.cardNumber[index+1].focus();
        }
      },
      resetAllStep() {
        console.log('work');
        for (let key in this.progress) {
          if (key === 'steps') continue;
          if (key === 'currentStep') {
            this.progress[key] = 0;
            continue;
          }
          this.progress[key] = false;
        }
        this.initFormData();
      },
      initFormData() {
        this.formProfile = JSON.parse(JSON.stringify(formProfile));
        this.formPayby = null;
        this.formPayment = JSON.parse(JSON.stringify(formPayment));
      },
      formatCreditNumber(e) {
        let val = e.target.value.replace(/-/g, '');
        let valArr = val.split('');
        let temp = [];
        valArr.map((val, i) => {
          temp.push(val);
          if((i + 1) % 4 === 0 && temp.length < 19) {
            temp.push('-');
          }
        });
        this.formPayment.cardNumberInput = temp.join('');
      },
    },
    created() {
      // 參加人數的客製化驗證
      this.$validator.extend('nop', {
        validate: () => {
          return this.formProfile.nop.adult + this.formProfile.nop.child > 0;
        }
      });
      this.initFormData();
    },
    mounted() {
      let timer = null;
      $(window).on('scroll', () => {
        if ($(window).width() <= 767) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            $('.popup_wrapper').animate({
              top: $(window).scrollTop(),
            }, 300);
          }, 100);
        }else {
          $('.popup_wrapper').attr('style', '');
        }
      });
      $(window).on('resize', () => {
        this.isMobile = $(window).width() <= 575 ? true : false;
      });
    },
  });
});