/**
 * Created by ChangeCheng on 16/5/13.
 */

var UserModel = require('../db/models/UserModel')
var errHandler = require('../utils/errHandlers')
var UserTypes = {
    normal:'normal',
    super:'super'
}

module.exports = function (req, res, next) {
    var curUser = req.session.user
    if (curUser&&curUser.id&&curUser.id!=""){
        UserModel.findById(curUser.id, function (err, user) {
            if (err || !user){
                errHandler(res, 500, 'invalid user')
            }else{
                if (user.type === UserTypes.super){
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
