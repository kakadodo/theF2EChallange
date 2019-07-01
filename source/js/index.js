$(function(){
  $.get('./json/item-list.json', function(data){
    $('.js_loading').hide();
    let temp = '';
    data.forEach(d => {
      temp += `
        <div class="card">
          <div class="card-img">
            <img src="${d.imgSrc}" alt="${d.title}" class="card-img-top">
          </div>
          <div class="card-body">
            <h5 class="card-title">${d.title}</h5>
            <p class="card-text">
              Skill Point:
              ${d.skills.map(skill => (`
                <span class="badge badge-warning mr-1">#${skill}</span>
              `)).join("")}
            </p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <small class="text-muted">${d.date}</small>
            <span class="badge badge-pill badge-dark">${d.edition}</span>
          </div>
          <div class="card_cover">
            <a href="${d.href}" target="_blank">
              <button class="btn btn-outline-goblue btn-lg">Checkout</button>
            </a>
          </div>
        </div>
      `;
    });
    $('.js_itemList').html(temp);
  })
});