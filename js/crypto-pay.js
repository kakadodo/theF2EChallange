'use strict';

var vm = null;
var formProfile = {
  name: null,
  mobile: null,
  email: null,
  date: '2019/08/09',
  nop: {
    adult: 0,
    child: 0
  },
  code: null,
  comment: null,
  agree: false
};
var formPayment = {
  name: null,
  cardNumber: ['', '', '', ''],
  expiredMonth: null,
  expiredYear: null,
  cvv: null
};

$(function () {
  // 表單驗證 plugin
  Vue.use(VeeValidate, {
    classes: true,
    classNames: {
      valid: 'is-valid',
      invalid: 'is-invalid'
    }
  });
  vm = new Vue({
    el: '#app',
    data: {
      progress: {
        steps: ['profile', 'payby', 'payment'],
        currentStep: 0,
        profile: false,
        payby: false,
        payment: false
      },
      payby: ['超商代碼 7-11', 'ATM轉帳', '街口支付', '信用卡', 'LINE Pay'],
      formProfile: null,
      formPayby: null,
      formPayment: null,
      hideOrder: false
    },
    computed: {},
    methods: {
      validateBeforeSubmit: function validateBeforeSubmit(stepName) {
        var _this = this;

        this.$validator.validateAll().then(function (result) {
          if (result) {
            _this.progress[stepName] = true;
            _this.progress.currentStep++;
            return;
          }
          if (stepName === 'payby') {
            $('.alert_payby').removeClass('hide').addClass('show');
            setTimeout(function () {
              $('.alert_payby').removeClass('show').addClass('hide');
            }, 2000);
          }
        });
      },
      resetForm: function resetForm(formName) {
        switch (formName) {
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
      checkCardNumberInput: function checkCardNumberInput(number, index) {
        if (number.length === 4 && index < 3) {
          this.$refs.cardNumber[index + 1].focus();
        }
      },
      resetAllStep: function resetAllStep() {
        console.log('work');
        for (var key in this.progress) {
          if (key === 'steps') continue;
          if (key === 'currentStep') {
            this.progress[key] = 0;
            continue;
          }
          this.progress[key] = false;
        }
        this.initFormData();
      },
      initFormData: function initFormData() {
        this.formProfile = JSON.parse(JSON.stringify(formProfile));
        this.formPayby = null;
        this.formPayment = JSON.parse(JSON.stringify(formPayment));
      }
    },
    created: function created() {
      var _this2 = this;

      // 參加人數的客製化驗證
      this.$validator.extend('nop', {
        validate: function validate() {
          return _this2.formProfile.nop.adult + _this2.formProfile.nop.child > 0;
        }
      });
      this.initFormData();
    }
  });
});
//# sourceMappingURL=crypto-pay.js.map
