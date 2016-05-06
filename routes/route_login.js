var UserModel = require('../db/models/UserModel')
var path = require('path')
var login = {}
login.get = function(req, res){
	//
	res.render('login/login.html',{
		title:'登录'
	})
}

login.post = function(req, res){
	console.log(req.body);
	console.log(req.session);
	var username = req.body.username
	var password = req.body.password
	var captchaText = req.body.captcha




	//varify captcha
	var sessionCaptchaText = req.session.captcha.text
	// console.log(sessionCaptchaText,req.session);
	if (sessionCaptchaText == captchaText) {
		// console.log('captcha valid');
		UserModel.findByName(username,function(err, user){
			if (err) {res.end(err)}
			if (user) {
				user.comparePassword(password,function(err, isMatch){
					if (err) {
						res.end(err)
					}
					if (isMatch) {
						console.log('login success');
						req.session.user = {
							id:user._id,
							username:username
						}
						res.end('ok')
					}else{
						res.end('not match')
					}
				})
			}else{






				res.end('no user')
			}
		})
	}else{
		res.end('captcha invalid')
	}
	
	
}

login.logout = function(req, res){
	delete req.session.user
	res.redirect('/user/login')
}

module.exports = login