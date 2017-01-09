$(function(){
	// $('#user-icon').on('click',function(){
	// 	$('#user-icon-menu').
	// })
	// $(".right").hover(function(){
 //        $(".menu").stop().animate({"height":"60px"})
 //    },function(){
 //        $(".menu").stop().animate({"height":"0px"})
 //    })
    var curSelectedPanel = null;
    var curPanel = null;
    var closeModal = $('#exampleModal');
    var curProject = null;
    var fs,path,mkdir,__dirname;
    var closeModalConfirmButton = $('#closeModalConfirm');
    var localProjectDir='';
    var localCANProjectDir='';

    closeModalConfirmButton.on('click',function (e) {
        console.log('project',curProject);
        if(curProject.resolution){
            deleteProject(curProject,curPanel);
        }else{
            deleteCANProject(curProject,curPanel);
        }
    });

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
        console.log('localCANProjectDir',localCANProjectDir);
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
            statsCAN = fs.statSync(localCANProjectDir);
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
        //delte projectPanels
        
        // $('.projectpanel').each(function (index,elem) {
        //     $(elem).remove();
        // });

        $('#addproject').siblings().each(function (index,elem) {
            $(elem).remove();
        });
        $('#addCANproject').siblings().each(function(index,elem){
            $(elem).remove();
        });

        //load projects
        var projects = readLocalProjects('normal').map(function (raw) {
            return JSON.parse(raw);
        });

        var CANProjects = readLocalProjects('CAN').map(function(raw){
            return JSON.parse(raw);
        });
        
        console.log('projects',projects);
        console.log('CANprojects',CANProjects);
        
        var addProjectButton =  $('#addproject');
        for(var i=projects.length-1;i>=0;i--){
            var newProject = projects[i];
            //console.log('newProject'+i,newProject);
            newProject.thumbnail = getResourceRelativePath(newProject.thumbnail);
            delete newProject.content;
            var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:newProject,thumbnail:newProject.thumbnail});

            addProjectButton.after(html);
        }

        var addCANprojectButton = $('#addCANproject');
        for(var i=CANProjects.length-1;i>=0;i--){
            var newCANProject = CANProjects[i];
            console.log('newCANProject'+i,newCANProject);
            newCANProject.thumbnail = getResourceRelativePath(newCANProject.thumbnail);
            delete newCANProject.content;
            var html = new EJS({url:'../../public/login/assets/views/CANProjectpanel.ejs'}).render({project:newCANProject,thumbnail:newCANProject.thumbnail});
            addCANprojectButton.after(html);
        }
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

        console.log('dir',dir);
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
    

    $('#projectlist')
        .on('click','.projectpanel', function (e) {
        curPanel = $(this)
        curSelectedPanel = curPanel;
        $('#basicinfo-template').attr('disabled',false);
        $('#basicinfo-supportTouch').attr('disabled',false);
        var project = $(this).attr('data-project');
        project = JSON.parse(project);
        curProject = project;
        var curNodeName = e.target.nodeName
        if (curNodeName == 'IMG'){
            //img
            //open in new window
            var targetUrl = '';
            if (local){

                targetUrl = '../ide/index.html?project_id='+project._id;
            }else{
                targetUrl = '/project/'+project._id+'/editor';
            }

            window.open(targetUrl);

        }else if (curNodeName == 'SPAN'){
            //span
            //show modal
            $('#modal-ok').html('确认');
            var title = $('#basicinfo-title');
            var author = $('#basicinfo-author');
            var resolution = $('#basicinfo-resolution');
            var customWidth = $('#customWidth');
            var customHeight = $('#customHeight');
            var template = $('#basicinfo-template');
            var supportTouch = $('#basicinfo-supportTouch');

            title.val(project.name);
            author.val(project.author);
            if(identifyCustomResolution(project.resolution)){
                resolution.val(project.resolution);
                $('#basicinfo-customResolution').hide();
            }else{
                //console.log('custom');
                resolution.val('custom');
                $('#basicinfo-customResolution').show();
                var arr=project.resolution.split('*');
                customWidth.val(arr[0]);
                customHeight.val(arr[1]);
            }
            template.val(project.template);
            template.attr('disabled',true);
            supportTouch.val(project.supportTouch);
            supportTouch.attr('disabled',true);
        }else if (curNodeName == 'I'){
            //delete
            // if(confirm('确认删除?')){
            //     deleteProject(project,curPanel)
            // }else{
            //
            // }
            closeModal.modal('show');

        }
    });

    function identifyCustomResolution(resolution){
        var result=false;
        $("#basicinfo-resolution option").each(function(){
            if($(this).val().trim()==resolution){
                //console.log('haha',$(this).val().trim());
                result=true;
            }
        });
        return result;
    }



    $('#projectlist').on('mouseenter','.projectpanel',function (e) {
        //console.log('hover',e)
        //console.log($(this))
        var icon = $(this).find('.projectdelete')
        //console.log((icon))
        if (icon){
            icon.css('display','block')
        }
    })
        .on('mouseleave','.projectpanel',function (e) {
            var icon = $(this).find('.projectdelete')
            if (icon){
                icon.css('display','none')
            }
        })




    $('#addproject').on('click', function (e) {
        $('#basicinfo-title').val('');
        $('#basicinfo-author').val('');
        $('#basicinfo-template').attr('disabled',false);
        $('#basicinfo-supportTouch').attr('disabled',false);
        $('#basicinfo-resolution').val('800*480');
        $('#basicinfo-customResolution').hide();
        $('#customWidth').val('');
        $('#customHeight').val('');
        $('#modal-ok').html('创建');
    });

    $('#basicinfo-resolution').on('change',function(e){
        var resolution = $('#basicinfo-resolution').val().trim();
        if(resolution==="custom"){
            $('#basicinfo-customResolution').show();
            //$('#customWidth').val('');
            //$('#customHeight').val('');
        }else{
            $('#basicinfo-customResolution').hide();
        }
    });


    $('#modal-ok').on('click',changeProject);

    function changeProject(e){
        var op = $('#modal-ok').html();
        console.log(op);
        if (op == '确认'){
            updateProject(e,local)
        }else{
            createProject(e,local)
        }
    }
    function createProject(e,local) {
        console.log('create');
        var project = {};
        var title = $('#basicinfo-title');
        var author = $('#basicinfo-author');
        var template = $('#basicinfo-template');
        var supportTouch = $('#basicinfo-supportTouch');
        var resolution = $('#basicinfo-resolution');
        var customWidth = $('#customWidth');
        var customHeight = $('#customHeight');

        if (title.val().trim()!=''&&resolution.val().trim()!=''&&supportTouch.val().trim()!=''){
            //create
            project.name = title.val().trim();
            project.author = author.val().trim();
            project.template = template.val().trim();
            project.supportTouch = supportTouch.val().trim();
            if (!checkName(project.name,project.author)){
                //invalid name
                toastr.error('名称只能是汉字、英文和数字');
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
                project.createdTime = Date.now();
                project.lastModified =  Date.now();
                project._id = ''+project.createdTime+Math.round((Math.random()+1)*1000);
                project.maxSize = 1024*1024*100;
                var localprojectpath = path.join(localProjectDir,String(project._id));
                var localresourcepath = path.join(localprojectpath,'resources')
                console.log(localprojectpath);

                try {
                    mkdir.sync(localresourcepath);
                    //save init project.json
                    var filePath = path.join(localprojectpath,'project.json')
                    fs.writeFileSync(filePath,JSON.stringify(project));
                    addNewProject(project);
                }catch (e){
                    console.log('write error')
                }



            }else{
                $.ajax({
                    type:'POST',
                    url:'/project/create',
                    data:project,
                    success: function (data, status, xhr) {
                        var newProject = JSON.parse(data)
                        addNewProject(newProject)
                    },
                    error: function (err, status, xhr) {
                        console.log(err)
                    }
                })
            }
        }

    }


    function deleteProject(project,curPanel){
        console.log('delete')
        if (local){
            console.log('project id',project._id);
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
                    console.log(data)
                    curPanel.remove()

                },
                error: function (err, status, xhr) {
                    console.log(err)
                    alert('删除失败')
                }
            })
        }

    }

    function checkName() {
        // name.match(/["'\/\\\(\){},\.\+\-\*\?]/)
        try {
            for (var i=0;i<arguments.length;i++){
                var name = arguments[i];
                if (name.match(/[^\d|A-Z|a-z|\u4E00-\u9FFF]/)){
                    return false;
                }
            }
            return true;

        }catch (e){
            return false;
        }
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
        var supportTouch = $('#basicinfo-supportTouch');
        var thumbnailDOM = curPanel.find('img');
        var thumbnail = thumbnailDOM && thumbnailDOM.attr('src') ||null;
        if (project.name != title.val().trim() || project.author != author.val().trim()|| project.resolution != resolution.val().trim()){
            //changed
            project.name = title.val().trim();
            project.author = author.val().trim();
            //check name;
            if (!checkName(project.name,project.author)){
                //invalid name
                toastr.error('名称只能是汉字、英文和数字');
                return;
            }
            //check resolution
            if(resolution.val().trim()=='custom'){
                if(!checkCustomResolution(customWidth.val().trim(),customHeight.val().trim())){
                    toastr.error('分辨率有误');
                    return;
                }else
                    project.resolution=customWidth.val().trim()+"*"+customHeight.val().trim();
            }else{
                project.resolution = resolution.val().trim();
            }
            project.supportTouch = supportTouch.val().trim();
            var updateSuccess = false;
            if (local){
                var projectPath = path.join(localProjectDir,String(project._id),'project.json');
                fs.writeFileSync(projectPath,JSON.stringify(project));
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
                        console.log('success',data)
                        //update panel
                        updateSuccess = true;
                        console.log(project,thumbnail,JSON.stringify(project),JSON.stringify(thumbnail))
                        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:project,thumbnail:thumbnail});
                        curPanel.replaceWith(html)

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
        // console.log(newProject)
        // console.log(newProject,JSON.stringify(newProject));
        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:newProject,thumbnail:null});
        // console.log(html,JSON.stringify(html));
        $('#addproject').after(html)
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
        console.log(op);
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
            }else if(curNodeName=='I'){
                //deleteCANProject(project,curPanel);
                closeModal.modal('show');
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
            if(!checkName(CANProject.name)){
                toastr.error('名称只能是汉字、英文和数字');
                return;
            }
            if(local){
                console.log('创建本地CAN');
                CANProject.createdTime = Date.now();
                CANProject.lastModified = Date.now();
                CANProject._id=''+CANProject.createdTime+Math.round((Math.random()+1)*1000);
                CANProject.maxSize = 1024*1024*100;
                var localCANProjectpath = path.join(localCANProjectDir,String(CANProject._id));
                console.log(localCANProjectpath);
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
                    }
                })
            }
        }
    };

    function deleteCANProject(project,curPanel){
        if(local){

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
                if(!checkName(project.name,project.author)){
                    toastr.error('名称只能是汉字、英文和数字');
                    return;
                }
                if(local){

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
});