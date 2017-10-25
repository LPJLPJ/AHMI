/**
 * Created by lixiang on 2016/10/19.
 */
ide.controller('animationCtl',['$scope','ProjectService','Type','$uibModal','AnimationService','UserTypeService',function($scope,ProjectService,Type,$uibModal,AnimationService,UserTypeService){
    $scope.$on('GlobalProjectReceived',function(){
        initUserInterface();
        initProject();
    });

    function initUserInterface(){
        readAnimationInfo();
        setAnimationAuthor();
        $scope.status={
            collapsed:false,
        };
        $scope.collapse=function(event){
            $scope.status.collapsed=!$scope.status.collapsed;
        }
    }

    function setAnimationAuthor(){
        var animationsDisabled=UserTypeService.getAnimationAuthor();
        var animationBtn=document.getElementById('addAnimationBtn');
        animationBtn.disabled=animationsDisabled;
    }
    function readAnimationInfo(){
        if(!ProjectService.getCurrentSelectObject()){
            console.warn('空');
            return;
        }
        var curLevel = ProjectService.getCurrentSelectObject().level;
        var _animation = _.cloneDeep(curLevel.animations);
        AnimationService.setAnimations(_animation);

        $scope.animations=AnimationService.getAllAnimations();

        var currentObject = ProjectService.getCurrentSelectObject().level;
        switch (currentObject.type){
            case 'MyLayer':
                $scope.showAnimationPanel=true;
                break;
            default:
                $scope.showAnimationPanel=false;
                break;
        }
    }

    function initProject(){
        $scope.$on('AttributeChanged',function(){
            readAnimationInfo();
        });

        $scope.deleteAnimation=function(index){
            ProjectService.deleteAnimationName(AnimationService.getAllAnimations()[index].title);
            AnimationService.deleteAnimationByIndex(index,function(){
                $scope.animations=AnimationService.getAllAnimations();
            }.bind(this));

        };

        $scope.openPanel=function(index){
            $scope.selectIdx=index;
            var targetAnimation;
            if(index==-1){
                targetAnimation = AnimationService.getNewAnimation();
            }else if(index>=0&&index<$scope.animations.length){
                targetAnimation=_.cloneDeep($scope.animations[index]);
            }

            var modalInstance = $uibModal.open({
                animation:true,
                templateUrl:'animationPanelModal.html',
                controller:'AnimationInstanceCtrl',
                size:'middle',
                resolve:{
                    animation:function(){
                        return targetAnimation;
                    }
                }
            });

            modalInstance.result.then(function(newAnimation){
                if($scope.selectIdx==-1){
                    AnimationService.appendAnimation(newAnimation,function(){
                        $scope.animations=AnimationService.getAllAnimations();
                    }.bind(this));
                }else if($scope.selectIdx>=0&&$scope.selectIdx<$scope.animations.length){
                    AnimationService.updateAnimationByIndex(newAnimation,$scope.selectIdx,function(){
                        $scope.animations=AnimationService.getAllAnimations();
                    }.bind(this));
                }
            });
        }
    }


}])

    .controller('AnimationInstanceCtrl',['$scope','$uibModalInstance','ProjectService','animation',function($scope,$uibModalInstance,ProjectService,animation){
        $scope.animation=animation;
        $scope.checkDuration = function (e) {
            if($scope.animation.duration<0){
                toastr.error('持续时间必须大于0s');
                $scope.animation.duration=0;
            }else if($scope.animation.duration>5000){
                toastr.error('持续时间不能大于5s');
                $scope.animation.duration=5000;
            }
        };
        $scope.confirm = function (th) {
            if(validation&&duplicate(th)){
                titleArray.push(th.animation.title);
                ProjectService.setAnimationArray(titleArray);
                $uibModalInstance.close($scope.animation);
            }

        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        var restoreValue;
        var validation=true;
        var titleArray=[];
        //保存旧值
        $scope.store=function(th){
            restoreValue=th.animation.title;

        };

        //恢复旧值
        $scope.restore = function (th) {
            th.animation.title=restoreValue;
        };

        //验证新值
        $scope.enterName=function(th){
            //判断是否和初始一样
            if (th.animation.title===restoreValue){
                return;
            }
            //输入有效性检测
            validation=ProjectService.inputValidate(th.animation.title);
            if(!validation||!duplicate(th)){
                $scope.restore(th);
                return;
            }
            toastr.info('修改成功');
            ProjectService.deleteAnimationName(restoreValue);
            restoreValue=th.animation.title;
        };
        //验证重名
        function duplicate(th){
            titleArray=_.cloneDeep(ProjectService.getAnimationArray());
            for(var i=0;i<titleArray.length;i++){
                if(th.animation.title===titleArray[i]){
                    toastr.info('重复的动画名');
                    return false;
                }
            }
            return true;
        }

        //验证enter键
        $scope.enterPress=function(e,th){
            if (e.keyCode==13){
                $scope.enterName(th);
            }
        };

}]);