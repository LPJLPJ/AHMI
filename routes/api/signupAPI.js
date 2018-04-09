/**
 * Created by ChangeCheng on 16/5/23.
 */

//api version for signup
var UserModel = require('../../db/models/UserModel');
var path = require('path');
var signupAPI = {};
var mailServiece = require('../../utils/mailService');
var errHandler = require('../../utils/errHandler');


signupAPI.post = function(req, res){

    var userInfo = req.body;

    if (userInfo.username && userInfo.mail && userInfo.password) {
        //compare captcha
        if (req.session.captcha&&(userInfo.captcha == req.session.captcha.text)) {
            //valid
            UserModel.findByName(userInfo.username,function(err , user){
                if (err) {
                    errHandler(res,500,err);
                }
                if (user) {
                    //duplicated name
                    errHandler(res,500,'duplicate');

                }else{
                    //findByMail
                    UserModel.findByMail(userInfo.mail,function(err, user){
                        if (err) {
                            errHandler(res,500,err);
                        }
                        if (user){
                            errHandler(res,500,'duplicate');
                        }else{

                            var newUser = new UserModel({accountName:userInfo.username,password:userInfo.password,email:userInfo.mail})
                            newUser.save(function(err){
                                if (err) {
                                    errHandler(res,500,err);
                                }
                                //send mail
                                //baseurl
                                var baseUrl = req.protocol+'://'+req.headers.host;
                                baseUrl = process.env.CUR_HOST || baseUrl;
                                mailServiece.sendVerifyMail(newUser.email,newUser._id,baseUrl, function (err, info) {
                                    if (err){
                                        errHandler(res,500,err)
                                    }
                                    res.end('new');
                                })

                            })
                        }
                    })
                }

            })
        }else{
            errHandler(res,500,'captcha error');
        }
        //delete captcha
        req.session.captcha = null;
    }else{
        errHandler(res,500,'error');
    }

};

module.exports = signupAPI