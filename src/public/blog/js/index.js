/**
 * Created by changecheng on 2017/2/10.
 */

var tool = $('#blog-right-operate');


var blogs;
var $blogUL =$('.blog-list-menu')
function loadFromServer() {
    var pageQuery = window.location.search
    $.ajax({
        type:'GET',
        url:"/blog/getallpublishedblogs"+pageQuery,

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
    var pTime = blog.publishTime;

    var showTime;
    if (pTime){
        showTime = moment(pTime).local().format('YYYY-MM-DD')
    }else{
        showTime = moment().local().format('YYYY-MM-DD')
    }

    var result =  '<li class="blog-list-li" data-id="'+blog._id+'">'+
        '<div class="blog-panel"><div class="blog-panel-title">'+(blog.title||"")+
        '</div><div class="blog-panel-keywords">'+(blog.keywords||"")+
        '</div><div class="blog-panel-digest">'+(blog.digest||"")+
        '</div><div class="blog-panel-time">'+showTime+'</div></div>'+'</li>';

    var tpl = '<li class="blog-list__item blog-list-li blog-panel-title" data-id="'+blog._id+'">'+
        '<h3><img src="../../public/blog/img/star.png"/><span class="blog-list__item-title">'+(blog.title||"")+'</span></h3>'+
        '<div class="blog-list__item-param">'+
            '<div class="blog-param__item">'+
                '<img src="../../public/blog/img/author.png"/>'+
                '<span class="blog-param__item-text">GraphiChina</span>'+
            '</div>'+
            '<span class="parting-line"></span>'+
            '<div class="blog-param__item">'+
                '<span class="blog-param__item-text">'+showTime+'</span>'+
            '</div>'+
            '<span class="parting-line"></span>'+
            '<div class="blog-param__item">'+
                '<img src="../../public/blog/img/see.png"/>'+
                '<span class="blog-param__item-text">666</span>'+
            '</div>'+
            '<span class="parting-line"></span>'+
            '<div class="blog-param__item">'+
                '<img src="../../public/blog/img/comment.png"/>'+
                '<span class="blog-param__item-text">999</span>'+
            '</div>'+
        '</div>'+
        '<div class="blog-list__item-surface">'+
            '<img src="../../public/blog/img/img.png"/>'+
        '</div>'+
        '<div class="blog-list__item-content">'+
            '<p>'+(blog.digest||"")+'</p>'+
        '</div>'+
    '</li>';
    return tpl;
}

function bindEvent() {

    $('.blog-list').on('click','.blog-panel-title',function (e) {
        var id=$(e.target).closest('.blog-list-li').data('id')
        window.open('/blog/post?id='+id)
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
