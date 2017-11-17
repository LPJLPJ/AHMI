var Scope = new Scope();
$(function() {
    init();
    function init(){
        if(!localStorage.language){
            localStorage.language="Chinese";
        }else if(localStorage.language!=="Chinese"){
            languageRender();
        }
    }

    function languageRender() {
        var urlString;
        if (localStorage.language==="English") {
            urlString="/language/data/English.json";
        } else if(localStorage.language==="Chinese") {
            urlString="/language/data/chinese.json";
        }else{
            console.log(err);
            return;
        }
        $.ajax({
            type: 'GET',
            url: urlString,
            success: function (data, status, xhr) {
                Scope.login = data.login;
                Scope.footer=data.footer;
                $("#username").attr("placeholder",Scope.login.input[0]);
                $("#password").attr("placeholder",Scope.login.input[1]);
                $("#captcha-input").attr("placeholder",Scope.login.input[2]);
                Scope.digest();
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });

    }

});
