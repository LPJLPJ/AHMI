ide.controller("ContainerCtl",["$scope","KeydownService","NavService","ProjectService","$document",function(e,t,n,a,r,c){function o(){var t=!1;try{Object.defineProperties({},"passive",{get:function(){t=!0}})}catch(e){}document.getElementsByClassName("container-fluid")[0].addEventListener("wheel",function(t){"Shift-"!==e.currentKey&&"Ctrl-"!==e.currentKey||(t.preventDefault(),0!==parseInt(t.delatY)&&e.$broadcast("wheelScale",parseInt(t.deltaY)))},!!t&&{passive:!0})}function i(){e.handleKeyUp=function(n){t.keyUp(),e.currentKey=""},e.handleKeyDown=function(r){var c=t.currentKeydown(r);if(e.currentKey=c,_.indexOf(t.getActionKeys(),c)>=0&&r.preventDefault(),t.isValidKeyPair(c))switch(console.log("currentKey",c,r),c){case"Cmd-C":case"Ctrl-C":n.DoCopy(function(){e.$emit("DoCopy")});break;case"Cmd-V":case"Ctrl-V":var o=a.SaveCurrentOperate();n.DoPaste(function(){e.$emit("ChangeCurrentPage",o)});break;case"Cmd-BackSpace":case"Ctrl-BackSpace":case"Cmd-Delete":case"Ctrl-Delete":console.log("删除");var o=a.SaveCurrentOperate();n.DoDelete(function(){e.$emit("ChangeCurrentPage",o)});break;case"Ctrl-Z":console.log("撤销");var o=a.SaveCurrentOperate();n.DoUndo(function(){e.$emit("ChangeCurrentPage",o)});break;case"Ctrl-Up":case"Ctrl-Down":case"Ctrl-Left":case"Ctrl-Right":case"Shift-Up":case"Shift-Down":case"Shift-Left":case"Shift-Right":var o=a.SaveCurrentOperate(),i=c.toLowerCase().split("-"),s=i[i.length-1];n.DoMove(s,1,function(){e.$emit("ChangeCurrentPage",o)}.bind(this))}}}e.$on("GlobalProjectReceived",function(){i(),o(),e.$emit("LoadUp")})}]);