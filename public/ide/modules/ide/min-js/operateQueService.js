ideServices.service("OperateQueService",["$timeout","ProjectService",function(e,t){var n=[],r=[],o=20,u={undoEnable:!1,redoEnable:!1};this.getOperateQueStatus=function(){return u={undoEnable:0!=n.length,redoEnable:0!=r.length}},this.pushNewOperate=function(e){n.length>=o&&n.shift(),n.push(e),r=[]},this.undo=function(o,u){if(!this.getOperateQueStatus().undoEnable)return console.warn("无效的撤销,请检查..."),void(u&&u());var a=n[n.length-1];e(function(){t.LoadCurrentOperate(a.undoOperate,function(){r.push(n.pop()),o&&o()},u)})},this.redo=function(o,u){this.getOperateQueStatus().redoEnable||(console.warn("无效的重做,请检查..."),u());var a=r[r.length-1];e(function(){t.LoadCurrentOperate(a.redoOperate,function(){n.push(r.pop()),o&&o()},u)})}}]);