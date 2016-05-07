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
					projects:[
                        {
                            id:'project1',
                            name:'project1',
                            thumbnail:'t1.png',
                            resolution:'800*600',
                            lastModified:'date1',
                            createdAt:'date2'
                        },
                        {
                            id:'project2',
                            name:'project2',
                            thumbnail:'t2.png',
                            resolution:'1280*800',
                            lastModified:'date1',
                            createdAt:'date2'
                        }
                    ]
				})
			}
		})
	}else{
		console.log('user not valid');
		res.end('user not valid')
		res.redirect('/user/login')
	}
}