/**
 * Created by ChangeCheng on 16/5/7.
 */
var ProjectModel = require('../db/models/ProjectModel')
var UserModel = require('../db/models/UserModel')
var TemplateModel = require('../db/models/TemplateModel')
var projectRoute = {}
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var errHandler = require('../utils/errHandler')
var defaultProject = require('../utils/defaultProject')
var nodejszip = require('../utils/zip');
var MyZip = require('../utils/MyZip');
var mkdir = require('mkdir-p');
var Canvas = require('canvas');
var archiver = require('archiver');
var Font = Canvas.Font;
//rendering
var Renderer = require('../utils/render/renderer');
var fse = require('fs-extra');
projectRoute.getAllProjects=function(req, res){
    ProjectModel.fetch(function(err, projects){
        if (err){
            errHandler(res,500,err)
        }
        res.end(projects)
    })
}

projectRoute.getProjectById = function (req, res) {
    var projectId = req.params.id
    var userId = req.session.user&&req.session.user.id;

    if (projectId && projectId!=''){
        ProjectModel.findById(projectId,function (err, project) {
            if (err) {
                errHandler(res,500,'error')
            }
            //console.log(project)
            if(!project){
                errHandler(res,500,'project is null');
            }else if (project.userId == userId){
                res.render('ide/index.html')
            }else{
                res.render('login/login.html',{
                    title:'重新登录'
                });
            }

        })
    }else{
        errHandler(res,500,'error')
    }

}

projectRoute.getProjectContent = function (req, res) {
    var projectId = req.params.id
    if (projectId && projectId!=''){
        ProjectModel.findById(projectId,function (err, project) {
            if (err) {
                console.log(err)
                errHandler(res,500,'error')
            }
            //console.log(project)
            res.end(JSON.stringify(project))
        })
    }else{
        //console.log(projectId)
        errHandler(res,500,'error')
    }
}

projectRoute.createProject = function (req, res) {
    var data = _.cloneDeep(req.body)
    if (req.session.user){
        //user exists
        data.userId = req.session.user.id
        var newProject = new ProjectModel(data)
        newProject.save(function (err) {
            if (err){
                console.log('project save error',err)
                //res.status(500).end('save error')
                errHandler(res,500,'save error');
            }
            //create project directory
            var targetDir = path.join(__dirname,'../project/',String(newProject._id),'resources')
            fs.stat(targetDir, function (err, stats) {
                if(data.template){
                    if (stats&&stats.isDirectory&&stats.isDirectory()){
                        TemplateModel.findById(data.template,function(err,Template){
                                if(err){
                                    console.log('err in find template')
                                }
                                else{
                                    crTemplates(Template.fileId,path.join(targetDir,'template'),function(err){
                                        var newProjectInfo = _.cloneDeep(newProject)
                                        delete newProjectInfo.content;
                                        res.end(JSON.stringify(newProjectInfo))
                                    });
                                }
                        });
                        //copy template
                    }else{
                        //create new directory
                        //console.log('create new directory',targetDir);
                        mkdir(targetDir, function (err) {
                            if (err){
                                console.log('mk error')
                                errHandler(res, 500,'mkdir error')
                            }else{
                                console.log('ok')
                                //copy template
                                TemplateModel.findById(data.template,function(err,Template){
                                    if(err)
                                        console.log('err in find template')
                                    else{
                                        crTemplates(Template.fileId,path.join(targetDir,'template'),function(err){
                                            var newProjectInfo = _.cloneDeep(newProject)
                                            delete newProjectInfo.content;
                                            res.end(JSON.stringify(newProjectInfo))
                                        });
                                    }
                                });
                            }
                        })
                    }
                }
                else{
                    if (stats&&stats.isDirectory&&stats.isDirectory()){
                    //copy template
                    cpTemplates('defaultTemplate',path.join(targetDir,'template',function (err) {
                        //exists
                        var newProjectInfo = _.cloneDeep(newProject)
                        delete newProjectInfo.content;
                        res.end(JSON.stringify(newProjectInfo))
                    }));



                }else{
                    //create new directory
                    console.log('create new directory',targetDir);
                    mkdir(targetDir, function (err) {
                        if (err){
                            console.log('mk error')
                            errHandler(res, 500,'mkdir error')
                        }else{
                            console.log('ok')
                            //copy template
                            cpTemplates('defaultTemplate',path.join(targetDir,'template'),function (err) {
                                var newProjectInfo = _.cloneDeep(newProject)
                                delete newProjectInfo.content;
                                res.end(JSON.stringify(newProjectInfo))
                            });
                        }

                    })
                }
                }
            })
        })
    }else{
        res.status(500).end('not login')
    }
}


