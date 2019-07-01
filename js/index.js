'use strict';

$(function () {
  $.get('./json/item-list.json', function (data) {
    $('.js_loading').hide();
    var temp = '';
    data.forEach(function (d) {
      temp += '\n        <div class="card">\n          <div class="card-img">\n            <img src="' + d.imgSrc + '" alt="' + d.title + '" class="card-img-top">\n          </div>\n          <div class="card-body">\n            <h5 class="card-title">' + d.title + '</h5>\n            <p class="card-text">\n              Skill Point:\n              ' + d.skills.map(function (skill) {
        return '\n                <span class="badge badge-warning mr-1">#' + skill + '</span>\n              ';
      }).join("") + '\n            </p>\n          </div>\n          <div class="card-footer d-flex justify-content-between">\n            <small class="text-muted">' + d.date + '</small>\n            <span class="badge badge-pill badge-dark">' + d.edition + '</span>\n          </div>\n          <div class="card_cover">\n            <a href="' + d.href + '" target="_blank">\n              <button class="btn btn-outline-goblue btn-lg">Checkout</button>\n            </a>\n          </div>\n        </div>\n      ';
    });
    $('.js_itemList').html(temp);
  });
});
//# sourceMappingURL=index.js.map
