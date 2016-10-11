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
                fontFamily:'宋体',
                fontSize:'20px',
                fontColor:null,
                fontBold:null,
                fontItalic:null,
                fontAlignment:null
            },
            fontFamilies:[],

            enableInput:enableInput,
            disableInput:disableInput,
            allCharacters:[],
            selectCharacterByIndex:selectCharacterByIndex,
        };
    }

    function syncFontFamilies() {
        var customFonts = ResourceService.getAllFontResources().map(function (fRes) {
            return fRes.name;
        });
        console.log(customFonts)
        $scope.componentOfChar.fontFamilies = ['宋体','times'].concat(customFonts)
    }

    function initProject(){

        //ProjectService.getProjectTo($scope);
        //
        //onAttributeChanged();
        //$scope.$on('AttributeChanged', function (event) {
        //    onAttributeChanged();
        //});

        $scope.componentOfChar.allCharacters=characterSetService.getCharacterSet();

        syncFontFamilies();

        $scope.$on('ResourceUpdate',function (e) {
            syncFontFamilies();
        })
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

    function selectCharacterByIndex(index){
        console.log('hh');
        $scope.componentOfChar.character=characterSetService.selectCharacterByIndex(index);
    }

});
