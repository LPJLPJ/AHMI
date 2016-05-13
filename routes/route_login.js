var UserModel = require('../db/models/UserModel')
var path = require('path')
var login = {}
login.get = function(req, res){
	//
    console.log('login user',req.session.user)
    if (req.session.user){
        res.redirect('/private/space')

    }else{
        res.render('login/login.html',{
            title:'登录'
        })
    }

}

login.post = function(req, res){
	console.log(req.body);
	//console.log(req.session);


	var username = req.body.username
	var password = req.body.password
	var captchaText = req.body.captcha


    //console.log(req.session.captcha,captchaText)

	//varify captcha
	//var sessionCaptchaText = req.session.captcha.text
	// console.log(sessionCaptchaText,req.session);
	if (req.session.captcha&&(captchaText == req.session.captcha.text)) {
		 console.log('captcha valid');
		UserModel.findByMailOrName(username,username,function(err, user){
			if (err) { return res.end(err)}
			if (user) {
                if (!user.verified){
                    return res.end('not verified')
                }
				user.comparePassword(password,function(err, isMatch){
					if (err) {
						return res.end(err)
					}
					if (isMatch) {
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