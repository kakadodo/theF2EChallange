"use strict";$(function(){var i=$("#navbar .nav-item"),s=$(".js_mainContent");i.on("click",function(e){e.preventDefault(),i.removeClass("active"),$(this).addClass("active");var a=$(this).find("a").attr("href");s.not(a).hide().addClass("d-none"),$(a).fadeIn().removeClass("d-none")});c3.generate({bindto:"#chart",data:{x:"x",columns:[["x","18 JUN","19 JUN","20 JUN","21 JUN","22 JUN","23 JUN"],["TOTAL REVENUE",5e3,2e3,3e3,4500,6e3,8e3],["TOTAL COST",500,800,1200,1500,750,800],["NET INCOME",4500,1200,1800,3e3,5250,7200]]},color:{pattern:["#7ED321","#D0021B","#4A90E2"]},axis:{x:{type:"category"}},legend:{show:!1},grid:{y:{show:!0}},tooltip:{grouped:!1,contents:function(e,a,i,s){return"TOTAL REVENUE"==e[0].id?'<div class="tip_revenue"><i class="fas fa-hand-holding-usd mr-2"></i>'+e[0].value+"</div>":"TOTAL COST"==e[0].id?'<div class="tip_cost"><i class="fas fa-boxes mr-2"></i>'+e[0].value+"</div>":'<div class="tip_income"><i class="fas fa-money-bill mr-2"></i>'+e[0].value+"</div>"}}})});
//# sourceMappingURL=admin-order.js.map