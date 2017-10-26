var UserModel = require('../db/models/UserModel');
var path = require('path');
var url = require('url')
var qs  = require('qs')
var login = {};
login.get = function(req, res){
    console.log('login user',req.session.user);
    if (req.session.user){
        var urlQuery = url.parse(req.url).query
        if (urlQuery){
            var query = qs.parse(urlQuery)
            var originalUrl = query.originalUrl
            if (originalUrl){
                res.redirect(originalUrl)
            }else{
                res.redirect('/private/space')
            }
        }else{
            res.redirect('/private/space')
        }






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