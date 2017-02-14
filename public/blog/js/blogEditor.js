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
var editorStatus={}
editorStatus.types = {
    normal:'normal',
    success:'success',
    warning:'warning',
    error:'error'
}
editorStatus.init = function (elem) {
    this.elem = $(elem)
}
editorStatus.show = function (msg,type) {
    this.elem.text(msg);
    if (!type){
        type = this.types.normal
    }
    this.changeType(type)
}
editorStatus.changeType = function (type) {
    if (type){
        this.elem.addClass('editor-status-'+type)
    }
}
editorStatus.clear = function (msg,type) {
    this.show("")
}
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
    blogInfo.digest = getDigestOfContent(blogContent,100)
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
        error:function (xhr) {
            fcb && fcb(xhr)
        }
    })
}

function publishToServer(newDraft,scb,fcb) {

    $.ajax({
        type:'POST',
        data:newDraft,
        url:"/blog/publish",
        success:function (msg) {
            scb&&scb(msg)
        },
        error:function (xhr) {
            fcb && fcb(xhr)
        }
    })
}

function toggleSubmitButtons(op) {
    op = !(!!op)
    $save.attr('disabled',op)
    $pubish.attr('disabled',op)
}

$save.click(function (e) {
    e.preventDefault();
    var newDraft = generateDraft()
    newDraft.blogId = currentId
    toggleSubmitButtons(false);
    editorStatus.show('保存中...')
    saveNewDraft(newDraft,function (msg) {
        editorStatus.show('保存成功','success')
        toggleSubmitButtons(true)

    },function (xhr,status) {
        editorStatus.show('保存失败','error')
        toggleSubmitButtons(true)
    })
})

$pubish.click(function (e) {
    e.preventDefault();
    var newBlog = generateArticle()
    newBlog.blogId = currentId
    toggleSubmitButtons(false)
    editorStatus.show('发布中...')
    publishToServer(newBlog,function (msg) {
        editorStatus.show('发布成功','success')
        toggleSubmitButtons(true)
    },function (xhr, status) {
        editorStatus.show('发布失败','error')
        toggleSubmitButtons(true)
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
        editorStatus.show("载入中...")
        $.ajax({
            type:'GET',
            url:"/blog/getlastmodified",
            data:{
                blogId:currentId
            },
            success:function (msg) {
                updateBlogFromData(JSON.parse(msg))
                editorStatus.show("载入成功")
            },
            error:function (xhr) {
                editorStatus.show("载入失败",'error')
            }
        })
    }

}

function getUrlPrefix() {
    var loc = window.location
    if ((loc.protocol == "http:" && loc.port==80)||(loc.protocol=="https:"&&loc.port==443)){
        //no need for port
        return loc.protocol+"//"+loc.hostname
    }else{
        return loc.protocol+"//"+loc.hostname+":"+loc.port
    }

}

function init() {
    var urlPrefix = getUrlPrefix()
    currentId = parseQuery().id
    $summernote.summernote('library.setUploadUrl',urlPrefix+'/blog/resources/upload?blogId='+currentId)
    $summernote.summernote('library.setRetriveUrl',urlPrefix+'/blog/resources/getresources?blogId='+currentId)
    $summernote.summernote('library.setResourceUrl',urlPrefix+'/public/blog/media')
    $summernote.summernote('library.setDeleteUrl',urlPrefix+'/blog/resources/deleteresource?blogId='+currentId)
    //init status
    editorStatus.init('.editor-status')
}

init()

loadFromServer()