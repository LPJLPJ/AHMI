/**
 * Created by changecheng on 2017/2/8.
 */
var $save = $('#save')
var $pubish = $('#publish')
var $content = $('.note-editable')
var $title = $('#title')
var $desp = $('#desp')
var $keywords = $('#keyword')
var $category = $('#category')
var $summernote = $('#summernote')
var currentId = null;
function exportContent() {
    return $content.html()
}

function exportInfo() {
    return {
        title:$title.val(),
        desp:$desp.val(),
        keywords:$keywords.val(),
        category:$category.val()
    }
}

function isInfoValid(info) {
    for (var elem in info){
        if (info.hasOwnProperty(elem)&&!info[elem]){
            return false
        }
    }
    return true;
}


function getDigestOfContent(content,num) {
    var totalText = $('<div />').html(content).text()
    var length = totalText.length
    return num > length? totalText.slice(0,num):totalText
}

function generateArticle() {
    var blogInfo = exportInfo()
    var blogContent = exportContent()
    if (!isInfoValid(blogInfo)){
        console.log('info incomplete')
    }else{
        blogInfo.digest = getDigestOfContent(blogContent,100)
        // console.log(blogInfo)
    }
    return {
        info:blogInfo,
        content:blogContent
    }
}

function generateDraft() {
    var blogInfo = exportInfo()
    var blogContent = exportContent()
    return {
        info:blogInfo,
        content:blogContent
    }
}

function saveNewDraft(newDraft,scb,fcb) {
    $.ajax({
        type:'POST',
        data:newDraft,
        url:"/blog/savedraft",
        success:function (msg) {
            scb&&scb(msg)
        },
        fail:function (xhr, status) {
            fcb && fcb(xhr,status)
        }
    })
}

function publishToServer(newDraft,scb,fcb) {
    $.ajax({
        type:'POST',
        data:newDraft,
        url:"/blog/publish",
        success:function (msg) {
            scb&&scb()
        },
        fail:function (xhr, status) {
            fcb && fcb()
        }
    })
}

$save.click(function (e) {
    e.preventDefault();
    var newDraft = generateDraft()
    newDraft.blogId = currentId
    saveNewDraft(newDraft,function (msg) {
        console.log(msg)
    },function (xhr,status) {
        console.log(xhr)
    })
})

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
function updateBlogFromData(data) {
    $title.val(data.title)
    $desp.val(data.desp)
    $keywords.val(data.keywords)
    // $category.val()
    $summernote.summernote('code',data.content)
}
function loadFromServer() {
    if (currentId){
        $.ajax({
            type:'GET',
            url:"/blog/getlastmodified",
            data:{
                blogId:currentId
            },
            success:function (msg) {
                console.log(msg)
                updateBlogFromData(JSON.parse(msg))
            },
            fail:function (xhr, status) {

            }
        })
    }

}
function init() {
    currentId = parseQuery().id
    $summernote.summernote('library.setUploadUrl','/blog/resources/upload?blogId='+currentId)
    $summernote.summernote('library.setRetriveUrl','/blog/resources/getresources?blogId='+currentId)
    $summernote.summernote('library.setResourceUrl','/public/blog/media')
    $summernote.summernote('library.setDeleteUrl','/blog/resources/deleteresource?blogId='+currentId)
}

init()

loadFromServer()