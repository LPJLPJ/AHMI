//load templates
$(function () {

    var $templates = $('.templates')
    var $templateModal = $('#template-modal')
    var $templateModalConfirm = $('#template-modal-confirm')
    var userTemplates = []
    var curShouldRemoveTemplateId = undefined
    var curShouldRemoveTemplatePanel = undefined
    var $templateOptions = $('.basicinfo-template-options')
    var $templateSelector = $('#basicinfo-template')

    init()
    function init() {
        loadTemplates()
        $templateOptions.hide()
        registerActions()
    }


    function registerActions() {
        $templates.on('click','.template-btn-delete',function (e) {
            var id = $(e.target).closest('.template-panel').data('id')
            if (id){
                curShouldRemoveTemplateId = id
                curShouldRemoveTemplatePanel = $(e.target)
                $templateModal.modal('show')
            }
        })



        $templateModalConfirm.on('click',function (e) {
            if(curShouldRemoveTemplateId){
                deleteTemplateById(curShouldRemoveTemplateId,function () {
                    removeTemplateFromUserTemplatesById(curShouldRemoveTemplateId)
                    if (curShouldRemoveTemplatePanel){
                        curShouldRemoveTemplatePanel.closest('.template-panel-wrapper').remove()
                    }

                })
            }
        })


        $templateSelector.on('change',function (e) {
            var optionVal = $(e.target).val()
            if (optionVal == 'collectedTemplate'){
                $templateOptions.show()
            }else{
                $templateOptions.hide()
            }
        })


        $templateOptions.on('click','.template-option-panel',function (e) {
            var $optionPanel = $(e.currentTarget)
            var title = $optionPanel.find('.template-option-info-title').text()||''
            var resolution = $optionPanel.find('.template-option-info-size').text()||''
            var id = $optionPanel.data('id')
            if (id){
                $templateSelector.html(makeTemplateSelectorOptions(id,title,resolution))
                $templateSelector.val(id)
                $templateOptions.hide()
            }
        })
    }

    function makeTemplateSelectorOptions(id,title,resolution) {
        var basicOptions = '<option value="">---</option>' +
            '<option value="defaultTemplate">默认模板</option>' +
            '<option value="collectTemplate">默认模板</option>'
        return  basicOptions+'<option value="'+id+'">'+(title+" -- "+resolution)+'</option>'
    }

    function loadTemplates() {
        $.ajax({
            type:'get',
            url:'/templates/user/infos',
            success:function (data) {
                // console.info(data)
                data = JSON.parse(data)
                userTemplates = data
                renderTemplateList()
                renderOptionTemplateList()
            },
            error:function (err) {
                showErr(err)
            }
        })
    }

    function renderTemplateList() {
        var templateStr = ""
        templates = userTemplates||[]
        templates.forEach(function (template) {
            templateStr += renderTemplate(template)
        })
        $templates.html(templateStr)
    }

    function renderTemplate(template) {
        return '<div class="template-panel-wrapper " >'+
                '<div class="template-panel" data-id="'+template._id+'">' +
                    '<i class="template-btn-delete iconfont">&#xe607;</i>'+
                    '<div class="template-thumbnail-wrapper">' +
                        '<div class="template-thumbnail-container">' +
                            '<img class="template-thumbnail" src="'+template.thumbnail+'">'+
                            '<div class="template-info"><div class="template-info-title">'+template.name+'</div><div class="template-info-size">'+template.resolution+'</div></div>'+
                        '</div>'+
                    '</div>' +
                '</div>' +
            '</div>'
    }


    function renderOptionTemplateList() {
        var templateStr = ""

        templates = [{
            _id:'defaultTemplate',
            name:'默认模板',
            resolution:'*'
        }].concat(userTemplates)
        templates.forEach(function (template) {
            templateStr += renderOptionTemplate(template)
        })
        $templateOptions.html(templateStr)
    }

    function renderOptionTemplate(template) {
        return  '<div class="template-option-panel" data-id="'+template._id+'">' +
                        '<div class="template-option-thumbnail-container">' +
                            '<img class="template-option-thumbnail" draggable="false" src="'+template.thumbnail+'">'+
                        '</div>'+
                        '<div class="template-option-info">' +
                            '<div class="template-option-info-title">'+template.name+'</div>' +
                            '<div class="template-option-info-size">'+template.resolution+'</div>' +
                        '</div>'+
                    '</div>'

    }


    function deleteTemplateById(id,cb) {
        $.ajax({
            type:'post',
            url:'/templates/uncollect',
            data:{
                templateId:id
            },
            success:function (data) {
                if (data==='ok'){
                    cb && cb()
                }else{
                    showErr('delete failed')
                }

            },
            error:function (err) {
                showErr(err)
            }
        })
    }


    function removeTemplateFromUserTemplatesById(id) {
        for(var i=0;i<userTemplates.length;i++){
            if (userTemplates[i]._id == id){
                userTemplates.splice(i,1)
                break
            }
        }
    }

    function showErr(err) {
        console.log(err)
    }
})