/**
 * Created by lixiang on 2016/10/19.
 */
ide.controller('animationCtl',['$scope','ProjectService','Type','$uibModal','AnimationService',function($scope,ProjectService,Type,$uibModal,AnimationService){
    $scope.$on('GlobalProjectReceived',function(){
        initUserInterface();
        initProject();
    });

    function initUserInterface(){
        readAnimationInfo();
        $scope.animationsEnabled = true;
        $scope.status={
            collapsed:false,
        };
        $scope.collapse=function(event){
            $scope.status.collapsed=!$scope.status.collapsed;
        }
    }

    function readAnimationInfo(){
        if(!ProjectService.getCurrentSelectObject()){
            console.warn('空');
            return;
        }
        $scope.animations=AnimationService.getAllAnimations();

        var currentObject = ProjectService.getCurrentSelectObject().level;
        switch (currentObject.type){
            case "MyLayer" :
            case "MyNum":
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
                animation:$scope.animationsEnabled,
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
                    AnimationService.updateAnimationByIndex(newAnimation,$scope.selectedIdx,function(){
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
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }
}]);