/**
 * Created by Zzen1sS on 24/3/2016
 */
ide.controller('ImageSelectorInstanceCtl', ['$scope','$timeout', '$uibModalInstance','ProjectService','Type', 'ResourceService','widgetInfo','TexService',function ($scope,$timeout, $uibModalInstance,ProjectService,Type, ResourceService,widgetInfo,TexService) {


    $scope.images = ResourceService.getAllImagesAndTemplates();
    $scope.images.unshift({
        name:'---',
        src:''
    });
    $scope.basicUrl = ResourceService.getResourceUrl();

    //edit by lixiang
    $scope.$on('colorpicker-submit', function (e,op) {
        enterColor(op);
    });
    $scope.$on('colorpicker-closed',function(e,op){
        restore(op);
    });
    $scope.$on('colorpicker-shown',function(e,op){
        cloneSlice();
    });


    $scope.canInputText = false;
    $scope.canAddNewSlice = false;
    $scope.disableEditImg = false;
    $scope.disableEditColor = false;
    $scope.sliceNum = 0;
    switch (widgetInfo.type){
        case Type.MyButton:
            initConfigure(false,false,2,widgetInfo.tex,true,false,false);
            break;
        case Type.MyProgress:
            if((widgetInfo.objInfo.progressModeId==='1'||widgetInfo.objInfo.progressModeId==='3')&&(widgetInfo.index==1||widgetInfo.index==2||widgetInfo.index==3)){
                initConfigure(false,false,1,widgetInfo.tex,true,true,false);
            }else{
                initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            }
            if(widgetInfo.tex.name==='光标纹理'){
                initConfigure(false,false,1,widgetInfo.tex,true,false,true);
            }
            break;
        case Type.MySlide:
            initConfigure(true,true,2,widgetInfo.tex,false,false,false);
            break;
        case Type.MyNumber:
            initConfigure(false,false,13,widgetInfo.tex,false,false,false);
            break;
        case Type.MyDashboard:
            initConfigure(false,false,2,widgetInfo.tex,true,false,false);
            break;
        case Type.MyTextArea:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        case Type.MyNum:
            initConfigure(false,false,1,widgetInfo.tex,false,false,false);
            break;
        case Type.MyOscilloscope:
            initConfigure(false,false,2,widgetInfo.tex,false,false,false);
            break;
        case Type.MyKnob:
            initConfigure(false,false,2,widgetInfo.tex,false,false,false);
            break;
        case Type.MyImage:
            initConfigure(false,false,1,widgetInfo.tex,false,false,false);
            break;
        case Type.MySwitch:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        case Type.MyRotateImg:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        case Type.MySlideBlock:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        case Type.MyAnimation:
            initConfigure(true,false,1,widgetInfo.tex,false,false,false);
            break;
        case Type.MyTexNum:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        case Type.MyDateTime:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        case Type.MyButtonGroup:
            initConfigure(false,false,1,widgetInfo.tex,true,false,false);
            break;
        default:
            initConfigure(true,false,1,widgetInfo.tex,false,false,false);
            break;
    }

    // $scope.addSlice = function () {
    //     $scope.tex.slices.push(TexService.getDefaultSlice());
    // };

    //last edtor: liuhuan 2017/8/17
    //从当前行的下一行插入默认新行
    $scope.addSlice = function () {
        $scope.tex.slices.splice($scope.curIndex+1,0,TexService.getDefaultSlice());
    };

    $scope.removeSlice = function (index) {
        if($scope.tex.slices.length==1){
            toastr.warning('至少有一张纹理');
        }else{
            $scope.tex.slices.splice(index,1);
        }
    };


    $scope.save = function () {
        if(validation){
            $uibModalInstance.close($scope.tex);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.disableColorInput = function(slice,e){
        console.log(slice,e)
        if(slice.imgSrc){
            slice.color='rgba(0,0,0,0)';
        }else{
            slice.color=_getRandomColor();
        }
    };



    function initConfigure(_canAddNewSlice,_canInputText,_sliceNum,_tex,_disableEditName,_disableEditImg,_disableEditColor){
        $scope.canAddNewSlice = _canAddNewSlice;
        $scope.canInputText = _canInputText;
        $scope.sliceNum = _sliceNum;
        $scope.tex = _tex;
        $scope.disableEditName = _disableEditName;
        $scope.disableEditImg = _disableEditImg;
        $scope.disableEditColor = _disableEditColor;
    }

    //edit by lixiang
    function cloneSlice(){
        //console.log('open success');
        $scope.tempSlices= _.cloneDeep($scope.tex.slices);
        //console.log($scope.tempSlices);
    }

    function enterColor(op) {
        if(op.name='selectSlice.color'){
        }
    }
    function restore(){
        $timeout(function () {
            $scope.tex.slices= _.cloneDeep($scope.tempSlices);
        });
    }

    function _getRandomColor(){
        var r = _.random(64, 255);
        var g = _.random(64, 255);
        var b = _.random(64, 255);
        return 'rgba(' + r + ',' + g + ',' + b + ',1.0)';
    }

    $scope.curIndex = 0;
    $scope.selectItem = function(index){
        $scope.curIndex = index;
    };

    var restoreValue;
    var validation=true;
    //保存旧值
    $scope.store=function(th){
        restoreValue=th.slice.name;
    };

    //回复旧值
    $scope.restore = function (th) {
        th.slice.name=restoreValue;
    };

    //验证新值
    $scope.enterName=function(th){
        console.log("$scope.canInputText:",$scope.canInputText)

        //判断是否和初始一样
        if (th.slice.name===restoreValue){
            return;
        }
        //输入有效性检测
        validation=ProjectService.inputValidate(th.slice.name);
        if(!validation){
            $scope.restore(th);
            return;
        }
        toastr.info('修改成功');
        restoreValue=th.slice.name;
    };

    //验证enter键
    $scope.enterPress=function(e,th){
        if (e.keyCode==13){
            // angular.element($(th)).trigger("blur");
            // angular.element(document.getElementById('texBar')).trigger("click");
            // console.log(angular.element($("#texBar")));
            // console.log(angular.element(document.getElementById('texBar')));
            $scope.enterName(th);


        }
    };

}]);