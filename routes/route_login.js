var UserModel = require('../db/models/UserModel');
var path = require('path');
var login = {};
login.get = function(req, res){
	//
    console.log('login user',req.session.user);
    if (req.session.user){
        res.redirect('/private/space')

    }else{
        res.render('login/login.html',{
            title:'登录'
        })
    }

};

login.logout = function(req, res){
	delete req.session.user;
	res.redirect('/user/login')
};

module.exports = login;