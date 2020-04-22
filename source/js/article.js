$(function() {
    let codes = $('.article-text figure');
    codes.each(function(){
        $(this).prepend(
        '<div class="article-btns">'+
        '<div class="fold">-</div>'+
        '<div class="copy">copy</div>'+
        '</div>');
    });
    let btn_fold = $('.article-text .fold');
    btn_fold.each(function(){
        $(this).on('click',function(){
            if($(this).text()=='-')
            {
                let tbl = $(this).parent().parent().children('table');
                tbl.hide();
                $(this).text('+');
            }
            else
            {
                let tbl = $(this).parent().parent().children('table');
                tbl.show();
                $(this).text('-');
            }
        });
    });
    let btn_copy = $('.article-text .copy');
    btn_copy.each(function(){
        $(this).on('click', function(){
            let input = $('<textarea></textarea>');
            let tmp = $('<div></div>');
            tmp.html($(this).parent().parent().find('.code').html());
            tmp.find('br').after('<span>&#10;</span>');
            input.text(tmp.text());
            $('body').append(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        });
    });
});