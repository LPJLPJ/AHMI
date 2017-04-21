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
                //async: false,
                url:"/blog/getblogdata",
                data:{
                    blogId:currentId
                },
                success:function (msg) {
                    var msgObj = JSON.parse(msg);
                    var userId = msgObj.authorId;
                    renderBlog(msgObj);
                    msgObj.comments.userId = msgObj.userInfo.id;
                    msgObj.comments.type = msgObj.userInfo.type;
                    renderComments(msgObj.comments);
                },
                error:function (xhr) {

                }
            })
        }
    }
    /**
     * 渲染博客内容
     * @param blog
     */
    function renderBlog(blog) {
        $('title').html(blog.title)
        $title.html(blog.title)
        $keywords.html(blog.keywords)
        contentArea.html(blog.content)
    }
    /**
     * 渲染评论内容
     * @param comments
     */
    function renderComments(comments){
        var tempCommentsHtml = new EJS({url:'../../public/blog/views/commentsPanel.ejs'}).render({comments:comments});
        insertBlogViews(tempCommentsHtml);
    }

    /**
     * 将模板插入视图
     * @param template
     */
    function insertBlogViews(template){
        var submitComment = $('#submitComment');
        submitComment.before(template);
    }

    //提交评论事件
    $('#commentForm').submit(function(e){
        e.preventDefault();
        e.stopPropagation();
        var comment =$.trim(this.comment.value);
        var currentId = parseQuery().id;
        if(comment===''){
            alert('评论不能为空');
            return;
        }else if(comment.length>140){
            alert('评论不能超过140个字符');
        }
        $.ajax({
            method:'POST',
            url:'/blog/post/comment'+'?id='+currentId,
            data:{content:comment},
            success:function(data){
                console.log('data',data);
                window.location.reload();

            },
            error:function(err){
                console.log('err',err);
            }

        })
    });
    //powerJudge()
    loadFromServer()

}())

