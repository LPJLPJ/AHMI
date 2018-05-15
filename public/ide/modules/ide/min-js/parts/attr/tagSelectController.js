/**
 * Created by lixiang on 17/3/5.
 */

ide.controller('TagSelectCtl', ['$scope', 'TagService', 'ProjectService', 'Type', function ($scope, TagService, ProjectService, Type) {
    $scope.component = {
        showTagPanel: false,
        selectedTag: null,
        allCustomTags: null,
        allTimerTags: null,
        selectedTagFun: selectedTagFun,
    };

    $scope.$on('GlobalProjectReceived', function () {
        _initController();
    });

    $scope.$on('AttributeChanged', function () {
        _readTagsInfo();
        _reBindTag();
        _readObjType();
    });


    //初始化控制器
    function _initController() {
        _reBindTag();
        _readObjType();
    }

    //获取所有自定义tag和定时器tag
    function _readTagsInfo() {
        $scope.component.allCustomTags = TagService.getAllCustomTags();
        $scope.component.allTimerTags = TagService.getAllTimerTags();
    }

    //重新绑定tag
    function _reBindTag() {
        var selectObject = ProjectService.getCurrentSelectObject();
        if (!selectObject.level) {
            console.warn('空!');
            return;
        }
        $scope.component.selectedTag = selectObject.level.tag;
    }

    //重新读取选中对象信息，用于控制是否在属性栏显示tag选择框
    function _readObjType() {
        var currentSelectedObject = _.cloneDeep(ProjectService.getCurrentSelectObject().level);
        if (!currentSelectedObject) {
            console.warn('空!');
            return;
        }
        switch (currentSelectedObject.type) {
            case Type.MyNumber:
            case Type.MySlide:
            case Type.MyProgress:
            case Type.MyDashboard:
            case Type.MyButtonGroup:
            case Type.MyLayer:
            case Type.MyPage:
            case Type.MyNum:
            case Type.MyKnob:
            case Type.MyOscilloscope:
            case Type.MyImage:
            case Type.MySwitch:
            case Type.MyRotateImg:
            case Type.MyScriptTrigger:
            case Type.MySlideBlock:
            case Type.MyVideo:
            case Type.MyAnimation:
            case Type.MyTexNum:
                $scope.component.showTagPanel = true;
                break;
            default:
                $scope.component.showTagPanel = false;
        }
    }

    //选择tag，并将其绑定到当前对象上
    function selectedTagFun() {
        ProjectService.ChangeAttributeTag($scope.component.selectedTag, function (oldOperate) {
            $scope.$emit('ChangeCurrentPage', oldOperate);
        });
    }
}]);