projectRoute.updateProject = function (req,res) {
    var newProject = req.body
    if (newProject._id){
        ProjectModel.findById(newProject._id, function (err, project) {
            if (err) {
                //err
                console.log(err)
                res.end(err)
                return
            }
            if (project){
                //update project
                for (var key in newProject){
                    if (key != 'id'){
                        project[key] = newProject[key]
                    }
                }
                //resave
                project.save(function (err) {
                    if (err){
                        console.log(err)
                        res.end('save error')
                        return
                    }
                    res.end('ok')
                })
            }else{
                //no project
                res.end('no project')
            }
        })
    }else{
        //no id
        res.end('error')
    }
}
var deleteFolderRecursive = function(_path) {
    var files = [];
    if( fs.existsSync(_path) ) {
        files = fs.readdirSync(_path);
        files.forEach(function(file,index){
            var curPath = path.join(_path , file);
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(_path);
    }
};
var rmdirAsync = function(_path, callback) {
    fs.readdir(_path, function(err, files) {
        if(err) {
            // Pass the error on to callback
            callback(err, []);
            return;
        }
        var wait = files.length,
            count = 0,
            folderDone = function(err) {
                count++;
                // If we cleaned out all the files, continue
                if( count >= wait || err) {
                    fs.rmdir(_path,callback);
                }
            };
        // Empty directory to bail early
        if(!wait) {
            folderDone();
            return;
        }

        files.forEach(function(file) {
            var curPath = path.join(_path,file);
            fs.lstat(curPath, function(err, stats) {
                if( err ) {
                    callback(err, []);
                    return;
                }
                if( stats.isDirectory() ) {
                    rmdirAsync(curPath, folderDone);
                } else {
                    fs.unlink(curPath, folderDone);
                }
            });
        });
    });
};

projectRoute.deleteProject = function (req, res) {
    var projectId = req.body.projectId;
    //console.log(projectId)
    if (projectId){
        //exitst
        ProjectModel.deleteById(projectId, function (err) {
            if (err){
                errHandler(res,500,'delete error')
            }
            //delete directory
            var targetDir = path.join(__dirname,'../project/',String(projectId))
            fs.stat(targetDir, function (err, stats) {
                if (stats&&stats.isDirectory&&stats.isDirectory()){
                    //exists
                    //delete
                    rmdirAsync(targetDir,function (rmErr) {
                        if (rmErr){
                            errHandler(res,500,'rm directory error')
                        }else{
                            res.end('ok')
                        }
                    })
                }else{
                    res.end('ok')
                }
            })

        })
    }else{
        errHandler(res,500,'invalid project id')
    }
}

projectRoute.saveProject = function (req, res) {
    var projectId = req.params.id;
    if (projectId!=""){
        ProjectModel.findById(projectId, function (err, project) {
            if (err){
                errHandler(res,500,'project error')
            }else{
                if(!project){
                    errHandler(res,500,'project is null');
                }else{
                    var curProjectContent = req.body.project
                    if (curProjectContent){
                        project.content = JSON.stringify(curProjectContent)
                        project.save(function (err) {
                            if (err){
                                console.log(err)
                                errHandler(res, 500, 'project resave error')
                            }else{

                                res.end('ok')
                                //delete files
                                var resourceList = curProjectContent.resourceList;
                                var resourceNames = resourceList.map(function(res){
                                    return res.id;
                                })
                                //console.log(resourceNames);
                                var url = path.join(__dirname,'../project',projectId,'resources');
                                fs.readdir(url, function (err, files) {
                                    if (err){
                                        console.log(err)
                                    }
                                    //console.log(files)
                                    if (files && files.length){

                                        var diffResources = _.difference(files,resourceNames);
                                        // console.log(diffResources)
                                        // for (var i=0;i<diffResources.length;i++){
                                        //     fs.unlink(path.join(url,diffResources[i]));
                                        // }

                                        //filter
                                        diffResources.map(function (dFile) {
                                            var dFilePath = path.join(url,dFile);
                                            // console.log(dFilePath)
                                            fs.stat(dFilePath,function (err,stats) {
                                                // console.log(stats)
                                                if (stats && stats.isFile()){
                                                    fs.unlink(dFilePath);
                                                }
                                            })
                                        });
                                    }
                                })

                            }
                        })
                    }else{
                        errHandler(res,500,'project save error')
                    }
                }

            }

        })
    }else{
        errHandler(res,500,'projectId error')
    }
};

projectRoute.saveProjectAs = function(req,res){
    var projectId = req.params.id;
    var data = req.body;
    //console.log('receive request');
    if(projectId!=''){
        ProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'find project err');
            }
            else if(!project){
                errHandler(res,500,'project is null');
            }else{
                //console.log('find project');
                var copyProject = {};
                copyProject.name = _.cloneDeep(project.name);
                copyProject.userId = _.cloneDeep(project.userId);
                copyProject.author = _.cloneDeep(project.author);
                copyProject.resolution = _.cloneDeep(project.resolution);
                copyProject.type = _.cloneDeep(project.type);
                copyProject.template = _.cloneDeep(project.template);
                copyProject.supportTouch = _.cloneDeep(project.supportTouch);
                copyProject.curSize = _.cloneDeep(project.curSize);
                copyProject.thumbnail = _.cloneDeep(project.thumbnail);
                copyProject.content = _.cloneDeep(project.content);

                copyProject.name = data.saveAsName?(data.saveAsName):(copyProject.name+"副本");
                copyProject.author = data.saveAsAuthor?(data.saveAsAuthor):(copyProject.author);
                var newProject = new ProjectModel(copyProject);
                var newId = newProject._id;
                if(newProject.content){
                    newProject.content=newProject.content.replace(/project\/[\S]+?\/resources/g,'project/'+newId+'/resources');
                }
                newProject.save(function(err){
                    if(err){
                        errHandler(res,500,'save new project err')
                    }else{
                        //console.log('save new project success');
                        var targetDir = path.join(__dirname,'../project/',String(newProject._id));
                        var srcDir = path.join(__dirname,'../project/',projectId);
                        fse.ensureDir(targetDir,function(err){
                            if(err){
                                console.log(err);
                                errHandler(res,500,'ensureDir err');
                            }else{
                                //console.log('make dir success');
                                fse.copy(srcDir,targetDir,function(err){
                                    if(err){
                                        console.log(err);
                                        errHandler(res,500,'copy project folder err')
                                    }else{
                                        //console.log('copy dir success');
                                        res.send('ok');
                                    }
                                })
                            }
                        })
                    }
                });
            }
        })
    }
};

