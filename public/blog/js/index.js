/**
 * Created by changecheng on 2017/2/10.
 */

var blogs
var $blogUL =$('.blog-list')
function loadFromServer() {
    $.ajax({
        type:'GET',
        url:"/blog/getallpublishedblogs",

        success:function (msg) {
            blogs = JSON.parse(msg)
            console.log(blogs)
            $blogUL.html(renderBlogs(blogs))
        },
        error:function (xhr) {
            console.log(xhr)
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
    var pTime = blog.publishTime;

    var showTime;
    if (pTime){
        showTime = moment(pTime).local().format('YYYY-MM-DD')
    }else{
        showTime = moment().local().format('YYYY-MM-DD')
    }
    console.log(pTime,showTime)

    var result =  '<li class="blog-list-li" data-id="'+blog._id+'">'+'<div class="blog-panel"><div class="blog-panel-title">'+(blog.title||"")+'</div><div class="blog-panel-keywords">'+(blog.keywords||"")+'</div><div class="blog-panel-digest">'+(blog.digest||"")+
        '</div><div class="blog-panel-time">'+showTime+'</div></div>'+'</li>'
    return result;
}

function bindEvent() {

    $('.blog-list').on('click','.blog-panel-title',function (e) {

        // window.open('/blog/editor?id='+e.currentTarget.parentNode.parentNode.dataset.id)
    })

    $('.blog-list').on('click','.blog-panel-menuitem-edit',function (e) {
        var id=$(e.target).closest('.blog-list-li').data('id')
        window.open('/blog/editor?id='+id)
    })

    $('.blog-list').on('click','.blog-panel-menuitem-delete',function (e) {
        var curLi = $(e.target).closest('.blog-list-li')
        var id=curLi.data('id')
        $.ajax({
            type:"DELETE",
            url:'/blog/deleteblog',
            data:{
                blogId:id
            },
            success:function (msg) {
                curLi.remove()
            },
            error:function (xhr) {
                console.log(xhr)
            }
        })
    })

    $('#create').click(function (e) {
        var newWindow = window.open("","_blank");
        $.ajax({
            type:"GET",
            url:'/blog/createblog',
            success:function (msg) {
                console.log(msg)
                newWindow.location.href = '/blog/editor?id='+msg;
            }.bind(this),
            error:function (xhr) {
                console.log(xhr)
            }
        })
    })
}

bindEvent()

loadFromServer()
