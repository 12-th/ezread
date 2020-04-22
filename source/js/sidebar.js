function open_sidebar() {
  $('#mask').fadeIn(500);
  $('#sidebar').animate({left: '0'}, 500);
}

function close_sidebar() {
  let sidebar = $('#sidebar');
  $('#mask').fadeOut(500);
  sidebar.animate({left: -sidebar.width()}, 500);
}

$(function() {
  $('#btn-sidebar').on('click', open_sidebar);
  $('#mask').on('click', close_sidebar);
})