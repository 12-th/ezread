class Node {
  constructor() {
    this.child = [];
    this.name = '';
    this.anchor = '';
  }
  isValid() {
    return this.child.length != 0 || this.name != '';
  }
}


function buildContents() {
  var stack = new Array(5);
  for (let i = 0; i < 5; ++i) stack[i] = new Node();

  function stackMerge(index) {
    for (let i = 4; i >= index; --i) {
      if (stack[i].isValid()) {
        stack[i - 1].child.push(stack[i]);
        stack[i] = new Node();
      }
    }
  }

  function pushToStack(index, str, anchor) {
    if (!stack[index].isValid()) {
      stack[index].name = str;
      stack[index].anchor = anchor;
      return;
    }
    stackMerge(index);
    stack[index].name = str;
    stack[index].anchor = anchor;
  }

  function NodeToHtml(anchor, extradata, name, nextLevel) {
    let res = '';
    if (extradata === '') {
      let button = '';
      if (name === '') name = '&nbsp';
      if (nextLevel !== '')
        button = '<span class="btn">-</span>&ensp;';
      else
        button = '<span class="padding">&ensp;</span>&ensp;';
      if (anchor !== '')
        res += '<div class="entry" data-href="' + anchor + '">' + button +
            name + '</div>';
      else
        res += '<div class="entry">' + name + '</div>';
      if (nextLevel !== '')
        res += '<div class="container">' + nextLevel + '</div>';
      return res;
    }

    res = '<div class="entry content-tittle">' + extradata + name + '</div>' +
        '<div class="container">' + nextLevel + '</div>';
    return res;
  }

  function convertToContentsImpl(node) {
    if (node.isValid()) {
      let tmp = '';
      for (let i = 0; i < node.child.length; ++i) {
        let nextres = convertToContentsImpl(node.child[i]);
        if (nextres) tmp += nextres;
      }
      return NodeToHtml(node.anchor, '', node.name, tmp);
    }
    return undefined;
  }

  function convertToContents(node) {
    if (node.isValid()) {
      let tmp = '';
      for (let i = 0; i < node.child.length; ++i) {
        let nextres = convertToContentsImpl(node.child[i]);
        if (nextres) tmp += nextres;
      }
      let extradata = '<span class="btn-fold-all">-</span>&ensp;' +
          '<span class="btn-unfold-all">+</span>&ensp;';
      return NodeToHtml('', extradata, $(document).attr('title'), tmp);
    }
    return undefined;
  }
  let eles = $('#post-text .article-text').children('h1,h2,h3,h4');
  eles.each(function() {
    if ($(this).is('h1')) {
      pushToStack(1, $(this).text(), $(this).attr('id'));
    } else if ($(this).is('h2')) {
      pushToStack(2, $(this).text(), $(this).attr('id'));
    } else if ($(this).is('h3')) {
      pushToStack(3, $(this).text(), $(this).attr('id'));
    } else if ($(this).is('h4')) {
      pushToStack(4, $(this).text(), $(this).attr('id'));
    }
  });
  stackMerge(1);
  if (stack[0].child.length == 1) {
    return convertToContents(stack[0].child[0]);
  }
  return convertToContents(stack[0]);
}

function contentInit() {
  let content_text = buildContents();
  if (content_text) {
    $('#post-content').append(content_text);
  }
  $('#post-content .entry').on('click', function() {
    let href = $(this).attr('data-href');
    if (href) {
      let top = $('#' + href).offset().top;
      $('html,body').animate({scrollTop: top}, 'slow');
    }
  });
  $('#post-content .content-tittle').on('click', function() {
    $('html,body').animate({scrollTop: '0px'}, 'slow');
  });
}

function contentPositionSet() {
  let totalHeight = $(window).height();
  let content = $('#post-content');
  let btn_sidebar = $('#btn-sidebar');
  let restHeight =
      totalHeight - btn_sidebar.position().top - btn_sidebar.outerHeight();
  content.css({'height': '' + restHeight});
}

function btn_contentPositionSet() {
  let btn = $('#btn-content');
  let btn_sidebar = $('#btn-sidebar');
  let top = btn_sidebar.offset().top;
  let left =
      btn_sidebar.offset().left + btn_sidebar.outerWidth() + btn.outerWidth();
  btn.offset({top: top, left: left});
}

function btn_content_click() {
  let btn = $('#btn-content');
  let grid = $('#post-grid');
  let content = $('#post-content');
  if (btn.text() === '⇦') {
    btn.text('⇨');
    grid.css({'grid-template-columns': '125px auto 125px'});
    content.hide();
  } else {
    btn.text('⇦');
    grid.css({'grid-template-columns': '250px auto'});
    content.show();
  }
}

function content_fold(btn, container, fold) {
  if (fold) {
    container.hide();
    btn.text('+');
  } else {
    container.show();
    btn.text('-');
  }
}

function content_fold_btn_click() {
  let btn = $(this);
  let container = btn.parent().next();
  content_fold(btn, container, btn.text() == '-');
  return false;
}

function content_fold_all() {
  let btns = $('#post-content .btn');
  btns.each(function() {
    let btn = $(this);
    let container = btn.parent().next();
    content_fold(btn, container, true);
  })
}

function content_unfold_all() {
  let btns = $('#post-content .btn');
  btns.each(function() {
    let btn = $(this);
    let container = btn.parent().next();
    content_fold(btn, container, false);
  })
}

$(function() {
  contentInit();
  contentPositionSet();
  btn_contentPositionSet();
  $(window).resize(contentPositionSet);
  $(window).resize(btn_contentPositionSet);
  $('#btn-content').on('click', btn_content_click);
  $('#post-content .btn').on('click', content_fold_btn_click);
  $('#post-content .btn-fold-all').on('click', content_fold_all);
  $('#post-content .btn-unfold-all').on('click', content_unfold_all);
  content_fold_all();
  $('#btn-content').click();
})