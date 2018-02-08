/**
 * Created by lixiang on 2016/10/19.
 */
ide.controller('animationCtl', ['$scope', 'ProjectService', 'Type', '$uibModal', 'AnimationService', 'UserTypeService', function ($scope, ProjectService, Type, $uibModal, AnimationService, UserTypeService) {
    //工程接收完毕，初始化动画控制器
    $scope.$on('GlobalProjectReceived', function () {
        initUserInterface();
        initProject();
    });

    function initUserInterface() {
        readAnimationInfo();
        setAnimationAuthor();
        $scope.status = {
            collapsed: false,
        };
        $scope.collapse = function (event) {
            $scope.status.collapsed = !$scope.status.collapsed;
        }
    }

    function setAnimationAuthor() {
        var animationsDisabled = UserTypeService.getAnimationAuthor();
        var animationBtn = document.getElementById('addAnimationBtn');
        animationBtn.disabled = animationsDisabled;
    }

    //读取当前选中对象的动画信息
    function readAnimationInfo() {
        if (!ProjectService.getCurrentSelectObject()) {
            console.warn('空');
            return;
        }
        var curLevel = ProjectService.getCurrentSelectObject().level;
        $scope.animations = _.cloneDeep(curLevel.animations) || [];
        switch (curLevel.type) {
            case 'MyLayer':
                $scope.showAnimationPanel = true;
                break;
            default:
                $scope.showAnimationPanel = false;
                break;
        }
    }

    function initProject() {
        $scope.$on('AttributeChanged', function () {
            readAnimationInfo();
        });

        $scope.deleteAnimation = function (index) {
            if (index >= 0 && index < $scope.animations.length) {
                $scope.animations.splice(index, 1);
                ProjectService.ChangeAttributeAnimation(_.cloneDeep($scope.animations));
            }
        };

        $scope.openPanel = function (index) {
            $scope.selectIdx = index;
            var targetAnimation;
            if (index == -1) {
                targetAnimation = AnimationService.getNewAnimation();
                targetAnimation.newAnimation = true;
            } else if (index >= 0 && index < $scope.animations.length) {
                targetAnimation = _.cloneDeep($scope.animations[index]);
                targetAnimation.newAnimation = false;
            }

            var animationNames = [];
            for (var i = 0; i < $scope.animations.length; i++) {
                animationNames.push($scope.animations[i].title);
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'animationPanelModal.html',
                controller: 'AnimationInstanceCtrl',
                size: 'lg',
                resolve: {
                    animation: function () {
                        return targetAnimation;
                    },
                    animationNames: function () {
                        return animationNames;
                    }
                }
            });

            modalInstance.result.then(function (newAnimation) {
                if ($scope.selectIdx == -1) {
                    $scope.animations.push(newAnimation);
                    ProjectService.ChangeAttributeAnimation(_.cloneDeep($scope.animations));
                } else if ($scope.selectIdx >= 0 && $scope.selectIdx < $scope.animations.length) {
                    if (index >= 0 && index < $scope.animations.length) {
                        $scope.animations[index] = newAnimation;
                        ProjectService.ChangeAttributeAnimation(_.cloneDeep($scope.animations));
                    }
                }
            });
        }
    }

}])

    .controller('AnimationInstanceCtrl', ['$scope', '$uibModalInstance', 'TagService', 'ProjectService', 'animation', 'animationNames', function ($scope, $uibModalInstance, TagService, ProjectService, animation, animationNames) {
        $scope.animation = animation;
        $scope.animationNames = animationNames;
        $scope.tags = TagService.getAllCustomTags();
        $scope.checkDuration = function (e) {
            if ($scope.animation.duration < 0) {
                toastr.error('持续时间必须大于0s');
                $scope.animation.duration = 0;
            } else if ($scope.animation.duration > 5000) {
                toastr.error('持续时间不能大于5s');
                $scope.animation.duration = 5000;
            }
        };
        $scope.confirm = function (th) {
            fixData($scope.animation,$scope.switchButtons);
            if (th.animation.newAnimation === false) {
                if (th.animation.title === restoreValue) {
                    $uibModalInstance.close($scope.animation);
                    return;
                }
            }
            if (validation && duplicate(th)) {
                $uibModalInstance.close($scope.animation);
            }


        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        var restoreValue = $scope.animation.title;
        var validation = true;
        //保存旧值
        $scope.store = function (th) {
            restoreValue = th.animation.title;
        };

        //恢复旧值
        $scope.restore = function (th) {
            th.animation.title = restoreValue;
        };

        //验证新值
        $scope.enterName = function (th) {
            //判断是否和初始一样
            if (th.animation.title === restoreValue) {
                return;
            }
            //输入有效性检测
            validation = ProjectService.inputValidate(th.animation.title);
            if (!validation || !duplicate(th)) {
                $scope.restore(th);
                return;
            }
            toastr.info('修改成功');
            restoreValue = th.animation.title;
        };

        //验证重名
        function duplicate(th) {
            var tempArray = $scope.animationNames;
            for (var i = 0; i < tempArray.length; i++) {
                if (th.animation.title === tempArray[i]) {
                    toastr.info('重复的动画名');
                    return false;
                }
            }
            return true;
        }

        //验证enter键
        $scope.enterPress = function (e, th) {
            if (e.keyCode == 13) {
                $scope.enterName(th);
            }
        };


        //edit by lx
        var translate = animation.animationAttrs.translate;
        var scale = animation.animationAttrs.scale;

        //switch button 的状态，共八个开关，每个开关两种状态
        $scope.switchButtons = {
            srcPos: {
                x: (translate.srcPos.x.tag !== '') ? 'on' : 'off',
                y: (translate.srcPos.y.tag !== '') ? 'on' : 'off'
            },
            dstPos: {
                x: (translate.dstPos.x.tag !== '') ? 'on' : 'off',
                y: (translate.dstPos.y.tag !== '') ? 'on' : 'off'
            },
            srcScale: {
                x: (scale.srcScale.x.tag !== '') ? 'on' : 'off',
                y: (scale.srcScale.y.tag !== '') ? 'on' : 'off',
            },
            dstScale: {
                x: (scale.dstScale.x.tag !== '') ? 'on' : 'off',
                y: (scale.dstScale.y.tag !== '') ? 'on' : 'off',
            }
        };

        $scope.timingFuns = ['linear','easeInQuad','easeOutQuad','easeInOutQuad','easeInCubic','easeOutCubic','easeInOutCubic','easeInQuart','easeOutQuart','easeInOutQuart','easeInQuint','easeOutQuint','easeInOutQuint'];

        //修正数据，将为绑定tag的属性置空,将绑定了tag的属性的value置0
        function fixData(animation,switchButtons){
            var animationAttrs = animation.animationAttrs;
            var translate = animationAttrs.translate;
            var scale = animationAttrs.scale;
            for(var key in switchButtons){
                switch (key){
                    case 'srcPos':
                        (switchButtons[key].x==='on')?(translate[key].x.value=0):(translate[key].x.tag="");
                        (switchButtons[key].y==='on')?(translate[key].y.value=0):(translate[key].y.tag="");
                        break;
                    case 'dstPos':
                        (switchButtons[key].x==='on')?(translate[key].x.value=0):(translate[key].x.tag="");
                        (switchButtons[key].y==='on')?(translate[key].y.value=0):(translate[key].y.tag="");
                        break;
                    case 'srcScale':
                        (switchButtons[key].x==='on')?(scale[key].x.value=1):(scale[key].x.tag="");
                        (switchButtons[key].y==='on')?(scale[key].y.value=1):(scale[key].y.tag="");
                        break;
                    case 'dstScale':
                        (switchButtons[key].x==='on')?(scale[key].x.value=1):(scale[key].x.tag="");
                        (switchButtons[key].y==='on')?(scale[key].y.value=1):(scale[key].y.tag="");
                        break;
                }
            }
        }


    }]);

ide.directive('mySwitchButton', function () {
    return {
        restrict: "EA",
        template: "<div id='btn' class='switch-button switch-button-close' ng-click='clickHandler()'><span class='switch-flag'></span></div>",
        scope: {
            status: '=status',
        },
        replace: true,
        link: function ($scope, $element) {
            function init() {
                ($scope.status === 'on')?$element.removeClass('switch-button-close'): $element.addClass('switch-button-close')
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