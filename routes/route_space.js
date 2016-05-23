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
                return info
            })
            res.render('login/personalProject.html',{
                                       username:_user.username,
                                       projects:processedProjects
                                   })

        })
		//UserModel.findById(_user.id,function(err, user){
		//	if (err) {
		//		console.log(err);
		//		res.end('error')
		//	}
		//	if (user) {
		//		console.log('user', user);
         //       //find all projects
         //       var projectIds = user.projectIds
         //       console.log('projectIds',projectIds)
         //       //var projects = projectIds.map(function (projectId) {
         //       //    ProjectModel.findById(projectId, function (err, project) {
         //       //        if (err) {
         //       //            console.log('find project error')
         //       //            return {name:'a'};
         //       //        }else{
         //       //            return project
         //       //        }
         //       //
         //       //    })
         //       //})
        //
         //       var projects = []
         //       var num = projectIds.length;
        //
         //       for (var i = 0;i<projectIds.length;i++){
         //           ProjectModel.findById(projectIds[i], function (err, project) {
         //               if (err) {
         //                   console.log('find project error')
         //               }else{
         //                   projects.push(project)
         //               }
         //               num = num -1
         //               if (num == 0){
         //                   res.render('login/personalProject.html',{
         //                       username:user.accountName,
         //                       projects:projects
         //                   })
         //               }
        //
        //
        //
         //           })
         //       }
        //
		//	}
		//})
	}else{
		console.log('user not valid');
		res.end('user not valid')
		res.redirect('/user/login')
	}
}