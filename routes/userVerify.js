/**
 * Created by ChangeCheng on 16/5/12.
 */

var UserModel = require('../db/models/UserModel')
var errHandler = require('../utils/errHandler')

var UserVerify = {}
UserVerify.verify = function (req, res) {
    var id = req.query.id;
    if (id!=''){
        UserModel.findById(id, function (err, user) {
            if (err){
                errHandler(res,500,'invalid user id')
            }else{
                if (user){
                    if (user.verified){
                        res.redirect('/user/login')
                    }else{
                        user.verified = true
                        user.save(function (err) {
                            if (err){
                                errHandler(res,500,'user verify error')
                            }else{
                                console.log('verified')
                                res.redirect('/user/login')
                            }
                        })
                    }

                }else{
                    errHandler(res,500,'user not found')
                }
            }
        })
    }else{
        errHandler(res,500,'invalid user id')
    }
}


module.exports = UserVerify;
