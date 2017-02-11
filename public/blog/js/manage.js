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
    // console.log(blog)
    var showHide = blog.publish?"":"hidden";
    var result =  '<li class="blog-list-li" data-id="'+blog._id+'">'+'<div class="blog-panel"><div class="blog-panel-title">'+(blog.title||"")+'</div><div class="blog-panel-keywords">'+(blog.keywords||"")+'</div><div class="blog-panel-digest">'+(blog.digest||"")+
        '</div></dvi><div class="blog-panel-button"><span class="dropdown-toggle glyphicon glyphicon-menu-down" data-toggle="dropdown"></span><ul class="dropdown-menu dropdown-menu-right"><li><a class="blog-panel-menuitem blog-panel-menuitem-edit">Edit</a></li>' +
        '<li '+(showHide)+'><a class="blog-panel-menuitem blog-panel-menuitem-unpublish">UnPublish</a></li>'+
        '<li><a class="blog-panel-menuitem blog-panel-menuitem-delete">Delete</a></li></ul></div>'+'</li>'
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

    $('.blog-list').on('click','.blog-panel-menuitem-unpublish',function (e) {
        var curLi = $(e.target).closest('.blog-list-li')
        var id=curLi.data('id')
        $.ajax({
            type:"POST",
            url:'/blog/unpublish',
            data:{
                blogId:id
            },
            success:function (msg) {
                console.log(msg)
                $(e.target).hide()
            },
            error:function (xhr) {
                console.log(xhr)
            }
        })
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