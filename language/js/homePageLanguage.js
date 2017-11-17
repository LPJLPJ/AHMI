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
                Scope.homePage = data.homePage;
                Scope.footer=data.footer;
                Scope.digest();
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });

    }

    $("#language").on('click', function (e) {
        var urlString;
        if (localStorage.language==="Chinese") {
            urlString="/language/data/English.json";
        } else if(localStorage.language==="English") {
            urlString="/language/data/chinese.json";
        }else{
            console.log(err);
            return;
        }

        $.ajax({
            type: 'GET',
            url: urlString,
            success: function (data, status, xhr) {
                Scope.homePage = data.homePage;
                Scope.footer=data.footer;
                Scope.digest();

                if (localStorage.language==="Chinese") {
                    localStorage.language="English";
                } else if(localStorage.language==="English") {
                    localStorage.language="Chinese";
                }else{
                    console.log(err);
                    return;
                }
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });

    });

});