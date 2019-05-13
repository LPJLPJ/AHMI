// 自定义指令


/**
 * 指令：含有标签和启用寄存器筛选的变量选择
 * 参数：bind和actionFunction
 * bind：含有tagName属性的对象，与selectedTag双向绑定
 * actionFunction：当selectedTag中的tagName发上变化时要执行的父作用域里的函数
 * 示例：<tag-select bind="selectedTagObjArray[0]" action-function="actionFunction(0)"></tag-select>
 * create in 2018/4/4 by LH
 */
ide.directive("tagSelect", function () {
    return {
        restrict: 'E',
        templateUrl: "tagSelect.html",
        controller: 'TagSelect',
        scope: {
            selectedTag: "=?bind",
            action: "&?actionFunction"
        }
    };
});

/**
 * tag管理控制器
 */
ide.controller('TagSelect', ['$scope', 'TagService', '$timeout', function ($scope, TagService, $timeout) {
    $scope.component = {
        allCustomTags: null,
        tagClasses: null,
        curTagClassName: null,
        curTagClass: null,
        curTagArray: null,
        showRegValidTagsFlag: false,
        selectedTagFun: selectedTagFun,
        changeCurTagClass: changeCurTagClass,
        showRegValidTags: showRegValidTags,
        syncTagClasses: syncTagClasses
    };
    $scope.selectedTag = {tagName: null};

    _initController();

    //初始化控制器
    function _initController() {
        _readTagClasses();
        initCurTagClass();
    }

    $scope.$on('GlobalProjectReceived', function () {
        syncTagClasses();
    });

    $scope.$on('TagsChanged', function () {
        syncTagClasses();
    });

    //获取所有tag
    function _readTagsInfo() {
        $scope.component.allCustomTags = TagService.getAllCustomTags();
    }

    //获取tagClasses
    function _readTagClasses() {
        $scope.component.tagClasses = TagService.getAllTagClasses();
    }

    //获取tagClasses
    function initCurTagClass() {
        $scope.component.curTagClassName = $scope.component.tagClasses[0].name;
        $scope.component.curTagClass = $scope.component.tagClasses[0];
        $scope.component.curTagArray = $scope.component.curTagClass.tagArray;
    }

    function syncTagClasses() {
        $scope.component.tagClasses = TagService.getAllTagClasses();
        $scope.component.curTagClassName = $scope.component.curTagClass.name;
        changeCurTagClass();
        $scope.component.curTagArray = $scope.component.curTagClass.tagArray;
        // console.log('$scope',$scope.component.curTagClass);

    }

    //返回tagName在tagClass的index
    function IndexInTagClass(tagName, tagClass) {
        for (var i = 0; i < tagClass.tagArray.length; i++) {
            if (tagName === tagClass.tagArray[i].name) {
                return i;
            }
        }
        return -1;
    }

    //选择tag，并将其绑定到当前对象上
    function selectedTagFun() {
        if ($scope.selectedTag.tagName !== undefined && $scope.selectedTag.tagName !== null) {
            $scope.$emit("SelectedTagChanged");
        }
    }

    //选择tagClass
    function changeCurTagClass() {
        var name = $scope.component.curTagClassName;
        var tagClasses = $scope.component.tagClasses;

        //根据curTagClassName来更新curTagClass和selectedTag
        for (var i = 0; i < tagClasses.length; i++) {
            if (tagClasses[i].name === name) {
                $scope.component.curTagClass = tagClasses[i];
                showRegValidTags();
                $scope.component.selectedIdx = null;
                break;
            }
        }
    }

    //tag列表根据是否启用了寄存器筛选
    function showRegValidTags() {
        var tagArray = [];
        var tag = null;
        if ($scope.component.showRegValidTagsFlag === true) {
            for (var i = 0; i < $scope.component.curTagClass.tagArray.length; i++) {
                tag = $scope.component.curTagClass.tagArray[i];
                // console.log('tag',tag)
                if (tag.register === true) {
                    tagArray.push(tag);
                    // console.log('tagArray',tagArray)
                }
            }
            $scope.component.curTagArray = tagArray;
        } else {
            $scope.component.curTagArray = $scope.component.curTagClass.tagArray;
        }
    }
}]);

/**
 * switch开关指令-组件
 * 内部status与外部数据相绑定,status 有两种状态 on  off
 */
ide.directive('mySwitchButton', function () {
    return {
        restrict: "EA",
        template: "<div id='btn' class='switch-button switch-button-close' ng-click='clickHandler()'><span class='switch-flag'></span></div>",
        scope: {
            status: '=',
        },
        replace: true,
        link: function ($scope, $element) {
            function init() {
                ($scope.status === 'on') ? $element.removeClass('switch-button-close') : $element.addClass('switch-button-close');
            }

            init();
            $scope.clickHandler = function () {
                if ($scope.status === 'on') {
                    $scope.status = 'off';
                    $element.addClass('switch-button-close')
                } else if ($scope.status === 'off') {
                    $scope.status = 'on';
                    $element.removeClass('switch-button-close')
                }
            };
        }
    }
});

/**
 * switch开关指令-组件
 * 内部status与外部数据相绑定,status 有两种状态 true  false
 */
ide.directive('myBoolSwitchButton', function () {
    return {
        restrict: "EA",
        template: "<div id='btn' class='switch-button switch-button-close' ng-click='clickHandler()'><span class='switch-flag'></span></div>",
        scope: {
            status: '=',
        },
        replace: true,
        link: function ($scope, $element) {
            function init() {
                $scope.status  ? $element.removeClass('switch-button-close') : $element.addClass('switch-button-close');
            }

            init();
            $scope.clickHandler = function () {
                if ($scope.status ) {
                    $scope.status = false;
                    $element.addClass('switch-button-close')
                } else if (!$scope.status ) {
                    $scope.status = true;
                    $element.removeClass('switch-button-close')
                }
            };
        }
    }
});
