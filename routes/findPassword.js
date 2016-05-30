/**
 * Created by ChangeCheng on 16/5/12.
 */
var findPassword = {}
var errHandler = require('../utils/errHandler')
var UserModel = require('../db/models/UserModel')
var mailService = require('../utils/mailService')
var bcrypt = require('bcrypt')
var SALT_FACTOR = 10
findPassword.getFindPasswordPage = function (req, res) {
    res.render('login/findback.html',{
        title:'找回密码'
    })
}

findPassword.postMail = function (req, res) {
    var data = req.body;
    if (data.mail!=''&&data.captcha!=''){
        if (data.captcha == req.session.captcha.text){
            UserModel.findByMail(data.mail, function (err, user) {
                if (err){
                    errHandler(res,500,'error')
                }else {
                    if (user){
                        var baseUrl = req.protocol+'://'+req.headers.host;
                        //var baseUrl = req.headers.host;
                        mailService.sendPasswordMail(data.mail,baseUrl, function (err, info) {
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
            //delete captcha
            req.session.captcha = null;
        }else{
            errHandler(res, 500, 'captcha error')
        }
    }else{
        errHandler(res, 500,'error')
    }
}

findPassword.getResetPasswordPage = function (req, res) {

    var time = req.query.time
    //time
    var timeDiff = Date.now() - time;
    if (timeDiff>0 && timeDiff<30*60*1000){
        //valid
        //compare key
        res.render('login/resetPassword.html',{
            title:'重置密码'
        })
    }else{
        res.end('链接超时, 请重新获取')
    }
}

findPassword.resetPassword = function (req, res) {
    var mail = req.query.mail
    var key = req.query.key
    var time = req.query.time

    var newPassword = req.body.password;
    var captcha = req.body.captcha
    //captcha
    if (captcha!=req.session.captcha.text){
        errHandler(res,500,'captcha error')
        return;
    }
    //console.log('params',req.params)
    //console.log('query',req.query)
    //console.log('time',Date.now())
    var timeDiff = Date.now() - time;
    if (timeDiff>0 && timeDiff<30*60*1000){
        //valid
        //compare key
        bcrypt.compare(mail,key, function (err, isMatch) {
            if (err){
                errHandler(res,500,'verify error')
            }else{
                if (isMatch){
                    //
                    if (newPassword!=''){
                        UserModel.findByMail(mail, function (err, user) {
                            if (err){
                                errHandler(res,500,'password change error')
                            }else{
                                if (user){
                                    user.password = newPassword;
                                    console.log('newpass',newPassword)
                                    bcrypt.genSalt(SALT_FACTOR,function(err, salt){
                                        if (err) return errHandler(res,500,'password change error')
                                        bcrypt.hash(user.password,salt,function(err, hash){
                                            if (err) {errHandler(res,500,'password change error')}
                                            user.password = hash
                                            user.save(function (err) {
                                                if (err){
                                                    errHandler(res,500,'password change error')
                                                }else{
                                                    res.end('ok')
                                                }
                                            })
                                        })
                                    })
                                }else{
                                    errHandler(res,500,'user not found')
                                }
                            }
                        })
                    }else{
                        errHandler(res,500,'password not valid')
                    }

                }else{
                    errHandler(res,500,'key not match')
                }
            }
        })

    }else{
        errHandler(res,500,'timeout')
    }
}




module.exports = findPassword