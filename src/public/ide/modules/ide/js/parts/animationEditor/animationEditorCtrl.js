

ide.controller('AnimationEditorCtrl', ['$scope','$timeout', 'ProjectService',function ($scope,$timeout, ProjectService) {
    $scope.$on('GlobalProjectReceived', function () {

        // initUserInterface();

        // initProject();
        // $scope.$emit('LoadUp');
        init()

    });

    $scope.component = {
        marker:{
            onMouseDown:markerOnMouseDown,
            onMouseMove:markerOnMouseMove,
            onMouseUp:markerOnMouseUp
        },
        animation:{
            // keyFrames:[
            //     {
            //         id:0,
            //         time:0,
            //         attrs:{
            //             translateX:0,
            //             translateY:0,
            //             scaleX:1,
            //             scaleY:1
            //         }
            //     },
            //     {
            //         id:1,
            //         time:1,
            //         attrs:{
            //             translateX:50,
            //             translateY:50,
            //             scaleX:1,
            //             scaleY:1
            //         }
            //     },
            //     {
            //         id:2,
            //         time:2,
            //         attrs:{
            //             translateX:0,
            //             translateY:0,
            //             scaleX:2,
            //             scaleY:2
            //         }
            //     }
            // ]
            keyFrames:{
                0:{
                    time:0,
                    translateX:0,
                    translateY:0,
                    scaleX:1,
                    scaleY:1
                },
                1:{
                    time:1,
                    translateX:50,
                    translateY:50,
                    scaleX:1,
                    scaleY:1
                },
                2:{
                    time:2,
                    translateX:0,
                    translateY:0,
                    scaleX:2,
                    scaleY:2
                }
            },
            curKeyFrameIdx:0,
            fps:60,
            attributes:['translateX','translateY','scaleX','scaleY'],
            start:startAnimation,
            pause:pauseAnimation
        },
        timeLine:{
            position:0,
            onMouseDown:timeLineOnMouseDown,
            onMouseMove:timeLineONMouseMove,
            onMouseUp:timeLineOnMouseUp,
            onMouseOut:timeLineOnMouseOut
        }
    }
    
    function init(){
        console.log('loaded animationEditor')
    }

    function markerOnMouseDown(e){
        
        if(angular.element(e.target).hasClass('animationEditor__marker')){
            var target = e.target
            var id = Number(target.getAttribute('data-id'))||0

            var d = parseInt(e.clientX - target.offsetLeft)
            $scope.component.animation.curKeyFrameIdx = id
            
            e.currentTarget.onmousemove = function(e){
                
    //             target.style.left = (e.clientX - d) + 'px'
                
                $scope.component.animation.keyFrames[id].time = ((e.clientX-d)/100.0).toFixed(3)
                // console.log($scope.component.animation.keyFrames[id])
            }
        }
        
          
    }

    

    function markerOnMouseMove(e){
        //reserved
    }

    function markerOnMouseUp(e){
        e.currentTarget.onmousemove = null;
    }


    function timeLineOnMouseDown(e){
        // console.log(e)
        var clientRect = e.currentTarget.getBoundingClientRect()
        var d = ((e.clientX - clientRect.left)/100.0).toFixed(3)
        $scope.component.timeLine.position = d
        //update animation
        // console.log(getCurrentAnimation())
        updateAnimationOnLayer()
        e.currentTarget.onmousemove = function(e){
            $scope.component.timeLine.position = ((e.clientX - parseInt(clientRect.left))/100.0).toFixed(3)
            updateAnimationOnLayer()
        }
    }

    function timeLineONMouseMove(e){
        //reserved
    }

    function timeLineOnMouseUp(e){
        // console.log('canceled')
        e.currentTarget.onmousemove = null
    }

    function timeLineOnMouseOut(e){
        if(angular.element(e.relatedTarget).hasClass('animationEditor__timeLine')){
         
            e.currentTarget.onmousemove = null
        }
        
    }

    function startAnimation(){
        var fps = $scope.component.animation.fps
        var dps = 1000.0/fps
        $scope.component.timeLine.position = 0
        if($scope.startAnimationKey){
            clearInterval($scope.startAnimationKey)
            $scope.startAnimationKey = null
        }
        $scope.startAnimationKey = setInterval(function(){
            var nextPosition = ($scope.component.timeLine.position + dps/1000.0)
            nextPosition = parseFloat(nextPosition.toFixed(3))
            $scope.$apply(function(){
                $scope.component.timeLine.position = nextPosition
                updateAnimationOnLayer()
                if($scope.component.timeLine.position > 5){
                    clearInterval($scope.startAnimationKey)
                }
            })
            
            
        },dps)
    }

    function pauseAnimation(){
        if($scope.startAnimationKey){
            clearInterval($scope.startAnimationKey)
            $scope.startAnimationKey = null
        }
    }

    function updateAnimationOnLayer(){
        ProjectService.ChangeLayerAnimation(getCurrentAnimation())
    }

    function calculateInnerAnimation(leftAnimation, rightAnimation, t){
        var result = {}
        $scope.component.animation.attributes.forEach(function(attr){
            result[attr] = leftAnimation[attr] + t * (rightAnimation[attr] - leftAnimation[attr])
        });
        return result
    }

    //get current animation
    function getCurrentAnimation(){
        var position = $scope.component.timeLine.position
        var leftMin = Infinity, rightMin = Infinity, left = -1, right = -1
        var d,t
        for(var id in $scope.component.animation.keyFrames){
            var keyFrame = $scope.component.animation.keyFrames[id]
            if(keyFrame.time <= position){
                //left
                d = position-keyFrame.time
                if( d < leftMin){
                    leftMin = d
                    left = id
                }
            }else{
                d = keyFrame.time - position
                if( d < rightMin){
                    rightMin = d
                    right = id
                }
            }
        }
        //calculate with left and right
        if(left != -1 && right != -1){
            //calculate with left and right
            t = leftMin / (leftMin + rightMin)
            return calculateInnerAnimation($scope.component.animation.keyFrames[left],$scope.component.animation.keyFrames[right],t)
        }else if(left != -1){
            return $scope.component.animation.keyFrames[left]
        }else if(right != -1){
            return $scope.component.animation.keyFrames[right]
        }else{
            return null
        }
    }


}]);