projectRoute.saveThumbnail = function (req, res) {
    var projectId = req.params.id;
    if (projectId!=""){
        ProjectModel.findById(projectId, function (err, project) {
            if (err){
                errHandler(res,500,'project error')
            }else{
                if(!project){
                    errHandler(res,500,'project is null');
                }else{
                    var thumbnail = req.body.thumbnail;
                    if (!!thumbnail){
                        project.thumbnail = thumbnail;
                        //console.log('thumbnail',thumbnail)
                        project.save(function (err) {
                            if (err){
                                errHandler(res, 500, 'project resave error')
                            }else{
                                res.end('ok')
                            }
                        })
                    }else{
                        errHandler(res,500,'project save error')
                    }
                }
            }
        })
    }else{
        errHandler(res,500,'projectId error');
    }
}


projectRoute.generateProject = function (req, res) {
    var projectId = req.params.id;
    var dataStructure = req.body.dataStructure;
    if (projectId!=""){
        var ProjectBaseUrl = path.join(__dirname,'../project',String(projectId));
        var DataFileUrl = path.join(ProjectBaseUrl,'resources','data.json');
        //trans all widgets
        var allWidgets = [];
        for (var i=0;i<dataStructure.pageList.length;i++){
            var curPage = dataStructure.pageList[i];
            for (var j=0;j<curPage.canvasList.length;j++){
                var curCanvas = curPage.canvasList[j];
                for (var k=0;k<curCanvas.subCanvasList.length;k++){
                    var curSubCanvas = curCanvas.subCanvasList[k];
                    for (var l=0;l<curSubCanvas.widgetList.length;l++){
                        allWidgets.push(curSubCanvas.widgetList[l]);
                    }
                }
            }
        }
        var totalNum = allWidgets.length;
        if (totalNum>0){
            var okFlag = true;
            var cb = function (err) {
                if (err){
                    okFlag = false;
                    errHandler(res,500,'generate error');
                }else{
                    totalNum-=1;
                    if (totalNum<=0){
                        if (okFlag){
                            //ok
                            console.log('trans finished');
                            fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                                if (err){
                                    errHandler(res,500,err);
                                }else{
                                    //write ok
                                    console.log('write ok');
                                    // var zip = new nodejszip();
                                    // var SrcUrl = path.join(ProjectBaseUrl,'resources');
                                    // var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                    // try {
                                    //     zip.compress(DistUrl, SrcUrl, ['-rj'], function (err) {
                                    //         if (err) {
                                    //             errHandler(res, 500, err);
                                    //         } else {
                                    //             res.end('ok')
                                    //
                                    //         }
                                    //     })
                                    // }catch (err){
                                    //     errHandler(res, 500, err);
                                    // }

                                    //using myzip
                                    var SrcUrl = path.join(ProjectBaseUrl,'resources');
                                    var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                    
                                }
                            })
                        }
                    }
                }
            }.bind(this);
            // var fonts = {'Songti':new Font('Songti',this.fontFile('Songti.ttc'))};
            //init fonts
            // console.log(dataStructure.resourceList);
            var fontRes = dataStructure.resourceList.filter(isFont);
            var customFonts = {};
            var resBaseUrl = path.join(ProjectBaseUrl,'resources');
            for (i=0;i<fontRes.length;i++){
                var curFont = fontRes[i];
                customFonts[curFont.name] = fontFile(curFont.name,resBaseUrl,curFont.id);
            }
            console.log(customFonts)
            var renderer = new Renderer(null,customFonts);
            for (var m=0;m<allWidgets.length;m++){
                var curWidget = allWidgets[m];
                renderer.renderWidget(curWidget,path.join(__dirname,'..'),path.join(ProjectBaseUrl,'resources'),path.join('project',String(projectId),'resources'),cb);
            }
        }else{
            fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
                if (err){
                    errHandler(res,500,err);
                }else{
                    //write ok
                    console.log('write ok');
                    var SrcUrl = path.join(ProjectBaseUrl,'resources');
                    var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                    MyZip.zipDir(SrcUrl,DistUrl,function (err) {
                        if (err) {
                            errHandler(res, 500, err);
                        } else {
                            res.end('ok')
                        }
                    })

                }
            })
        }

    }else{
        errHandler(res,500,'projectId error');
    }
}

