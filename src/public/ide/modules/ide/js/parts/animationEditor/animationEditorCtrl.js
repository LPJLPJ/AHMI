

ide.controller('AnimationEditorCtrl', ['$scope','$timeout', 'ProjectService','Type',function ($scope,$timeout, ProjectService, Type) {
    $scope.$on('GlobalProjectReceived', function () {

        // initUserInterface();

        // initProject();
        // $scope.$emit('LoadUp');
        init()

    });

    $scope.$on('AttributeChanged', function (event) {
        onAttributeChanged();
    });

    $scope.component = {
        ui:{
            paddingLeft:50,
            selectedAnimationIdx:0,
            changeAnimationIdx:changeAnimationIdx
        },
        marker:{
            onMouseDown:markerOnMouseDown,
            onMouseMove:markerOnMouseMove,
            onMouseUp:markerOnMouseUp
        },
        animations:[],
        animation:{
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
            
        },
        animationOptions:{
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
        onAttributeChanged()
    }

    //timingFuns

    var EasingFunctions = {
        // no easing, no acceleration
        linear: function (t) { return t },
        // accelerating from zero velocity
        // easeInQuad: function (t) { return t*t },
        // // decelerating to zero velocity
        // easeOutQuad: function (t) { return t*(2-t) },
        // // acceleration until halfway, then deceleration
        // easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        // accelerating from zero velocity
        easeInCubic: function (t) { return t*t*t },
        // decelerating to zero velocity
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        // accelerating from zero velocity
        // easeInQuart: function (t) { return t*t*t*t },
        // // decelerating to zero velocity
        // easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        // // acceleration until halfway, then deceleration
        // easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        // // accelerating from zero velocity
        // easeInQuint: function (t) { return t*t*t*t*t },
        // // decelerating to zero velocity
        // easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
        // // acceleration until halfway, then deceleration
        // easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
        // // elastic bounce effect at the beginning
        // easeInElastic: function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 },
        // // elastic bounce effect at the end
        // easeOutElastic: function (t) { return .04 * t / (--t) * Math.sin(25 * t) },
        // // elastic bounce effect at the beginning and end
        // easeInOutElastic: function (t) { return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 }
    }

    var selectedObj

    function onAttributeChanged(){
        //check selected object type
        selectedObj = ProjectService.getCurrentSelectObject();
        if(selectedObj.type == Type.MyLayer && selectedObj.level.animations && selectedObj.level.animations.length){
            //show
            $scope.component.ui.show = true
            
            //update animation
            $scope.component.animations = selectedObj.level.animations.map(function(a){
                return a.title||'动画'
            })

            $scope.component.ui.selectedAnimationIdx = '0'
            changeAnimationIdx()
            

        }else{
            $scope.component.ui.show = false
        }
    }

    function changeAnimationIdx(){
        $scope.component.animation = projectAnimationToEditorAnimation(selectedObj.level.animations[$scope.component.ui.selectedAnimationIdx])
    }


    function projectAnimationToEditorAnimation(rawAnimation){
        var result = {}
        result.title = rawAnimation.title
        result.keyFrames = {}
        result.keyFrames[0] = {
            time:0,
            translateX:rawAnimation.animationAttrs.translate.srcPos.x,
            translateY:rawAnimation.animationAttrs.translate.srcPos.y,
            scaleX:rawAnimation.animationAttrs.scale.srcScale.x,
            scaleY:rawAnimation.animationAttrs.scale.srcScale.y,
            timingFun:null,
            fixed:true
        }
        result.keyFrames[1] = {
            time:parseFloat((rawAnimation.duration/1000.0).toFixed(3)),
            translateX:rawAnimation.animationAttrs.translate.dstPos.x,
            translateY:rawAnimation.animationAttrs.translate.dstPos.y,
            scaleX:rawAnimation.animationAttrs.scale.dstScale.x,
            scaleY:rawAnimation.animationAttrs.scale.dstScale.y,
            timingFun:rawAnimation.timingFun
        }
        return result
    }

    function editorAnimationToProjectAnimation(rawAnimation){
        var result = {}
        result.title = rawAnimation.title
        result.animationAttrs = {
            translate:{
                srcPos:{
                    x:rawAnimation.keyFrames[0].translateX,
                    y:rawAnimation.keyFrames[0].translateY,
                },
                dstPos:{
                    x:rawAnimation.keyFrames[1].translateX,
                    y:rawAnimation.keyFrames[1].translateY
                }
            },
            scale:{
                srcScale:{
                    x:rawAnimation.keyFrames[0].scaleX,
                    y:rawAnimation.keyFrames[0].scaleY
                },
                dstScale:{
                    x:rawAnimation.keyFrames[1].scaleX,
                    y:rawAnimation.keyFrames[1].scaleY
                }
            }
        }
        result.duration = rawAnimation.keyFrames[1].time - rawAnimation.keyFrames[0].time
        result.timingFun = rawAnimation.keyFrames[1].timingFun
    }

    function markerOnMouseDown(e){
        
        if(angular.element(e.target).hasClass('animationEditor__marker')){
            var target = e.target
            var id = Number(target.getAttribute('data-id'))||0

            var d = parseInt(e.clientX - target.offsetLeft)
            $scope.component.animationOptions.curKeyFrameIdx = id
            if($scope.component.animation.keyFrames[id].fixed){
                //can't move
                return
            }
            e.currentTarget.onmousemove = function(e){
                
    //             target.style.left = (e.clientX - d) + 'px'
                var nextTime = parseFloat(((e.clientX - $scope.component.ui.paddingLeft -d)/100.0).toFixed(3))
                nextTime = nextTime < 0 ? 0 : nextTime
                
                $scope.component.animation.keyFrames[id].time = nextTime
                // console.log($scope.component.animation.keyFrames[id])
            }
        }
        
          
    }

    

    function markerOnMouseMove(e){
        //reserved
    }

    function markerOnMouseUp(e){
        e.currentTarget.onmousemove = null;
        updateAnimationOnLayer()
    }


    function timeLineOnMouseDown(e){
        // console.log(e)
        var clientRect = e.currentTarget.getBoundingClientRect()
        var d = parseFloat(((e.clientX - $scope.component.ui.paddingLeft - clientRect.left)/100.0).toFixed(3))
        d = d<0?0:d
        $scope.component.timeLine.position = d
        //update animation
        // console.log(getCurrentAnimation())
        updateAnimationOnLayer()
        e.currentTarget.onmousemove = function(e){
            d = parseFloat(((e.clientX - $scope.component.ui.paddingLeft - parseInt(clientRect.left))/100.0).toFixed(3))
            d = d < 0 ? 0 : d
            $scope.component.timeLine.position = d
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
        var fps = $scope.component.animationOptions.fps
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

    function calculateInnerAnimation(leftAnimation, rightAnimation, t, timingFun){
        var result = {}
        if(timingFun){
            if(timingFun in EasingFunctions){
                t = EasingFunctions[timingFun](t)
            }
        }
        $scope.component.animationOptions.attributes.forEach(function(attr){
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
            return calculateInnerAnimation($scope.component.animation.keyFrames[left],$scope.component.animation.keyFrames[right],t,$scope.component.animation.keyFrames[right].timingFun)
        }else if(left != -1){
            return $scope.component.animation.keyFrames[left]
        }else if(right != -1){
            return $scope.component.animation.keyFrames[right]
        }else{
            return null
        }
    }


}]);

