'use strict';

var imgs = Array.from(document.querySelectorAll('.product img'));
var indexContainer = document.querySelector('.index');
var pd_pageContainer = document.querySelector('.pd_page');
var backBtn = document.querySelector('.back');
imgs.forEach(function (img) {
  img.addEventListener('click', function () {
    indexContainer.classList.remove('active');
    pd_pageContainer.classList.add('active');
    smoothscroll();
  });
});
backBtn.addEventListener('click', function (e) {
  e.preventDefault();
  pd_pageContainer.classList.remove('active');
  indexContainer.classList.add('active');
});

function smoothscroll() {
  var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll);
    window.scrollTo(0, currentScroll - currentScroll / 5);
  }
}
//# sourceMappingURL=product-gallery.js.map
