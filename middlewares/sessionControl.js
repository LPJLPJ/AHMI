var needAuth = require('../utils/needAuth')
module.exports = function userControl(req, res, next){
	if (!req.session.user){
		if (!needAuth(req.url)){
			next()
		}else{
			res.redirect('/user/login')
		}
	}else if (req.session.user){
		next()
	}
}