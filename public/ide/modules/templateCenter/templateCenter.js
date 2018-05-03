$(function () {

    var $templatesWrapper = $('.templates-wrapper')



    init()


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

    function renderTemplateList(templates) {
        var templateStr = ""
        templates = templates||[]
        templates.forEach(function (template) {
            templateStr += renderTemplate(template)
        })
        $templatesWrapper.html(templateStr)
    }

    function renderTemplate(template) {
        return '<div class="template-panel">' +
                    '<div class="template-thumbnail-wrapper">' +
                        '<div class="template-thumbnail-container">' +
                            '<img class="template-thumbnail" src="'+template.thumbnail+'">'+
                            '<div class="template-info"><div class="template-info-title">'+template.name+'</div><div class="template-info-size">'+template.resolution+'</div></div>'+
                        '</div>'+

                        '<div class="template-btns col"><button class="btn btn-default template-btn-collect pull-right" >收藏</button></div> '+
                    '</div>' +
            '</div>'
    }


    function showErr(err,cb) {
        console.log(err)
        cb && cb()
    }
})