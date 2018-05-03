$(function () {

    var $templatesWrapper = $('.templates-wrapper')



    init()

    registerAction()

    function registerAction() {
        $templatesWrapper.on('click','.template-btn-collect',function (e) {
            var id = $(e.target).closest('.template-panel').data('id')
            console.log(id)
            if(id){
                collectTemplate(id)
            }
        })
    }


    function init() {
        //load template lists
        $.ajax({
            type:'get',
            url:'/templates/center',
            success:function (data) {
                console.log(data)
                data = JSON.parse(data)||[]
                renderTemplateList(data)
            },
            error:function (err) {
                showErr(err)
            }
        })
    }

    function collectTemplate(id) {
        $.ajax({
            type:'post',
            url:'/templates/collect',
            data:{
              templateId:id
            },
            success:function (data) {
                console.log(data)
            },error:function (err) {
                showErr(err)
            }
        })
    }

    function renderTemplateList(templates) {
        var templateStr = ""
        templates = templates||[]
        templates.forEach(function (template) {
            templateStr += renderTemplate(template)
        })
        $templatesWrapper.html(templateStr)
    }

    function renderTemplate(template) {
        return '<div class="template-panel-wrapper col-md-3" >'+'<div class="template-panel" data-id="'+template._id+'">' +
                    '<div class="template-thumbnail-wrapper">' +
                        '<div class="template-thumbnail-container">' +
                            '<img class="template-thumbnail" src="'+template.thumbnail+'">'+
                            '<div class="template-info"><div class="template-info-title">'+template.name+'</div><div class="template-info-size">'+template.resolution+'</div></div>'+
                        '</div>'+

                        '<div class="template-btns col"><button class="btn btn-default template-btn-collect pull-right" >收藏</button></div> '+
                    '</div>' +
            '</div>' + '</div>'
    }


    function showErr(err,cb) {
        console.log(err)
        cb && cb()
    }
})