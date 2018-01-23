ide.controller("StageCtrl",["$scope","$timeout","$interval","ProjectService","CanvasService","Preference","Type","KeydownService","OperateQueService",function(e,t,n,o,a,r,i,u,s){function c(){o.getProjectTo(e),e.component.menuOptions.allMenuItems=[["上移一层",function(){S(0)}],null,["下移一层",function(){S(1)}],null,["移至顶层",function(){S("front")}],null,["移至底层",function(){S("back")}]],e.component.menuOptions.contextMenu=l,e.component.canvas.node.on({"object:selected":p,"object:moving":v,"object:scaling":b,"object:rotating":v,"mouse:down":m,"mouse:up":I,"selection:cleared":g}),e.component.subCanvas.node.on({"object:selected":C,"object:moving":O,"object:scaling":O,"object:rotating":O,"mouse:down":P,"mouse:up":M,"selection:cleared":f}),e.$on("CurrentPageChanged",function(e,t,n){d(t,n)}),e.$on("CanvasScaleChanged",function(e,t){T(t)}),e.$on("CurrentSubLayerChanged",function(e,t,n){d(t,n)}),e.$on("ToolShowChanged",function(t,n){e.component.out.toolShow=n}),e.$on("PageChangedSwitched",function(e,t,n){d(t,n)}),e.$on("NewPageAdded",function(e,t,n){d(t,n)}),e.$on("OperateQueChanged",function(e,t,n){d(t,n)}),e.$on("SubLayerEntered",function(e){toastr.info("显示子图层"),d()})}function d(t,n){if(o.isEditingPage()?(e.component.canvas.node,e.status.editPage=!0):(e.component.subCanvas.node,e.status.editPage=!1),t){var a=o.SaveCurrentOperate(),r={undoOperate:t,redoOperate:a};s.pushNewOperate(r)}o.setRendering(!1),n&&n()}function l(){var t=o.getCurrentSelectObject();return t.type==i.MyLayer||i.isWidget(t.type)?e.component.menuOptions.allMenuItems:[]}function g(t){if(!u.isCtrlPressed()){o.layerClickPop=0;var n=-1;if(_.forEach(e.project.pages,function(e,t){e.id==o.getCurrentPage().id&&(n=t)}),n<0)return void console.warn("找不到Page");o.OnPageClicked(n,function(){e.$emit("ChangeCurrentPage")})}}function f(){if(!u.isCtrlPressed()){var t=o.getCurrentPage();_.forEach(t.layers,function(t,n){t.current&&_.forEach(t.subLayers,function(t,a){t.current&&o.OnSubLayerClicked(n,a,function(){e.$emit("ChangeCurrentSubLayer")})})})}}function v(t){"release"==e.status.gesture&&(e.status.gesture="moving",r.THUMB_REAL_TIME>0&&(j=n(function(){o.UpdateCurrentThumb()},r.THUMB_REAL_TIME)),o.HoldObject(e.status))}function b(){"release"==e.status.gesture&&(e.status.gesture="moving",r.THUMB_REAL_TIME>0&&(j=n(function(){o.UpdateCurrentThumb()},r.THUMB_REAL_TIME)),o.ScaleLayer(e.status))}function m(e){F.x=e.e.x,F.y=e.e.y,void 0==e.e.y&&void 0==e.e.x&&(F.x=e.e.layerX,F.y=e.e.layerY)}function p(t){if(E)return void console.log("双击中");var n=t.target;o.OnLayerClicked(n,function(){if(!u.isCtrlPressed()){var t=o.getCurrentSelectObject();if(t.type==i.MyLayer){var n=o.getFabricObject(t.level.id);o.currentFabLayerIdList=[],o.currentFabLayerIdList.push(n.id)}else if(t.type==i.MyGroup){var a=t.target;o.currentFabLayerIdList=[],_.forEach(a.getObjects(),function(e){o.currentFabLayerIdList.push(e.id)})}}e.$emit("ChangeCurrentPage")})}function C(t){var n=t.target;o.getLayerInfo?o.setAbsolutePosition(n):o.getLayerInfo=!0,o.OnWidgetClicked(n,function(){if(!u.isCtrlPressed()){var t=o.getCurrentSelectObject();if(i.isWidget(t.type)){var n=o.getFabricObject(t.level.id,!0);o.currentFabWidgetIdList=[],o.currentFabWidgetIdList.push(n.id)}else if(t.type==i.MyGroup){var a=t.target;o.currentFabWidgetIdList=[],_.forEach(a.getObjects(),function(e){o.currentFabWidgetIdList.push(e.id)})}}e.$emit("ChangeCurrentSubLayer")})}function h(t){if(!t)return void o.OnLayerMultiSelected(function(){e.$emit("ChangeCurrentPage"),o.UpdateCurrentThumb()});for(var n=!1,r=0;r<o.currentFabLayerIdList.length;r++)if(o.currentFabLayerIdList[r]==t.id){var i=a.getPageNode();i.renderAll(),o.currentFabLayerIdList.splice(r,1),i.renderAll(),toastr.info("多选去除"),n=!0}n&&0!=o.currentFabLayerIdList.length||(o.currentFabLayerIdList.push(t.id),toastr.info("多选添加")),o.OnLayerMultiSelected(function(){e.$emit("ChangeCurrentPage"),o.UpdateCurrentThumb()})}function y(n){E=!0,o.OnLayerDoubleClicked(n.id,function(){t(function(){E=!1},0),e.$emit("ChangeCurrentPage"),o.UpdateCurrentThumb()})}function L(t){if(!t)return void o.OnWidgetMultiSelected(function(){e.$emit("ChangeCurrentPage")});for(var n=!1,a=0;a<o.currentFabWidgetIdList.length;a++)o.currentFabWidgetIdList[a]==t.id&&(o.currentFabWidgetIdList.splice(a,1),toastr.info("多选去除"),n=!0);n&&o.currentFabWidgetIdList!=[]||(o.currentFabWidgetIdList.push(t.id),toastr.info("多选添加")),o.OnWidgetMultiSelected(function(){e.$emit("ChangeCurrentPage")})}function P(e){F.x=e.e.x,F.y=e.e.y,void 0==e.e.y&&void 0==e.e.x&&(F.x=e.e.layerX,F.y=e.e.layerY)}function O(){"release"==e.status.gesture&&(e.status.gesture="moving",r.THUMB_REAL_TIME>0&&(j=n(function(){o.updateCurrentThumbInPage()},r.THUMB_REAL_TIME)),o.HoldObject(e.status))}function I(t){function a(){var n=null,o=null,a=null;if(t.e.x&&t.e.y?(o=t.e.x,a=t.e.y):t.e.layerX&&t.e.layerY&&(o=t.e.layerX,a=t.e.layerY),Math.abs(o-F.x)<=2&&Math.abs(a-F.y)<=2){var i=new fabric.Point(t.e.offsetX/e.component.canvas.node.getZoom(),t.e.offsetY/e.component.canvas.node.getZoom()),s=e.component.canvas.node.getActiveGroup(),c=null,d=null;s&&s.containsPoint(i)?(c=t.e.offsetX/e.component.canvas.node.getZoom()-(s.left+s.width/2),d=t.e.offsetY/e.component.canvas.node.getZoom()-(s.top+s.height/2)):(c=t.e.offsetX/e.component.canvas.node.getZoom(),d=t.e.offsetY/e.component.canvas.node.getZoom()),_.forEach(e.component.canvas.node.getObjects(),function(e){c<=e.getWidth()+e.left&&d<=e.getHeight()+e.top&&c>=e.left&&d>=e.top&&(n=e)}),u.isCtrlPressed()?h(n):r&&n&&y(n)}else console.log("偏移")}if(E)return void console.log("双击layer中");var r=!1;if($){(new Date).getTime()-$.getTime()<300&&(console.log("双击"),r=!0),$=new Date}else $=new Date;var i=o.getCurrentLayer();if(i){var s=o.getFabricObject(i.id);s&&o.SyncLevelFromFab(i,s)}"release"!=e.status.gesture?(angular.isDefined(j)&&(n.cancel(j),j=void 0),o.ReleaseObject(e.status,function(){e.$emit("ChangeCurrentPage",e.status.holdOperate),e.status.gesture="release",a(),o.UpdateCurrentThumb()})):a()}function M(t){function a(){var n=null;if(Math.abs(t.e.x-w.x)<=2&&Math.abs(t.e.y-w.y)<=2){var o=new fabric.Point(t.e.offsetX/e.component.subCanvas.node.getZoom(),t.e.offsetY/e.component.subCanvas.node.getZoom()),a=e.component.subCanvas.node.getActiveGroup(),r=null,i=null;a&&a.containsPoint(o)?(r=t.e.offsetX/e.component.subCanvas.node.getZoom()-(a.left+a.width/2),i=t.e.offsetY/e.component.subCanvas.node.getZoom()-(a.top+a.height/2)):(r=t.e.offsetX/e.component.subCanvas.node.getZoom(),i=t.e.offsetY/e.component.subCanvas.node.getZoom()),_.forEach(e.component.subCanvas.node.getObjects(),function(e){r<=e.getWidth()+e.getLeft()&&i<=e.getHeight()+e.getTop()&&r>=e.getLeft()&&i>=e.getTop()&&(n=e)}),u.isCtrlPressed()&&L(n)}}var r=o.getCurrentWidget();if(o.setAbsolutePosition(t.target),r){var i=o.getFabricObject(r.id,!0);i&&o.SyncLevelFromFab(r,i)}"release"!=e.status.gesture?(angular.isDefined(j)&&(n.cancel(j),j=void 0),o.ReleaseObject(e.status,function(){e.$emit("ChangeCurrentPage",e.status.holdOperate),e.status.gesture="release",o.updateCurrentThumbInPage(),a()})):a()}function S(t){var n={index:t},a=o.SaveCurrentOperate();o.ChangeAttributeZIndex(n,function(){e.$emit("ChangeCurrentPage",a),o.updateCurrentThumbInPage()})}function T(e){o.ScaleCanvas(e)}!function(){e.component={out:{toolShow:!1},canvas:{node:null,currentWidth:0,currentHeight:0,holdOperate:null},subCanvas:{node:null,currentWidth:0,currentHeight:0,holdOperate:null},menuOptions:{contextMenu:null,allMenuItems:[]}},e.status={gesture:"release",holdOperate:null,editPage:!0},e.component.canvas.node=new fabric.Canvas("c"),e.component.subCanvas.node=new fabric.Canvas("c1",{renderOnAddRemove:!1});var t=e.component.canvas.node;a.setPageNode(t);var n=e.component.subCanvas.node;a.setSubLayerNode(n)}(),function(){a.setOffCanvas(document.getElementById("offCanvas"))}(),e.$on("GlobalProjectReceived",function(){c(),e.$emit("LoadUp")});var j,F={},$=new Date,E=!1,w={}}]);