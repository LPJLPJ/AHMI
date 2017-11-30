var sx_languageServer = function() {};

Object.assign(sx_languageServer.prototype,{
    languageRenderInit:function(myScope,pageRender) {
        if (localStorage.language==="English") {
            myScope.dataCurrent=window.langSets.dataEnglish;
        } else if(localStorage.language==="Chinese") {
            myScope.dataCurrent=window.langSets.dataChinese;
        }else{
            console.log(err);
            return;
        }
        pageRender (myScope.dataCurrent);

    },

    languageRenderSwitch:function(myScope,pageRender) {
        var loadingAnimation = $(".loadEffect");
        loadingAnimation.css("visibility", "visible");

        var dataCurrent = null;
        var urlString;
        if (localStorage.language === "Chinese") {
            myScope.dataCurrent = window.langSets.dataEnglish;
            localStorage.language = "English";
        } else if (localStorage.language === "English") {
            myScope.dataCurrent = window.langSets.dataChinese;
            localStorage.language = "Chinese";
        } else {
            console.log("error");
            return;
        }
        setTimeout("$('.loadEffect').css('visibility','hidden')", 1000);
        // loadingAnimation.css("visibility","hidden");
        pageRender(myScope.dataCurrent);
    }

});

