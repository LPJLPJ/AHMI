/**
 * Created by ChangeCheng on 16/5/12.
 */

var mailService = require('../utils/mailService')
var errHandler = require('../utils/errHandler')
var UserModel = require('../db/models/UserModel')

module.exports.sendTestMail = function (req, res) {
    mailService.transporter.sendMail(mailService.sendTestMail('940476656@qq.com'), function(error, info){
        if(error){
            console.log(error);
            res.end('error')
            return
        }
        res.end('Message sent: ' + info.response);
    });
}


module.exports.sendVerifyMail = function (req, res) {
    var username = req.body.username;
    if (username!=""){
        UserModel.findByMailOrName(username, username, function (err, user) {
            if (err){
                errHandler(res, 500, 'error')
            }else{
                if (user){
                    var baseUrl = req.protocol+'://'+req.headers.host;
                    baseUrl = process.env.CUR_HOST || baseUrl;
                    mailService.sendVerifyMail(user.email,user._id, baseUrl,function (err,info) {
                        if (err){
                            //console.log(err)
                            errHandler(res, 500, 'mail send error')
                        }else{
                            //console.log('send ok')
                            res.end('ok')
                        }
                    })
                }else{
                    errHandler(res, 500, 'user not found')
                }
            }
        })
    }else{
        errHandler(res,500,'error')
    }


}


module.exports.sendPasswordMail = function (req, res) {
    var to = req.body.mail;
    if (to!=''){
        UserModel.findByMail(to, function (err, user) {
            if (err){
                errHandler(res,500,'user find error')
            }else{
                if (user){
                    var baseUrl = req.protocol+'://'+req.headers.host;
                    baseUrl = process.env.CUR_HOST || baseUrl;
                    mailService.sendPasswordMail(to, baseUrl, function (err, info) {
                        if (err){
                            errHandler(res,500,'send mail error')
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
        errHandler(res,500,'error mail')
    }
    
}