projectRoute.generateLocalProject = function(req, res){
    var projectId = req.params.id;
    if(projectId&&projectId!=''){
        ProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'project model err!');                
            }else{
                //generate local project json
                var filePath = path.join(__dirname,'../project/',projectId,'project.json');
                var tempPro = {};
                tempPro.name = project.name;
                tempPro.author = project.author;
                tempPro.template = project.template;
                tempPro.supportTouch = project.supportTouch;
                tempPro.resolution = project.resolution;
                tempPro._id = project._id;
                tempPro.createdTime = project.createTime;
                tempPro.lastModifiedTime = project.lastModifiedTime;
                //check and change resource url
                var transformSrc = function(key,value){
                    //console.log('key');
                    if(key=='src'||key=='imgSrc'||key=='backgroundImage'){
                        if(typeof(value)=='string'&&value!=''){
                            try{
                                if(value.indexOf('http')==-1){
                                    value = value.replace('/project','../../localproject');
                                    value = value.replace(/\//g,"\\");
                                    //console.log('value',value);
                                    return value
                                }else{
                                    var arr = value.split('/');
                                    arr[0] = 'chrome-extension:';
                                    arr[2] = 'ide.graphichina.com';
                                    arr[3] = 'localproject';
                                    value = arr.join('/');
                                    return value;
                                }
                            }catch(e){
                                console.log(e);
                                return value;
                            }
                        }else{
                            return value;
                        }
                    }
                    return value;
                }
                var contentObj = JSON.parse(project.content);
                contentNewJSON = JSON.stringify(contentObj,transformSrc);
                tempPro.content = contentNewJSON;

                try{
                    fs.writeFileSync(filePath,JSON.stringify(tempPro,null));
                    //generate localpro zip
                    var zipName = '/'+projectId+'.zip';
                    var targetUrl = path.join(__dirname,'../project/',projectId,zipName);
                    var srcResourcesFolderUrl = path.join(__dirname,'../project/',projectId,'resources/');
                    var srcJsonUrl = path.join(__dirname,'../project/',projectId,'/project.json'); 
                    var output = fs.createWriteStream(targetUrl);
                    var archive = archiver('zip', {
                                store: true 
                        });
                    output.on('close',function(){
                            console.log(archive.pointer() + ' total bytes');
                            res.end('ok');
                    });
                    archive.on('error',function(err){
                        console.log('error',err);
                        throw err;   
                    });
                    archive.pipe(output);
                    archive.directory(srcResourcesFolderUrl,'/resources');
                    archive.file(srcJsonUrl,{ name: 'project.json' });
                    archive.finalize();
                }catch(e){
                    console.log(e);
                    errHandler(res,500,'err');
                }
                
            }
        })
    }else{
        errHandler(res,500,'err');
    }
}

