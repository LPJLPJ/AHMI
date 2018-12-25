/**
 * Created by lixiang on 2016/10/19.
 */
ide.controller('animationCtl', ['$scope', 'ProjectService', 'Type', '$uibModal', 'AnimationService', 'UserTypeService', function ($scope, ProjectService, Type, $uibModal, AnimationService, UserTypeService) {
    $scope.$on('GlobalProjectReceived', function () {
        initUserInterface();
        initProject();
    });

    $scope.$on("MaskView", function (event, data) {
        $scope.myMask = data;
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

    function readAnimationInfo() {
        if (!ProjectService.getCurrentSelectObject()) {
            console.warn('空');
            return;
        }
        var curLevel = ProjectService.getCurrentSelectObject().level;
        var _animation = _.cloneDeep(curLevel.animations);
        AnimationService.setAnimations(_animation);

        $scope.animations = AnimationService.getAllAnimations();

        var currentObject = ProjectService.getCurrentSelectObject().level;
        switch (currentObject.type) {
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
            AnimationService.deleteAnimationByIndex(index, function () {
                $scope.animations = AnimationService.getAllAnimations();
            }.bind(this));

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
                    AnimationService.appendAnimation(newAnimation, function () {
                        $scope.animations = AnimationService.getAllAnimations();
                    }.bind(this));
                } else if ($scope.selectIdx >= 0 && $scope.selectIdx < $scope.animations.length) {
                    AnimationService.updateAnimationByIndex(newAnimation, $scope.selectIdx, function () {
                        $scope.animations = AnimationService.getAllAnimations();
                    }.bind(this));
                }
            });
        }
    }


}])

    .controller('AnimationInstanceCtrl', ['$scope', '$uibModalInstance', 'TagService', 'ProjectService', 'animation', 'animationNames', function ($scope, $uibModalInstance, TagService, ProjectService, animation, animationNames) {
        $scope.animation = animation;     // 动画配置
        $scope.animationNames = animationNames;
        $scope.tags = TagService.getAllCustomTags();
        $scope.advanceMode = 'normal';

        // 初始化高级动画按钮
        function initAnimationBtns() {
            var translate = $scope.animation.animationAttrs.translate;
            var scale = $scope.animation.animationAttrs.scale;

            //switch button 的状态，共八个开关，每个开关两种状态
            var switchButtons = $scope.switchButtons;
            switchButtons.srcPos.x = (translate.srcPos.x.tag && translate.srcPos.x.tag !== '') ? 'on' : 'off';
            switchButtons.srcPos.y = (translate.srcPos.y.tag && translate.srcPos.y.tag !== '') ? 'on' : 'off';
            switchButtons.dstPos.x = (translate.dstPos.x.tag && translate.dstPos.x.tag !== '') ? 'on' : 'off';
            switchButtons.dstPos.y = (translate.dstPos.y.tag && translate.dstPos.y.tag !== '') ? 'on' : 'off';
            switchButtons.srcScale.x = (scale.srcScale.x.tag && scale.srcScale.x.tag !== '') ? 'on' : 'off';
            switchButtons.srcScale.y = (scale.srcScale.y.tag && scale.srcScale.y.tag !== '') ? 'on' : 'off';
            switchButtons.dstScale.x = (scale.dstScale.x.tag && scale.dstScale.x.tag !== '') ? 'on' : 'off';
            switchButtons.dstScale.y = (scale.dstScale.y.tag && scale.dstScale.y.tag !== '') ? 'on' : 'off';
        }

        // 初始化控制器参数
        function initCtrl() {
            $scope.advanceMode = animation.advanceMode ? 'advance' : 'normal';  //初始化否启用高级动画设置
            $scope.switchButtons = {
                srcPos: {
                    x: 'off',
                    y: 'off'
                },
                dstPos: {
                    x: 'off',
                    y: 'off'
                },
                srcScale: {
                    x: 'off',
                    y: 'off',
                },
                dstScale: {
                    x: 'off',
                    y: 'off',
                }
            };
            if ($scope.advanceMode === 'advance') {
                initAnimationBtns();
            }
        }

        initCtrl();


        // 转换动画模式
        $scope.toggleMode = function () {
            var translate, scale, key;
            translate = $scope.animation.animationAttrs.translate;
            scale = $scope.animation.animationAttrs.scale;
            if ($scope.advanceMode === 'normal') {
                // 普通模式，修改数据结构
                animation.advanceMode = false;
                for (key in translate) {
                    translate[key].x = 0;
                    translate[key].y = 0;
                }
                for (key in scale) {
                    scale[key].x = 1;
                    scale[key].y = 1;
                }
            } else if ($scope.advanceMode === 'advance') {
                animation.advanceMode = true;
                for (key in translate) {
                    translate[key].x = {
                        value: 0,
                        tag: ''
                    };
                    translate[key].y = {
                        value: 0,
                        tag: ''
                    };
                }
                for (key in scale) {
                    scale[key].x = {
                        value: 0,
                        tag: ''
                    };
                    scale[key].y = {
                        value: 0,
                        tag: ''
                    }
                }
            }
            // 重置开关状态
            initAnimationBtns();
        };


        // 验证持续时间参数
        function checkDuration(e) {
            if ($scope.animation.duration < 0) {
                alert('持续时间必须大于0s');
                $scope.animation.duration = 0;
                return false;
            } else if ($scope.animation.duration > 5000) {
                alert('持续时间不能大于5s');
                $scope.animation.duration = 5000;
                return false
            }else{
                return true
            }
        };

        // 确定按钮
        $scope.confirm = function (th) {
            if (!checkScale()||!checkDuration()) {
                return;
            }
            fixData($scope.animation, $scope.switchButtons);
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

        // 取消
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

        function checkScale() {
            var advanceMode = $scope.animation.advanceMode;
            var scaleX, scaleY,stopScaleX,stopScaleY;
            if (advanceMode === true) {
                scaleX = $scope.animation.animationAttrs.scale.srcScale.x.value;
                scaleY = $scope.animation.animationAttrs.scale.srcScale.y.value;

                stopScaleX = $scope.animation.animationAttrs.scale.dstScale.x.value;
                stopScaleY = $scope.animation.animationAttrs.scale.dstScale.y.value;
            } else if (advanceMode === false) {
                scaleX = $scope.animation.animationAttrs.scale.srcScale.x;
                scaleY = $scope.animation.animationAttrs.scale.srcScale.y;

                stopScaleX = $scope.animation.animationAttrs.scale.dstScale.x;
                stopScaleY = $scope.animation.animationAttrs.scale.dstScale.y;
            }

            if (scaleX < 0 || scaleY < 0 || stopScaleX<0 || stopScaleY<0) {
                alert("缩放倍率禁止使用负数");
                return false;
            }
            return true;

        }

        //验证enter键
        $scope.enterPress = function (e, th) {
            if (e.keyCode == 13) {
                $scope.enterName(th);
            }
        };

        $scope.timingFuns = ['linear',  'easeInCubic', 'easeOutCubic', 'easeInOutCubic'];

        //修正数据，将为绑定tag的属性置空,将绑定了tag的属性的value置0
        function fixData(animation, switchButtons) {
            var animationAttrs = animation.animationAttrs;
            var advanceMode = animation.advanceMode;
            var translate = animationAttrs.translate;
            var scale = animationAttrs.scale;

            if (advanceMode === true) {
                for (var key in switchButtons) {
                    switch (key) {
                        case 'srcPos':
                            (switchButtons[key].x === 'on') ? (translate[key].x.value = 0) : (translate[key].x.tag = "");
                            (switchButtons[key].y === 'on') ? (translate[key].y.value = 0) : (translate[key].y.tag = "");
                            break;
                        case 'dstPos':
                            (switchButtons[key].x === 'on') ? (translate[key].x.value = 0) : (translate[key].x.tag = "");
                            (switchButtons[key].y === 'on') ? (translate[key].y.value = 0) : (translate[key].y.tag = "");
                            break;
                        case 'srcScale':
                            (switchButtons[key].x === 'on') ? (scale[key].x.value = 1) : (scale[key].x.tag = "");
                            (switchButtons[key].y === 'on') ? (scale[key].y.value = 1) : (scale[key].y.tag = "");
                            break;
                        case 'dstScale':
                            (switchButtons[key].x === 'on') ? (scale[key].x.value = 1) : (scale[key].x.tag = "");
                            (switchButtons[key].y === 'on') ? (scale[key].y.value = 1) : (scale[key].y.tag = "");
                            break;
                    }
                }
            }

        }

    }]);