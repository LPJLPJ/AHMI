/**
 * Created by ChangeCheng on 16/5/7.
 */
var ProjectModel = require('../db/models/ProjectModel')
var UserModel = require('../db/models/UserModel')
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
var moment = require('moment');
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
    var v = req.query.v
    if (projectId && projectId!=''){
        ProjectModel.findById(projectId,function (err, project) {
            if (err) {
                console.log(err)
                errHandler(res,500,'error')
            }
            //console.log(project)
            if (v in project.backups){
                project.content = project.backups[v].content||''
            }
            project.backups = []
            res.end(JSON.stringify(project))
        })
    }else{
        //console.log(projectId)
        errHandler(res,500,'error')
    }
}

projectRoute.getBackupList = function (req, res) {
    var projectId = req.params.id
    if (projectId && projectId!=''){
        ProjectModel.findBackupsById(projectId,function (err, project) {
            if (err) {
                errHandler(res,500,'error')
            }

            res.end(JSON.stringify(project.backups))
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
                if (stats&&stats.isDirectory&&stats.isDirectory()){

                    //copy template
                    cpTemplates('defaultTemplate',path.join(targetDir,'template',function (err) {
                        var info = {};
                        info._id = newProject._id;
                        info.userId = newProject.userId;
                        info.resolution = newProject.resolution;
                        info.name = newProject.name;
                        info.template = newProject.template;
                        info.createTime = moment(newProject.createTime).format('YYYY-MM-DD HH:mm');
                        info.lastModifiedTime = moment(newProject.lastModifiedTime).format('YYYY-MM-DD HH:mm');
                        info.supportTouch = newProject.supportTouch;
                        info.author = newProject.author;
                        res.end(JSON.stringify(info))
                    }));

                }else{
                    //create new directory
                    //console.log('create new directory',targetDir);
                    mkdir(targetDir, function (err) {
                        if (err){
                            console.log('mk error');
                            errHandler(res, 500,'mkdir error')
                        }else{
                            // console.log('ok')
                            //copy template
                            cpTemplates('defaultTemplate',path.join(targetDir,'template'),function (err) {
                                var info = {};
                                info._id = newProject._id;
                                info.userId = newProject.userId;
                                info.resolution = newProject.resolution;
                                info.name = newProject.name;
                                info.template = newProject.template;
                                info.createTime = moment(newProject.createTime).format('YYYY-MM-DD HH:mm');
                                info.lastModifiedTime = moment(newProject.lastModifiedTime).format('YYYY-MM-DD HH:mm');
                                info.supportTouch = newProject.supportTouch;
                                info.author = newProject.author;
                                res.end(JSON.stringify(info))
                            });
                        }

                    })
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
                        //backup last content
                        var backups = project.backups||[]
                        if (backups.length>=5){
                            backups.shift()
                        }
                        project.content = JSON.stringify(curProjectContent)
                        backups.push({time:new Date(),content:project.content})
                        project.save(function (err) {
                            if (err){
                                console.log(err)
                                errHandler(res, 500, 'project resave error')
                            }else{

                                res.end('ok')
                                //delete files
                                // var resourceList = curProjectContent.resourceList;
                                var resourceList = []
                                project.backups.forEach(function (backup) {
                                    var c = JSON.parse(backup.content)
                                    if (c){
                                        var curList = c.resourceList||[]
                                        resourceList = resourceList.concat(curList)
                                    }
                                })
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
                };
                try{
                    var contentObj = JSON.parse(project.content);
                    contentNewJSON = JSON.stringify(contentObj,transformSrc);
                    tempPro.content = contentNewJSON;
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
