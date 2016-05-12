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
            verify:'账户没有验证,请进入邮箱验证'
		}
	}
	var formVerify = {
		username:false,
		password:false,
		captcha:false,
	}

	var submit = document.getElementById('submit')


	$('#captcha-img').attr('src','/captcha') 

	$('#login-form').on('focus',function(){
		$('#captcha-verify').html('')
	})

	$('#username')
	.on('focus',function(){
		formVerify.username = false
		$('#username-verify').html('')
		submit.disabled = true
	})
	.on('keyup',function(){
		var value = $(this).val()
		if (value.length>0) {
			//ok
			formVerify.username = true
			checkSubmit()
		}else{
			formVerify.username = false
			$('#username-verify').html(ErrMessages.username.empty)
		}
	})

	$('#password')
	.on('focus',function(){
		formVerify.password = false
		$('#password-verify').html('')
		submit.disabled = true

	})
	.on('keyup',function(){
		var value = $(this).val()
		if (value.length>0) {
			//ok
			formVerify.password = true
            $('#password-verify').html('')
			checkSubmit()
		}else{
			formVerify.password = false
			$('#password-verify').html(ErrMessages.password.empty)
		}
	})

	$('#captcha-input')
	.on('focus',function(){
		formVerify.captcha = false
		$('#captcha-verify').html('')
		submit.disabled = true
	})
	.on('keyup',function(){
		var value = $(this).val()
		if (value.length>0) {
			//ok
			formVerify.captcha = true
			checkSubmit()
		}else{
			formVerify.captcha = false
			$('#captcha-verify').html(ErrMessages.captcha.empty)
		}
	})

	$('#change-captcha').on('click',function(){
		$('#captcha-img').attr('src','/captcha') 
	})

	$('#submit').on('click',function(){
		var userInfo = {
			username:$('#username').val(),
			password:$.md5($('#password').val()),
			captcha:$('#captcha-input').val()
		}
		console.log('submit', userInfo);
		$(this).attr('disabled',true)
		$.ajax({
			type:'POST',
			url:'/user/login',
			data:userInfo,
			success:function(data, status, xhr){
				console.log(data);
				console.log(xhr);
				switch (data){
					case 'ok':
					console.log('ok');
					window.location.href='/private/space'
					break
					case 'not match':
					$('#captcha-verify').html(ErrMessages.general.wrong)
					break
					case 'no user':
					$('#captcha-verify').html(ErrMessages.general.wrong)
					break
					case 'captcha invalid':
					$('#captcha-verify').html(ErrMessages.captcha.wrong)

					break
                    case 'not verified':
                        //not verified
                    $('#captcha-verify').html(ErrMessages.general.verify)
                        break
				}
                $('#captcha-img').attr('src','/captcha')
			},
			error:function(err, status, xhr){
				console.log(err);
				$('#captcha-verify').html(ErrMessages.general.wrong)
                $('#captcha-img').attr('src','/captcha')

			}

		})
	})

	function checkSubmit(){
		var submit = document.getElementById('submit')
		var checkResult = true
		for (var key in formVerify){
			checkResult = formVerify[key] && checkResult
		}
		if (checkResult) {
			submit.disabled = false
		}else{
			submit.disabled = true
		}
		
	}



})