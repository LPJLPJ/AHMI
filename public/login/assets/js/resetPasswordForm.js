/**
 * Created by ChangeCheng on 16/5/13.
 */


$(function () {
    var errMessages = {
        password:{
            empty:'密码不能为空',
            wrong:'密码为6-16个字符的数字或字母',
            error:'重置失败'
        },
        comparepassword:{
            empty:'请再次输入密码',
            wrong:'密码不匹配'
        },
        captcha:{
            empty:'请输入验证码',
            error:'验证码错误'
        },
        general:{
            error:'发生错误, 请重新获取链接'
        }
    }

    var successMessages = {
        general:{
            ok:'重置成功, 请重新登录'
        }
    }

    //$('#mail').on('keyup', function () {
    //    var mailVal = $(this).val()
    //    if (mailVal==""){
    //        $('#mail-verify').html(errMessages.mail.empty)
    //    }else{
    //        $('#mail-verify').html()
    //    }
    //})

    $('#password').on('keyup', function () {
        var passwordVal = $(this).val()
        if (passwordVal==""){
            $('#password-verify').html(errMessages.password.empty)
        }else if (passwordVal.length<6||passwordVal.length>16){
            $('#password-verify').html(errMessages.password.wrong)
        }else{
            $('#password-verify').html('')
        }
    })


    $('#comparepassword').on('keyup', function () {
        var comparepasswordVal = $(this).val()
        if (comparepasswordVal==''){
            $('#comparepassword-verify').html(errMessages.comparepassword.empty)
        }else{
            var passwordVal = $('#password').val();
            //console.log(passwordVal, comparepasswordVal)
            if (comparepasswordVal!=passwordVal){
                $('#comparepassword-verify').html(errMessages.comparepassword.wrong)
            }else{
                $('#comparepassword-verify').html('')
            }
        }
    })

    $('#captcha-input').on('keyup', function () {
        var captchaVal = $(this).val()
        if (captchaVal==""){
            $('#captcha-verify').html(errMessages.captcha.empty)
        }else{
            $('#captcha-verify').html('')
        }
    })

    $('#change-captcha').on('click', function () {
        $('#captcha-img').attr('src','/captcha')
    })

    $('#submit').on('click', function () {
        $('#submit').attr('disabled',true)
        var passwordVal = $('#password').val()
        var comparepasswordVal = $('#comparepassword').val()
        var captchaVal = $('#captcha-input').val()
        if (passwordVal!=''&&comparepasswordVal!=""&&captchaVal!=''&&(passwordVal == comparepasswordVal)){
            //not empty
            $.ajax({
                type:'POST',
                url:window.location.href,
                data:{
                    password:passwordVal,
                    captcha:captchaVal
                },
                success: function (data, status, xhr) {
                    $('#captcha-verify').html(successMessages.general.ok)


                    $('#submit').attr('disabled',false)
                },
                error: function (err, status, xhr) {
                    //error
                    console.log(err.responseText)
                    switch (err.responseText){
                        case 'captcha error':
                            $('#captcha-verify').html(errMessages.captcha.error)
                            break;
                        case 'password change error':
                            $('#captcha-verify').html(errMessages.password.error)
                            break;
                        default:
                            $('#captcha-verify').html(errMessages.general.error)
                            setTimeout(function () {
                                //window.location.href = '/user/forgetpassword'
                            },2000)
                            break;

                    }
                    $('#captcha-img').attr('src','/captcha')
                    $('#submit').attr('disabled',false)
                }
            })

        }else{
            $('#submit').attr('disabled',false)
        }
    })

})