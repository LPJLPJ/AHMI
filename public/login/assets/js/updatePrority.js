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
		buttonDisabled();
		if(username[0].value ==""&&password[0].value !=""){
			alert(ErrMessage.username.empty);
		}
		else if(username[0].value !=""&&password[0].value ==""){
			alert(ErrMessage.password.empty);
		}
		else if(username[0].value ==""&&password[0].value ==""){
			alert(ErrMessage.general.empty);
		}
		else{
			username = username[0].value;
			password = $.md5(password[0].value);
			updateVerify(username,password);
		}
	}
	function updateVerify(username,password){
		$.ajax({
			type:'POST',
			url:'https://test.graphichina.com/user/checkUserType',
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
					if(data){
						fs.readFile('public\\nw\\userInfo.json','utf-8',function(err,ddata){
							if(err)
								alert('本地版权限读取错误');
							else{
								var ddata = JSON.parse(ddata);
								if(ddata.type ==data.type){
									alert('已提升至最新权限等级');
								}
								else{
									data.json = JSON.stringify(data);
									fs.writeFile('public\\nw\\userInfo.json',data.json,function(err){
										if(err)
											console.log(err);
										else{
											alert('升级成功');
										}
									})
								}
							}
						})
					}					
				}
				else if(msg.confirm =='account err'){
						alert(ErrMessage.general.wrong);
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

	function buttonDisabled(){
		$('#submit').prop('disabled',true);
		setTimeout(function(){
			$('#submit').prop('disabled',false);
		},500);
	}
})