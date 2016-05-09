/**
 * Created by ChangeCheng on 16/5/7.
 */
var ProjectModel = require('../db/models/ProjectModel')
var UserModel = require('../db/models/UserModel')
var projectRoute = {}
var _ = require('lodash')
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
    ProjectModel.findById(function (err, project) {
        if (err) {
            console.log(err)
            res.end(err)
        }
        res.end(project)
    })
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
            res.end(JSON.stringify(newProject))
            //save to user
            //var projectId = newProject._id
            //console.log(projectId)
            //UserModel.findById(req.session.user.id, function (err, user) {
            //    if (err){
            //        console.log('user find error')
            //        res.status(500).end()
            //    }
            //    if (user){
            //        //update user
            //        //console.log(user.projectIds)
            //        user.projectIds.push(projectId)
            //        //console.log(user.projectIds)
            //        user.save(function (err) {
            //            if (err){
            //                console.log('project save to user error')
            //                res.status(500).end()
            //            }
            //            //console.log(user.projectIds)
            //            //res.send('ok')
            //            res.send(JSON.stringify(newProject))
            //            res.end()
            //        })
            //    }else{
            //        //user error
            //        res.status(500).end()
            //    }
            //})
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
            res.end('ok')
        })
    }else{
        errHandler(res,500,'invalid project id')
    }
}

module.exports = projectRoute
