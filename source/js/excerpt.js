$(function(){
    $(".except .excerpt-div-more").on('click',function(){
        widow.location.href = $(this).attr('data-href');
    });
})