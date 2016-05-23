/**
 * Created by ChangeCheng on 16/5/23.
 */
var UserModel = require('../../db/models/UserModel');
var path = require('path');
var errHandler = require('../../utils/errHandler');
var loginAPI = {};


loginAPI.post = function(req, res){

    var username = req.body.username;
    var password = req.body.password;
    var captchaText = req.body.captcha;

    if (req.session.captcha&&(captchaText == req.session.captcha.text)) {
        UserModel.findByMailOrName(username,username,function(err, user){
            if (err) { return res.end(err)}
            if (user) {
                if (!user.verified){
                    errHandler(res,500,'not verified');
                }
                user.comparePassword(password,function(err, isMatch){
                    if (err) {
                        errHandler(res,500,err);
                    }
                    if (isMatch) {
                        req.session.user = {
                            id:user._id,
                            username:username
                        };
                        return res.end('ok');
                    }else{
                        errHandler(res,500,'not match')
                    }
                })
            }else{

                errHandler(res,500,'no user')
            }
        })
    }else{
        errHandler(res,500,'captcha invalid')
    }
    req.session.captcha = null;


};

module.exports = loginAPI;