"use strict";$(function(){new PerfectScrollbar(".comic_page_viewer_nav");$(".comic_chapters_lists a").click(function(e){e.preventDefault(),$(".comic_index").addClass("d-none"),$(".comic_page").removeClass("d-none"),window.scrollTo(0,0)}),$(".comic_page_title").click(function(e){e.preventDefault(),$(".comic_index").removeClass("d-none"),$(".comic_page").addClass("d-none"),window.scrollTo(0,0)}),$("#view_mode").click(function(){$("#app").toggleClass("dark")});var t={currentPage:1,totalPage:12,currentPageUrl:function(){return"https://hexschool.github.io/THE_F2E_Design/week5-comic%20viewer/assets/storyboard-"+this.currentPage+".png"},checkViewerBtn:function(){$(".viewer_btn").removeAttr("disabled"),1==this.currentPage?$(".viewer_btn.left").attr("disabled",!0):this.currentPage==this.totalPage&&$(".viewer_btn.right").attr("disabled",!0)},updateSelectChapter:function(){$(".select_page option").removeAttr("selected"),$('.select_page option[value="p-'+this.currentPage+'"]').attr("selected",!0)}},c=$(".comic_page_viewer img")[0];$(".page").click(function(){$(".page").removeClass("active"),$(this).addClass("active"),t.currentPage=$(this).data("page");var e=$(".comic_page_viewer_nav")[0];e.scrollLeft=$(this)[0].offsetLeft-e.offsetLeft-e.offsetWidth/2+$(this)[0].offsetWidth/2,c.src=t.currentPageUrl(),t.checkViewerBtn(),t.updateSelectChapter()}),$(".viewer_nav_btn").click(function(){var e=$(".comic_page_viewer_nav")[0].offsetWidth;$(this).is(".left")?$(".comic_page_viewer_nav")[0].scrollLeft=0:$(".comic_page_viewer_nav")[0].scrollLeft=$(".comic_page_viewer_nav")[0].scrollWidth-e}),$(".viewer_btn").click(function(){$(this).is(".left")?t.currentPage--:t.currentPage++,$('.page[data-page="'+t.currentPage+'"]').click(),t.checkViewerBtn()}),$(".select_page").change(function(){var e=$(this).val().split("-")[1];t.currentPage=parseInt(e),$('.page[data-page="'+t.currentPage+'"]').click()}),$(".comic_page_viewer img").click(function(){$(this).parent().addClass("fullscreen")}),$(".close_btn").click(function(){$(this).closest(".comic_page_viewer").removeClass("fullscreen")})});
//# sourceMappingURL=comic-viewer.js.map