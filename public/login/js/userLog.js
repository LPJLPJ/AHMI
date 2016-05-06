/**
 * Created by deng on 16/4/26.
 * include register/log in .....
 */

$("#register-user").click(function() {

    /**
     * 首先进行表单的形式校验
     * 随后将所有数据填入json
     * hint: password is only transferred by md5
     */
    if((isFormRight())&&(isPwdRight())&&(isEmailRight())){
        document.getElementById("registerHint").innerHTML="";

        var name = document.getElementsByClassName("name_1")[0].value;
        var pwd = $.md5(document.getElementsByClassName("pwd_1")[0].value);
        var email = document.getElementsByClassName("email_1")[0].value;
        var captcha = document.getElementsByClassName("yzm_1")[0].value;

        var user = {
            user: {
                email: email,
                password: pwd,
                phoneNumber: "11111111111",
                username: name,
                },
            captcha:captcha
        };
        console.log(user);

        postJSON(user,'/register', function(data) {
         console.log(data+'success and hhh');
         });
    }
    else{
        console.log('false');
        document.getElementById("registerHint").innerHTML="请将信息填写完整"
    }

});

$("#captcha-refresh").click(function() {
    /**
     * hint: 获取并显示验证码
     */
    getJSON('/captcha',function(data){
        console.log(data);
    })
});

function getCaptcha(){
    getJSON('/captcha',function(data){
        console.log(data);
    })
}



$(".login-button").click(function() {

/**
 * 登录操作,用户名和密码
 * hint: password is only transferred by md5
 */
    var name = document.getElementsByClassName("name")[0].value;
    var pwd = $.md5(document.getElementsByClassName("pwd")[0].value);
    var captcha = document.getElementsByClassName("yzm_1")[0].value;

    var user = {
        user: {
            password: pwd,
            username: name,
        },
        captcha:captcha
    };
    console.log(user);

    postJSON(user,'/login', function(data) {
        console.log(data+'success and hhh');
    });
})

