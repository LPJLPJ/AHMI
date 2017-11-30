window.myScope=null;
$(function() {
    myScope = new sx_Scope();
    var myLanguageServer = new sx_languageServer();
    init();
    function init(){
        console.log('initing ')
        if(!localStorage.language){
            localStorage.language="Chinese";
        }
        myLanguageServer.languageRenderInit(myScope,pageRender);
    }

    $("#language").on('click', function(e){
        myLanguageServer.languageRenderSwitch(myScope,pageRender);
    });

    function pageRender (data) {
        myScope.page404 = data.page404;
        myScope.footer=data.footer;
        myScope.digest();
    }
});