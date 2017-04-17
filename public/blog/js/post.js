/**
 * Created by changecheng on 2017/2/11.
 */
;(function () {
    var contentArea = $('.note-editable')
    var $title =$('.blog-panel-title')
    var $keywords = $('.blog-panel-keywords')
    function parseQuery() {
        var query = window.location.search.slice(1)
        var querys = query.split('&')
        var results = {}
        for (var i=0;i<querys.length;i++){
            var pair = querys[i].split('=')
            results[pair[0]] = pair[1]
        }
        return results;
    }
    function loadFromServer() {
        var currentId = parseQuery().id;
        if (currentId){
            $.ajax({
                type:'GET',
                url:"https://test.graphichina.com/blog/manage",
                data:{
                    blogId:currentId
                },
                success:function (msg) {
                    renderBlog(JSON.parse(msg))
                },
                error:function (xhr) {

                }
            })
        }
    }

    function renderBlog(blog) {
        $('title').html(blog.title)
        $title.html(blog.title)
        $keywords.html(blog.keywords)
        contentArea.html(blog.content)
    }

    loadFromServer()
}())