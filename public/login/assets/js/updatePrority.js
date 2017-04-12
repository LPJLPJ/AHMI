var fs = require('fs');
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
		if(username[0].value ==""&&password[0].value !="")
			alert(ErrMessage.username.empty);
		if(username[0].value !=""&&password[0].value =="")
			alert(ErrMessage.password.empty);
		if(username[0].value ==""&&password[0].value =="")
			alert(ErrMessage.general.empty);
		username = username[0].value;
		password = $.md5(password[0].value);
		updateVerify(username,password)


	}
	function updateVerify(username,password){
		$.ajax({
			type:'POST',
			url:'https://localhost/user/checkUserType',
			data:{
				username:username,
				password:password
			},
			success:function(msg){
				if(msg.confirm == 'ok'){
					var data = {
						name:username,
						type:msg.userType
					}
					data.json = JSON.stringify(data);
					fs.writeFile('public\\nw\\userInfo.json',data.json,function(err){
						if(err)
							console.log(err);
						else
							alert('升级成功');
					})
				}
				else
					console.log(msg);
			},
			error:function(xhr){
				console.log(xhr);
			}
		})
	}
	function cancel(e){
		window.location.href="personalProject.html";
	}

})