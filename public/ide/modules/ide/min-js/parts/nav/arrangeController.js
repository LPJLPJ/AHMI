ide.controller("arrangeCtr",["$scope","ProjectService",function(e,n){e.changeZIndex=function(r){var t={index:r},a=n.SaveCurrentOperate();n.ChangeAttributeZIndex(t,function(){e.$emit("ChangeCurrentPage",a),n.updateCurrentThumbInPage()})}}]);