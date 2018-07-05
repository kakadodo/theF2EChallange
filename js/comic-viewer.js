'use strict';

$(function () {
  //perfect scroller
  var ps = new PerfectScrollbar('.comic_page_viewer_nav');
  // toogle to comic page
  var chapterBtn = $('.comic_chapters_lists a');
  chapterBtn.click(function (e) {
    e.preventDefault();
    $('.comic_index').addClass('d-none');
    $('.comic_page').removeClass('d-none');
    window.scrollTo(0, 0);
  });
  //toogle to comic index
  $('.comic_page_title').click(function (e) {
    e.preventDefault();
    $('.comic_index').removeClass('d-none');
    $('.comic_page').addClass('d-none');
    window.scrollTo(0, 0);
  });
  //toogle view mode
  $('#view_mode').click(function () {
    $('#app').toggleClass('dark');
  });
  //count page
  var pages = {
    currentPage: 1,
    totalPage: 12,
    currentPageUrl: function currentPageUrl() {
      return 'https://hexschool.github.io/THE_F2E_Design/week5-comic%20viewer/assets/storyboard-' + this.currentPage + '.png';
    },
    checkViewerBtn: function checkViewerBtn() {
      $('.viewer_btn').removeAttr('disabled');
      if (this.currentPage == 1) {
        $('.viewer_btn.left').attr('disabled', true);
      } else if (this.currentPage == this.totalPage) {
        $('.viewer_btn.right').attr('disabled', true);
      }
    },
    updateSelectChapter: function updateSelectChapter() {
      $('.select_page option').removeAttr('selected');
      $('.select_page option[value="p-' + this.currentPage + '"]').attr('selected', true);
    }
  };

  var viewerImg = $('.comic_page_viewer img')[0];
  //page nav click
  $('.page').click(function () {
    $('.page').removeClass('active');
    $(this).addClass('active');
    pages.currentPage = $(this).data('page');
    var viewerNav = $('.comic_page_viewer_nav')[0];
    viewerNav.scrollLeft = $(this)[0].offsetLeft - viewerNav.offsetLeft - viewerNav.offsetWidth / 2 + $(this)[0].offsetWidth / 2;
    viewerImg.src = pages.currentPageUrl();
    pages.checkViewerBtn();
    pages.updateSelectChapter();
  });
  //page nav scroll btn
  $('.viewer_nav_btn').click(function () {
    var navWidth = $('.comic_page_viewer_nav')[0].offsetWidth;
    if ($(this).is('.left')) {
      $('.comic_page_viewer_nav')[0].scrollLeft = 0;
    } else {
      $('.comic_page_viewer_nav')[0].scrollLeft = $('.comic_page_viewer_nav')[0].scrollWidth - navWidth;
    }
  });
  //viewer btn
  $('.viewer_btn').click(function () {
    if ($(this).is('.left')) {
      pages.currentPage--;
    } else {
      pages.currentPage++;
    }
    $('.page[data-page="' + pages.currentPage + '"]').click();
    pages.checkViewerBtn();
  });
  //page select
  $('.select_page').change(function () {
    var page = $(this).val().split('-')[1];
    pages.currentPage = parseInt(page);
    $('.page[data-page="' + pages.currentPage + '"]').click();
  });
  //open fullscreen
  $('.comic_page_viewer img').click(function () {
    $(this).parent().addClass('fullscreen');
  });
  //close fullscreen
  $('.close_btn').click(function () {
    $(this).closest('.comic_page_viewer').removeClass('fullscreen');
  });
});
//# sourceMappingURL=comic-viewer.js.map
