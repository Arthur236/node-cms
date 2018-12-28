/* eslint-disable */
$(".sidebar-dropdown > a").click(function () {
  $(".sidebar-submenu").slideUp(200);
  $(this).find(".link-arrow").toggleClass("down");
  
  if ($(this).parent().hasClass("active")) {
    $(".sidebar-dropdown").removeClass("active");
    $(this).parent().removeClass("active");
    $(this).find(".link-arrow").removeClass("fa-angle-down").addClass("fa-angle-right");
  } else {
    $(".sidebar-dropdown").removeClass("active");
    $(this).next(".sidebar-submenu").slideDown(200);
    $(this).parent().addClass("active");
    $(this).find(".link-arrow").removeClass("fa-angle-right").addClass("fa-angle-down");
  }
});

$("#close-sidebar").click(function () {
  $(".page-wrapper").removeClass("toggled");
});

$("#show-sidebar").click(function () {
  $(".page-wrapper").addClass("toggled");
});
