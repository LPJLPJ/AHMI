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
projectRoute.getAllProjects=function(req, res){
    ProjectModel.fetch(function(err, projects){
        if (err){
            console.log(err)
            res.end(err)
        }
        res.end(projects)
    })
}


projectRoute.getProjectById = function (req, res) {
    console.log('get project by id')
    var projectId = req.params.id
    console.log(projectId)
    if (projectId && projectId!=''){
        ProjectModel.findById(projectId,function (err, project) {
            if (err) {
                console.log(err)
                errHandler(res,500,'error')
            }
            console.log(project)
            res.render('ide/index.html')
        })
    }else{
        errHandler(res,500,'error')
    }

}

projectRoute.getProjectContent = function (req, res) {
    var projectId = req.params.id
    console.log('projectId: ',projectId)
    if (projectId && projectId!=''){
        ProjectModel.findById(projectId,function (err, project) {
            if (err) {
                console.log(err)
                errHandler(res,500,'error')
            }
            //console.log(project)
            res.end(project.content)
        })
    }else{
        errHandler(res,500,'error')
    }
}

projectRoute.createProject = function (req, res) {
    console.log('======')
    console.log(req.session.user)
    console.log(req.params)
    console.log(req.body)
    console.log('*******')
    var data = _.cloneDeep(req.body)
    if (req.session.user){
        //user exists
        data.userId = req.session.user.id
        var newProject = new ProjectModel(data)
        newProject.save(function (err) {
            if (err){
                console.log('project save error')
                res.status(500).end()
            }
            //create project directory
            var targetDir = path.join(__dirname,'../projects/',String(newProject._id))
            fs.stat(targetDir, function (err, stats) {
                if (stats&&stats.isDirectory&&stats.isDirectory()){
                    //exists
                }else{
                    //create new directory
                    console.log('create new directory')
                    fs.mkdir(targetDir, function (err) {
                        if (err){
                            console.log('mk error')
                            errHandler(res, 500,'mkdir error')
                        }else{
                            console.log('ok')
                            res.end(JSON.stringify(newProject))
                        }

                    })
                }
            })


        })
    }else{
        res.status(500).end()
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
    console.log('saving project')
    var projectId = req.params.id;
    if (projectId!=""){
        ProjectModel.findById(projectId, function (err, project) {
            if (err){
                errHandler(res,500,'project error')
            }else{
                var curProjectContent = req.body.project
                if (curProjectContent!=''){
                    project.content = JSON.stringify(curProjectContent)
                    project.save(function (err) {
                        if (err){
                            console.log(err)
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
        errHandler(res,500,'projectId error')
    }
}

module.exports = projectRoute
