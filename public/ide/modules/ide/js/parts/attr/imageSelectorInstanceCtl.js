/**
 * Created by Zzen1sS on 24/3/2016
 */
ide.controller('ImageSelectorInstanceCtl', function ($scope,$timeout, $uibModalInstance,Type, ResourceService,widgetInfo,TexService) {


    $scope.images = ResourceService.getAllImages();
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
            initConfigure(false,2,widgetInfo.tex);
            break;
        case Type.MyProgress:
            initConfigure(false,2,widgetInfo.tex);
            break;
        case Type.MySlide:
            initConfigure(true,2,widgetInfo.tex);
            break;
        case Type.MyNumber:
            initConfigure(false,13,widgetInfo.tex);
            break;
        case Type.MyDashboard:
            initConfigure(false,2,widgetInfo.tex);
            break;
        case Type.MyTextArea:
            initConfigure(false,2,widgetInfo.tex);
            break;
        case Type.MyNum:
            initConfigure(false,2,widgetInfo.tex);
            break;
        case Type.MyOscilloscope:
            initConfigure(false,2,widgetInfo.tex);
            break;
        case Type.MyKnob:
            initConfigure(false,2,widgetInfo.tex);
            break;
        default:
            initConfigure(true,1,widgetInfo.tex);
            break;
    }

    $scope.addSlice = function () {
        $scope.tex.slices.push(TexService.getDefaultSlice());
    };

    $scope.removeSlice = function (index) {
        $scope.tex.slices.splice(index,1);
    };

    $scope.save = function () {
        $uibModalInstance.close($scope.tex);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    function initConfigure(_canAddNewSlice,_sliceNum,_tex){
        $scope.canAddNewSlice = _canAddNewSlice;
        $scope.sliceNum = _sliceNum;
        $scope.tex = _tex;
    }

    //edit by lixiang
    function cloneSlice(){
        //console.log('open success');
        $scope.tempSlices= _.cloneDeep($scope.tex.slices);
        //console.log($scope.tempSlices);
    }

    function enterColor(op) {
        if(op.name='selectSlice.color'){
            //console.log('success');
           // console.log(op);
        }
    }
    function restore(){
        //console.log('restore');
        $timeout(function () {
            $scope.tex.slices= _.cloneDeep($scope.tempSlices);
            //console.log($scope.tex.slices);
        });
    }

});