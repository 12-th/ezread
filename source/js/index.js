$(function(){
    let strs = $('#site-strings').text().split(',');
    if(strs.length>0)
    {
        let index = Math.round(Math.random()*(strs.length-1));;
        $('#site-description').text(strs[index]);
    }
});