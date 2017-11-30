window.myScope=null;
$(function() {
    myScope = new sx_Scope();
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
        myScope.login = data.login;
        myScope.footer=data.footer;
        $("#username").attr("placeholder",myScope.login.input[0]);
        $("#password").attr("placeholder",myScope.login.input[1]);
        $("#captcha-input").attr("placeholder",myScope.login.input[2]);
        $("#mail").attr("placeholder",myScope.login.input[3]);
        console.log("$(\"#mail\")",$("#mail"))
        myScope.digest();
    }
});
