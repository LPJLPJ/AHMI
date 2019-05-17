/**
 * Created by ChangeCheng on 16/5/12.
 */

$(function () {
    var errMessages = {
        mail:{
            empty:'请输入邮箱',
            error:'邮箱不存在'
        },
        captcha:{
            empty:'请输入验证码',
            error:'验证码错误'
        },
        general:{
            error:'发生错误'
        }
    }

    var successMessages = {
        general:{
            ok:'已发送邮件,请点击邮件链接进行重置'
        }
    }

    $('#mail').on('keyup', function () {
        var mailVal = $(this).val()
        if (mailVal==""){
            $('#mail-verify').html(errMessages.mail.empty)
        }else{
            $('#mail-verify').html()
        }
    })

    $('#captcha-input').on('keyup', function () {
        var captchaVal = $(this).val()
        if (captchaVal==""){
            $('#captcha-verify').html(errMessages.captcha.empty);
        }else{
            $('#captcha-verify').html('')
        }
    })

    $('#change-captcha').on('click', function () {
        $('#captcha-img').attr('src','/captcha?'+Date.now())
    })

    $('#submit').on('click', function (e) {
        e.preventDefault()
        $('#submit').attr('disabled',true)
        if ($('#mail').val()!==''&&$('#captcha-input').val()!=''){
            //not empty
            $.ajax({
                type:'POST',
                url:'/user/forgetpassword',
                data:{
                    mail:$('#mail').val(),
                    captcha:$('#captcha-input').val()
                },
                success: function (data, status, xhr) {
                    $('#captcha-verify').html(successMessages.general.ok)
                    $('#captcha-img').attr('src','/captcha');
                    $('#submit').attr('disabled',true)
                },
                error: function (err, status, xhr) {
                    //error
                    switch (err.responseJSON.errMsg){
                        case 'captcha error':
                            $('#captcha-verify').html(errMessages.captcha.error)
                            break;
                        case 'user not found':
                            $('#mail-verify').html(errMessages.mail.error)
                            break;
                        default:
                            $('#captcha-verify').html(errMessages.general.error)
                            break;

                    }
                    $('#captcha-img').attr('src','/captcha');
                    $('#submit').attr('disabled',false)
                }
            })

        }else{
            $('#submit').attr('disabled',false)
        }
    })

})