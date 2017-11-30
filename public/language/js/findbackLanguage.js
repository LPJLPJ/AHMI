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
        myScope.findback = data.findback;
        myScope.footer=data.footer;
        $("#mail").attr("placeholder",myScope.findback.input[0]);
        $("#captcha-input").attr("placeholder",myScope.findback.input[1]);
        console.log("$(\"#mail\")",$("#mail"))
        myScope.digest();
    }
});