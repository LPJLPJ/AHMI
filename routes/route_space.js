var UserModel = require('../db/models/UserModel');
var ProjectModel = require('../db/models/ProjectModel');
var CANProjectModel = require('../db/models/CANProjectModel');
var path = require('path');
var moment = require('moment');
var _ = require('lodash');
module.exports = function (req, res) {
	var _user = req.session.user
	if (_user && _user.username && _user.id) {
        ProjectModel.findProjectInfosByUser(_user.id, function (err, projects) {
            if (err){
                console.log(err)
                res.status(500).end()
            }
            var processedProjects = _.cloneDeep(projects).map(function (project) {
                var info = {}
                info._id = project._id;
                info.userId = project.userId;
                info.resolution = project.resolution;
                info.name = project.name;
                info.template = project.template;
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
                        projects:processedProjects,
                        CANProjects:processedCANProjects,
                    })
                }
            });
        })

	}else{
		res.end('user not valid')
		res.redirect('/user/login')
	}
}