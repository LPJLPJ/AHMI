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
var mkdir = require('mkdir-p');
//rendering
var renderer = require('../utils/render/renderer');
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
            if (project.userId == userId){
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
                console.log('project save error')
                //res.status(500).end('save error')
                errHandler(res,500,'save error');
            }
            //create project directory
            var targetDir = path.join(__dirname,'../projects/',String(newProject._id),'resources')
            fs.stat(targetDir, function (err, stats) {
                if (stats&&stats.isDirectory&&stats.isDirectory()){
                    //exists
                    var newProjectInfo = _.cloneDeep(newProject)
                    delete newProjectInfo.content;
                    res.end(JSON.stringify(newProjectInfo))
                }else{
                    //create new directory
                    console.log('create new directory',targetDir);
                    mkdir(targetDir, function (err) {
                        if (err){
                            console.log('mk error')
                            errHandler(res, 500,'mkdir error')
                        }else{
                            console.log('ok')
                            //create resources
                            var newProjectInfo = _.cloneDeep(newProject)
                            delete newProjectInfo.content;
                            res.end(JSON.stringify(newProjectInfo))
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

projectRoute.deleteProject = function (req, res) {
    var projectId = req.body.projectId;
    console.log(projectId)
    if (projectId){
        //exitst
        ProjectModel.deleteById(projectId, function (err) {
            if (err){
                errHandler(res,500,'delete error')
            }
            //delete directory
            var targetDir = path.join(__dirname,'../projects/',String(projectId))
            fs.stat(targetDir, function (err, stats) {
                if (stats&&stats.isDirectory&&stats.isDirectory()){
                    //exists
                    //delete
                    fs.rmdir(targetDir, function () {
                        res.end('ok')
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
                            var url = path.join(__dirname,'../projects',projectId,'resources');
                            fs.readdir(url, function (err, files) {
                                if (err){
                                    console.log(err)
                                }
                                //console.log(files)
                                if (files && files.length){

                                    var diffResources = _.difference(files,resourceNames);
                                    //console.log(diffResources)
                                    for (var i=0;i<diffResources.length;i++){
                                        fs.unlink(path.join(url,diffResources[i]));
                                    }
                                }
                            })

                        }
                    })
                }else{
                    errHandler(res,500,'project save error')
                }
            }

        })
    }else{
        errHandler(res,500,'projectId error')
    }
}

projectRoute.saveThumbnail = function (req, res) {
    var projectId = req.params.id;
    if (projectId!=""){
        ProjectModel.findById(projectId, function (err, project) {
            if (err){
                errHandler(res,500,'project error')
            }else{
                var thumbnail = req.body.thumbnail;
                if (thumbnail){
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

        })
    }else{
        errHandler(res,500,'projectId error');
    }
}


projectRoute.generateProject = function (req, res) {
    var projectId = req.params.id;
    var dataStructure = req.body.dataStructure;
    if (projectId!=""){
        var ProjectBaseUrl = path.join(__dirname,'../projects',String(projectId));
        var DataFileUrl = path.join(ProjectBaseUrl,'resources','data.json');
        // fs.writeFile(DataFileUrl,JSON.stringify(dataStructure,null,4), function (err) {
        //     if (err){
        //         errHandler(res,500,err);
        //     }else{
        //         //write ok
        //         var zip = new nodejszip();
        //         var SrcUrl = path.join(ProjectBaseUrl,'resources');
        //         var DistUrl = path.join(ProjectBaseUrl,'file.zip');
        //         try {
        //             zip.compress(DistUrl, SrcUrl, ['-rj'], function (err) {
        //                 if (err) {
        //                     errHandler(res, 500, err);
        //                 } else {
        //                     res.end('ok')
        //
        //                 }
        //             })
        //         }catch (err){
        //             errHandler(res, 500, err);
        //         }
        //     }
        // })
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
        var okFlag = true;
        var cb = function (err) {
            if (err){
                okFlag = false;
                console.log('err',err);
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
                                var zip = new nodejszip();
                                var SrcUrl = path.join(ProjectBaseUrl,'resources');
                                var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                try {
                                    zip.compress(DistUrl, SrcUrl, ['-rj'], function (err) {
                                        if (err) {
                                            errHandler(res, 500, err);
                                        } else {
                                            res.end('ok')

                                        }
                                    })
                                }catch (err){
                                    errHandler(res, 500, err);
                                }
                            }
                        })
                    }else{
                        errHandler(res,500,'generate error')
                    }
                }
            }
        }.bind(this);
        for (var m=0;m<allWidgets.length;m++){
            var curWidget = allWidgets[m];
            renderer.renderWidget(curWidget,path.join(__dirname,'..'),path.join(ProjectBaseUrl,'resources'),path.join('projects',String(projectId),'resources'),cb);
        }
    }else{
        errHandler(res,500,'projectId error');
    }
}

projectRoute.downloadProject = function (req, res) {
    var projectId = req.params.id;
    if (projectId!=""){
        var ProjectBaseUrl = path.join(__dirname,'../projects',String(projectId));
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
}

module.exports = projectRoute;
