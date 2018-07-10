'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

$(function () {

  var vm = new Vue({
    el: '#app',
    data: {
      step: 1,
      progressTop: 0,
      createAccount: {
        mail: '',
        password: '',
        confirmPassword: ''
      },
      generalInfo: {
        phone: '',
        city: '',
        dist: '',
        address: ''
      },
      files: [],
      fileErrName: [],
      paymentMethod: {
        cardNumber: '',
        cardHolder: '',
        bankName: '',
        cvv: '',
        expireMonth: '',
        expireYear: ''
      }
    },
    methods: {
      submitCheck: function submitCheck(e) {
        e.preventDefault();
        e.stopPropagation();
        $(e.currentTarget).addClass('was-validated');
        if (e.currentTarget.checkValidity()) {
          this.step++;
          this.progressTop++;
          $(e.currentTarget).removeClass('was-validated');
        }
      },
      checkFile: function checkFile(e) {
        var files = [].concat(_toConsumableArray(e.currentTarget.files));
        var _this = this;
        var _URL = window.URL || window.webkitURL;
        var leftImages = 3 - _this.files.length;
        _this.fileErrName = [];
        // 最多上傳三張
        if (files.length > leftImages) files.splice(leftImages);
        files.forEach(function (file, i) {
          if (!file.type.includes('image/')) {
            console.log('not image');
            return;
          }
          var img = new Image();
          img.onload = function (e) {
            if (this.width > 150 || this.height > 150) {
              _this.fileErrName.push(file.name);
              return;
            }
            _this.files.push(e.path[0].currentSrc);
          };
          img.src = _URL.createObjectURL(file);
        });
      }
    },
    watch: {
      'createAccount.confirmPassword': function createAccountConfirmPassword(val) {
        if (val !== this.createAccount.password) {
          $('#input_confirmPassword')[0].setCustomValidity('not match');
        } else {
          $('#input_confirmPassword')[0].setCustomValidity('');
        }
      }
    }
  });
});
//# sourceMappingURL=validation.js.map
