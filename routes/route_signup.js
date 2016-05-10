var UserModel = require('../db/models/UserModel')
var path = require('path')
var signup = {}
signup.get = function(req ,res){
	// res.sendFile(path.join(__dirname,'..','client','signup.html'))
	res.render('login/register.html',{
		title:'注册'
	})
}

signup.post = function(req, res){
	var userInfo = req.body
	console.log(userInfo);
	if (userInfo.username && userInfo.mail && userInfo.password && userInfo.captcha) {
		//compare captcha
		if (req.session.captcha&&(userInfo.captcha == req.session.captcha.text)) {
			//valid
			UserModel.findByName(userInfo.username,function(err , user){
				if (err) {
					console.log(err);
					res.end('error')
				}
				if (user) {
					//duplicated name
					console.log(user);
					res.end('duplicate')

				}else{
					//findByMail
					UserModel.findByMail(userInfo.mail,function(err, user){
						if (err) {
							console.log(err);
							res.end('error')
						}
						if (user){
							res.end('duplicate')
						}else{
							var newUser = new UserModel({accountName:userInfo.username,password:userInfo.password,email:userInfo.mail})
							newUser.save(function(err){
								if (err) {
									console.log(err);
									res.end('error')
								}
								res.end('new')
								// res.redirect('/user/login')
							})
						}
					})	
				}

			})
		}else{
			res.end('captcha error')
		}
	}else{
		res.end('error')
	}
	
}

module.exports = signup