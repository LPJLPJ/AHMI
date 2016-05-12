/**
 * Created by ChangeCheng on 16/5/12.
 */

var nodemailer = require('nodemailer')
var bcrypt = require('bcrypt')
var mailService = {}
var SALT_FACTOR = 10
mailService.transporter = nodemailer.createTransport({
    host: 'smtp.mxhichina.com',
    port: 465,
    secureConnection:true,
    auth: {
        user: 'zeyu.cheng@graphichina.com',
        pass: 'Change092410'
    }
})


mailService.sendTestMail = function (to) {
    return {
        from: '"Graphichina" <zeyu.cheng@graphichina.com>', // sender address
        to: to, // list of receivers
        subject: 'Test', // Subject line
        text: 'Hello World', // plaintext body
        html: '<b>Hello world</b>' // html body
    }
}

mailService.sendVerifyMailExample = function (to, id) {
    var url = 'http://localhost:3000/user/verify?id='+id;
    return {
        from: '"Graphichina" <zeyu.cheng@graphichina.com>', // sender address
        to: to, // list of receivers
        subject: '注册确认', // Subject line
        //text: '请点击链接进行确认: '+'http', // plaintext body
        html: '<p>请点击链接进行确认:</p><br><a href='+url+'>'+url+'</a> ' // html body
    }
}

mailService.sendPasswordMailExample = function (to, key, timeTag) {
    var url = 'http://localhost:3000/user/findpassword?mail='+to+'&key='+key+'&time='+timeTag;
    return {
        from: '"Graphichina" <zeyu.cheng@graphichina.com>', // sender address
        to: to, // list of receivers
        subject: '找回密码', // Subject line
        //text: '请点击链接找回密码: '+'http', // plaintext body
        html: '<p>请点击链接找回密码:</p><br><a href='+url+'>'+url+'</a> ' // html body
    }
}



mailService.sendVerifyMail = function (to, id, cb) {
    mailService.transporter.sendMail(mailService.sendVerifyMailExample(to,id), cb);
}


mailService.sendPasswordMail = function (to ,cb) {
    var timeTag = Date.now();
    var key = ''


    bcrypt.genSalt(SALT_FACTOR,function(err, salt){
        if (err) return cb(err)
        bcrypt.hash(to,salt,function(err, hash){
            if (err) {return cb(err)}
            key = hash
            mailService.transporter.sendMail(mailService.sendPasswordMailExample(to,key,timeTag),cb);
        })
    })

}




module.exports = mailService