projectRoute.downloadLocalProject = function(req, res) {
    var projectId = req.params.id;
    if(projectId!=''){
        var zipName = String(projectId)+'.zip';
        var ProjectBaseUrl = path.join(__dirname,'../project',String(projectId));
        var DistUrl = path.join(ProjectBaseUrl,zipName);
        res.download(DistUrl,zipName, function (err) {
            if (err){
                errHandler(res,500,err);
            }else{
                res.end('ok');
            }
        })
    }else{
        errHandler(res,500,'projectId is null');
    }
}

projectRoute.saveDataAndCompress = function (req, res) {
    var projectId = req.params.id;
    var dataStructure = req.body.dataStructure;
    if (projectId!=""){
        var ProjectBaseUrl = path.join(__dirname,'../project',String(projectId));
        var DataFileUrl = path.join(ProjectBaseUrl,'resources','data.json');

        fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
            if (err){
                errHandler(res,500,err);
            }else{
                //console.log('compress');
                var SrcUrl = path.join(ProjectBaseUrl,'resources');
                var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                //MyZip.zipDir(SrcUrl,DistUrl,function (err) {
                //    if (err) {
                //        errHandler(res, 500, err);
                //    } else {
                //        res.end('ok')
                //
                //    }
                //})
                var output = fse.createWriteStream(DistUrl);
                var archive = archiver('zip');
                output.on('close',function(){
                    //console.log(archive.pointer()+"total bytes",'relese new updfiles success');
                    //编辑Log文件并返回响应
                    res.send('ok');
                });
                archive.on('error',function(err){
                    errHandler(res,500,'package folder err');
                });
                archive.pipe(output);
                archive.directory(SrcUrl,'/');
                archive.finalize();
            }
        })
    }else{
        errHandler(res,500,'projectId error');
    }
};
projectRoute.NewTemplate = function(req,res){
    var temPicName
    var widgetUrl
    var replaceUrl
    var tWidgetName
    var tWidgetUrl
    var data = {};
    var k =-1;//num of template pictures
    var projectId = req.params.id;
    var SourceUrl = path.join(__dirname,'../project/',String(projectId),'resources');
    var dataStructure = req.body.dataStructure;
    var widgets = dataStructure.TemplateWidgets;
    var templates = {
        MyDashboard:{},
        MyProgress:{},
        MySwitch:{},
        MyRotateImg:{},
        MyButton:{},
        templateResourcesList:[]
    }; 
    var guid =Math.round((Math.random()+1)*(Math.random()+3)*10000000);
    var NewUrl = path.join(__dirname,'../public/templates/',String(guid));
    var targetUrl = path.join(__dirname,'../public/templates/');
        //user exists
    data.userId = req.session.user.id;
    data.name = dataStructure.name;
    data.fileId = guid;
        fs.stat(targetUrl,function(err,stats){
            if(stats&&stats.isDirectory&&stats.isDirectory()){
                    fs.mkdir(NewUrl,0777);
                     console.log('ok1',NewUrl)
            }
            else{
                    fs.mkdir(targetUrl,function(err){
                        if(err){
                            console.log('Template mkidir error')
                            errHandler(res,500,'Template mkidir error')
                        }
                        else{
                            console.log('ok',NewUrl)
                            fs.mkdir(NewUrl,0777)
                        }     
                    })
            }
                for(var i = 0;i<widgets.length;i++){   
                    switch (widgets[i].type)
                        {
                        case "MyDashboard":
                                if(templates.MyDashboard.info ==undefined||templates.MyDashboard.info ==null) {
                                    templates.MyDashboard.info = widgets[i].info;
                                    templates.MyDashboard.texList = widgets[i].texList;
                                    for(var a = 0;a<templates.MyDashboard.texList.length;a++)
                                        for(var j = 0;j<templates.MyDashboard.texList[a].slices.length;j++){
                                            widgetUrl = templates.MyDashboard.texList[a].slices[j].imgSrc;
                                            replaceUrl = path.join(NewUrl,PicName(widgetUrl));
                                            temPicName = PicName(widgetUrl);
                                            widgetUrl = path.join(SourceUrl,PicName(widgetUrl));
                                            isSameFile(widgetUrl,replaceUrl);
                                            tWidgetUrl = fictitiousUrl(replaceUrl);
                                            templates.MyDashboard.texList[a].slices[j].imgSrc = tWidgetUrl;
                                            tWidgetName = templates.MyDashboard.texList[a].slices[j].name;
                                            k+=1;
                                            templates.templateResourcesList[k]=crResource(templates.templateResourcesList[k],temPicName,tWidgetUrl,tWidgetName);
                                        }
                                }
                                continue;
                        case "MyProgress":
                                if(templates.MyProgress.info ==undefined||templates.MyProgress.info ==null) {
                                    templates.MyProgress.info = widgets[i].info;
                                    templates.MyProgress.texList = widgets[i].texList;
                                    for(var a = 0;a<templates.MyProgress.texList.length;a++)
                                        for(var j = 0;j<templates.MyProgress.texList[a].slices.length;j++){
                                            widgetUrl = templates.MyProgress.texList[a].slices[j].imgSrc;
                                            replaceUrl = path.join(NewUrl,PicName(widgetUrl));
                                            temPicName = PicName(widgetUrl);
                                            widgetUrl = path.join(SourceUrl,PicName(widgetUrl));
                                            isSameFile(widgetUrl,replaceUrl); 
                                            tWidgetUrl = fictitiousUrl(replaceUrl);   
                                            templates.MyProgress.texList[a].slices[j].imgSrc = tWidgetUrl;
                                            tWidgetName = templates.MyProgress.texList[a].slices[j].name;
                                            k+=1;
                                            templates.templateResourcesList[k]=crResource(templates.templateResourcesList[k],temPicName,tWidgetUrl,tWidgetName);
                                        }
                                }
                                continue;
                        case "MySwitch":
                                if(templates.MySwitch.info ==undefined||templates.MySwitch.info ==null) {
                                    templates.MySwitch.info = widgets[i].info;
                                    templates.MySwitch.texList = widgets[i].texList;
                                    for(var a = 0;a<templates.MySwitch.texList.length;a++)
                                        for(var j = 0;j<templates.MySwitch.texList[a].slices.length;j++){
                                            widgetUrl = templates.MySwitch.texList[a].slices[j].imgSrc;
                                            replaceUrl = path.join(NewUrl,PicName(widgetUrl));
                                            temPicName = PicName(widgetUrl);
                                            widgetUrl = path.join(SourceUrl,PicName(widgetUrl));
                                            isSameFile(widgetUrl,replaceUrl);
                                            tWidgetUrl = fictitiousUrl(replaceUrl);
                                            templates.MySwitch.texList[a].slices[j].imgSrc = tWidgetUrl;
                                            tWidgetName = templates.MySwitch.texList[a].slices[j].name;
                                            k+=1;
                                            templates.templateResourcesList[k]=crResource(templates.templateResourcesList[k],temPicName,tWidgetUrl,tWidgetName);
                                        }
                                }
                                continue;
                         case "MyRotateImg":
                                if(templates.MyRotateImg.info ==undefined||templates.MyRotateImg.info ==null) {
                                    templates.MyRotateImg.info = widgets[i].info;
                                    templates.MyRotateImg.texList = widgets[i].texList;
                                    for(var a = 0;a<templates.MyRotateImg.texList.length;a++)
                                        for(var j = 0;j<templates.MyRotateImg.texList[a].slices.length;j++){
                                            widgetUrl = templates.MyRotateImg.texList[a].slices[j].imgSrc;
                                            replaceUrl = path.join(NewUrl,PicName(widgetUrl));
                                            temPicName = PicName(widgetUrl);
                                            widgetUrl = path.join(SourceUrl,PicName(widgetUrl));
                                            isSameFile(widgetUrl,replaceUrl);
                                            tWidgetUrl = fictitiousUrl(replaceUrl);
                                            templates.MyRotateImg.texList[a].slices[j].imgSrc = tWidgetUrl;
                                            tWidgetName = templates.MyRotateImg.texList[a].slices[j].name;
                                            k+=1;
                                            templates.templateResourcesList[k]=crResource(templates.templateResourcesList[k],temPicName,tWidgetUrl,tWidgetName);
                                        }
                                }
                                continue;
                        case "MyButton":
                                if(templates.MyButton.info ==undefined||templates.MyButton.info ==null) {
                                    templates.MyButton.info = widgets[i].info;
                                    templates.MyButton.texList = widgets[i].texList;
                                    for(var a = 0;a<templates.MyButton.texList.length;a++)
                                        for(var j = 0;j<templates.MyButton.texList[a].slices.length;j++){
                                            widgetUrl = templates.MyButton.texList[a].slices[j].imgSrc;
                                            replaceUrl = path.join(NewUrl,PicName(widgetUrl));
                                            temPicName = PicName(widgetUrl);
                                            widgetUrl = path.join(SourceUrl,PicName(widgetUrl));
                                            isSameFile(widgetUrl,replaceUrl);
                                            tWidgetUrl = fictitiousUrl(replaceUrl);
                                            templates.MyButton.texList[a].slices[j].imgSrc = tWidgetUrl;
                                            tWidgetName = templates.MyButton.texList[a].slices[j].name;
                                            k+=1;
                                            templates.templateResourcesList[k]=crResource(templates.templateResourcesList[k],temPicName,tWidgetUrl,tWidgetName);
                                        }
                                }
                                continue;
                        case undefined:
                                console.log('no widget');
                                res.end('nofind');
                                break;           
                        }
                    }  
                data.templateJson = JSON.stringify(templates);
                fs.writeFile(NewUrl+'\\'+'NewTemplate.json',data.templateJson,function(saveErr){
                    var newTemplate = new TemplateModel(data)
                    newTemplate.save(function (err) {
                        if (err){
                            errHandler(res, 500, 'templates save error',err)
                        }else{
                            console.log('template has been saved');
                            res.end('ok')
                        }
                    })
                });
        });
    // console.log(data);
}

