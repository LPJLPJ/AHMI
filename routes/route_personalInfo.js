/**
 * Created by ChangeCheng on 16/5/13.
 */
var UserModel = require('../db/models/UserModel')
var errHandler = require('../utils/errHandler')
module.exports = function (req, res) {
    var userId = req.session.user && req.session.user.id;
    UserModel.findById(userId, function (err, user) {
        if (err){
            errHandler(res,500,'error')
        }else{
            if (user){
                var userInfo = {}
                userInfo.phone = user.phone
                userInfo.company = user.company
                userInfo.male = user.male
                res.render('login/editPersonalInfo.html',{
                    userInfo : userInfo
                })
            }else{
                errHandler(res, 500, 'user not found')
            }
        }
    })
}