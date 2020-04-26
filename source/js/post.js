function SingleFold(ch, btn)
{
  let list = btn.parent().siblings(".toc-child");
  if(ch == '-')
  {
    btn.text('+');
    list.hide();
  }
  else
  {
    btn.text('-');
    list.show();
  }
}

function FoldAll(){
  $("#post .toc .btn-fold").each(function(){
    SingleFold('-',$(this));
  });
}

function UnfoldAll(){
  $("#post .toc .btn-fold").each(function(){
    SingleFold('+',$(this));
  });
}

function TocFold(e){
  SingleFold($(this).text(), $(this));
  e.stopPropagation();
}

function ScrollToAnchor()
{
  let link = $(this).children('.toc-link');
  let offset = $(link.attr('href')).offset().top;
  $('html, body').animate({
    scrollTop: offset
  }, 'slow');
}

function TocBtnClick(){
  let toc = $("#post .div-toc");
  let grid = $("#post .post-grid");
  if($(this).text()=='⇦')
  {
    toc.css({left:-toc.width()});
    grid.css({left:-toc.width()/2});
    $(this).text('⇨');
  }
  else
  {
    toc.css({left:0});
    grid.css({left:0});
    $(this).text('⇦');
  }
}

function TocAddButton()
{
  $("#post .toc .toc-link").wrap('<div class="link-wrapper"></div>');
  let wrapper = $("#post .toc .toc-child").siblings(".link-wrapper");
  wrapper.prepend('<span class="btn-fold">-</span>');
  wrapper.addClass('canfold');
  wrapper = $("#post .toc .link-wrapper").not('.canfold');
  wrapper.prepend('<span class="padding">&nbsp</span>');
  
  wrapper = $("#post .toc .link-wrapper");
  wrapper.on('click', ScrollToAnchor);
  let btns = $("#post .toc .btn-fold");
  btns.on('click', TocFold);

  let divtoc = $("#post .div-toc");
  divtoc.prepend('<div class="div-btnfold"><span class="btn-fold-all">-</span><span class="btn-unfold-all">+</span>目录</div>');
  $('#post .div-toc .btn-fold-all').on('click', FoldAll);
  $('#post .div-toc .btn-unfold-all').on('click', UnfoldAll);
  $("#post .btn-toc").on('click', TocBtnClick);
}

function SetTagLinks(){
  $("#post .tag-list-item a").each(function(){
    $(this).attr("href", "/tags/#"+encodeURI($(this).text()));
  })
}

$(function() {
  // '⇨''⇦'
  SetTagLinks();
  TocAddButton();
  $("#post .btn-toc").click();
})