projectRoute.getTemplateName = function(req,res){
    var userId = req.session.user.id;
    TemplateModel.findByUser(userId,function(err,Template){
        if(err){
            alert('err')
        }
        else{
            Template.reverse();
            var proccessTemplate = _.cloneDeep(Template).map(function(Template){
                var info = {};
                info._id = Template._id;
                info.name = Template.name;
                return info;
                
            });
            res.end(JSON.stringify(proccessTemplate))
           
        }
    });
}

projectRoute.findeTemplateFile = function(req,res){
    var templateId = req.body.dataStructure;
    if(!templateId){
        errHandler(res,500,'invalid templateId')
    }else{
        TemplateModel.findById(templateId,function(err,Template){
            if(err)
                errHandler(res,500,'err in find tempalte')
            else{
                if(Template){
                    var TemplateJson = Template.templateJson;
                    res.end(TemplateJson)
                }
                else
                    res.end('no TemplateJson');
            }
        })
    }
}

projectRoute.deleteTemplate = function(req,res){
    var templateId = req.body.templateId;
    if(!templateId){
        errHandler(res,500,'invalid templateId')
    }else{
        TemplateModel.findById(templateId,function(err,Template){
            if(err)
                console.log('err in find file')
            else{
                deleteTemplateFile(Template.fileId,function(err){
                    if(err){
                        errHandler(res,500,'err in delete file')
                    }
                    else{
                        TemplateModel.deleteById(templateId,function(err){
                            if(err)
                                errHandler(res,500,'delete error')
                            else

                                res.end('ok')
                        })
                    }
                })
            }
        })
    }
}

