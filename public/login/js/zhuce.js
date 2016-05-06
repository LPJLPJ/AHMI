/**
 * Created by lenovo on 2016/3/2.
 */

var tx;

function isFormRight(){
    var name=document.getElementsByClassName("name_1")[0].value;
    var pwd=document.getElementsByClassName("pwd_1")[0,1].value;
    var email=document.getElementsByClassName("email_1")[0].value;
    var yzm=document.getElementsByClassName("yzm_1")[0].value;

    if((name && pwd && email && yzm)=="" || (name && pwd && email && yzm)==null){
        $("#registerHint").html("请将信息填写完整");
        console.log("form false");
        return false;
    }else{
        tx=document.getElementById("registerHint").innerHTML=""
        return true;
    };
};

var pd;
function isPwdRight(){
    var pwd=document.getElementsByClassName("pwd_1");
    if(!(pwd[0].value==pwd[1].value)){
        pd=document.getElementById("span1").innerHTML="密码输入的不一致";
        return false;
    }else{
        pd=document.getElementById("span1").innerHTML='';
        return true;
    };
};

var em;
function isEmailRight(){
    var email=document.getElementsByClassName("email_1")[0].value;
    apos=email.indexOf("@");
    dpos=email.lastIndexOf(".");
    if(apos<1 || dpos-apos<2){
        em=document.getElementById("span2").innerHTML="邮箱输入的不正确";
        return false;
    }else{
        em=document.getElementById("span2").innerHTML="";
        return true;
    };
};

/**
 * @constructor 点击登录键后的后台操作
 */

function DlFun(){
    /*var yz=document.getElementById("list");
    yz.style.display="block";*/
}



