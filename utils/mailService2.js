/**
 * Created by zzen1ss on 16/7/18.
 */
var MailCore = require('./mailCore');
var path = require('path');
var bcrypt = require('bcrypt')
var mailService = {}
var SALT_FACTOR = 10

var curMailCore = new MailCore({
    host: 'smtp.mxhichina.com',
    port: 465,
    secureConnection:true,
    auth: {
        user: 'no-reply@graphichina.com',
        pass: 'Graphichina12345'
    }
},{
    root:path.join(__dirname,'mailtemplates')
});




mailService.sendTestMail = function (to,cb) {
    curMailCore.sendMail({
        from: '"Graphichina" <no-reply@graphichina.com>', // sender address
        to: to, // list of receivers
        subject: 'Test', // Subject line
    },'<b>Hello world</b>','hello world',cb);
};

mailService.sendVerifyMail = function (to, id,baseUrl,cb) {
    baseUrl = baseUrl || 'http://localhost:300';
    var url = baseUrl+'/user/verify?id='+id;

    curMailCore.sendMailWithTemplates({
        from: '"Graphichina" <no-reply@graphichina.com>', // sender address
        to: to, // list of receivers
        subject: '注册确认', // Subject line
    },'verify.html',{
        url:url
    },cb);

};

mailService.sendPasswordMail = function (to ,baseUrl,cb) {
    var timeTag = Date.now();
    var key = '';


    bcrypt.genSalt(SALT_FACTOR,function(err, salt){
        if (err) return cb(err)
        bcrypt.hash(to,salt,function(err, hash){
            if (err) {return cb(err)}
            key = hash;
            baseUrl = baseUrl || 'http://localhost:3000';
            var url = baseUrl+'/user/findpassword?mail='+to+'&key='+key+'&time='+timeTag;

            curMailCore.sendMailWithTemplates({
                from: '"Graphichina" <no-reply@graphichina.com>', // sender address
                to: to, // list of receivers
                subject: '找回密码', // Subject line
            },'findpassword.html',{
                url:url
            },cb);
        })
    })

};




module.exports = mailService
