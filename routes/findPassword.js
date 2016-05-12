/**
 * Created by ChangeCheng on 16/5/12.
 */
var findPassword = {}
var errHandler = require('../utils/errHandler')
var UserModel = require('../db/models/UserModel')
var mailService = require('../utils/mailService')
findPassword.getFindPasswordPage = function (req, res) {
    res.render('login/findback.html',{
        title:'找回密码'
    })
}

findPassword.postMail = function (req, res) {
    var data = req.body
    if (data.mail!=''&&data.captcha!=''){
        if (data.captcha == req.session.captcha.text){
            UserModel.findByMail(data.mail, function (err, user) {
                if (err){
                    errHandler(res,500,'error')
                }else {
                    if (user){
                        mailService.sendPasswordMail(data.mail, function (err, info) {
                            if (err){
                                errHandler(res,500,'mail send error')
                            }else{
                                res.end('ok')
                            }
                        })
                    }else{
                        errHandler(res,500,'user not found')
                    }
                }
            })
        }else{
            errHandler(res, 500, 'captcha error')
        }
    }else{
        errHandler(res, 500,'error')
    }
}

module.exports = findPassword