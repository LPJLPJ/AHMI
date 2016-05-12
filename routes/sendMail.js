/**
 * Created by ChangeCheng on 16/5/12.
 */

var mailService = require('../utils/mailService')

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
    var timeTag = Date.now();
    mailService.transporter.sendMail(mailService.sendVerifyMail('940476656@qq.com','heheeh',timeTag), function(error, info){
        if(error){
            console.log(error);
            res.end('error')
            return
        }
        res.end('Message sent: ' + info.response);
    });
}


module.exports.sendPasswordMail = function (req, res) {
    var timeTag = Date.now();
    mailService.transporter.sendMail(mailService.sendPasswordMail('940476656@qq.com','heheeh',timeTag), function(error, info){
        if(error){
            console.log(error);
            res.end('error')
            return
        }
        res.end('Message sent: ' + info.response);
    });
}

