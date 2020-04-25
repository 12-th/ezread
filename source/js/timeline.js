function JoinItem(date, titles){
    return '<div class=\'item\'><div class=\'icon\'></div><div class=\'date\'><span class="fold">&and;</span>' +
            date + '</div>' +
            '<div class=\'titles\'>' + titles + '</div></div>';
}
function JoinTitle(url, title){
    return '<div class="title-wrapper"><a class=\'article-name\', href="' + url + '">' +
            title + '</a></div>';
}

//text is a json string, likes this: {posts:[{"date":"2020-04-01","title":"foo","url":"/a/b"},{"date":"2008-08-08","title":"bar","url":"/c/d"}]}
//parent- the parent widget that contains time-line
function InitTimeLine(text, parent) {
  info = JSON.parse(text);
  info.posts.sort(function(a, b) {
    if (a.date < b.date) return 1;
    if (b.date < a.date) return -1;
    return 0;
  });
  let lastDate = undefined;
  let titles = '';
  let res = '';
  info.posts.forEach(function(post) {
    let curDate = post.date.substring(0, 7);
    if (!lastDate) {
      lastDate = curDate;
      titles = JoinTitle(post.url, post.title);
    } else {
      if (lastDate == curDate) {
        titles += JoinTitle(post.url, post.title);
      } else {
        res += JoinItem(lastDate, titles);
        titles = JoinTitle(post.url, post.title);
        lastDate = curDate;
      }
    }
  });
  res += JoinItem(lastDate, titles);
  parent.children(".time-line").append(res);
}

// parent- the parent widget that contains time-line
function TimeLineClickCallBackSet(parent){
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
    parent.find(".time-line .item .date").on('click', clickfn);
    parent.find(".time-line .item .icon").on('click', clickfn);
}

function TimeLineReset(parent){
  parent.find(".time-line").children(".item").remove();
}