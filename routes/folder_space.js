var UserModel = require('../db/models/UserModel');
var ProjectModel = require('../db/models/ProjectModel');
var ClassModel = require('../db/models/ClassModel');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
module.exports=function(req,res){
    var folderId = req.params.id;
    var _user = req.session.user;
    if(_user&&_user.id){
        ClassModel.findById(folderId,function(err,folder){
            if(err){
                console.log(err);
                errHandler(res,500,'error')
            }else{
                var folderInfo={
                    name:folder.name,
                    id:folderId
                };
                //查找项目下的工程
                ProjectModel.findProByClass(_user.id,folderId,function(err,projects){
                    if(err){
                        console.log(err);
                        errHandler(res,500,'error')
                    }else{
                        var processedProjects = projects.map(function (project) {
                            var info = {};
                            info._id = project._id;
                            info.classId=project.classId;
                            info.userId = project.userId;
                            info.resolution = project.resolution;
                            info.name = project.name;
                            info.template = project.template;
                            info.ideVersion = project.ideVersion;
                            info.originalSite = project.originalSite;
                            info.createTime = moment(project.createTime).format('YYYY-MM-DD HH:mm');
                            info.lastModifiedTime = moment(project.lastModifiedTime).format('YYYY-MM-DD HH:mm');
                            info.supportTouch = project.supportTouch;
                            info.author = project.author;
                            var thumbnail = project.thumbnail;
                            return {
                                projectInfo: info,
                                thumbnail:thumbnail
                            }
                        });

                        res.render('login/classSpace.html',{
                            folder:folderInfo,
                            projects:processedProjects
                        });
                    }
                });
            }
        });
    }else{
        res.redirect('/user/login');
    }
};