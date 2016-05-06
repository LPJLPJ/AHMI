var UserModel = require('../db/models/UserModel')
var path = require('path')
module.exports = function (req, res) {
	var _user = req.session.user
	if (_user && _user.username && _user.id) {
		UserModel.findById(_user.id,function(err, user){
			if (err) {
				console.log(err);
				res.end('error')
			}
			if (user) {
				console.log('user', user);
				res.render('login/personalProject.html',{
					username:user.accountName,
					projectIds:['project1','project2','project3']
				})
			}
		})
	}else{
		console.log('user not valid');
		res.end('user not valid')
		res.redirect('/user/login')
	}
}