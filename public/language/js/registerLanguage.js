window.myScope=null;
$(function() {
    var myScope = new sx_Scope();
    var myLanguageServer = new sx_languageServer();
    init();
    function init(){
        if(!localStorage.language){
            localStorage.language="Chinese";
        }
        myLanguageServer.languageRenderInit(myScope,pageRender);
    }

    $("#language").on('click', function(e){
        myLanguageServer.languageRenderSwitch(myScope,pageRender);
    });

    function pageRender (data) {
        myScope.register = data.register;
        myScope.footer=data.footer;
        $("#username").attr("placeholder",myScope.register.input[0]);
        $("#mail").attr("placeholder",myScope.register.input[1]);
        $("#password").attr("placeholder",myScope.register.input[2]);
        $("#comparepassword").attr("placeholder",myScope.register.input[3]);
        $("#captcha-input").attr("placeholder",myScope.register.input[4]);
        myScope.digest();
    }
});

