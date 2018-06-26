$(function () {

    var $templatesWrapper = $('.templates-wrapper')
    var userTemplateIds = []
    var collectBtnStr = '<button class="btn btn-default template-btn-collect pull-right" >收藏</button>'
    var unCollectBtnStr = '<button class="btn btn-default template-btn-uncollect pull-right" >取消收藏</button>'
    var $filterNew = $('.template-tools-filter-new')
    var $filterPopulate  = $('.template-tools-filter-populate')
    var $search = $('.template-tools-search')

    var selectedFilter = null
    var searchKey = ''
    init()


    function selectFilter(f) {
        var hightClassName = 'filter-highlight'
        switch (f){
            case 'new':
                selectedFilter = f
                $filterNew.addClass(hightClassName)
                $filterPopulate.removeClass(hightClassName)
                break;
            case 'populate':
                selectedFilter = f
                $filterNew.removeClass(hightClassName)
                $filterPopulate.addClass(hightClassName)
                break;
            default:
                selectedFilter = null
                $filterNew.removeClass(hightClassName)
                $filterPopulate.removeClass(hightClassName)
        }

        loadTemplateLists()

    }

    function search() {
        searchKey = $search.val().trim()
        loadTemplateLists()
    }




    registerAction()

    function registerAction() {
        //收藏
        $templatesWrapper.on('click','.template-btn-collect',function (e) {
            var id = $(e.target).closest('.template-panel').data('id')
            console.log(id)
            if(id){
                collectTemplate(id,function () {
                    $(e.target).replaceWith(unCollectBtnStr)
                })
            }
        })
        //取消收藏
        $templatesWrapper.on('click','.template-btn-uncollect',function (e) {
            var id = $(e.target).closest('.template-panel').data('id')
            console.log(id)
            if(id){
                uncollectTemplate(id,function () {
                    $(e.target).replaceWith(collectBtnStr)
                })
            }
        })


        //filter
        //new
        $filterNew.on('click',function (e) {
            selectFilter('new')
        })
        //populate
        $filterPopulate.on('click',function (e) {
            selectFilter('populate')
        })

        $search.on('keydown',function (e) {
            if(e.keyCode === 13){
                search()
            }
        })
    }


    function init() {
        loadUserTemplates(function (_userTemplateIds) {
            userTemplateIds = _userTemplateIds
            selectFilter('new')
        })
    }

    function loadUserTemplates(cb) {
        $.ajax({
            type:'get',
            url:'/templates/user/ids',
            success:function (data) {
                console.log(data)
                data = JSON.parse(data)||[]
                cb && cb(data)

            },
            error:function (err) {
                showErr(err)
            }
        })
    }

    function loadTemplateLists() {
        //load template lists
        var templateListUrl = '/templates/center'
        if (selectedFilter){
            templateListUrl +='?filter='+selectedFilter+(searchKey?('&key='+searchKey):'')
        }
        $.ajax({
            type:'get',
            url:templateListUrl,
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

    function collectTemplate(id,cb) {
        $.ajax({
            type:'post',
            url:'/templates/collect',
            data:{
              templateId:id
            },
            success:function (data) {
                console.log(data)
                addItemToSet(id,userTemplateIds)
                cb && cb()
            },error:function (err) {
                showErr(err)
            }
        })
    }

    function uncollectTemplate(id,cb) {
        $.ajax({
            type:'post',
            url:'/templates/uncollect',
            data:{
                templateId:id
            },
            success:function (data) {
                console.log(data)
                deleteFromSet(id,userTemplateIds)
                cb && cb()
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
                            '<img class="template-thumbnail" src="'+(template.thumbnail||'../../public/login/assets/img/pro_1.png')+'">'+
                            '<div class="template-info"><div class="template-info-title">'+template.name+'</div><div class="template-info-size">'+template.resolution+'</div></div>'+
                        '</div>'+

                        '<div class="template-btns col">'+(isInUserTemplates(template._id)?unCollectBtnStr:collectBtnStr)+'</div> '+
                    '</div>' +
            '</div>' + '</div>'
    }

    function isInUserTemplates(id) {
        for(var i=0;i<userTemplateIds.length;i++){
            if (userTemplateIds[i] == id){
                return true
            }
        }
        return false
    }

    function showErr(err,cb) {
        console.log(err)
        cb && cb()
    }
    function addItemToSet(item,curItems) {
        var flag = false
        for(var i=0;i<curItems.length;i++){
            if (curItems[i]==item){
                flag = true
                break
            }
        }
        if (!flag){
            curItems.push(item)
        }

        return !flag
    }

    function deleteFromSet(item,curItems) {
        var flag = false
        for(var i=0;i<curItems.length;i++){
            if (curItems[i]==item){
                flag = true
                break
            }
        }
        if (flag){
            curItems.splice(i,1)
        }

        return flag
    }
})