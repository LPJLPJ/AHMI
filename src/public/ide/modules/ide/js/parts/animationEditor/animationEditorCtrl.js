

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
            attributes:['translateX','translateY','scaleX','scaleY']
        },
        timeLine:{
            position:0,
            onMouseDown:timeLineOnMouseDown,
            onMouseMove:timeLineONMouseMove,
            onMouseUp:timeLineOnMouseUp
        }
    }
    
    function init(){
        console.log('loaded animationEditor')
    }

    function markerOnMouseDown(e){
        
        if(angular.element(e.target).hasClass('animationEditor__marker')){
            var target = e.target
            var id = Number(target.getAttribute('data-id'))||0

            var d = e.clientX - target.offsetLeft
            $scope.component.animation.curKeyFrameIdx = id
            e.currentTarget.onmousemove = function(e){
                
    //             target.style.left = (e.clientX - d) + 'px'
                
                $scope.component.animation.keyFrames[id].time = ((e.clientX-d)/100).toFixed(3)
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
        var d = e.clientX - clientRect.left
        $scope.component.timeLine.position = d

        e.currentTarget.onmousemove = function(e){
            // console.log(e.clientX - clientRect.left)
            $scope.component.timeLine.position = e.clientX - clientRect.left
        }
    }

    function timeLineONMouseMove(e){
        //reserved
    }

    function timeLineOnMouseUp(e){
        // console.log('canceled')
        e.currentTarget.onmousemove = null
    }

}]);

