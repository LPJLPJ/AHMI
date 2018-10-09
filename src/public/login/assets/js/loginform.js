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
			wrong:'账号错误',
			noPass:'密码错误',
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
	submit.disabled = false;

    var username = $('#username');
    var password = $('#password');
    var formTitle = $('#form-title').text();
    var dstURL = "";
    // switch (formTitle){
    //     case '登录':
    //         dstURL = '/private/space';
    //         break;
    //     case '管理员登录':
    //         dstURL = '/admin/manage/space';
    //         break;
    // }
    if (username.val().length) {
        formVerify.username = true;
    }
    if (password.val().length) {
        formVerify.password = true;
    }


	$('#captcha-img').attr('src','/captcha');

	$('#login-form').on('focus',function(){
		$('#captcha-verify').html('')
	});

	$('#username')
	.on('focus',function(){
		formVerify.username = false;
		$('#username-verify').html('');
		//submit.disabled = true
	})

	$('#password')
	.on('focus',function(){
		formVerify.password = false;
		$('#password-verify').html('');
	});

	$('#captcha-input')
	.on('focus',function(){
		formVerify.captcha = false;
		$('#captcha-verify').html('');
		//submit.disabled = true
	})

	$('#change-captcha').on('click',function(){
        $('#captcha-img').attr('src','/captcha?'+Date.now());
	});

    //$('#submit').on('hover',function () {
    //    checkSubmit()
    //})

	$('#submit').on('click',function(){
		if(!checkSubmit()){
			return
		};
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
                console.log(data);
				if (data.confirm == 'ok'){
                    console.log(dstURL);
					localStorage.setItem('userType',data.userType);
                    window.location.href=dstURL;
                    return;
                }

                $('#captcha-img').attr('src', '/captcha?' + Date.now());
                $('#submit').attr('disabled',false)
			},
			error:function(err, status, xhr){
                var errMsg = err.responseJSON.errMsg;
                switch (errMsg){
                    case 'not match':
                        $('#captcha-verify').html(ErrMessages.general.noPass);
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
		var username = $('#username').val()&&$('#username').val().trim();
		var password = $('#password').val()&&$('#password').val().trim();
		var captcha = $('#captcha-input').val()&&$('#captcha-input').val().trim();
		var result = true;
		if((!username)||(username.length==0)){
			$('#username-verify').html(ErrMessages.username.empty);
			result = false;
		}
		if((!password)||(password.length==0)){
			$('#password-verify').html(ErrMessages.password.empty);
			result = false;
		}
		if((!captcha)||(captcha.length==0)){
			$('#captcha-verify').html(ErrMessages.captcha.empty);
			result = false;
		}
		return result
	}

	//回车登录
	document.onkeydown = function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e.keyCode==13){
			$('#submit').click();
		}
	}

});