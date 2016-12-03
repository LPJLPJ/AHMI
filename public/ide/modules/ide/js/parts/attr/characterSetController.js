/**
 * Created by lixiang on 16/3/25.
 */
ide.controller('characterSetCtrl',['$scope','characterSetService','$timeout',
    'ProjectService',
    'Type', 'Preference',
    'ResourceService','CanvasService','UserTypeService',function($scope,characterSetService,$timeout,
                                           ProjectService,
                                           Type, Preference,
                                           ResourceService,CanvasService,UserTypeService){
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
            var customFont={
                name:fRes.name
            };
            if($scope.customFontDisabled){
                customFont.type='disable'
            }
            return customFont;
        });
        // console.log(customFonts)
        $scope.componentOfChar.fontFamilies = [{name:'宋体'},{name:'Arial'},{name:'times'}].concat(customFonts)
    }

    function initProject(){

        //ProjectService.getProjectTo($scope);
        //
        //onAttributeChanged();
        //$scope.$on('AttributeChanged', function (event) {
        //    onAttributeChanged();
        //});

        $scope.componentOfChar.allCharacters=characterSetService.getCharacterSet();
        $scope.customFontDisabled=UserTypeService.getCustomFontAuthor();

        syncFontFamilies();

        $scope.$on('ResourceChanged',function (e) {
            console.log('Fonts changed!!')
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

}]);
