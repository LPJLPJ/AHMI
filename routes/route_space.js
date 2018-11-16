var UserModel = require('../db/models/UserModel');
var ProjectModel = require('../db/models/ProjectModel');
var CANProjectModel = require('../db/models/CANProjectModel');
var ClassModel = require('../db/models/ClassModel');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
module.exports = function (req, res) {
	var _user = req.session.user;
    var path = req.query.path;
    var classId='space';


	if (_user && _user.id) {
        UserModel.findById(_user.id,function(err,user){
            if(err){
                res.status(500).end()
            }else{
                var userInfo = {};
                userInfo.name = user.accountName;
                userInfo.email = user.email;
                userInfo.type = user.type;

                ProjectModel.findPro(_user.id,classId,function (err, projects) {
                    if (err){
                        console.log(err);
                        res.status(500).end()
                    }else{
                        var processedProjects = projects.map(function (project) {
                            var info = {};
                            if(project.classId){
                                info.classId=project.classId;
                            }else{
                                info.classId='space';
                            }
                            info._id = project._id;
                            info.userId = project.userId;
                            info.resolution = project.resolution;
                            info.name = project.name;
                            info.template = project.template;
                            info.ideVersion = project.ideVersion;
                            info.originalSite = project.originalSite;
                            info.createTime = moment(project.createTime).format('YYYY-MM-DD HH:mm');
                            info.lastModifiedTime = moment(project.lastModifiedTime).format('YYYY-MM-DD HH:mm');
                            info.supportTouch = project.supportTouch;
                            info.encoding = project.encoding;
                            info.author = project.author;
                            var thumbnail = project.thumbnail;
                            return {
                                projectInfo: info,
                                thumbnail:thumbnail
                            }
                        });
                        ClassModel.findFolderByUser(_user.id,function(err,folders){
                            if(err){
                                console.log(err);
                                res.status(500).end();
                            }else{
                                var processedFolders=_.cloneDeep(folders).map(function(folder){
                                    var info={};
                                    info._id = folder._id;
                                    info.userId = folder.userId;
                                    info.name = folder.name;
                                    info.author = folder.author;
                                    info.createTime = moment(folder.createTime).format('YYYY-MM-DD HH:mm');
                                    info.lastModifiedTime = moment(folder.lastModifiedTime).format('YYYY-MM-DD HH:mm');
                                    return {
                                        folderInfo:info
                                    }
                                });

                                CANProjectModel.findByUser(_user.id,function(err,CANProjects){
                                    if(err) {
                                        res.status(500).end('error');
                                    }else{
                                        CANProjects.reverse();
                                        var processedCANProjects = _.cloneDeep(CANProjects).map(function(CANProject){
                                            var info = {};
                                            info._id = CANProject._id;
                                            info.userId = CANProject.userId;
                                            info.name = CANProject.name;
                                            info.lastModifiedTime = CANProject.lasModifiedTime;
                                            return {
                                                CANProjectInfo : info
                                            }
                                        });

                                        res.render('login/personalProject.html',{
                                            username:_user.username,
                                            folders:processedFolders,
                                            projects:processedProjects,
                                            path:path?path:'project',
                                            CANProjects:processedCANProjects,
                                            userInfo:userInfo
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
	}else{
		console.log('user not valid')
		res.redirect('/user/login')
	}
};