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
    closeModalConfirmButton.on('click',function (e) {
       deleteProject(curProject,curPanel);
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
    
    if (local){
        //create localproject folder
        fs = require('fs');
        path = require('path');
        mkdir = require('mkdir-p');
        __dirname = global.__dirname;
        console.log(__dirname, process)
        console.log(window.location);
        localProjectDir = path.join(__dirname,'localproject');
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
            if (!stats.isDirectory()){
                mkdir.sync(localProjectDir);
            }
        }catch (e){
            mkdir.sync(localProjectDir);
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

        //load projects
        var projects = readLocalProjects().map(function (raw) {
            return JSON.parse(raw);
        });
        
        console.log(projects);
        
        var addProjectButton =  $('#addproject');
        for(var i=projects.length-1;i>=0;i--){
            var newProject = projects[i];
            console.log(newProject);
            newProject.thumbnail = getResourceRelativePath(newProject.thumbnail);
            delete newProject.content;
            var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:newProject});

            addProjectButton.after(html);
        }
    }

    function readLocalProjects() {

        var projects=[];
        try {
            var stats = fs.statSync(localProjectDir);
            if (stats&&stats.isDirectory()){
                var projectNames = fs.readdirSync(localProjectDir);
                for (var i=0;i<projectNames.length;i++){
                    var curProjectDir =  path.join(localProjectDir,projectNames[i]);
                    var curProject = readSingleFile(path.join(curProjectDir,'project.json'),true);
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
        curSelectedPanel = curPanel


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
            $('#modal-ok').html('确认')
            var title = $('#basicinfo-title')
            var author = $('#basicinfo-author')
            var resolution = $('#basicinfo-resolution')
            title.val(project.name)
            resolution.val(project.resolution)
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
        $('#modal-ok').html('创建')

    })

    $('#modal-ok').on('click',changeProject);

    function changeProject(e){
        var op = $('#modal-ok').html()
        console.log(op)
        if (op == '确认'){
            updateProject(e,local)
        }else{
            createProject(e,local)
        }
    }
    function createProject(e,local) {
        console.log('create')
        var project = {}
        var title = $('#basicinfo-title')
        var author = $('#basicinfo-author')
        var resolution = $('#basicinfo-resolution')
        if (title.val().trim()!=''&&resolution.val().trim()!=''){
            //create
            project.name = title.val().trim()
            project.resolution = resolution.val().trim()

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

    function updateProject(e,local) {
        var curPanel = curSelectedPanel
        var project = curPanel.attr('data-project')
        project = JSON.parse(project)
        console.log(project)
        var title = $('#basicinfo-title')
        var author = $('#basicinfo-author')
        var resolution = $('#basicinfo-resolution')
        if (project.name != title.val().trim() || project.resolution != resolution.val().trim()){
            //changed
            project.name = title.val().trim()
            project.resolution = resolution.val().trim()
            var updateSuccess = false;
            if (local){
                var projectPath = path.join(localProjectDir,String(project._id),'project.json');
                fs.writeFileSync(projectPath,JSON.stringify(project));
                updateSuccess = true;
                var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:project});
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
                        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:project});
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


    function addNewProject(newProject){
        console.log(newProject)
        var html = new EJS({url:'../../public/login/assets/views/projectpanel.ejs'}).render({project:newProject});
        console.log(html)
        $('#addproject').after(html)
    }
})