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
    var from = parseInt(req.query.from)||0;
    var limit = parseInt(req.query.limit)||0;
    UserModel.fetchBatch(from,limit,function (err,users) {
        if (err){
            errHandler(res,500,'fetch user')
        }else{
            users.forEach(function (user) {
                user.password = null;
            });
            res.end(JSON.stringify(users))
        }
    })
}


Route_admin.changeUserType = function (req, res) {
    var userId = req.body.userId;
    var type = req.body.type;
    UserModel.findById(userId,function (err, user) {
        if (err || !user){
            console.log(err,user)
            errHandler(res,500,err)
        }else{
            user.type = type;
            user.save(function (err) {
                if (err){
                    errHandler(res,500,"error saving user type");
                }else{
                    res.end('ok');
                }
            })
        }
    })
}

module.exports = Route_admin;