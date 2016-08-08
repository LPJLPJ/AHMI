var UserModel = require('../db/models/UserModel')
var ProjectModel = require('../db/models/ProjectModel')
var path = require('path')
var _ = require('lodash')
module.exports = function (req, res) {
	var _user = req.session.user
	if (_user && _user.username && _user.id) {
        ProjectModel.findByUser(_user.id, function (err, projects) {
            if (err){
                console.log(err)
                res.status(500).end()
            }
            var processedProjects = _.cloneDeep(projects).map(function (project) {
                var info = {}
                info._id = project._id;
                info.userId = project.userId;
                info.resolution = project.resolution
                info.name = project.name;
                info.template = project.template;
                info.lastModifiedTime = project.lastModifiedTime;
                var thumbnail = project.thumbnail;
                return {
                    projectInfo: info,
                    thumbnail:thumbnail
                }
            })
            res.render('login/personalProject.html',{
                                       username:_user.username,
                                       projects:processedProjects
                                   })

        })

	}else{
		res.end('user not valid')
		res.redirect('/user/login')
	}
}