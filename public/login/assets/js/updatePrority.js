$(function(){
	var ErrMessage = {
		username:{
			empty:'用户名不能为空',
			wrong:'用户名错误'
		},
		password:{
			empty:'密码不能为空',
			wrong:'密码错误'
		},
		general:{
			empty:'请输入用户名和密码',
			wrong:'账户错误'
		}
	}
	$('#submit').on('click',SendInformation);
	$('#cancel').on('click',cancel);

	function SendInformation(e){
	 	var username = $('#username');
	 	var password = $('#password');
	 	console.log(username,password,username[0].value,password[0].value);
	 	if(username[0].value ==""&&password[0].value !="")
	 		alert(ErrMessage.username.empty);
	 	if(username[0].value !=""&&password[0].value =="")
	 		alert(ErrMessage.password.empty);
	 	if(username[0].value ==""&&password[0].value =="")
	 		alert(ErrMessage.general.empty);
	 	usernameVerify(username[0].value);
	 	passwordVerify(password[0].value);


	}
	function usernameVerify(username){

	}
	function passwordVerify(password){

	}
	function cancel(e){
		window.location.href="personalProject.html";
	}

})