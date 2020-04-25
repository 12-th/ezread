async function GetTagAllPosts(tagWidget)
{
    let info = tagWidget.children(".hidden-info");
    if(info.length>0)
        return info.text();
    let res = {posts:[]};
    let url = tagWidget.attr("href");
    do
    {
        let page = await $.ajax({url:url});
        let text = $("<div></div>").append(page).find("#tag-info").text();
        let jsobj = JSON.parse(text);
        res.posts = res.posts.concat(jsobj.posts);
        url = jsobj.next_link;
    }while(url != "");
    tagWidget.append("<xmp class='hidden-info' style='display:none'>"+JSON.stringify(res)+"</xmp>");
    return tagWidget.children(".hidden-info").text();
}

async function TagItemClick(tagWidget){
    if(tagWidget.parent().hasClass("chosen"))
        return;
    let info = await GetTagAllPosts(tagWidget);
    let parent = $("#tag-index .timeline-parent");
    TimeLineReset(parent);
    InitTimeLine(info, parent);
    TimeLineClickCallBackSet(parent);
    tagWidget.parent().siblings(".chosen").removeClass("chosen");
    tagWidget.parent().addClass("chosen");
}

function SetDefaultTimeLine()
{
    let defaultInfo =  JSON.stringify({"posts":[{"date":"oops~~~~","title":"还没有创建任何tag","url":"#"},{"date":"oops~~~~","title":"快创建一个tag吧~~","url":"#"}]});
    let parent = $("#tag-index .timeline-parent");
    InitTimeLine(defaultInfo, parent);
    TimeLineClickCallBackSet(parent);
    let defaultList = "<ul class='tag-list' itemprop='keywords'><li class='tag-list-item chosen'><a class='tag-list-link' href='#' rel='tag'>我不是tag</a></li></ul>";
    $("#tag-index .list-tags").append(defaultList);
}

$(function(){
    if($("#tag-index .list-tags").children().length<=0)
    {
        SetDefaultTimeLine();
    }
    else
    {
        $("#tag-index .list-tags a").on('click',function(e){
            TagItemClick($(this));
            return false;
        });
        $("#tag-index .list-tags a").first().click();
    }
});