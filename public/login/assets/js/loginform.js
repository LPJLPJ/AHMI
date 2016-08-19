// loginform
$(function(){
	var ErrMessages = {
		username:{
			empty:'用户名或邮箱不能为空'
		},
		password:{
			empty:'密码不能为空'
		},
		captcha:{
			empty:'请输入验证码',
			wrong:'验证码错误'
		},
		general:{
			wrong:'账户错误',
            verify:'<a id="resend">账户没有验证, 请进入邮箱验证, 点击重新获取验证链接</a>',
            verifyErr:'邮箱不存在'
		}
	};
	var formVerify = {
		username:false,
		password:false,
        captcha: false
	};

	var submit = document.getElementById('submit');

    var username = $('#username');
    var password = $('#password');
    if (username.val().length) {
        formVerify.username = true;
    }
    if (password.val().length) {
        formVerify.password = true;
    }

    checkSubmit();

	$('#captcha-img').attr('src','/captcha');

	$('#login-form').on('focus',function(){
		$('#captcha-verify').html('')
	});

	$('#username')
	.on('focus',function(){
		formVerify.username = false;
		$('#username-verify').html('');
		submit.disabled = true
	})
	.on('keyup',function(){
		var value = $(this).val();
		if (value.length>0) {
			//ok
			formVerify.username = true;
            $('#username-verify').html('');
			checkSubmit()
		}else{
			formVerify.username = false;
			$('#username-verify').html(ErrMessages.username.empty)
		}
	});

	$('#password')
	.on('focus',function(){
		formVerify.password = false;
		$('#password-verify').html('');
		submit.disabled = true

	})
	.on('keyup',function(){
		var value = $(this).val();
		if (value.length>0) {
			//ok
			formVerify.password = true;
            $('#password-verify').html('');
			checkSubmit()
		}else{
			formVerify.password = false;
			$('#password-verify').html(ErrMessages.password.empty)
		}
	});

	$('#captcha-input')
	.on('focus',function(){
		formVerify.captcha = false;
		$('#captcha-verify').html('');
		submit.disabled = true
	})
	.on('keyup',function(){
		var value = $(this).val();
		if (value.length>0) {
			//ok
			formVerify.captcha = true;
            $('#captcha-verify').html('');
			checkSubmit()
		}else{
			formVerify.captcha = false;
			$('#captcha-verify').html(ErrMessages.captcha.empty)
		}
	});

	$('#change-captcha').on('click',function(){
        // $.ajax({
		// 	type:'GET',
		// 	url:'/captcha',
         //    success:function(data, status, xhr){
         //        console.log(data)
         //        $('#captcha-img').attr('src',data)
         //    },
         //    error: function (err, status, xhr) {
         //        $('#captcha-img').attr('src','')
         //    }
		// })
        $('#captcha-img').attr('src','/captcha?'+Date.now());

	});



	$('#submit').on('click',function(){
		var userInfo = {
			username:$('#username').val(),
			password:$.md5($('#password').val()),
			captcha:$('#captcha-input').val()
		};
		$(this).attr('disabled',true);
		$.ajax({
			type:'POST',
			url:'/user/loginAPI',
			data:userInfo,
			success:function(data, status, xhr){
                console.log(data)
				if (data == 'ok'){
                    window.location.href='/private/space';
                    return;
                }

                $('#captcha-img').attr('src', '/captcha?' + Date.now());
                $('#submit').attr('disabled',false)
			},
			error:function(err, status, xhr){
                var errMsg = err.responseJSON.errMsg;
                switch (errMsg){
                    case 'not match':
                        $('#captcha-verify').html(ErrMessages.general.wrong);
                        break;
                    case 'no user':
                        $('#captcha-verify').html(ErrMessages.general.wrong);
                        break;
                    case 'captcha invalid':
                        $('#captcha-verify').html(ErrMessages.captcha.wrong);

                        break;
                    case 'not verified':
                        //not verified
                        $('#captcha-verify').html(ErrMessages.general.verify);
                        break;
                    default:
                        $('#captcha-verify').html(ErrMessages.general.wrong);
                        break;

                }

                $('#captcha-img').attr('src', '/captcha?' + Date.now());
                $('#submit').attr('disabled',false)

			}

		})
	});


    $('#captcha-verify').on('click','#resend', function () {
        var username = $('#username').val();
        if (username!=''){
            $.ajax({
                type:'POST',
                url:'/mail/sendverifymail',
                data:{
                    username:username
                },
                success:function(data, status, xhr){
                    $('captcha-verify').html('已发送验证邮件, 请查收')
                },
                error: function (err, status, xhr) {
                    var errMsg = err.responseJSON.errMsg;
                    var captchaVerify = $('#captcha-verify')
                    switch (errMsg){
                        case 'mail send error':
                            captchaVerify.html(ErrMessages.general.verifyErr)
                            break;
                        default:
                            captchaVerify.html(ErrMessages.general.wrong)
                            break;

                    }

                }
            })
        }
    });

	function checkSubmit(){
		var submit = document.getElementById('submit');
		var checkResult = true;
		for (var key in formVerify){
			checkResult = formVerify[key] && checkResult
		}
		if (checkResult) {
			submit.disabled = false
		}else{
			submit.disabled = true
		}
		
	}



});