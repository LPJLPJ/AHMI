var UserModel = require('../db/models/UserModel')
var validator = {}

validator.checkusername = function(req, res){
	var username = req.body.username
	if (!username || username == '') {
		res.end('error')
		return
	}
	UserModel.findByName(username,function(err, user){
		if (err) {console.log(err);}
		if (user) {
			//duplicate
			res.end('duplicate')
		}else{
			res.end('new')
		}
	})
}

validator.checkmail = function(req, res){
	var mail = req.body.mail
	if (!mail || mail == ''){
		res.end('error')
	}

	UserModel.findByMail(mail,function(err, user){
		if (err) {console.log(err);}
		if (user) {
			//duplicate
			res.end('duplicate')
		}else{
			res.end('new')
		}
	})

}

module.exports = validator