function isFont(font) {
    var names = font.src.split('.');
    var ext = names[names.length-1];
    if (ext==='ttf'||ext==='woff'){
        return true;
    }else{
        return false;
    }
}
function fontFile(name,baseUrl,id) {
    // var fonts = {'Songti':new Font('Songti',this.fontFile('Songti.ttc'))};
    return new Font(name,path.join(baseUrl,id));
    // return path.join(baseUrl,id);
}


//cp templates
function cpTemplates(templateName,dstDir,cb) {
    var srcDir = path.join(__dirname,'../public/templates/',templateName,'defaultResources');
    fse.copy(srcDir,dstDir,function (err) {
        console.log(err);
        if (err){
            cb && cb(err);
        }else{
            cb && cb();
        }
    })
}

function PicName(bascUrl){
    try{
        var fs = require('fs');
        var Names = bascUrl.split('/');
    }catch(e){
        var Names = bascUrl.split('\\');
    }
    var name = Names[Names.length-1];
    return name;
}

function crTemplates(fileId,dstDir,cb){
    var srcDir = path.join(__dirname,'../public/templates/',fileId);
    fse.copy(srcDir,dstDir,function(err){
        console.log(err);
        if(err){
            cb&cb(err);
        }
        else{
            cb&&cb();
        }
    })
}
function crResource(resource,id,url,name){
    resource = {
        id:id,
        src:url,
        name:name,
        content: null,
        complete: true,
        type:"image/png"
    }
    return resource
}
function isSameFile(sourceUrl,destUrl){
    fs.stat(destUrl,function(err){
        if(err){
            fse.copy(sourceUrl,destUrl,function(err){
                if(err) console.log(err);
            });
        }
    })
}
function fictitiousUrl(url){
    var str = String(path.join(__dirname,'../'));
    url = url.replace(/\\/g,'/');
    url = url.slice(str.length-1);
    return url
}

