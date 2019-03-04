/**
 * Created by changecheng on 2017/2/10.
 */

var tool = $('#blog-right-operate');


var blogs;
var $blogUL =$('#all-blog-menu');
var $myBlog = $('#my-blog-menu');
var $recommend = $('#blog-recommend');
function loadFromServer() {
    var pageQuery = window.location.search
    $.ajax({
        type:'GET',
        url:"/blog/getallpublishedblogs"+pageQuery,

        success:function (msg) {
            blogs = JSON.parse(msg);
            $blogUL.html(renderBlogs(blogs));
        },
        error:function (xhr) {
            console.log(xhr)
        }
    })
}

function loadMyBlog(){
    $.ajax({
        type:'get',
        url:'/blog/getMyBlog',
        success:function(data){
            var myBlog = JSON.parse(data);
            $myBlog.html(renderBlogs(myBlog));
        },
        error:function(){

        }
    })
}

function loadRecommendBlog(){
    $.ajax({
        type:'get',
        url:'/blog/getRecommend',
        success:function(data){
            var myBlog = JSON.parse(data);
            $recommend.html(renderRecommends(myBlog));
        },
        error:function(){

        }
    })
}

//recommend
function renderRecommends(blogs){
    var blogData = '';
    for(var i=0;i<blogs.length;i++){
        blogData+='<p data-id="'+blogs[i]._id+'">'+(blogs[i].title||"Graphichina")+'</p>'
    }
    return blogData;
}

//all
function renderBlogs(blogs) {
    var result = "";
    for (var i=0;i<blogs.length;i++){
        result+=renderSingleBlog(blogs[i]);
    }
    return result
}

function renderSingleBlog(blog) {
    var pTime = blog.publishTime;
    var coverImg = blog.cover?"/public/blog/media/"+blog._id+"/"+blog.cover:'/public/blog/img/img.png';

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
                '<span class="blog-param__item-text">'+(blog.author||"Graphichina")+'</span>'+
            '</div>'+
            '<span class="parting-line"></span>'+
            '<div class="blog-param__item">'+
                '<span class="blog-param__item-text">'+showTime+'</span>'+
            '</div>'+
            '<span class="parting-line"></span>'+
            '<div class="blog-param__item">'+
                '<img src="../../public/blog/img/see.png"/>'+
                '<span class="blog-param__item-text">'+blog.visits+'</span>'+
            '</div>'+
            '<span class="parting-line"></span>'+
            '<div class="blog-param__item">'+
                '<img src="../../public/blog/img/comment.png"/>'+
                '<span class="blog-param__item-text">'+blog.commentNum+'</span>'+
            '</div>'+
        '</div>'+
        '<div class="blog-list__item-surface">'+
            '<img src='+coverImg+' />'+
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
    });

    $('.blog-list').on('click','.blog-panel-menuitem-edit',function (e) {
        var id=$(e.target).closest('.blog-list-li').data('id')
        window.open('/blog/editor?id='+id)
    });

    $('#blog-recommend').on('click','p',function(){
        var id = $(this).attr('data-id');
        window.open('/blog/post?id='+id)
    });

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
                console.log(msg);
                newWindow.location.href = '/blog/editor?id='+msg;
            }.bind(this),
            error:function (xhr) {
                console.log(xhr);
            }
        })
    })
}

bindEvent();

loadFromServer();

loadMyBlog();

loadRecommendBlog();

$('.blog-nav-list').on('click','li',function(){
    $(this).addClass('active').siblings('li').removeClass('active');
    var id = $(this).attr('data-id');
    $('#'+id).show().siblings('.blog-list-content').hide();
});