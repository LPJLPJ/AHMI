$(function(){
    var curSelectedPanel = null;
    var curPanel = null;
    var curFolder = null;
    var closeModal = $('#exampleModal');
    var curProject = null;
    var fs,path,mkdir,__dirname;
    var deleteProjectButton = $('#delete-project-confirm');
    var localProjectDir='';
    var localCANProjectDir='';
    var localFolderPath = '';
    var curIDEVersion = window.ideVersion.split('_')[0].trim();
    var userType = localStorage.getItem('userType');
    var listWrap = $('#list-wrap');

    var folders = []

    deleteProjectButton.on('click',function (e) {
        if(curProject.resolution){
            deleteProject(curProject,curPanel);
        }else{
            deleteCANProject(curProject,curPanel);
        }
    });


    //update modal
    var updateModal = $('#updateModal')
    var updateConfirmBtn = $('#updateConfirmBtn')
    var updateCancelBtn = $('#updateCancelBtn')
    var updateNewVersion = $('#update-new-version')
    var updateAlert = $('.update-alert')
    var userUpdateChoice = null
    var local = false;

    try {
        var os = require('os');
        if (os){
            local = true;
            console.log('os',os);
        }
    }catch (e){

    }

    function mkdirSync(dist) {
        dist = path.resolve(dist);
        try{
            var stats = fs.statSync(dist)
            if (!stats.isDirectory()) {
                mkdir.sync(path.dirname(dist));
                fs.mkdirSync(dist);
            }
        }catch(e){
            mkdirSync(path.dirname(dist));
            fs.mkdirSync(dist);
        }

    }

    if (local){
        //create localproject folder
        fs = require('fs');
        path = require('path');
        mkdir = {};
        mkdir.sync = mkdirSync;
        __dirname = global.__dirname;
        localProjectDir = path.join(__dirname,'localproject');
        localCANProjectDir = path.join(__dirname,'localproject','localCANProject');
        localFolderPath = path.join(localProjectDir,"folder.json");
        //console.log('localCANProjectDir',localCANProjectDir);
        function getResourceRelativePath(resourceFilePath) {
            var realDirPath = path.join(__dirname, path.dirname(window.location.pathname));
            if (resourceFilePath){
                return path.relative(realDirPath, resourceFilePath);
            }else{
                return '';
            }

        }

        var stats;

        try {
            stats = fs.statSync(localProjectDir);
            var statsCAN = fs.statSync(localCANProjectDir);
            if (!stats.isDirectory()){
                mkdir.sync(localProjectDir);
            }
            if(!statsCAN.isDirectory()){
                mkdir.sync(localCANProjectDir);
            }
        }catch (e){
            mkdir.sync(localProjectDir);
            mkdir.sync(localCANProjectDir);
        }
    }

    //render projects
    if (local){

        // $('#add-project').siblings().each(function (index,elem) {
        //     $(elem).remove();
        // });
        $('#addCANproject').siblings().each(function(index,elem){
            $(elem).remove();
        });

        //load folders

        try{
            var folderJson = fs.readFileSync(localFolderPath)
            folders = JSON.parse(folderJson)
        }catch{
            folders = []
        }

        folders.forEach(function(f){
            var html = new EJS({url:'../../public/login/assets/views/folderPanel.ejs'}).render({folder:f});
            $('#project-list').prepend(html);
        })

        //load projects
        var projects = readLocalProjects('normal').map(function (raw) {
            return JSON.parse(raw);
        });
        projects.sort(function(p1,p2){
            var s1 = parseInt(String(p1._id).slice(0,String(p1._id).length-4));
            var s2 = parseInt(String(p2._id).slice(0,String(p2._id).length-4));
            return s2-s1;
        });
        // console.log('projects',projects);

        var CANProjects = readLocalProjects('CAN').map(function(raw){
            return JSON.parse(raw);
        });

        //console.log('projects',projects);
        //console.log('CANprojects',CANProjects);

        for(var i=projects.length-1;i>=0;i--){
            var newProject = projects[i];
            // console.log('newProject.createTime',newProject.createTime);
            // console.log(new Date(newProject.createTime));
            //console.log('newProject'+i,newProject);
            newProject.thumbnail = getResourceRelativePath(newProject.thumbnail);
            delete newProject.content;
            delete newProject.backups;
            var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:newProject,thumbnail:newProject.thumbnail});
            $('#project-list').prepend(html);
        }

        var addCANprojectButton = $('#addCANproject');
        for(var i=CANProjects.length-1;i>=0;i--){
            var newCANProject = CANProjects[i];
            //console.log('newCANProject'+i,newCANProject);
            newCANProject.thumbnail = getResourceRelativePath(newCANProject.thumbnail);
            delete newCANProject.content;
            var html = new EJS({url:'../../public/login/assets/views/CANProjectpanel.ejs'}).render({project:newCANProject,thumbnail:newCANProject.thumbnail});
            $('#project-list').prepend(html);
        }
    }

    //versionOptions
    if(!local){
        var versionWrapper = $('.version-wrapper')

        var $versionSelector = $('#basicinfo-ideversion')
        if(userType!=='admin'){
            $versionSelector.attr('disabled',true)
        }
        $versionSelector.html($('<option value="'+curIDEVersion+'">'+curIDEVersion+'(最新)'+'</option>'))

        $.ajax({
            type:'GET',
            url:'/api/versions',
            success:function (data) {
                data = JSON.parse(data)||[]
                data.forEach(function (op) {
                    $versionSelector.append($('<option value="'+op+'">'+op+'</option>'))
                })
                $versionSelector.val(curIDEVersion)
            },
            error:function (err) {
                console.log(err)
            }
        })

        //register version update choices
        // $('.update-option').on('click',function(e){

        // })
        $('.update-options-body input').on('change', function() {
            updateAlert.html('')
            userUpdateChoice =  $('.update-options-body input[name=update-options]:checked').val()
        });

        updateConfirmBtn.on('click',function(){
            var toUpdateProject = null
            var targetUrl = ''
            if(!userUpdateChoice){
                updateAlert.html('选项未选择')
            }else{
                switch(userUpdateChoice){
                    case '1':
                        //no update
                        updateModal.modal('hide')
                        targetUrl = '/project/'+curProject._id+'/editor'+(curProject.ideVersion?'?ideVersion='+curProject.ideVersion:'');
                        window.open(targetUrl)
                        break;
                    case '2':
                        //update with copy
                        saveProjectCopy(curProject._id,curProject.name+'_'+curProject.ideVersion,function(err){
                            if(err){
                                updateAlert.html('保存副本出错'+err)
                            }else{
                                var thumbnailDOM = curPanel.find('img');
                                var thumbnail = thumbnailDOM && thumbnailDOM.attr('src') ||null;
                                curProject.name = curProject.name+'_'+curProject.ideVersion
                                addNewProject(curProject)
                                toUpdateProject = JSON.parse(curPanel.attr('data-project'))
                                toUpdateProject.ideVersion = curIDEVersion
                                updateProjectInfo(toUpdateProject,function(err){
                                    if(err){
                                        updateAlert.html('更新版本出错')
                                    }else{
                                        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:toUpdateProject,thumbnail:thumbnail});
                                        curPanel.replaceWith(html)
                                        updateModal.modal('hide')
                                        targetUrl = '/project/'+curProject._id+'/editor'
                                        window.open(targetUrl)
                                    }
                                })
                            }
                        })
                        break;
                    case '3':
                        //update without copy
                        toUpdateProject = JSON.parse(curPanel.attr('data-project'))
                        toUpdateProject.ideVersion = curIDEVersion
                        var thumbnailDOM = curPanel.find('img');
                        var thumbnail = thumbnailDOM && thumbnailDOM.attr('src') ||null;
                        updateProjectInfo(toUpdateProject,function(err){
                            if(err){
                                updateAlert.html('更新版本出错')
                            }else{
                                var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:toUpdateProject,thumbnail:thumbnail});
                                curPanel.replaceWith(html)
                                updateModal.modal('hide')
                                targetUrl = '/project/'+curProject._id+'/editor'
                                window.open(targetUrl)
                            }
                        })
                        break;
                }
                // targetUrl = '/project/'+project._id+'/editor?ideVersion='+project.ideVersion;
            }
        })
    }

    function saveProjectCopy(projectId,saveAsName,cb){
        $.ajax({
            method: 'POST',
            url: '/project/' + projectId + '/saveAs',
            data: {
                saveAsName:saveAsName
            },
            success:function (data) {
                if(data == 'ok'){
                    cb && cb(null)
                }else{
                    cb && cb(new Error('save as failed'))
                }
            },
            error:function (err) {
                cb && cb(err)
            }

        })

    }

    function readLocalProjects(projectType) {
        var dir;
        var fileName;
        switch(projectType){
            case 'CAN':
                dir = localCANProjectDir;
                fileName ='CANProject.json';
                break;
            case 'normal':
            default:
                dir = localProjectDir;
                fileName = 'project.json';
                break;
        }

        //console.log('dir',dir);
        var projects=[];
        try {
            var stats = fs.statSync(dir);
            if (stats&&stats.isDirectory()){
                var projectNames = fs.readdirSync(dir);
                for (var i=0;i<projectNames.length;i++){
                    var curProjectDir =  path.join(dir,projectNames[i]);
                    var curProject = readSingleFile(path.join(curProjectDir,fileName),true);
                    if (curProject){
                        projects.push(curProject);
                    }
                }
            }
        }catch (err){

        }

        return projects;
    }

    function readSingleFile(filePath,check) {
        if (check){
            try{
                var stats = fs.statSync(filePath);
                if (stats&&stats.isFile()){
                    return fs.readFileSync(filePath,'utf-8');
                }else{
                    return null;
                }
            }catch (e){
                return null;
            }


        }else{
            return fs.readFileSync(filePath,'utf-8');
        }
    }

    //rm -rf
    function rmdir(dirpath) {
        var stats = fs.statSync(dirpath);
        if (stats ){
            if (stats.isDirectory()){
                var files = fs.readdirSync(dirpath);
                for (var i=0;i<files.length;i++){
                    var curPath = path.join(dirpath,String(files[i]));
                    rmdir(curPath);
                }
                fs.rmdirSync(dirpath);
            }else if (stats.isFile()){
                fs.unlinkSync(dirpath);
            }
        }
    }


    //contextMenu last edit : LH 2017/9/21
    var errorItems = { "errorItem": { name: "Items Load error" },};
    //加载contextMenu子菜单：较早的工程版本
    var loadItems = function (id) {
        //异步
        var dfd = jQuery.Deferred();
        //从后端获取backuplist
        $.ajax({
            type:'get',
            url:"/project/"+id+"/backuplist",
            success:function(result){
                //versionArray中保存了较早的工程版本
                var versionArray=JSON.parse(result);
                var subItems={};
                if(versionArray&&versionArray.length&&versionArray.length>0){
                    for(var i=0;i<((versionArray.length>5)?5:versionArray.length);i++){
                        switch(i){
                            case 0:
                                subItems.sub1={name:versionArray[i].date};
                                break;
                            case 1:
                                subItems.sub2={name:versionArray[i].date};
                                break;
                            case 2:
                                subItems.sub3={name:versionArray[i].date};
                                break;
                            case 3:
                                subItems.sub4={name:versionArray[i].date};
                                break;
                            case 4:
                                subItems.sub5={name:versionArray[i].date};
                                break;
                            default:
                        }
                    }
                }
                else{
                    subItems.sub1={name:"没有较早版本",disabled:true};
                }
                dfd.resolve(subItems);
            }
        });
        return dfd.promise();
    };

    //author: LH 2017-10-30
    function ChinaFormatItem(fmt) {
        var Y=fmt.slice(11,15);
        var M=fmt.slice(4,7);
        var D=fmt.slice(8,10);
        var HMS=fmt.slice(16,24);

        switch (M){
            case "Jan":
                M='01';
                break;
            case "Feb":
                M='02';
                break;
            case "Mar":
                M='03';
                break;
            case "Apr":
                M='04';
                break;
            case "May":
                M='05';
                break;
            case "Jun":
                M='06';
                break;
            case "Jul":
                M='07';
                break;
            case "Aug":
                M='08';
                break;
            case "Sep":
                M='09';
                break;
            case "Oct":
                M='10';
                break;
            case "Nov":
                M='11';
                break;
            case "Dec":
                M='12';
                break;

        }
        fmt=Y+"-"+M+"-"+D+" "+HMS;
        return fmt;

    }
    function localLoadItems(id){
        var curProjectDir =  path.join(localProjectDir,id);
        var curProject = readSingleFile(path.join(curProjectDir,'project.json'),true);
        var cur=JSON.parse(curProject);
        var versionArray=cur.backups;
        var subItems={};
        if(versionArray&&versionArray.length&&versionArray.length>0){
            for(var i=0;i<((versionArray.length>5)?5:versionArray.length);i++){
                switch(i){
                    case 0:
                        var temp=new Date(versionArray[i].time);
                        subItems.sub1={name:ChinaFormatItem(temp.toString())};
                        break;
                    case 1:
                        var temp=new Date(versionArray[i].time);
                        subItems.sub2={name:ChinaFormatItem(temp.toString())};
                        break;
                    case 2:
                        var temp=new Date(versionArray[i].time);
                        subItems.sub3={name:ChinaFormatItem(temp.toString())};
                        break;
                    case 3:
                        var temp=new Date(versionArray[i].time);
                        subItems.sub4={name:ChinaFormatItem(temp.toString())};
                        break;
                    case 4:
                        var temp=new Date(versionArray[i].time);
                        subItems.sub5={name:ChinaFormatItem(temp.toString())};
                        break;
                    default:
                }
            }
        }
        else{
            subItems.sub1={name:"没有较早版本",disabled:true};
        }
        return subItems;
    }

    $.contextMenu({
        selector: '.project-tool',
        callback: function(key) {
            var project = $(this).attr('data-project');
            project = JSON.parse(project);
            curPanel = $(this);
            curSelectedPanel = curPanel;
            curProject = project;
            switch (key){
                case "openFolder":
                    var localprojectpath = path.join(localProjectDir,String(project._id));
                    var gui = require('nw.gui');
                    gui.Shell.openItem(localprojectpath);
                    break;
                case "showInfo":
                    showProInfo($(this));
                    break;
                case "deletePro":
                    closeModal.modal('show');
                    break;
                case "visualization":
                    window.open('/project/'+project._id+'/visualization');
                    break;
                case "showProjectVersion":
                    break;
                case "data-analysis":
                    window.open('/project/'+project._id+'/data-analysis');
                    break;
                case "sub1":
                    openVertion(0,project._id);
                    break;
                case "sub2":
                    openVertion(1,project._id);
                    break;
                case "sub3":
                    openVertion(2,project._id);
                    break;
                case "sub4":
                    openVertion(3,project._id);
                    break;
                case "sub5":
                    openVertion(4,project._id);
                    break;
                case "space":
                    moveToClass(project,key);
                    break;
                default:
            }

            //移动到分类
            if(folderList.length>0){
                for(var i=0;i<folderList.length;i++){
                    var item='class'+(i+1);
                    if(key==item){
                        moveToClass(project,folderList[i].classInfo.id)
                    }
                }
            }
        },
        build:function($trigger, e){
            var project=JSON.parse(e.currentTarget.dataset.project);
            if(local){
                var items={
                    "openFolder": {name: "查看工程所在文件夹"},
                    "sep1":"---------",
                    "showInfo": {name: "修改工程信息"},
                    "sep2": "---------",
                    "showProjectVersion": {name: "打开较早保存的工程"},
                    "sep3":"---------",
                    "deletePro": {name: "删除工程"}
                };
                items.showProjectVersion.items=localLoadItems(project._id);
                return {
                    items:items
                };
            }else{
                return{
                    items:{
                        "showInfo": {name: "修改工程信息"},
                        "sep1":"---------",
                        "moveToClass":{name:"移动至项目",items:loadClass(project)},
                        "sep5":"---------",
                        "showProjectVersion": {name: "打开较早保存的工程",items: loadItems(project._id)},
                        "sep2":"---------",
                        "visualization":{name:"结构可视化"},
                        "sep3":"---------",
                        "data-analysis":{name:"数据分析"},
                        "sep4":"---------",
                        "deletePro": {name: "删除工程"}
                    }
                };
            }
        }

    });
    //打开较早的版本
    function openVertion(v,id){
        var targetUrl="";
        if (local){
            targetUrl = '../ide/index.html?project_id='+id+'&&v='+v;
        }else{
            targetUrl = '/project/'+id+'/editor'+'?v='+v;
        }
        window.open(targetUrl);
    }
    //normal promise usage example
    var completedPromise = function (status) {
        console.log("completed promise:", status);
    };

    var failPromise = function (status) {
        console.log("fail promise:", status);
    };

    var notifyPromise = function (status) {
        console.log("notify promise:", status);
    };

    $.loadItemsAsync = function() {
        console.log("loadItemsAsync");
        var promise = loadItems();
        $.when(promise).then(completedPromise, failPromise, notifyPromise);
    };

    //运行工程
    var customModal = {
        confirm:function(modal,content,cb){
            modal.find('.origin-site').html(content.msg||'');
            modal.modal('show');
            modal.find(".modal-cancel").off("click").on("click",function(){
                cb(false);
            });
            modal.find(".modal-confirm").off("click").on("click",function(){
                cb(true);
            })
        }
    };

    listWrap.on('click','.play-project',function(){
        var modal = $('#originSiteModal');
        curPanel = $(this).parents('.project-panel');
        curSelectedPanel = curPanel;
        $('#basicinfo-template').attr('disabled',false);
        $('#basicinfo-supportTouch').attr('disabled',false);
        var project = $(this).parents('.project-panel').attr('data-project');
        project = JSON.parse(project);
        curProject = project;
        var targetUrl = '';

        if(local){
            targetUrl = '../ide/index.html?project_id='+project._id;
            window.open(targetUrl);
        }else{

            var originalSite = window.location.host;
            if (project.originalSite && originalSite != project.originalSite) {
                customModal.confirm(modal, {msg: project.originalSite}, function (result) {
                    if (result) {
                        openProject();
                    }
                })
            } else {
                openProject();
            }
        }

        function openProject(){
            updateNewVersion.html(curIDEVersion);
            updateAlert.html('');

            if(project.ideVersion){
                if(project.ideVersion == curIDEVersion){
                    targetUrl = '/project/'+project._id+'/editor';
                    window.open(targetUrl);
                }else{
                    updateModal.modal('show')
                }
            }else{
                updateModal.modal('show')
            }
        }
    });

    //删除工程
    listWrap.on('click','.delete-project',function(){
        curPanel = $(this).parents('.project-panel');
        var project = $(this).parents('.project-panel').attr('data-project');
        project = JSON.parse(project);
        curProject = project;
        $('.project-delete__prompt').text(project.name);
        closeModal.modal('show');
    });

    //修改信息
    listWrap.on('click','.edit-project',function(){
        curPanel = $(this).parents('.project-panel');
        showProInfo(curPanel);
    });

    function showProInfo(cur){
        curPanel = cur;
        curSelectedPanel = curPanel;
        $('#basicinfo-template').attr('disabled',false);
        $('#basicinfo-supportTouch').attr('disabled',false);
        $('.basicinfo-template-options').hide();
        var project = cur.attr('data-project');
        project = JSON.parse(project);
        curProject = project;

        $('#project-info-confirm').html('确认');
        var title = $('#basicinfo-title');
        var author = $('#basicinfo-author');
        var resolution = $('#basicinfo-resolution');
        var customWidth = $('#customWidth');
        var customHeight = $('#customHeight');
        var ideVersion = $('#basicinfo-ideversion');
        var template = $('#basicinfo-template');
        var supportTouch = $('#basicinfo-supportTouch');
        var encoding = $('#basicinfo-encoding');
        title.val(project.name);
        author.val(project.author);
        if(identifyCustomResolution(project.resolution)){
            resolution.val(project.resolution);
            $('#basicinfo-customResolution').hide();
        }else{
            resolution.val('custom');
            $('#basicinfo-customResolution').show();
            var arr=project.resolution.split('*');
            customWidth.val(arr[0]);
            customHeight.val(arr[1]);
        }
        ideVersion.val(project.ideVersion);
        ideVersion.trigger('change');
        template.val(project.template);
        template.attr('disabled',true);
        supportTouch.val(project.supportTouch);
        supportTouch.attr('disabled',true);
        encoding.val(project.encoding);
        $('#project-info-modal').modal('show');
    }

    function identifyCustomResolution(resolution){
        var result=false;
        $("#basicinfo-resolution option").each(function(){
            if($(this).val().trim()==resolution){
                result=true;
            }
        });
        return result;
    }

    //创建按钮
    $('#add-project').on('click', function (e) {
        $('#basicinfo-title').val('');
        $('#basicinfo-author').val('');
        $('#basicinfo-template').attr('disabled',false).val('');
        $('.basicinfo-template-options').hide();
        $('#basicinfo-supportTouch').attr('disabled',false);
        $('#basicinfo-encoding').val('ascii');
        $('#basicinfo-resolution').val('800*480');
        $('#basicinfo-ideversion').val(curIDEVersion);
        //trigger change
        $('#basicinfo-ideversion').trigger('change');
        $('#basicinfo-customResolution').hide();
        $('#customWidth').val('');
        $('#customHeight').val('');
        $('#project-info-confirm').html('创建');
    });

    $('#basicinfo-resolution').on('change',function(e){
        var resolution = $('#basicinfo-resolution').val().trim();
        if(resolution==="custom"){
            $('#basicinfo-customResolution').show();
        }else{
            $('#basicinfo-customResolution').hide();
        }
    });

    $('#project-info-confirm').on('click',changeProject);

    function changeProject(e){
        var op = $('#project-info-confirm').html();
        //console.log(op);
        if (op == '确认'){
            updateProject(e,local)
        }else{
            createProject(e,local)
        }
    }
    function createProject(e,local) {
        //console.log('create');
        var project = {};
        var title = $('#basicinfo-title');
        var author = $('#basicinfo-author');
        var template = $('#basicinfo-template');
        var ideVersion = $('#basicinfo-ideversion');
        var supportTouch = $('#basicinfo-supportTouch');
        var encoding = $('#basicinfo-encoding');
        var resolution = $('#basicinfo-resolution');
        var customWidth = $('#customWidth');
        var customHeight = $('#customHeight');
        var folderId=$('#add-project').attr('folder-id');

        project.classId = folderId || 'space';

        if (resolution.val().trim()!=''&&supportTouch.val().trim()!=''&&encoding.val()!=''){
            //create
            project.name = title.val().trim();
            project.author = author.val().trim();
            project.template = template.val().trim();
            if(project.template == 'collectedTemplate'){project.template=''}
            project.ideVersion = ideVersion.val()&&ideVersion.val().trim()||'';
            project.supportTouch = supportTouch.val().trim();
            project.encoding = encoding.val()&&encoding.val().trim()||'';
            if (!checkName({value:project.name,empty:false},{value:project.author,empty:true})){
                //invalid name
                return;
            }
            if(resolution.val().trim()==="custom"){
                if(!checkCustomResolution(customWidth.val().trim(),customHeight.val().trim())){
                    toastr.error('分辨率有误');
                    return;
                }else
                    project.resolution = customWidth.val().trim()+"*"+customHeight.val().trim();
            }else {
                project.resolution = resolution.val().trim();
            }


            if (local){
                project.createTime = new Date().toLocaleString();
                project.lastModifiedTime =  new Date().toLocaleString();
                project._id = ''+Date.now()+Math.round((Math.random()+1)*1000);
                project.maxSize = 1024*1024*100;
                var localprojectpath = path.join(localProjectDir,String(project._id));
                var localresourcepath = path.join(localprojectpath,'resources');
                project.originalSite = 'localIDE'

                try {
                    mkdir.sync(localresourcepath);
                    //save init project.json
                    var filePath = path.join(localprojectpath,'project.json')
                    fs.writeFileSync(filePath,JSON.stringify(project));
                    addNewProject(project);
                }catch (e){
                    toastr.error(e)
                }



            }else{
                project.originalSite = window.location.host
                $.ajax({
                    type:'POST',
                    url:'/project/create',
                    data:project,
                    success: function (data, status, xhr) {
                        var newProject = JSON.parse(data)
                        addNewProject(newProject);

                    },
                    error: function (err, status, xhr) {
                        toastr.error(err.responseJSON.errMsg)
                    }
                })
            }
        }

    }

    function deleteProject(project,curPanel){

        if (local){
            //console.log('project id',project._id);
            var projectdirpath = path.join(localProjectDir,String(project._id));
            try{
                rmdir(projectdirpath);
            }catch (e){
                console.log(e);
            }

            curPanel.remove()

        }else{
            $.ajax({
                type:'POST',
                url:'/project/delete',
                data:{projectId:project._id},
                success:function (data, status, xhr){
                    //delete ok
                    //console.log(data)
                    curPanel.remove();
                    if($('#project-list').find('.project-list__item').length<1){
                        $('#project-empty').show();
                    }
                },
                error: function (err, status, xhr) {
                    console.log(err)
                    alert('删除失败')
                }
            })
        }

    }

    function checkName() {
        try {
            for (var i=0;i<arguments.length;i++){
                var name = arguments[i].value;
                //是否为空
                if(arguments[i].empty===false){
                    if (name.match(/^$|^\s+$/)){
                        toastr.error('名称不能为空');
                        return false;
                    }
                }
                //是否大于30个字
                if(name.length>30){
                    toastr.error('长度不能大于30个字');
                    return false;
                }
                //是否含有非法字符
                if (name.match(/[^\d|A-Z|a-z|\u4E00-\u9FFF|_|\-|—|.|(|)]/)){
                    toastr.error('名称和作者只能包含：汉字、英文、数字、下划线_、英文破折号-、中文破折号—、英文()、小数点.');
                    return false;
                }
            }
            return true;

        }catch (e){
            return false;
        }
    }

    function updateProjectInfo(project,cb) {

        $.ajax({
            type:'POST',
            url:'/project/'+project._id+'/basicinfo',
            data:project,
            success: function (data, status, xhr) {

                cb && cb(null,data)

            },
            error: function (err, status, xhr) {
                cb && cb(err)
            }
        })

    }

    function checkCustomResolution(){
        var width = arguments[0]||0;
        var height = arguments[1]||0;
        if(width.match(/^[0-9]*[1-9][0-9]*$/)&&height.match(/^[0-9]*[1-9][0-9]*$/)){
            if(width<=1920&&height<=1920){
                return true;
            }
        }
        return false;
    }

    function updateProject(e,local) {
        var curPanel = curSelectedPanel;
        var project = curPanel.attr('data-project');
        project = JSON.parse(project);
        //console.log(project);
        var title = $('#basicinfo-title');
        var author = $('#basicinfo-author');
        var resolution = $('#basicinfo-resolution');
        var customWidth = $('#customWidth');
        var customHeight = $('#customHeight');
        var template = $('#basicinfo-template');
        var ideVersion = $('#basicinfo-ideversion');
        var supportTouch = $('#basicinfo-supportTouch');
        var encoding = $('#basicinfo-encoding');
        var thumbnailDOM = curPanel.find('.project-thumb');
        var thumbnail = thumbnailDOM && thumbnailDOM.attr('src') ||null;
        if (project.name != title.val().trim() || project.author != author.val().trim()|| project.resolution != resolution.val() || project.ideVersion != ideVersion.val()||project.encoding!=encoding.val()){
            //changed
            project.name = title.val().trim();
            project.author = author.val().trim();
            //check name;
            if (!checkName({value:project.name,empty:false},{value:project.author,empty:true})){
                //invalid name
                return;
            }
            //check resolution
            if(resolution.val().trim()=='custom'){
                if(!checkCustomResolution(customWidth.val().trim(),customHeight.val().trim())){
                    toastr.error('分辨率有误, 宽、高必须是小于1920的正整数');
                    return;
                }else
                    project.resolution=customWidth.val().trim()+"*"+customHeight.val().trim();
            }else{
                project.resolution = resolution.val().trim();
            }

            project.ideVersion = ideVersion.val().trim()||'';
            project.supportTouch = supportTouch.val().trim();
            project.encoding = encoding.val()&&encoding.val().trim()||'';
            var updateSuccess = false;
            if (local){
                var projectPath = path.join(localProjectDir,String(project._id),'project.json');
                var oldProject = JSON.parse(readSingleFile(projectPath,true));
                for(var key in project){
                    oldProject[key] = project[key];
                }
                fs.writeFileSync(projectPath,JSON.stringify(oldProject));
                updateSuccess = true;
                var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:project,thumbnail:thumbnail});
                curPanel.replaceWith(html)
            }else{
                $.ajax({
                    type:'POST',
                    url:'/project/'+project._id+'/basicinfo',
                    data:project,
                    success: function (data, status, xhr) {
                        //update success
                        updateSuccess = true;
                        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:project,thumbnail:thumbnail});
                        curPanel.replaceWith(html);

                    },
                    error: function (err, status, xhr) {
                        //update error
                        console.log('err',err)
                        alert('修改失败')
                    }
                })
            }

        }
    }

    window.generateNewProjectView = generateNewProjectView;

    function generateNewProjectView(project,thumbnail){
        return new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:project,thumbnail:thumbnail});
    }


    function addNewProject(newProject){
        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:newProject,thumbnail:null});
        if (location.hash === '') {
            $('#project-list').prepend(html);
            if($('#project-list').find('.project-list__item').length){
                $('#project-empty').hide();
            }
        }else {
            $('#folder-project-list').prepend(html);
        }
    }

    //edit by lixiang

    //创建CAN工程
    $('#addCANproject').on('click', function (e) {
        $('#CAN-basicinfo-title').val('');
        $('#CAN-basicinfo-author').val('');
        $('#CAN-modal-ok').html('创建');
    });

    $('#CAN-modal-ok').on('click',changeCANProject);
    function changeCANProject(e){
        var op = $('#CAN-modal-ok').html();
        //console.log(op);
        if(op=="确认"){
            updateCANProject(e,local);
        }else if(op=="创建"){
            createCANProject(e,local);
        }
    }

    $('#CANProjectlist')
        .on('click','.CANProjectPanel',function(e){
            curPanel=$(this);
            curSelectedPanel = curPanel;
            var project = $(this).attr('data-project');
            project = JSON.parse(project);
            curProject = project;
            var curNodeName = e.target.nodeName;
            if(curNodeName=='IMG'){
                var targetUrl = '';
                if(local){
                    targetUrl='../ide/indexOfCAN.html?project_id='+project._id;
                }else{
                    targetUrl='/CANProject/'+project._id+'/editor';
                }
                window.open(targetUrl);
            }else if(curNodeName=='SPAN'){
                $('#CAN-modal-ok').html('确认');
                var title = $('#CAN-basicinfo-title');
                var author = $('#CAN-basicinfo-author');
                title.val(project.name);
                author.val(project.author);
            }
        });

    $('#CANProjectlist').on('mouseenter','.CANProjectPanel',function(e){
        var icon = $(this).find('.CANProjectdelete');
        if(icon){
            icon.css('display','block');
        }
    })
        .on('mouseleave','.CANProjectPanel',function(e){
            var icon = $(this).find('.CANProjectdelete');
            if(icon){
                icon.css('display','none');
            }
        });


    function createCANProject(e,local){
        //console.log('创建CAN项目');
        var CANProject={};
        var title = $('#CAN-basicinfo-title');
        var author = $('#CAN-basicinfo-author');
        if(title.val().trim()!=''){
            CANProject.name = title.val().trim();
            CANProject.author = author.val().trim();
            if(!checkName({value:CANProject.name,empty:false})){
                return;
            }
            if(local){
                //console.log('创建本地CAN');
                CANProject.createdTime = Date.now();
                CANProject.lastModified = Date.now();
                CANProject._id=''+CANProject.createdTime+Math.round((Math.random()+1)*1000);
                CANProject.maxSize = 1024*1024*100;
                var localCANProjectpath = path.join(localCANProjectDir,String(CANProject._id));
                //console.log(localCANProjectpath);
                try{
                    mkdir.sync(localCANProjectpath);
                    var filePath = path.join(localCANProjectpath,'CANProject.json');
                    fs.writeFileSync(filePath,JSON.stringify(CANProject));
                    addNewCANProject(CANProject);
                }catch(e){
                    console.log('write error',e);
                }
            }else{
                $.ajax({
                    type:'POST',
                    url:'/CANProject/create',
                    data:CANProject,
                    success:function(data,status,xhr){
                        var newCANProject = JSON.parse(data);
                        addNewCANProject(newCANProject);
                    },
                    error:function(err){
                        toastr.error(err.responseJSON.errMsg)
                    }
                })
            }
        }
    };

    function deleteCANProject(project,curPanel){
        if(local){
            //console.log('project id',project._id);
            var CANProjectdirpath = path.join(localCANProjectDir,String(project._id));
            try{
                rmdir(CANProjectdirpath);
            }catch (e){
                console.log(e);
            }
            curPanel.remove()
        }else{
            $.ajax({
                type:'POST',
                url:'/CANProject/delete',
                data:{projectId:project._id},
                success:function(data,status,xhr){
                    console.log('删除成功');
                    curPanel.remove();
                },
                error:function(err,status,xhr){
                    console.log('err',err);
                    alert('删除失败');
                }
            })
        }
    }

    function updateCANProject(e,local){
        var curPanel = curSelectedPanel;
        var project = curPanel.attr('data-project');
        project = JSON.parse(project);
        var title = $('#CAN-basicinfo-title');
        var author = $('#CAN-basicinfo-author');
        if(project.name!=title.val().trim()||project.author!=author.val().trim()){
            //changed
            if(title.val().trim()!=''){
                //title not empty
                project.name = title.val().trim();
                project.author = author.val().trim();
                if(!checkName({value:project.name,empty:false},{value:project.author,empty:true})){
                    return;
                }
                if(local){
                    var CANProjectPath = path.join(localCANProjectDir,String(project._id),'CANProject.json');
                    var oldCANProject = JSON.parse(readSingleFile(CANProjectPath,true));
                    for(var key in project){
                        oldCANProject[key] = project[key];
                    }
                    fs.writeFileSync(CANProjectPath,JSON.stringify(oldCANProject));
                    var updateSuccess = true;
                    var html = new EJS({url:'../../public/login/assets/views/CANProjectpanel.ejs'}).render({project:project,thumbnail:null});
                    curPanel.replaceWith(html)
                }else{
                    $.ajax({
                        type:'POST',
                        url:'/CANProject/'+project._id+'/basicinfo',
                        data:project,
                        success:function(data,status,xhr){
                            var html = new EJS({url:'../../public/login/assets/views/CANProjectPanel.ejs'}).render({project:project,thumbnail:null});
                            curPanel.replaceWith(html);
                        },
                        error:function(err,status,xhr){
                            console.log('err',err);
                            alert('修改失败');
                        }
                    })
                }
            }else{
                toastr.warning('名称不能为空');
            }
        }
    }

    function addNewCANProject(newCANProject){
        var html = new EJS({url:'../../public/login/assets/views/CANProjectPanel.ejs'}).render({project:newCANProject,thumbnail:null});
        $('#addCANproject').after(html)
    }

    //改变window大小的时候，重新计算filedrag的大小
    $(window).resize(function() {
        setHundredPercentHeight("#filedrag", "window", "#mianHeader");
        var height=$(".all").height()+$(".top").height();
        if($("#filedrag").height()<height){
            $("#filedrag").height(height*1.1);
        }
    })
    //页面加载时，计算filedrag的大小
    setHundredPercentHeight("#filedrag", "window", "#mianHeader");
    var height=$(".all").height()+$(".top").height();
    if($("#filedrag").height()<height){
        $("#filedrag").height(height*1.1);
    }
    //计算filedrag的大小
    function setHundredPercentHeight(objId,containerId)
    {
        var length = arguments.length;
        var height = 0;
        for (var i = 2; i < length; i++)
        {
            height += $(arguments[i]).outerHeight();
        }
        if(containerId==="window"){
            $(objId).height(($(window).height() - height)*0.99);
        }else{
            $(objId).height(($(containerId).height() - height)*0.99);
        }

    }

    /**
     * @author tang
     * 项目分类
     */
    var folder,
        folderList,
        deleteFolderModal=$('#delete-folder-modal'),
        deleteFolderConfirm=$('#deleteFolderConfirm'),
        projectList = $('#project-list'),
        folderWrap = $('#folder-space-wrap'),
        projectWrap = $('#project-list-wrap');

    //创建、修改项目
    $('#add-folder').on('click',function(){
        $('#folder-ok').html('创建');
        $('#folder-title').val('');
        $('#folder-author').val('');
    });
    $('#folder-ok').on('click',changeFolder);

    //打开项目
    projectList.on('click','.open-folder',function(e){
        curFolder=$(this).parents('.folder-panel');
        var fol = curFolder.attr('data-folder');
        fol = JSON.parse(fol);
        folder=fol;
        if(local){
            //filter projects with classId = folterID
            try {
                
                var projects = readLocalProjects('normal').map(function (raw) {
                    return JSON.parse(raw);
                });
                projects = projects.filter(function(p){
                    return p.classId == folder._id
                })
                folderWrap.show();
                projectWrap.hide();
                
                var html = new EJS({url:'../../public/login/assets/views/folderSpace.ejs'}).render({projects:projects,folder:folder});
                folderWrap.find('.folder-space-list').replaceWith(html);
                $('#add-project').attr('folder-id',folder.id);
            }catch (e){
                console.log(e)
                toastr.error('获取工程失败')
            }
        }else{
            $.ajax({
                url:'/folder/space',
                type:'post',
                data: {folderId:folder._id},
                success: function (data) {
                    if (data) {
                        folderWrap.show();
                        projectWrap.hide();
                        data = JSON.parse(data);
                        var html = new EJS({url:'../../public/login/assets/views/folderSpace.ejs'}).render({projects:data.projects,folder:data.folder});
                        folderWrap.find('.folder-space-list').replaceWith(html);
                        $('#add-project').attr('folder-id',data.folder.id);
                    }
                },
                error:function (err) {
                    console.log(err);
                }
    
            })
        }
        
    });

    var addFolder = $('#add-folder');

    window.addEventListener('hashchange',function () {
        console.log('hashchange',location.hash)
        if (location.hash === '') {
            folderWrap.hide();
            addFolder.show();
            projectWrap.show();
            $('#add-project').attr('folder-id','');
        }else {
            folderWrap.show();
            addFolder.hide();
            projectWrap.hide();
        }
    });

    //删除确认按钮
    projectList.on('click','.delete-folder',function(){
        curFolder=$(this).parents('.folder-panel');
        var fol = curFolder.attr('data-folder');
        fol = JSON.parse(fol);
        folder=fol;
        $('.folder-delete__prompt').text(fol.name);
        deleteFolderModal.modal('show');
    });
    deleteFolderConfirm.on('click',function(){
        deleteFolder(folder,curFolder);
    });

    //编辑项目
    projectList.on('click','.edit-folder',function(){
        curFolder=$(this).parents('.folder-panel');
        var fol = curFolder.attr('data-folder');
        fol = JSON.parse(fol);
        folder=fol;
        showFolderInfo(curFolder);
    });
    function showFolderInfo(cur){
        $('#folder-ok').html('确认');
        var fol = cur.attr('data-folder');
        fol = JSON.parse(fol);
        curFolder=cur;
        $('#folder-title').val(fol.name);
        $('#folder-author').val(fol.author);
        $('#folder-info-modal').modal('show');
    }

    function changeFolder(){
        if($(this).html()==='确认'){
            updateFolder();
        }else{
            createFolder();
        }
    }
    function createFolder(){
        var folder={};
        var name=$('#folder-title');
        var author=$('#folder-author');

        folder.name=name.val().trim();
        folder.author=author.val().trim();

        if (!checkName({value:folder.name,empty:false},{value:folder.author,empty:true})){
            return;
        }

        if(local){
            
            folder.createTime = new Date().toLocaleString();
            folder.lastModifiedTime =  new Date().toLocaleString();
            folder._id = ''+Date.now()+Math.round((Math.random()+1)*1000);

            folders.push(folder)
            try {
                
                fs.writeFileSync(localFolderPath,JSON.stringify(folders));
                var html = new EJS({url:'../../public/login/assets/views/folderPanel.ejs'}).render({folder:folder});
                projectList.prepend(html);
                if($('#project-empty').css('display')=='block'){$('#project-empty').hide()}
            }catch (e){
                toastr.error(e)
            }
        }else{
            $.ajax({
                type:'POST',
                url:'/folder/create',
                data:folder,
                success: function (data, status, xhr) {
                    var newFolder = JSON.parse(data);
                    var html = new EJS({url:'../../public/login/assets/views/folderPanel.ejs'}).render({folder:newFolder});
                    projectList.prepend(html);
                    if($('#project-empty').css('display')=='block'){$('#project-empty').hide()}
                },
                error: function (err, status, xhr) {
                    toastr.error(err)
                }
            })
        }

        
    }
    function updateFolder(){
        var name=$('#folder-title');
        var author=$('#folder-author');
        name=name.val().trim();
        author=author.val().trim();
        var folder = curFolder.attr('data-folder');
        folder = JSON.parse(folder);

        if (!checkName({value:folder.name,empty:false},{value:folder.author,empty:true})){
            return;
        }

        if(name!==folder.name||author!==folder.author){
            folder.name=name;
            folder.author=author;
            $.ajax({
                type:'POST',
                url:'/folder/update',
                data:folder,
                success: function (data) {
                    var html = new EJS({url:'../../public/login/assets/views/folderPanel.ejs'}).render({folder:folder});
                    curFolder.replaceWith(html);
                },
                error: function (err) {
                    console.log('err',err);
                    alert('修改失败')
                }
            })
        }
    }
    function deleteFolder(folder,curFolder){
        $.ajax({
            type:'POST',
            url:'/folder/delete',
            data:{folderId:folder._id},
            success:function (data, status, xhr){
                curFolder.remove();
            },
            error: function (err, status, xhr) {
                console.log(err);
                alert('删除失败')
            }
        })
    }
    function loadClass(project){
        var dfd = jQuery.Deferred();
        $.ajax({
            type:'GET',
            url:"/folder/getFolderList",
            success:function(result){
                var classList=JSON.parse(result);
                folderList=classList;
                var items={};
                if(project.classId=='space'){
                    items.space={name:'个人中心',disabled:true};
                }else{
                    items.space={name:'个人中心'};
                }

                if(classList&&classList.length>0){
                    for(var i=0;i<classList.length;i++){
                        if(classList[i].classInfo.id==project.classId){
                            items["class"+(i+1)]={name:classList[i].classInfo.name,disabled:true}
                        }else{
                            items["class"+(i+1)]={name:classList[i].classInfo.name};
                        }
                    }
                }
                dfd.resolve(items);
            }
        });
        return dfd.promise();
    }
    function moveToClass(_project,_class){
        var project=_project;
        project.classId=_class;
        $.ajax({
            type:"post",
            url:'/project/moveToClass',
            data:project,
            success:function(data){
                curPanel.remove();
            }
        })
    }

    /*分享工程*/
    var shareModal = $('#share-project-modal');

    /*var socket = io(path||'');
     socket.on('connect',function(){});*/

    var shareButton = $('#share-button'),
        shareUrl = $('#share-url'),
        shareKey = $('#share-key'),
        reddOnlyKye = $('#readOnly-key'),
        shareWrap = $('#share-wrap'),
        projectShared = false,
        projectData = null,
        sharedOwn = false;

    listWrap.on('click','.share-project',function(){
        var project = $(this).parents('.project-panel').attr('data-project');
        projectData = JSON.parse(project);
        var projectId = projectData._id;
        var ideVersion = projectData.ideVersion?'?ideVersion='+projectData.ideVersion:'';
        var openUrl = window.location.origin+'/project/'+projectId+'/editor'+ideVersion;
        shareUrl.html("路径："+openUrl);
        $.ajax({
            type:'GET',
            url:'/project/' + projectId + '/share',
            success:function(data){
                data = JSON.parse(data);
                projectShared = data.shared;
                sharedOwn = data.own;
                shareKey.html("密码："+data.sharedKey);
                reddOnlyKye.html("只读密码："+data.readOnlySharedKey);

                if(projectShared){
                    shareButton.html('取消分享');
                    shareWrap.show();
                }else{
                    shareButton.html('开始分享');
                    shareWrap.hide();
                }
            },
            error:function(err){
                console.log(err);
                alert('加载出错');
            }
        });

        shareModal.modal('show');
    });

    shareButton.on('click',function(){
        var projectId = projectData._id;
        projectShared = !projectShared;
        $.ajax({
            type:'POST',
            url:'/project/' + projectId + '/share',
            data:{
                share:projectShared
            },
            success:function(data){
                data = JSON.parse(data);
                projectShared = data.shared;
                sharedOwn = data.own;
                shareKey.html("密码："+data.sharedKey);
                reddOnlyKye.html("只读密码："+data.readOnlySharedKey);

                if(projectShared){
                    shareButton.html('取消分享');
                    shareWrap.show();
                }else{
                    shareButton.html('开启分享');
                    shareWrap.hide();
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    })
});