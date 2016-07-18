/**
 * Created by zzen1ss on 16/7/18.
 */
var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
function MailCore(transportOptions, templateOptions) {
    this.transporter = nodemailer.createTransport(transportOptions);
    this.templates = new EmailTemplates(templateOptions);
}


MailCore.prototype.sendMailWithTemplates = function (mailOptions,templateSrc,context,cb) {
    this.templates.render(templateSrc,context,function (err,html,text) {
        mailOptions.html = html;
        mailOptions.text = text;
        this.transporter.sendMail(mailOptions,cb)
    }.bind(this))
};

MailCore.prototype.sendMail = function (mailOptions,html,text,cb) {
    mailOptions.html = html;
    mailOptions.text = text;
    this.transporter.sendMail(mailOptions,cb)
};


module.exports = MailCore;