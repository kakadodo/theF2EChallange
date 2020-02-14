"use strict";$(function(){var e="all",n=parseInt(localStorage.getItem("newTaskCount"))||0,l=JSON.parse(localStorage.getItem("data"))||[],d=JSON.parse(localStorage.getItem("sort"))||[];function t(t){var e=t.closest(".task_panel"),s={id:void 0===e.data("id")?n:e.data("id"),title:e.find(".title_input").val(),date:e.find('[name="task_date"]').val(),time:e.find('[name="task_time"]').val(),file:e.find('[name="task_file"]')[0].files[0]||"",fileTime:e.find(".file_info .upload").text()||"",comment:e.find('[name="task_comment"]').val(),isStar:e.find('[name="completed_check"]').prop("checked"),isCompleted:e.find('[name="star_check"]').prop("checked")};if(s.id==n)l.push(s),d.push(s.id);else{var a=l.find(function(t,e){return t.id==s.id}),i=l.indexOf(a);l[i]=s}localStorage.setItem("data",JSON.stringify(l)),localStorage.setItem("sort",JSON.stringify(d)),c()}function c(){var a="",i=0;$.each(d,function(t,s){var e=l.find(function(t,e){return t.id==s});e.isCompleted||i++,a+='\n        <div data-id="'+e.id+'" class="task_panel '+(e.isStar?"star":"")+" "+(e.isCompleted?"completed":"")+'">\n          <a href="#" class="delete_btn"><i class="fas fa-trash-alt"></i></a>\n          <div class="task_panel_top">\n            <div class="d_flex">\n              <input type="checkbox" name="completed_check" class="completed_check '+(e.isCompleted?"checked":"")+'"/>\n              <input type="text" placeholder="Type Something Here..." name="title_input" disabled="true" value="'+e.title+'" class="title_input"/>\n              <input type="checkbox" name="star_check" class="star_check '+(e.isStar?"checked":"")+'"/><a href="#" class="edit_btn"><i class="fas fa-pencil-alt"></i></a>\n            </div>\n            <div class="task_icons d_flex">\n              <li class="icon_date '+(e.date?"":"d_none")+'"><i class="far fa-calendar-alt"></i><span style="margin-left:5px">'+e.date+'</span></li>\n              <li class="icon_file ml-1 '+(e.file?"":"d_none")+'"><i class="far fa-file"></i></li>\n              <li class="icon_comment ml-1 '+(e.comment?"":"d_none")+'"><i class="far fa-comment-dots"></i></li>\n            </div>\n          </div>\n          <div class="task_panel_bottom d_none">\n            <div class="form_group">\n              <h4><i class="far fa-calendar-alt"></i>Deadline</h4>\n              <input type="date" placeholder="yyyy/mm/dd" name="task_date" class="ml-1" value="'+e.date+'"/>\n              <input type="time" placeholder="hh:mm" style="margin-left:5px" name="task_time" value="'+e.time+'"/>\n            </div>\n            <div class="form_group">\n              <h4><i class="far fa-file"></i>File</h4>\n              <div class="d_flex">\n                <div class="file_info ml-1 '+(e.file?"":"d_none")+'">\n                  <p class="name">'+(e.file?e.file.name:"")+'</p>\n                  <p class="upload">'+(e.file?e.fileTime:"")+'</p>\n                </div>\n                <label for="task_file'+e.id+'" class="file_btn ml-1">\n                  <input id="task_file'+e.id+'" type="file" name="task_file" hidden="hidden"/>\n                </label>\n              </div>\n            </div>\n            <div class="form_group">\n              <h4><i class="far fa-comment-dots"></i>Comment</h4>\n              <textarea name="task_comment" rows="6" placeholder="Type Your Memo Here..." class="ml-1">'+e.comment+'</textarea>\n            </div>\n            <div class="button_group">\n              <button class="btn_cancel">X Cancel</button>\n              <button id="js_saveTask'+e.id+'" class="btn_primary">+ Save</button>\n            </div>\n          </div>\n        </div>'}),$(".task_lists").html(a).hide(),$(".task_left_info").html(i+" tasks left"),$("header .nav_list").filter(".active").click(),$(".task_lists").show()}$("header .nav_list").on("click",function(){$("header .nav_list").removeClass("active"),$(this).addClass("active"),e=$(this).data("mode");var t=$(".task_lists .task_panel");switch(e){case"all":t.show("fast");break;case"progress":t.show(),t.filter(".completed").hide("fast");break;case"completed":t.show(),t.not(".completed").hide("fast")}}),$(".addTask_input").on("click",function(){$(this).fadeOut(50),$(this).next(".task_panel").slideDown("slow")}),$(".btn_cancel").on("click",function(){$(this).closest(".task_panel").find("input, textarea").val(""),$(this).closest(".task_panel").find(".file_info").addClass("d_none"),$(this).closest(".task_panel").hide().prev(".addTask_input").show()}),$(".container").on("change","[id^=task_file]",function(t){t.stopPropagation();var e=$(this)[0].files[0],s=$(this).closest(".d_flex").find(".file_info");s.removeClass("d_none").find(".name").text(e.name),s.find(".upload").text((new Date).toDateString())}),$("#js_addTask").on("click",function(){t($(this)),$(this).closest(".task_panel").find("input, textarea").val(""),$(this).closest(".task_panel").find(".file_info").addClass("d_none"),$(this).closest(".task_panel").hide().prev(".addTask_input").show(),n++,localStorage.setItem("newTaskCount",n)}),$(".task_lists").on("click",".edit_btn",function(t){t.preventDefault(),$(this).addClass("active").closest(".task_panel").find(".task_panel_bottom").slideDown().removeClass("d_none"),$(this).siblings(".title_input").removeAttr("disabled")}),$(".task_lists").on("click",".btn_cancel",function(){$(this).closest(".task_panel_bottom").slideUp().addClass("d_none").prev(".task_panel_top").find(".edit_btn").removeClass("active").siblings(".title_input").prop("disabled",!0)}),$(".task_lists").on("click",'[id^="js_saveTask"]',function(){t($(this)),$(this).closest(".task_panel_bottom").slideUp().addClass("d_none").prev(".task_panel_top").find(".edit_btn").removeClass("active").siblings(".title_input").prop("disabled",!0)}),$(".task_lists").on("click",".completed_check",function(){var s=$(this).closest(".task_panel").data("id"),t=l.find(function(t,e){return t.id==s}),e=l.indexOf(t);$(this).is(".checked")?l[e].isCompleted=!1:l[e].isCompleted=!0,$(this).is(".checked")?$(this).removeClass("checked"):$(this).addClass("checked"),localStorage.setItem("data",JSON.stringify(l)),c()}),$(".task_lists").on("click",".star_check",function(){var s=$(this).closest(".task_panel").data("id"),t=d.indexOf(s),e=l.find(function(t,e){return t.id==s}),a=l.indexOf(e);$(this).is(".checked")?l[a].isStar=!1:l[a].isStar=!0,$(this).is(".checked")?$(this).removeClass("checked"):$(this).addClass("checked"),$(this).is(".checked")&&(d.unshift(d.splice(t,1)[0]),localStorage.setItem("sort",JSON.stringify(d))),localStorage.setItem("data",JSON.stringify(l)),c()}),$(".task_lists").on("click",".delete_btn",function(){var s=$(this).closest(".task_panel").data("id"),t=l.find(function(t,e){return t.id==s}),e=l.indexOf(t);l.splice(e,1),localStorage.setItem("data",JSON.stringify(l));var a=d.indexOf(s);d.splice(a,1),localStorage.setItem("sort",JSON.stringify(d)),$(this).closest(".task_panel").fadeOut(function(){c()})}),$(".task_lists").sortable({opacity:.5,items:".task_panel:not(.star)"}),$(".task_lists").on("sortupdate",function(){d=$(this).find(".task_panel").map(function(t,e){return $(e).data("id")}).get(),localStorage.setItem("sort",JSON.stringify(d))}),c()});
//# sourceMappingURL=todolist.js.map
