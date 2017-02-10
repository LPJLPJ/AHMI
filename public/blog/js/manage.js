/**
 * Created by changecheng on 2017/2/9.
 */

var blogs
var $blogUL =$('.blog-list')
function loadFromServer() {
    $.ajax({
        type:'GET',
        url:"/blog/getallblogs",

        success:function (msg) {
            blogs = JSON.parse(msg)
            $blogUL.html(renderBlogs(blogs))
        },
        fail:function (xhr, status) {

        }
    })
}

function renderBlogs(blogs) {
    var result = ""
    for (var i=0;i<blogs.length;i++){
        result+=renderSingleBlog(blogs[i])
    }
    return result
}

function renderSingleBlog(blog) {
    return '<li class="blog-list-li">'+blog._id+'</li>'
}

function bindEvent() {
    $('.blog-list').click(function (e) {
        // console.log(e.target.innerText)
        window.open('/blog/editor?id='+e.target.innerText)
    })

    $('#create').click(function (e) {
        $.ajax({
            type:"GET",
            url:'/blog/createblog',
            success:function (msg) {
                console.log(msg)
            },
            fail:function (xhr, status) {

            }
        })
    })
}

bindEvent()

loadFromServer()