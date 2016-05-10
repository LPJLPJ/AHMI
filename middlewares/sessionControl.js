var needAuth = require('../utils/needAuth')
module.exports = function userControl(req, res, next){
	console.log(req.session);
	if (!req.session.user){
		if (!needAuth(req.url)){
			next()
		}else{
			console.log('redirect to login');
			res.redirect('/user/login')
		}
	}else if (req.session.user){
		next()
	}
}