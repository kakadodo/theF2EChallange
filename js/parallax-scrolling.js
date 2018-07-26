'use strict';

$(function () {
  //開頭動畫結束切換場景
  setTimeout(function () {
    $('.ani_opening').addClass('hide');
    $('.q1').find('.question_content').fadeIn(500, function () {
      $('.q1').find('.question_graphic').addClass('animate');
    });
  }, 7500);

  var score = 0;
  var currentQ = 1;
  var skrollrObj = void 0;

  $('.answer').on('click', function (e) {
    var point = $(this).data('point');
    score += point;
    currentQ++;
    switchQuest(currentQ);
  });

  function switchQuest(q) {
    //切換到問題2
    if (q == 2) {
      $('.q1').animate({ left: '-100%' }, 1000, function () {
        $(this).addClass('hide');
        $('.q2').find('.question_content').fadeIn(500);
        $('.q2').find('.question_graphic').addClass('animate');
      });
      $('.q1 .question_content, .q1 .question_graphic').children().css('display', 'none');
    } else if (q == 3) {
      $('.q2').animate({ left: '100%' }, 1000, function () {
        $(this).addClass('hide');
        $('.q3').find('.question_content').fadeIn(500);
        $('.q3').find('.question_graphic').addClass('animate');
      });
      $('.q2 .question_content, .q2 .question_graphic').children().css('display', 'none');
    } else {
      $('#skrollr-body').removeClass('hide');
      $('.q3').animate({ left: '-100%' }, 1000, function () {
        $(this).addClass('hide');
        $('.questions').remove();
        $('.step_done h2, .step_done p').fadeIn(500);
        skrollrObj = skrollr.init();
      });
      $('.q3 .question_content, .q3 .question_graphic').children().css('display', 'none');
    }
  }

  $('.restart').on('click', function () {
    window.location.href = 'parallax-scrolling.html';
  });

  $(window).on('scroll', function () {
    if (skrollrObj.getScrollTop() >= 7450) {
      var result = '';
      if (score < 6) {
        result = '.result_triangle';
      } else if (score < 12) {
        result = '.result_rect';
      } else {
        result = '.result_circle';
      }
      $('body').css('backgroundColor', '#fff');
      $(result).removeClass('hide');
      skrollrObj.destroy();
      setTimeout(function () {
        $(result).addClass('animate');
      }, 0);
    }
  });
});
//# sourceMappingURL=parallax-scrolling.js.map
