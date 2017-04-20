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
            case "MyPage" :
            case "MySubLayer":
            case undefined:
                $scope.showAnimationPanel=false;
                break;
            default:
                $scope.showAnimationPanel=true;
                break;
        }
    }

    function initProject(){
        $scope.$on('AttributeChanged',function(){
            readAnimationInfo();
        });

        $scope.deleteAnimation=function(index){
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

    .controller('AnimationInstanceCtrl',['$scope','$uibModalInstance','animation',function($scope,$uibModalInstance,animation){
        $scope.animation=animation;
        $scope.confirm = function () {
            $uibModalInstance.close($scope.animation);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }
}]);