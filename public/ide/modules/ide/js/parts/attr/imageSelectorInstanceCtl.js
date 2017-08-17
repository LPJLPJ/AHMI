/**
 * Created by Zzen1sS on 24/3/2016
 */
ide.controller('ImageSelectorInstanceCtl', ['$scope','$timeout', '$uibModalInstance','Type', 'ResourceService','widgetInfo','TexService',function ($scope,$timeout, $uibModalInstance,Type, ResourceService,widgetInfo,TexService) {


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



    $scope.canAddNewSlice = false;
    $scope.sliceNum = 0;
    switch (widgetInfo.type){
        case Type.MyButton:
            initConfigure(false,2,widgetInfo.tex,false);
            break;
        case Type.MyProgress:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MySlide:
            initConfigure(true,2,widgetInfo.tex,false);
            break;
        case Type.MyNumber:
            initConfigure(false,13,widgetInfo.tex,false);
            break;
        case Type.MyDashboard:
            initConfigure(false,2,widgetInfo.tex,false);
            break;
        case Type.MyTextArea:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MyNum:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MyOscilloscope:
            initConfigure(false,2,widgetInfo.tex,false);
            break;
        case Type.MyKnob:
            initConfigure(false,2,widgetInfo.tex,false);
            break;
        case Type.MyImage:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MySwitch:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MyRotateImg:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MySlideBlock:
            initConfigure(false,1,widgetInfo.tex,false);
            break;
        case Type.MyAnimation:
            initConfigure(true,1,widgetInfo.tex,false);
            break;
        case Type.MyTexNum:
            initConfigure(false,1,widgetInfo.tex,true);
            break;
        default:
            initConfigure(true,1,widgetInfo.tex,false);
            break;
    }

    // $scope.addSlice = function () {
    //     $scope.tex.slices.push(TexService.getDefaultSlice());
    // };
    //last edtor: liuhuan 2017/8/17
    //从当前行的下一行插入默认新行
    $scope.addSlice = function () {
        $scope.tex.slices.splice($scope.curIndex,0,TexService.getDefaultSlice());
    };

    $scope.removeSlice = function (index) {
        if($scope.tex.slices.length==1){
            toastr.warning('至少有一张纹理');
        }else{
            $scope.tex.slices.splice(index,1);
        }
    };


    $scope.save = function () {
        $uibModalInstance.close($scope.tex);
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

    //last edtor: liuhuan 2017/8/17
    //当前被点击行，修改背景色，修改curIndex位置
    $scope.curIndex = 1;
    $scope.selStyle=[{"background-color":" transparent"},{"background-color":" #F0F0F0"}];
    $scope.rowSelected=function(index){
        $scope.tex.slices[$scope.curIndex-1].selected=0;
        $scope.curIndex=index;
        $scope.tex.slices[$scope.curIndex-1].selected=1;
        // console.log($scope.tex.slices[$scope.curIndex-1].selected);
    };
    //end


    function initConfigure(_canAddNewSlice,_sliceNum,_tex,_disableEditName){
        $scope.canAddNewSlice = _canAddNewSlice;
        $scope.sliceNum = _sliceNum;
        $scope.tex = _tex;
        $scope.disableEditName = _disableEditName;
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

}]);