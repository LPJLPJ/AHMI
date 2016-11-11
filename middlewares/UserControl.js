/**
 * Created by ChangeCheng on 2016/11/11.
 */
var UserModel = require('../db/models/UserModel')
var errHandler = require('../utils/errHandler');
var UserTypes = {
    basic:1,
    pro:2,
    ultimate:3,
    admin:9
}

var UserControl = {};


for (type in UserTypes){
    UserControl[type] = function (req,res,next) {
        hasValidPrivilege(type,req,res,next)
    }
}

function hasValidPrivilege(baseType,req,res,next) {
    var curUser = req.session.user
    if (curUser&&curUser.id&&curUser.id!==""){
        UserModel.findById(curUser.id, function (err, user) {
            if (err || !user){
                errHandler(res, 500, 'invalid user')
            }else{
                if (UserTypes[user.type] && UserTypes[user.type]>=UserTypes[baseType]){
                    //ok
                    next()
                }else{
                    errHandler(res,500,'privilege not enough')
                }
            }
        })
    }else{
        errHandler(res, 500, 'invalid user')
    }
}

module.exports = UserControl;