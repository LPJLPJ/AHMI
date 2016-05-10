/**
 * Created by lixiang on 16/3/25.
 */
ide.controller('characterSetCtrl',function($scope,characterSetService,$timeout,
                                           ProjectService,
                                           Type, Preference,
                                           ResourceService,CanvasService){
    var initObject=null;

    $scope.$on('GlobalProjectReceived',function(){
        initUserInterface();
        initProject();
    });

    function initUserInterface(){
        $scope.componentOfChar={
            character:{
                text:null,
                fontName:'默认',
                fontFamily:'Arial',
                fontSize:'20px',
                fontColor:null,
                fontBold:null,
                fontItalic:null,
                fontAlignment:null
            },

            enableInput:enableInput,
            disableInput:disableInput,
            allCharacters:[],

        };
    }

    function initProject(){

        //ProjectService.getProjectTo($scope);
        //
        //onAttributeChanged();
        //$scope.$on('AttributeChanged', function (event) {
        //    onAttributeChanged();
        //});

        $scope.componentOfChar.allCharacters=characterSetService.getCharacterSet();
    }

    function enableInput(index){
        var list = document.getElementById("characterNameInput");
        var str = list.getElementsByTagName("input");
        if((0<=index)&&(index<str.length)){
            str[index].removeAttribute("readonly");
        }
    }
    function disableInput(index){
        //document.getElementsByClassName("characterNameInput").readonly=true;
        var list = document.getElementById("characterNameInput");
        var str = list.getElementsByTagName("input");
        if((0<=index)&&(index<str.length)){
            str[index].setAttribute('readonly','readonly');
        }
    }


});
