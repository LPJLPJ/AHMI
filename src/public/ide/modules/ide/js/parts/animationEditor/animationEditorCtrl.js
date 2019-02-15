

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
        title:'animation editor'
    }
    
    function init(){
        console.log('loaded animationEditor')
    }

    function markerOnMouseDown(e){
        var d = e.clientX - e.target.offsetLeft
        e.target.onmousemove = function(e){
            
            e.target.style.left = (event.clientX - d) + 'px'
        }
          
    }

    function markerOnMouseMove(e){

    }

    function markerOnMouseUp(e){
        e.target.onmousemove = null;
    }

}]);

