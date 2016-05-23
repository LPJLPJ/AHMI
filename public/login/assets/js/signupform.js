/**
 * Created by ChangeCheng on 16/5/5.
 */

window.onload=init;


var ErrMessages = {
	username:{
		empty:'用户名不能为空',
		wrong:'用户名为2-16个字符',
		duplicate:'用户名已被使用'
	},
	mail:{
		empty:'邮箱不能为空',
		wrong:'不是正确的邮箱',
		duplicate:'邮箱已被使用'
	},
	password:{
		empty:'密码不能为空',
		wrong:'密码为6-16个字符的数字或字母'
	},
	comparepassword:{
		empty:'请再次输入密码',
		wrong:'密码不匹配'
	},
	agree:{
		empty:'请阅读并同意使用规范'
	},
	captcha:{
		empty:'请输入验证码',
		wrong:'验证码错误'
	},
	general:{
		wrong:'账户错误'
	}
}
function get(name) {
	return document.getElementById(name)
}

function init(){
	var userInfo = {
		username:'',
		mail:'',
		password:'',
		captcha:''
	}
	var formVerify = {
		username:false,
		usernameUnique:false,
		mail:false,
		mailUnique:false,
		password:false,
		comparepassword:false,
		agree:false
		
	}
	var username = get('username')
	var usernameVerify = get('username-verify')
	var mail = get('mail')
	var mailVerify = get('mail-verify')
	var password =get('password')
	var passwordVerify = get('password-verify')
	var comparepassword = get('comparepassword')
	var comparepasswordVerify = get('comparepassword-verify')
	var captchaInput = get('captcha-input')
	var captchaImg = get('captcha-img');
	var captchaVerify = get('captcha-verify')
	var agree = get('agree')
	var submit = get('submit')

	var form = get('signup-form')
	form.addEventListener('focus',function(){
		captchaVerify.innerHTML = ''
	})

	//username
	username.addEventListener('focus',function(){
		formVerify.usernameUnique = false
		submit.disabled = true
	})
	username.addEventListener('keyup',function(e){

		// console.log(username.value,e.target.value,e);
		var _username = username.value
		if (_username == '') {
			//empty
			usernameVerify.innerHTML = ErrMessages.username.empty
			formVerify.username = false
			return
		}
		if (_username.length<2 || _username.length > 16) {
			usernameVerify.innerHTML = ErrMessages.username.wrong
			formVerify.username = false
			return
		}
		usernameVerify.innerHTML = ''
		formVerify.username = true
		
	})

	username.addEventListener('blur',function(){
		var _username = username.value
		if (_username == '') {
			//empty
			usernameVerify.innerHTML = ErrMessages.username.empty
			formVerify.username = false
			return
		}
		//check username
		if (formVerify.username) {
			
			$.ajax({
				type:'POST',
				url:'/utils/checkusername',
				data:{username:_username},
				success:function(data, textStatus, xhr){
					if (data == 'new'){
						//new user
						formVerify.usernameUnique = true
						usernameVerify.innerHTML = ''
						checkSubmit();
					}else{
						formVerify.usernameUnique = false
						usernameVerify.innerHTML = ErrMessages.username.duplicate
					}
					
				},
				error:function(err, textStatus, xhr){
					formVerify.usernameUnique = false
				}
			})
		}	
	})

	//mail
	mail.addEventListener('focus',function(){
		formVerify.mailUnique = false
		submit.disabled = true
	})
	mail.addEventListener('keyup',function(){
		var _mail = mail.value
		if (_mail.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
			formVerify.mail = true
			mailVerify.innerHTML = ''
		}else{
			formVerify.mail = false
			mailVerify.innerHTML = ErrMessages.mail.wrong
		}
	})

	mail.addEventListener('blur',function(){
		var _mail = mail.value
		if (_mail.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
			formVerify.mail = true
			mailVerify.innerHTML = ''
		}else{
			formVerify.mail = false
			mailVerify.innerHTML = ErrMessages.mail.wrong
		}
		if (formVerify.mail) {
			$.ajax({
				type:'POST',
				url:'/utils/checkmail',
				data:{mail:_mail},
				success:function(data, textStatus, xhr){
					if (data == 'new'){
						//new user
						formVerify.mailUnique = true
						mailVerify.innerHTML = ''
						checkSubmit()
					}else {
						formVerify.mailUnique = false
						mailVerify.innerHTML = ErrMessages.mail.duplicate
					}
					
				},
				error:function(err, textStatus, xhr){
					formVerify.mailUnique = false
				}
			})
		}
	})

	//password
	password.addEventListener('focus', checkPassword)
	password.addEventListener('keyup',checkPassword)

	//comparepassword
	comparepassword.addEventListener('focus', checkComparePassword)
	comparepassword.addEventListener('keyup',checkComparePassword)


	//captcha
	var captchaButton = get('change-captcha')
	captchaButton.addEventListener('click',function(e){
		e.preventDefault()
		
		captchaImg.src = '/captcha'
	})
	captchaInput.addEventListener('focus',function(){
		captchaVerify.innerHTML = ''
	})

	//agree

	agree.addEventListener('change',function(){
		var _agree = agree.checked
		if (_agree) {
			formVerify.agree = true
		}else{
			formVerify.agree = false
		}
		checkSubmit()
	})

	//submit

	submit.addEventListener('click',function(e){
		e.preventDefault()
		userInfo.username = username.value
		userInfo.mail = mail.value
		userInfo.password = $.md5(password.value)
		userInfo.captcha = captchaInput.value
		console.log(userInfo);
		submit.disabled = true;
		$.ajax({
			type:'POST',
			url:'/user/signupapi',
			data:userInfo,
			success:function(data, textStatus, xhr){
                //console.log(data);
                captchaVerify.innerHTML = '注册成功, 请进入邮箱进行确认!';
                setTimeout(function () {
                    window.location.href='/user/login'
                },2000);
                captchaImg.src = '/captcha'
				submit.disabled = false
			},
			error:function(err, textStatus, xhr){
                //console.log(err)
				switch (err.responseJSON.errMsg){
                    case 'error':
                        captchaVerify.innerHTML = ErrMessages.general.wrong
                        break;
                    case 'captcha error':
                        captchaVerify.innerHTML = ErrMessages.captcha.wrong
                        captchaImg.src='/captcha'
                        break;
                    case 'duplicate':
                        captchaVerify.innerHTML = ErrMessages.general.wrong
                        break;
                    default:
                        captchaVerify.innerHTML = err.responseJSON.errMsg;
                        break;

                }
                captchaImg.src = '/captcha'
				submit.disabled = false
			}
		})
	})

	function checkPassword(){
		var _password = password.value
		if (_password=='') {
			formVerify.password = false
			passwordVerify.innerHTML = ErrMessages.password.empty
		}else{
			if (_password.match(/^\w{6,17}$/)) {
				//
				formVerify.password = true
				passwordVerify.innerHTML = ''

			}else{
				formVerify.password = false
				passwordVerify.innerHTML = ErrMessages.password.wrong
			}
		}
		
		checkSubmit()
	}

	function checkComparePassword(){
		var _comparepassword = comparepassword.value
		if(_comparepassword == ''){
			formVerify.comparepassword = false
			comparepasswordVerify.innerHTML = ErrMessages.comparepassword.empty
		}else{
			if (_comparepassword == password.value) {
				//match
				formVerify.comparepassword = true
				comparepasswordVerify.innerHTML = ''
			}else{
				formVerify.comparepassword = false
				comparepasswordVerify.innerHTML = ErrMessages.comparepassword.wrong
			}
		}
		
		checkSubmit()
	}

	function checkSubmit(){
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

	

}