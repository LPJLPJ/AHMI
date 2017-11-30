/**
 * Created by ChangeCheng on 16/5/12.
 */

$(function () {
    var ErrMessages;
    var successMessages;
    console.log("myScope",myScope)

    $('#mail').on('keyup', function () {
        ErrMessages=myScope.findback.ErrMessages;
        var mailVal = $(this).val()
        if (mailVal==""){
            $('#mail-verify').html(ErrMessages.mail.empty)
        }else{
            $('#mail-verify').html()
        }
    })

    $('#captcha-input').on('keyup', function () {
        ErrMessages=myScope.findback.ErrMessages;
        var captchaVal = $(this).val()
        if (captchaVal==""){
            $('#captcha-verify').html(ErrMessages.captcha.empty)
        }else{
            $('#captcha-verify').html('')
        }
    })

    $('#change-captcha').on('click', function () {
        $('#captcha-img').attr('src','/captcha?'+Date.now())
    })

    $('#submit').on('click', function () {
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
                    successMessages=myScope.findback.successMessages;
                    $('#captcha-verify').html(successMessages.general.ok)
                    $('#captcha-img').attr('src','/captcha');
                    $('#submit').attr('disabled',false)
                },
                error: function (err, status, xhr) {
                    ErrMessages=myScope.findback.ErrMessages;
                    //error
                    switch (err.responseText){
                        case 'captcha error':
                            $('#captcha-verify').html(ErrMessages.captcha.error)
                            break;
                        case 'user not found':
                            $('#captcha-verify').html(ErrMessages.mail.error)
                            break;
                        default:
                            $('#captcha-verify').html(ErrMessages.general.error)
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