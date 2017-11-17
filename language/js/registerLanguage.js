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
                Scope.register = data.register;
                Scope.footer=data.footer;
                $("#username").attr("placeholder",Scope.register.input[0]);
                $("#mail").attr("placeholder",Scope.register.input[1]);
                $("#password").attr("placeholder",Scope.register.input[2]);
                $("#comparepassword").attr("placeholder",Scope.register.input[3]);
                $("#captcha-input").attr("placeholder",Scope.register.input[4]);
                Scope.digest();
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });

    }

});
