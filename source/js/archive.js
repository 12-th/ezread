function JoinItem(date, titles){
    return '<div class=\'item\'><div class=\'icon\'></div><div class=\'date\'><span class="fold">&and;</span>' +
            date + '</div>' +
            '<div class=\'titles\'>' + titles + '</div></div>';
}
function JoinTitle(url, title){
    return '<div class="title-wrapper"><a class=\'article-name\', href="' + url + '">' +
            title + '</a></div>';
}

function InitArchiveList() {
  let info = JSON.parse($('#archives-info').text());
  info.posts.sort(function(a, b) {
    if (a.date < b.date) return 1;
    if (b.date < a.date) return -1;
    return 0;
  });
  info.posts.forEach(function(post){
    console.log(post.date);
  })
  let lastDate = undefined;
  let titles = '';
  let list = $('#archives .list');
  info.posts.forEach(function(post) {
    let curDate = post.date.substring(0, 7);
    if (!lastDate) {
      lastDate = curDate;
      titles = JoinTitle(post.url, post.title);
    } else {
      if (lastDate == curDate) {
        titles += JoinTitle(post.url, post.title);
      } else {
        let newItem = JoinItem(lastDate, titles);
        list.append(newItem);
        titles = JoinTitle(post.url, post.title);
        lastDate = curDate;
      }
    }
  });
  let newItem = JoinItem(lastDate, titles);
  list.append(newItem);
  $('#archives-info').text(JSON.stringify(info));
}

function ClickCallBackSet(){
  let clickfn = function(){
    let fold = $(this).parent().find('.date .fold');
    let flag = fold.text();
    if(flag == '∧')
    {
        $(this).siblings(".titles").slideUp('fast');
        fold.text('∨');
    }
    else{
        $(this).siblings(".titles").slideDown('fast');
        fold.text('∧');
    }
};
    $("#archives .list .item .date").on('click', clickfn);
    $("#archives .list .item .icon").on('click', clickfn);
}

$(function() {
  InitArchiveList();
  ClickCallBackSet();
})