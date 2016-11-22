ide.controller("StageCtrl",["$scope","$timeout","$interval","ProjectService","CanvasService","Preference","Type","KeydownService","OperateQueService",function(e,t,n,o,a,r,i,u,c){function s(){a.setOffCanvas(document.getElementById("offCanvas"))}function d(){e.component={out:{toolShow:!1},canvas:{node:null,currentWidth:0,currentHeight:0,holdOperate:null},subCanvas:{node:null,currentWidth:0,currentHeight:0,holdOperate:null},menuOptions:{contextMenu:null,allMenuItems:[]}},e.status={gesture:"release",holdOperate:null,editPage:!0},e.component.canvas.node=new fabric.Canvas("c"),e.component.subCanvas.node=new fabric.Canvas("c1",{renderOnAddRemove:!1});var t=e.component.canvas.node;a.setPageNode(t);var n=e.component.subCanvas.node;a.setSubLayerNode(n)}function g(){o.getProjectTo(e),e.component.menuOptions.allMenuItems=[["上移一层",function(){j(0)}],null,["下移一层",function(){j(1)}]],e.component.menuOptions.contextMenu=f,e.component.canvas.node.on({"object:selected":h,"object:moving":m,"object:scaling":p,"object:rotating":m,"mouse:down":C,"mouse:up":S,"selection:cleared":v}),e.component.subCanvas.node.on({"object:selected":y,"object:moving":M,"object:scaling":M,"object:rotating":M,"mouse:down":I,"mouse:up":T,"selection:cleared":b}),e.$on("CurrentPageChanged",function(e,t,n){l(t,n)}),e.$on("CanvasScaleChanged",function(e,t){F(t)}),e.$on("CurrentSubLayerChanged",function(e,t,n){l(t,n)}),e.$on("ToolShowChanged",function(t,n){e.component.out.toolShow=n}),e.$on("PageChangedSwitched",function(e,t,n){l(t,n)}),e.$on("NewPageAdded",function(e,t,n){l(t,n)}),e.$on("OperateQueChanged",function(e,t,n){l(t,n)}),e.$on("SubLayerEntered",function(e){toastr.info("显示子图层"),l()})}function l(t,n){var a;if(o.isEditingPage()?(a=e.component.canvas.node,e.status.editPage=!0):(a=e.component.subCanvas.node,e.status.editPage=!1),t){var r=o.SaveCurrentOperate(),i={undoOperate:t,redoOperate:r};c.pushNewOperate(i)}o.setRendering(!1),n&&n()}function f(){var t=o.getCurrentSelectObject();return t.type==i.MyLayer||i.isWidget(t.type)?e.component.menuOptions.allMenuItems:[]}function v(t){if(!u.isCtrlPressed()){o.layerClickPop=0;var n=-1;return _.forEach(e.project.pages,function(e,t){e.id==o.getCurrentPage().id&&(n=t)}),n<0?void console.warn("找不到Page"):void o.OnPageClicked(n,function(){e.$emit("ChangeCurrentPage")})}}function b(){if(!u.isCtrlPressed()){var t=o.getCurrentPage();_.forEach(t.layers,function(t,n){t.current&&_.forEach(t.subLayers,function(t,a){t.current&&o.OnSubLayerClicked(n,a,function(){e.$emit("ChangeCurrentSubLayer")})})})}}function m(){"release"==e.status.gesture&&(e.status.gesture="moving",r.THUMB_REAL_TIME>0&&($=n(function(){o.UpdateCurrentThumb()},r.THUMB_REAL_TIME)),o.HoldObject(e.status))}function p(){"release"==e.status.gesture&&(e.status.gesture="moving",r.THUMB_REAL_TIME>0&&($=n(function(){o.UpdateCurrentThumb()},r.THUMB_REAL_TIME)),o.ScaleLayer(e.status))}function C(e){E.x=e.e.x,E.y=e.e.y,void 0==e.e.y&&void 0==e.e.x&&(E.x=e.e.layerX,E.y=e.e.layerY)}function h(t){if(W)return void console.log("双击中");var n=t.target;o.OnLayerClicked(n,function(){if(!u.isCtrlPressed()){var t=o.getCurrentSelectObject();if(t.type==i.MyLayer){var n=o.getFabricObject(t.level.id);o.currentFabLayerIdList=[],o.currentFabLayerIdList.push(n.id)}else if(t.type==i.MyGroup){var a=t.target;o.currentFabLayerIdList=[],_.forEach(a.getObjects(),function(e){o.currentFabLayerIdList.push(e.id)})}}e.$emit("ChangeCurrentPage")})}function y(t){var n=t.target;o.OnWidgetClicked(n,function(){if(!u.isCtrlPressed()){var t=o.getCurrentSelectObject();if(i.isWidget(t.type)){var n=o.getFabricObject(t.level.id,!0);o.currentFabWidgetIdList=[],o.currentFabWidgetIdList.push(n.id)}else if(t.type==i.MyGroup){var a=t.target;o.currentFabWidgetIdList=[],_.forEach(a.getObjects(),function(e){o.currentFabWidgetIdList.push(e.id)})}}e.$emit("ChangeCurrentSubLayer")})}function L(t){if(!t)return void o.OnLayerMultiSelected(function(){e.$emit("ChangeCurrentPage"),o.UpdateCurrentThumb()});for(var n=!1,r=0;r<o.currentFabLayerIdList.length;r++)if(o.currentFabLayerIdList[r]==t.id){var i=a.getPageNode();i.renderAll(),o.currentFabLayerIdList.splice(r,1),i.renderAll(),toastr.info("多选去除"),n=!0}n&&0!=o.currentFabLayerIdList.length||(o.currentFabLayerIdList.push(t.id),toastr.info("多选添加")),o.OnLayerMultiSelected(function(){e.$emit("ChangeCurrentPage"),o.UpdateCurrentThumb()})}function O(t){W=!0,o.OnLayerDoubleClicked(t.id,function(){W=!1,e.$emit("ChangeCurrentPage"),o.UpdateCurrentThumb()})}function P(t){if(!t)return void o.OnWidgetMultiSelected(function(){e.$emit("ChangeCurrentPage")});for(var n=!1,a=0;a<o.currentFabWidgetIdList.length;a++)o.currentFabWidgetIdList[a]==t.id&&(o.currentFabWidgetIdList.splice(a,1),toastr.info("多选去除"),n=!0);n&&o.currentFabWidgetIdList!=[]||(o.currentFabWidgetIdList.push(t.id),toastr.info("多选添加")),o.OnWidgetMultiSelected(function(){e.$emit("ChangeCurrentPage")})}function I(e){E.x=e.e.x,E.y=e.e.y,void 0==e.e.y&&void 0==e.e.x&&(E.x=e.e.layerX,E.y=e.e.layerY)}function M(){"release"==e.status.gesture&&(e.status.gesture="moving",r.THUMB_REAL_TIME>0&&($=n(function(){o.updateCurrentThumbInPage()},r.THUMB_REAL_TIME)),o.HoldObject(e.status))}function S(t){function a(){var n=null,o=null,a=null;if(t.e.x&&t.e.y?(o=t.e.x,a=t.e.y):t.e.layerX&&t.e.layerY&&(o=t.e.layerX,a=t.e.layerY),Math.abs(o-E.x)<=2&&Math.abs(a-E.y)<=2){var i=new fabric.Point(t.e.offsetX/e.component.canvas.node.getZoom(),t.e.offsetY/e.component.canvas.node.getZoom()),c=e.component.canvas.node.getActiveGroup(),s=null,d=null;c&&c.containsPoint(i)?(s=t.e.offsetX/e.component.canvas.node.getZoom()-(c.left+c.width/2),d=t.e.offsetY/e.component.canvas.node.getZoom()-(c.top+c.height/2)):(s=t.e.offsetX/e.component.canvas.node.getZoom(),d=t.e.offsetY/e.component.canvas.node.getZoom()),_.forEach(e.component.canvas.node.getObjects(),function(e){s<=e.getWidth()+e.left&&d<=e.getHeight()+e.top&&s>=e.left&&d>=e.top&&(n=e)}),u.isCtrlPressed()?L(n):r&&n&&O(n)}else console.log("偏移")}if(W)return void console.log("双击中");var r=!1;if(w){var i=new Date;i.getTime()-w.getTime()<300&&(console.log("双击"),r=!0),w=new Date}else w=new Date;var c=o.getCurrentLayer();if(c){var s=o.getFabricObject(c.id);s&&o.SyncLevelFromFab(c,s)}"release"!=e.status.gesture?(angular.isDefined($)&&(n.cancel($),$=void 0),o.ReleaseObject(e.status,function(){e.$emit("ChangeCurrentPage",e.status.holdOperate),e.status.gesture="release",a(),o.UpdateCurrentThumb()})):a()}function T(t){function a(){var n=null;if(Math.abs(t.e.x-x.x)<=2&&Math.abs(t.e.y-x.y)<=2){var o=new fabric.Point(t.e.offsetX/e.component.subCanvas.node.getZoom(),t.e.offsetY/e.component.subCanvas.node.getZoom()),a=e.component.subCanvas.node.getActiveGroup(),r=null,i=null;a&&a.containsPoint(o)?(r=t.e.offsetX/e.component.subCanvas.node.getZoom()-(a.left+a.width/2),i=t.e.offsetY/e.component.subCanvas.node.getZoom()-(a.top+a.height/2)):(r=t.e.offsetX/e.component.subCanvas.node.getZoom(),i=t.e.offsetY/e.component.subCanvas.node.getZoom()),_.forEach(e.component.subCanvas.node.getObjects(),function(e){r<=e.getWidth()+e.getLeft()&&i<=e.getHeight()+e.getTop()&&r>=e.getLeft()&&i>=e.getTop()&&(n=e)}),u.isCtrlPressed()&&P(n)}}var r=o.getCurrentWidget();if(r){var i=o.getFabricObject(r.id,!0);i&&o.SyncLevelFromFab(r,i)}"release"!=e.status.gesture?(angular.isDefined($)&&(n.cancel($),$=void 0),o.ReleaseObject(e.status,function(){e.$emit("ChangeCurrentPage",e.status.holdOperate),e.status.gesture="release",o.updateCurrentThumbInPage(),a()})):a()}function j(t){var n={index:t},a=o.SaveCurrentOperate();o.ChangeAttributeZIndex(n,function(){e.$emit("ChangeCurrentPage",a),o.updateCurrentThumbInPage()})}function F(e){o.ScaleCanvas(e)}d(),s(),e.$on("GlobalProjectReceived",function(){g(),e.$emit("LoadUp")});var $,E={},w=new Date,W=!1,x={}}]);