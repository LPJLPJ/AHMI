var UserModel = require('../db/models/UserModel')

module.exports=function(req, res){
	UserModel.fetch(function(err, users){
		if (err) {
			res.end(JSON.stringify(err))
		}

		res.end(JSON.stringify(users))
	})
}