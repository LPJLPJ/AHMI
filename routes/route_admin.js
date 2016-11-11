/**
 * Created by ChangeCheng on 2016/11/11.
 */
var UserModel = require('../db/models/UserModel')
var errHandler = require('../utils/errHandler')

var Route_admin = {};
Route_admin.getLogin = function(req, res){
    res.render('login/adminLogin.html')

};

Route_admin.postLogin = function (req,res) {
    
}

Route_admin.getManageSpace = function (req,res) {
    res.render('login/manageSpace.html')
}

Route_admin.getUsers = function (req, res) {
    
}

module.exports = Route_admin;