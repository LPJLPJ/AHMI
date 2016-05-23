var UserModel = require('../db/models/UserModel');
var path = require('path');
var signup = {};
signup.get = function(req ,res){
	res.render('login/register.html',{
		title:'注册'
	})
};

module.exports = signup;