function deleteTemplateFile(fileName,cb){
    if(!fileName){
        console.log('fileName err');
    }
    else{
        var fileUrl = path.join(__dirname,'../public/templates/',fileName);
        fs.stat(fileUrl,function(err,stats){
            if(err)
                console.log('no file to deleted')
            else{
                fse.remove(fileUrl,function(err){
                    if(err)
                        console.log('remove err');
                    cb();
                })
            }
        })
    }
}



projectRoute.downloadProject = function (req, res) {
    var projectId = req.params.id;
    if (projectId!=""){
        var ProjectBaseUrl = path.join(__dirname,'../project',String(projectId));
        var DistUrl = path.join(ProjectBaseUrl,'file.zip');
        res.download(DistUrl,'file.zip', function (err) {
            if (err){
                errHandler(res,500,err);
            }else{
                //res.end('ok');
            }
        })

    }else{
        errHandler(res,500,'projectId error');
    }
};

projectRoute.getUserType=function(req,res){
    var projectId = req.params.id;
    if(projectId!=""){
        ProjectModel.findById(projectId,function(err,project){
            if(err){
                errHandler(res,500,'projectId error');
            }else{
                var userId=project.userId;
                UserModel.findById(userId,function(err,user){
                   if(err){
                       errHandler(res,500,'userId error');
                   }else{
                       var userType=user.type;
                       res.end(userType);
                   }
                });
            }
        });
    }else{
        errHandler(res,500,'projectId error');
    }
};

module.exports = projectRoute;
