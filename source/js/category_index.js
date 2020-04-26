async function GetTagAllPosts(widget)
{
    let info = widget.children(".hidden-info");
    if(info.length>0)
        return info.text();
    let res = {posts:[]};
    let url = widget.attr("href");
    do
    {
        let page = await $.ajax({url:url});
        let text = $("<div></div>").append(page).find("#category-info").text();
        let jsobj = JSON.parse(text);
        res.posts = res.posts.concat(jsobj.posts);
        url = jsobj.next_link;
    }while(url != "");
    widget.append("<xmp class='hidden-info' style='display:none'>"+JSON.stringify(res)+"</xmp>");
    return widget.children(".hidden-info").text();
}

async function TagItemClick(widget){
    if(widget.siblings(".bottom-line").hasClass("chosen"))
        return;
    let info = await GetTagAllPosts(widget);
    let parent = $("#category-index .timeline-parent");
    TimeLineReset(parent);
    InitTimeLine(info, parent);
    TimeLineClickCallBackSet(parent);
    $("#category-index .list-categories .chosen").removeClass("chosen");
    widget.siblings(".bottom-line").addClass("chosen");
}

function SetDefaultTimeLine()
{
    let defaultInfo =  JSON.stringify({"posts":[{"date":"oops~~~~","title":"还没有创建任何category","url":"#"},{"date":"oops~~~~","title":"快创建一个category吧~~","url":"#"}]});
    let parent = $("#category-index .timeline-parent");
    InitTimeLine(defaultInfo, parent);
    TimeLineClickCallBackSet(parent);
    let defaultList = "<ul class='category-list'><li class='category-list-item'><a class='category-list-link' href='#'>我不是category</a></li></ul>"
    $("#category-index .list-categories").append(defaultList);
}

function InitCategoryBottomLine()
{
    $("#category-index .list-categories a").after("<div class='bottom-line'></div>");
}

$(function(){
    if($("#category-index .list-categories").children().length<=0)
    {
        SetDefaultTimeLine();
        InitCategoryBottomLine();
    }
    else
    {
        InitCategoryBottomLine();
        $("#category-index .list-categories a").on('click',function(e){
            TagItemClick($(this));
            return false;
        });
        let chosenItem = decodeURI(window.location.hash.substring(1)).toLowerCase();
        if(chosenItem=="")
            $("#category-index .list-categories a").first().click();
        else
            $("#category-index .list-categories a").each(function(){
                if($(this).text().toLowerCase()==chosenItem)
                    $(this).click();
            });
    }
});