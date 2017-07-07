ide.controller("AttributeCtrl",["$scope","$timeout","ProjectService","Type","Preference","ResourceService","characterSetService","CanvasService","AnimationService","UserTypeService",function(e,n,o,t,i,r,l,a,c,m){function u(){e.component={type:"",onAttributeChanged:v,transitionMode:[{name:"NO_TRANSITION",show:"无动画"},{name:"MOVE_LR",show:"从左进入"},{name:"MOVE_RL",show:"从右进入"},{name:"SCALE",show:"缩放"}],transitionName:null,page:{enterImage:B,selectImage:"demo20.png"},layer:{enterShowSubLayer:x,selectModel:null},subLayer:{enterImage:B,selectImage:"blank.png"},slide:{addSubSlide:s},button:{buttonModeId:"0",buttonModes:[{id:"0",name:"普通模式"},{id:"1",name:"开关模式"}],highlightModeId:"0",enterButtonMode:oe,enterArrange:G},buttonGroup:{enterInterval:$,enterButtonCount:N,enterArrange:G,highlightModeId:"0"},progress:{progressModeId:"0",enableAnimationModeId:"0",progressModes:[{id:"0",name:"普通进度条"},{id:"1",name:"变色进度条"},{id:"3",name:"多色进度条"}],thresholdModeId:"1",thresholdModes:[{id:"1",name:"两段色"},{id:"2",name:"三段色"}],enterProgressValue:D,enterArrange:G,enterCursor:F,enterThresholdMode:z,enterThresholdValue1:L,enterThresholdValue2:R},dashboard:{dashboardModeId:"0",clockwise:"1",dashboardModes:[{id:"0",name:"简单模式"},{id:"1",name:"复杂模式"},{id:"2",name:"精简模式"}],dashboardClockwise:[{wise:"1",name:"顺时针"},{wise:"0",name:"逆时针"}],enableAnimationModeId:"0",enterDashboardMode:E,enterDashboardClockwise:X,enterDashboardValue:U,enterDashboardOffsetValue:H,enterPointerLength:W,enterMinCoverAngle:Z,enterMaxCoverAngle:Y},textArea:{enterText:te,selectCharacterSetByIndex:ie,selectCharacterSetByName:re,addCharacterSet:le,deleteCharacterSetByIndex:ae,enterArrange:G},num:{numModeId:"0",enableAnimationModeId:"0",numModes:[{id:"0",name:"普通模式"},{id:"1",name:"动画模式"}],symbolMode:"0",symbolModes:[{id:"0",name:"无符号模式"},{id:"1",name:"有符号模式"}],frontZeroMode:"0",frontZeroModes:[{id:"0",name:"无前导0模式"},{id:"1",name:"有前导0模式"}],overFlowStyle:"0",overFlowStyles:[{id:"0",name:"溢出不显示"},{id:"1",name:"溢出显示"}],changeNumOfDigits:ce,changeDecimalCount:me,enterNumMode:ue,enterSymbolMode:fe,enterFrontZeroMode:ge,enterOverFlowStyle:ve,enterNumValue:de,changeNumAlign:pe,enterArrange:G},knob:{backgroundImage:"blank.png",knobImg:"blank.png",enterKnobSize:be,enterKnobValue:se},oscilloscope:{changeOscSpacing:he,changeOscGrid:ye,changeOscLinWidth:Ce,changeOscGridInitValue:je,changeOscGridUnitX:Me,changeOscGridUnitY:Ae},switchWidget:{enterBindBit:Ie},rotateImg:{enterInitValue:Se},dateTime:{dateTimeModes:[{id:"0",name:"时分秒模式"},{id:"1",name:"时分模式"},{id:"2",name:"斜杠日期"},{id:"3",name:"减号日期"}],RTCModes:[{id:"0",name:"使用内部时钟"},{id:"1",name:"使用外部时钟"}],highlightModeId:"0",enterDateTimeMode:we,enterArrange:G},slideBlock:{enterInitValue:Se,enterArrange:G},video:{source:[{id:"CVBS",name:"CVBS"},{id:"HDMI",name:"HDMI"}],scale:[{id:"0",name:"非原比例"},{id:"1",name:"原比例"}],changeVideoSource:Oe,changeVideoScale:Te},group:{align:[{id:"top",name:"上对齐"},{id:"bottom",name:"下对齐"},{id:"left",name:"左对齐"},{id:"right",name:"右对齐"}],alignModeId:null,changeGroupAlign:Ve},highlightModes:[{id:"0",name:"启用高亮"},{id:"1",name:"禁用高亮"}],enableAnimationModes:[{id:"0",name:"启用动画"},{id:"1",name:"关闭动画"}],enterName:h,enterColor:y,enterFontText:I,enterFontSize:S,enterFontFamily:w,enterFontBold:V,enterFontItalic:k,enterX:C,enterY:j,enterWidth:M,enterHeight:A,enterImage:B,enterMinValue:J,enterMaxValue:K,enterMinAngle:Q,enterMaxAngle:q,enterMinAlert:ee,enterMaxAlert:ne,restore:d,changeTransitionName:p,changeTransitionDur:b,enterHighlightMode:T,enterEnableAnimationMode:P},e.animationsDisabled=m.getAnimationAuthor()}function f(){o.getProjectTo(e),e.maxWidth=e.project.initSize.width||1280,e.maxHeight=e.project.initSize.height||1080,e.defaultTransition=c.getDefaultTransition(),v(),g(),e.$on("ResourceChanged",function(){g()}),e.$on("AttributeChanged",function(e){v()}),e.$on("colorpicker-submit",function(e,n){y(n)}),e.$on("colorpicker-closed",function(e,n){d()}),e.$on("changeFontFamily",function(e,n){enterFontStyle(n)})}function g(){var o={id:"blank.png",src:"/public/images/blank.png",name:"空白"};n(function(){e.component.images=r.getAllImages(),e.component.images.unshift(o)})}function v(){var r=o.getCurrentSelectObject();n(function(){switch(e.component.object=_.cloneDeep(r),Pe=_.cloneDeep(r),e.component.object.type){case t.MyLayer:e.component.layer.selectModel=e.component.object.level.showSubLayer.id,"object"!=typeof e.component.object.level.transition&&(o.AddAttributeTransition(_.cloneDeep(e.defaultTransition)),e.component.object.level.transition=_.cloneDeep(e.defaultTransition)),e.component.transitionName=e.component.object.level.transition.name;break;case t.MyPage:""===e.component.object.level.backgroundImage?e.component.page.selectImage="blank.png":e.component.page.selectImage=e.component.object.level.backgroundImage,"object"!=typeof e.component.object.level.transition&&(o.AddAttributeTransition(_.cloneDeep(e.defaultTransition)),e.component.object.level.transition=_.cloneDeep(e.defaultTransition)),e.component.transitionName=e.component.object.level.transition.name;break;case t.MyGroup:var n=i.GROUP_CONTROL_VISIBLE;r.target.setControlsVisibility(n),e.component.group.alignModeId=null;break;case t.MyProgress:e.component.progress.arrangeModel=e.component.object.level.info.arrange,e.component.progress.cursor=e.component.object.level.info.cursor,e.component.progress.progressModeId=e.component.object.level.info.progressModeId,e.component.object.level.info.thresholdModeId?e.component.progress.thresholdModeId=e.component.object.level.info.thresholdModeId:(r.level.info.thresholdModeId="1",r.level.info.threshold1=null,r.level.info.threshold2=null,e.component.progress.thresholdModeId="1"),void 0===e.component.object.level.info.enableAnimation?(r.level.info.enableAnimation=!1,e.component.progress.enableAnimationModeId="1"):!1===e.component.object.level.info.enableAnimation?e.component.progress.enableAnimationModeId="1":!0===e.component.object.level.info.enableAnimation&&(e.component.progress.enableAnimationModeId="0");break;case t.MyDashboard:e.component.dashboard.dashboardModeId=e.component.object.level.dashboardModeId,e.component.dashboard.clockwise=e.component.object.level.info.clockwise,e.component.object.level.info.minCoverAngle||e.component.object.level.info.maxCoverAngle||(e.component.object.level.info.minCoverAngle=0,e.component.object.level.info.maxCoverAngle=0,r.level.info.minCoverAngle=0,r.level.info.maxCoverAngle=0),void 0===e.component.object.level.info.enableAnimation?(r.level.info.enableAnimation=!1,e.component.dashboard.enableAnimationModeId="1"):!1===e.component.object.level.info.enableAnimation?e.component.dashboard.enableAnimationModeId="1":!0===e.component.object.level.info.enableAnimation&&(e.component.dashboard.enableAnimationModeId="0");break;case t.MyTextArea:e.component.textArea.arrangeModel=e.component.object.level.info.arrange;break;case t.MyButton:e.component.button.buttonModeId=e.component.object.level.buttonModeId,e.component.button.arrangeModel=e.component.object.level.info.arrange,void 0===e.component.object.level.info.disableHighlight?(r.level.info.disableHighlight=!1,e.component.button.highlightModeId="0"):!1===e.component.object.level.info.disableHighlight?e.component.button.highlightModeId="0":!0===e.component.object.level.info.disableHighlight&&(e.component.button.highlightModeId="1");break;case t.MyButtonGroup:e.component.buttonGroup.arrangeModel=e.component.object.level.info.arrange,void 0===e.component.object.level.info.disableHighlight?(r.level.info.disableHighlight=!1,e.component.buttonGroup.highlightModeId="0"):!1===e.component.object.level.info.disableHighlight?e.component.buttonGroup.highlightModeId="0":!0===e.component.object.level.info.disableHighlight&&(e.component.buttonGroup.highlightModeId="1");break;case t.MyNum:e.component.num.numModeId=e.component.object.level.info.numModeId,e.component.num.symbolMode=e.component.object.level.info.symbolMode,e.component.num.frontZeroMode=e.component.object.level.info.frontZeroMode,e.component.num.overFlowStyle=e.component.object.level.info.overFlowStyle,e.component.num.arrangeModel=e.component.object.level.info.arrange,"object"!=typeof e.component.object.level.transition&&(o.AddAttributeTransition(_.cloneDeep(e.defaultTransition)),e.component.object.level.transition=_.cloneDeep(e.defaultTransition)),e.component.transitionName=e.component.object.level.transition.name,void 0===e.component.object.level.info.enableAnimation?(r.level.info.enableAnimation=!1,e.component.num.enableAnimationModeId="1"):0==e.component.object.level.info.enableAnimation?e.component.num.enableAnimationModeId="1":1==e.component.object.level.info.enableAnimation&&(e.component.num.enableAnimationModeId="0");break;case t.MyDateTime:e.component.dateTime.arrangeModel=e.component.object.level.info.arrange,e.component.dateTime.dateTimeModeId=e.component.object.level.info.dateTimeModeId,e.component.dateTime.RTCModeId=e.component.object.level.info.RTCModeId,void 0==e.component.object.level.info.disableHighlight?(r.level.info.disableHighlight=!1,e.component.dateTime.highlightModeId="0"):0==e.component.object.level.info.disableHighlight?e.component.dateTime.highlightModeId="0":1==e.component.object.level.info.disableHighlight&&(e.component.dateTime.highlightModeId="1");break;case t.MySlideBlock:e.component.slideBlock.arrangeModel=e.component.object.level.info.arrange;break;case t.MyVideo:e.component.video.sourceId=e.component.object.level.info.source;break;case t.MySlide:void 0===r.level.info.fontFamily&&(r.level.info.fontFamily="宋体",r.level.info.fontSize=20,r.level.info.fontColor="rgba(0,0,0,1)",r.level.info.fontBold="100",r.level.info.fontItalic="")}})}function d(){n(function(){e.component.object=_.cloneDeep(Pe)})}function p(){for(var n={name:e.component.transitionName},t=0;t<e.component.transitionMode.length;t++)if(e.component.transitionMode[t].name==e.component.transitionName){n.show=e.component.transitionMode[t].show;break}o.ChangeAttributeTransition(n)}function b(n){if(13==n.keyCode){if(e.component.object.level.transition.duration>5e3||e.component.object.level.transition.duration<0)return toastr.warning("超出限制"),void d();if(!_.isInteger(e.component.object.level.transition.duration))return toastr.warning("输入不合法"),void d();if(e.component.object.level.transition.duration==Pe.level.transition.duration)return;var t={duration:e.component.object.level.transition.duration};toastr.info("修改成功");o.SaveCurrentOperate();o.ChangeAttributeTransition(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function s(){}function h(n){if(13==n.keyCode){if(e.component.object.level.name.length>i.OBJECT_MAX_LENGTH)return toastr.warning("名称超长"),void d();if(0==e.component.object.level.name.length)return toastr.warning("名称不能为空"),void d();if(e.component.object.level.name==Pe.level.name)return;toastr.info("修改成功");var t={name:e.component.object.level.name};o.ChangeAttributeName(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function C(n){if(13==n.keyCode){var t=Number(e.component.object.level.info.left);if(!_.isInteger(t))return toastr.warning("输入不合法"),void d();if(t<-2e3||t>2e3)return toastr.warning("超出画布范围"),void d();if(t==Pe.level.info.left)return void toastr.warning("未改变值"+e.component.object.level.info.left);var i={left:t};o.ChangeAttributePosition(i,function(n){e.$emit("ChangeCurrentPage",n)})}}function j(n){if(13==n.keyCode){var t=Number(e.component.object.level.info.top);if(!_.isInteger(t))return toastr.warning("输入不合法"),void d();if(t<-2e3||t>2e3)return toastr.warning("超出范围"),void d();if(t==Pe.level.info.top)return;var i={top:t};o.ChangeAttributePosition(i,function(n){e.$emit("ChangeCurrentPage",n)})}}function M(n){if(13==n.keyCode){var t=Number(e.component.object.level.info.width);if(!_.isInteger(t))return toastr.warning("输入不合法"),void d();if(t<1||t>2e3)return toastr.warning("超出范围"),void d();if(t==Pe.level.info.width)return void console.log("没有变化");var i={width:t};o.ChangeAttributeSize(i,function(n){e.$emit("ChangeCurrentPage",n)})}}function A(n){if(13==n.keyCode){var t=Number(e.component.object.level.info.height);if(!_.isInteger(t))return toastr.warning("输入不合法"),void d();if(t<1||t>2e3)return toastr.warning("超出范围"),void d();if(t==Pe.level.info.height)return void console.log("没有变化");var i={height:t};o.ChangeAttributeSize(i,function(n){e.$emit("ChangeCurrentPage",n)})}}function y(n){var t,i,r=null,l=null;for(t=n.value.slice(5,n.value.length-1),t=t.split(","),i=0;i<t.length;i++)if(parseInt(t[i])>255||!_.isInteger(Number(t[i])))return toastr.warning("格式错误"),void d();if("component.object.level.backgroundColor"==n.name){if(Pe.level.backgroundColor==n.value)return;r=o.SaveCurrentOperate(),l={color:n.value},o.ChangeAttributeBackgroundColor(l,function(){e.$emit("ChangeCurrentPage",r)})}if("component.object.level.info.fontColor"==n.name){if(Pe.level.info.fontColor==n.value)return;l={fontColor:n.value},O(l)}if("component.object.level.info.lineColor"==n.name){if(Pe.level.info.lineColor==n.value)return;l={lineColor:n.value},r=o.SaveCurrentOperate(),o.ChangeAttributeOscilloscope(l,function(n){e.$emit("ChangeCurrentPage",n)})}}function I(n){if(13==n.keyCode){var o=e.component.object.level.info.text;if(o==Pe.level.info.text)return;if(o.length>20)return toastr.warning("字数最大20"),void d();O({text:o})}}function S(n){if(13==n.keyCode){var o=e.component.object.level.info.fontSize;if(!_.isInteger(Number(o)))return toastr.warning("输入不合法"),void d();if(o<0||o>150)return toastr.warning("超出范围"),void d();if(o==Pe.level.info.fontSize)return;O({fontSize:o})}}function w(n){var o=e.component.object.level.info.fontFamily;if(o!=Pe.level.info.fontFamily){O({fontFamily:o})}}function V(n){var o=e.component.object.level.info.fontBold;"100"===o?o="bold":"bold"===o&&(o="100"),O({fontBold:o})}function k(n){var o=e.component.object.level.info.fontItalic;""===o?o="italic":"italic"===o&&(o=""),O({fontItalic:o})}function O(n){o.SaveCurrentOperate();switch(o.getCurrentSelectObject().type){case t.MyTextArea:o.ChangeAttributeTextContent(n,function(n){e.$emit("ChangeCurrentPage",n)});break;case t.MyDateTime:o.ChangeAttributeDateTimeText(n,function(n){e.$emit("ChangeCurrentPage",n)});break;case t.MyNum:o.ChangeAttributeNumContent(n,function(n){e.$emit("ChangeCurrentPage",n)});break;case t.MySwitch:case t.MySlide:case t.MyButton:o.ChangeAttributeFontStyle(n,function(n){e.$emit("ChangeCurrentPage",n)});break;default:console.error("not match in change font color!")}}function T(){var n=o.getCurrentSelectObject(),i=null;n.type==t.MyButton?i=e.component.button.highlightModeId:n.type==t.MyButtonGroup?i=e.component.buttonGroup.highlightModeId:n.type==t.MyDateTime&&(i=e.component.dateTime.highlightModeId);var r={highlightMode:i},l=o.SaveCurrentOperate();o.ChangeAttributeHighLightMode(r,function(){e.$emit("ChangeCurrentPage",l)})}function P(){var n,i=o.getCurrentSelectObject();i.type==t.MyDashboard?n=e.component.dashboard.enableAnimationModeId:i.type==t.MyProgress?n=e.component.progress.enableAnimationModeId:i.type==t.MyNum&&(n=e.component.num.enableAnimationModeId);var r={enableAnimationModeId:n};o.ChangeEnableAnimationMode(r,function(){e.$emit("ChangeCurrentPage")})}function x(n){var t=o.SaveCurrentOperate(),i=e.component.layer.selectModel,r=o.getCurrentLayer();_.forEach(r.subLayers,function(n,r){n.id==i&&o.changeCurrentSubLayerIndex(r,function(){e.$emit("ChangeCurrentPage",t)})})}function B(){var n="";if(e.component.object.type==t.MyPage){n=e.component.page.selectImage,e.component.object.level.backgroundColor="/public/images/blank.png"==n?"rgb(54,71,92)":"rgb(0,0,0)";var i=o.getCurrentPage(),r=a.getPageNode();r.setBackgroundColor(e.component.object.level.backgroundColor,function(){r.renderAll(),i.backgroundColor=e.component.object.level.backgroundColor,i.proJsonStr=r.toJSON()})}else{if(e.component.object.type!=t.MySubLayer)return;n=e.component.subLayer.selectImage,e.component.object.level.backgroundColor="/public/images/blank.png"==n?ke():"rgba(0,0,0,0)";var l=o.getCurrentSubLayer(),c=a.getSubLayerNode();c.setBackgroundColor(e.component.object.level.backgroundColor,function(){c.renderAll(),l.backgroundColor=e.component.object.level.backgroundColor,l.proJsonStr=c.toJSON()})}var m={image:_.cloneDeep(n)};o.ChangeAttributeBackgroundImage(m,function(n){e.$emit("ChangeCurrentPage",n)})}function $(n){if(13==n.keyCode){if(!_.isInteger(Number(e.component.object.level.info.interval))||parseInt(e.component.object.level.info.interval)<0)return toastr.warning("输入不合法"),void d();if((e.component.object.level.info.interval||0)*((e.component.object.level.info.count||0)-1)>(e.component.object.level.info.width||0))return toastr.warning("配置不合理"),void d();if(e.component.object.level.info.interval==Pe.level.info.interval)return;var t={interval:e.component.object.level.info.interval},i=o.SaveCurrentOperate();o.ChangeAttributeInterval(t,function(){e.$emit("ChangeCurrentPage",i)})}}function N(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.count))||parseInt(e.component.object.level.info.interval)<0)return toastr.warning("输入不合法"),void d();if((e.component.object.level.info.interval||0)*((e.component.object.level.info.count||0)-1)>(e.component.object.level.info.width||0))return toastr.warning("配置不合理"),void d();if(e.component.object.level.info.count==Pe.level.info.count)return;if(e.component.object.level.info.count<2)return toastr.warning("按钮数至少为2"),void d();if(e.component.object.level.info.count>15)return toastr.warning("按钮数至多为15"),void d();var t={count:parseInt(e.component.object.level.info.count)},i=o.SaveCurrentOperate();o.ChangeAttributeButtonCount(t,function(){e.$emit("ChangeCurrentPage",i)})}}function D(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.progressValue)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.progressValue==Pe.level.info.progressValue)return;if(e.component.object.level.info.progressValue<e.component.object.level.info.minValue||e.component.object.level.info.progressValue>e.component.object.level.info.maxValue)return toastr.warning("超出范围"),void d();var t={progressValue:e.component.object.level.info.progressValue};o.ChangeAttributeProgressValue(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function F(){var n=o.getCurrentSelectObject(),i=null,r=null,l=null;if(n.type==t.MyProgress){i=e.component.progress.cursor,r=e.component.progress.progressModeId,l=e.component.progress.thresholdModeId;var a=o.SaveCurrentOperate(),c={cursor:i,progressModeId:r,thresholdModeId:l};o.ChangeAttributeCursor(c,function(){e.$emit("ChangeCurrentPage",a)})}}function z(n){var t=e.component.progress.thresholdModeId;e.component.progress.threshold2=null;var i={thresholdModeId:t},r=o.SaveCurrentOperate();o.ChangeAttributeProgressThreshold(i,function(){e.$emit("ChangeCurrentPage",r)})}function L(n){if(13==n.keyCode){if(e.component.object.level.info.threshold1==Pe.level.info.threshold1)return;if(e.component.object.level.info.threshold1<e.component.object.level.info.minValue||e.component.object.level.info.threshold1>e.component.object.level.info.maxValue)return toastr.warning("超出范围"),void d();if(e.component.object.level.info.threshold2&&e.component.object.level.info.threshold1>e.component.object.level.info.threshold2)return toastr.warning("超出范围"),void d();var t={threshold1:e.component.object.level.info.threshold1},i=o.SaveCurrentOperate();o.ChangeAttributeProgressThreshold(t,function(){e.$emit("ChangeCurrentPage",i)})}}function R(n){if(13==n.keyCode){if(e.component.object.level.info.threshold2==Pe.level.info.threshold2)return;if(e.component.object.level.info.threshold2<e.component.object.level.info.minValue||e.component.object.level.info.threshold2>e.component.object.level.info.maxValue)return toastr.warning("超出范围"),void d();if(e.component.object.level.info.threshold1&&e.component.object.level.info.threshold2<e.component.object.level.info.threshold1)return toastr.warning("超出范围"),void d();var t={threshold2:e.component.object.level.info.threshold2},i=o.SaveCurrentOperate();o.ChangeAttributeProgressThreshold(t,function(){e.$emit("ChangeCurrentPage",i)})}}function G(){var n=o.getCurrentSelectObject(),i=null;if(n.type==t.MyProgress)i=e.component.progress.arrangeModel;else if(n.type==t.MyButtonGroup)i=e.component.buttonGroup.arrangeModel;else if(n.type==t.MySlideBlock)i=e.component.slideBlock.arrangeModel;else if(n.type==t.MyNum)i=e.component.num.arrangeModel;else if(n.type==t.MyTextArea)i=e.component.textArea.arrangeModel;else if(n.type==t.MyButton)i=e.component.button.arrangeModel;else{if(!(n.type=t.MyDateTime))return;i=e.component.dateTime.arrangeModel}var r=o.SaveCurrentOperate(),l={arrange:i};o.ChangeAttributeArrange(l,function(){e.$emit("ChangeCurrentPage",r)})}function H(n){if(13==n.keyCode){if(!_.isInteger(Number(e.component.object.level.info.offsetValue)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.offsetValue<-360||e.component.object.level.info.offsetValue>360)return toastr.warning("超出最小最大角度范围"),void d();if(e.component.object.level.info.offsetValue==Pe.level.info.offsetValue)return;var t={offsetValue:e.component.object.level.info.offsetValue},i=o.SaveCurrentOperate();o.ChangeAttributeDashboardOffsetValue(t,function(){e.$emit("ChangeCurrentPage",i)})}}function U(n){if(13==n.keyCode){if(!_.isNumber(e.component.object.level.info.value))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.value==Pe.level.info.value)return;if(e.component.object.level.info.value<e.component.object.level.info.minValue||e.component.object.level.info.value>e.component.object.level.info.maxValue)return toastr.warning("超出范围"),void d();var t={value:e.component.object.level.info.value},i=o.SaveCurrentOperate();o.ChangeAttributeDashboardValue(t,function(){e.$emit("ChangeCurrentPage",i)})}}function W(n){if(13==n.keyCode){var t=e.component.object.level.info.pointerLength,i=e.component.object.level.info.width,r=i/Math.SQRT2+10;if(!_.isInteger(Number(t)))return toastr.warning("输入不合法"),void d();if(t<0||t>r)return toastr.warning("指针长度超出范围"),void d();if(t==Pe.level.info.pointerLength)return;var l={pointerLength:t},a=o.SaveCurrentOperate();o.ChangeAttributeDashboardPointerLength(l,function(){e.$emit("ChangeCurrentPage",a)})}}function E(n){var i=o.getCurrentSelectObject(),r=null;if(i.type==t.MyDashboard){r=e.component.dashboard.dashboardModeId;var l=o.SaveCurrentOperate(),a={dashboardModeId:r};o.ChangeAttributeDashboardModeId(a,function(){e.$emit("ChangeCurrentPage",l)})}}function X(n){var i=o.getCurrentSelectObject(),r=null;if(i.type==t.MyDashboard){r=e.component.dashboard.clockwise;var l=o.SaveCurrentOperate(),a={clockwise:r};o.ChangeAttributeDashboardClockwise(a,function(){e.$emit("ChangeCurrentPage",l)})}}function Z(n){if(13==n.keyCode){if(!_.isInteger(e.component.object.level.info.minCoverAngle))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.minCoverAngle<-360||e.component.object.level.info.minCoverAngle>360||e.component.object.level.info.minCoverAngle>e.component.object.level.info.maxCoverAngle||e.component.object.level.info.maxCoverAngle-e.component.object.level.info.minCoverAngle>360)return toastr.warning("超出范围"),void d();var t={minCoverAngle:e.component.object.level.info.minCoverAngle},i=o.SaveCurrentOperate();o.ChangeAttributeDashboardCoverAngle(t,function(){e.$emit("ChangeCurrentPage",i)})}}function Y(n){if(13==n.keyCode){if(!_.isInteger(e.component.object.level.info.maxCoverAngle))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.maxCoverAngle<-360||e.component.object.level.info.maxCoverAngle>360||e.component.object.level.info.maxCoverAngle<e.component.object.level.info.minCoverAngle||e.component.object.level.info.maxCoverAngle-e.component.object.level.info.minCoverAngle>360)return toastr.warning("超出范围"),void d();var t={maxCoverAngle:e.component.object.level.info.maxCoverAngle},i=o.SaveCurrentOperate();o.ChangeAttributeDashboardCoverAngle(t,function(){e.$emit("ChangeCurrentPage",i)})}}function J(n){if(13==n.keyCode){if(!_.isInteger(e.component.object.level.info.minValue))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.minValue<1-Math.pow(10,9))return toastr.warning("小于最小临界值"),void d();if(e.component.object.level.info.minValue==Pe.level.info.minValue)return;if(e.component.object.level.info.maxValue<=e.component.object.level.info.minValue)return toastr.warning("不能比最大值大"),void d();if(e.component.object.level.type==t.MyProgress){if(e.component.object.level.info.minValue>e.component.object.level.info.progressValue)return toastr.warning("不能比当前值大"),void d()}else if(e.component.object.level.type==t.MyDashboard){if(e.component.object.level.info.minValue>e.component.object.level.info.value)return toastr.warning("不能比当前值大"),void d()}else if(e.component.object.level.type==t.Mynum){if(e.component.object.level.info.minValue>e.component.object.level.info.initValue)return toastr.warning("不能比当前值大"),void d()}else if(e.component.object.level.type==t.MySlideBlock){if(e.component.object.level.info.minValue>e.component.object.level.info.initValue)return toastr.warning("不能比初始值大"),void d()}else if(e.component.object.level.type==t.MyRotateImg&&e.component.object.level.info.minValue<0)return toastr.warning("不能小于0"),void d();var i={minValue:e.component.object.level.info.minValue},r=o.SaveCurrentOperate();o.ChangeAttributeValue(i,function(){e.$emit("ChangeCurrentPage",r)})}}function K(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.maxValue)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.maxValue>Math.pow(10,9)-1)return toastr.warning("超过最大临界值"),void d();if(e.component.object.level.info.maxValue==Pe.level.info.maxValue)return;if(e.component.object.level.info.maxValue<=e.component.object.level.info.minValue)return toastr.warning("不能比最小值小"),void d();if(e.component.object.level.type==t.MyProgress){if(e.component.object.level.info.maxValue<e.component.object.level.info.progressValue)return toastr.warning("不能比当前值小"),void d()}else if(e.component.object.level.type==t.Mynum){if(e.component.object.level.info.maxValue<e.component.object.level.info.initValue)return toastr.warning("不能比当前值小"),void d()}else if(e.component.object.level.type==t.MySlideBlock){if(e.component.object.level.info.maxValue<e.component.object.level.info.initValue)return toastr.warning("不能比初始值小"),void d()}else if(e.component.object.level.type==t.MyRotateImg&&e.component.object.level.info.maxValue>360)return toastr.warning("不能超过360"),void d();var i={maxValue:e.component.object.level.info.maxValue},r=o.SaveCurrentOperate();o.ChangeAttributeValue(i,function(){e.$emit("ChangeCurrentPage",r)})}}function Q(n){if(13==n.keyCode){if(!_.isInteger(Number(e.component.object.level.info.minAngle)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.minAngle<-360||e.component.object.level.info.minAngle>360)return toastr.warning("最小角度应在-360到360之间"),void d();if(e.component.object.level.info.minAngle==Pe.level.info.minAngle)return;var t={minAngle:e.component.object.level.info.minAngle},i=o.SaveCurrentOperate();o.ChangeAttributeValue(t,function(){e.$emit("ChangeCurrentPage",i)})}}function q(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.maxAngle)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.maxAngle>360||e.component.object.level.info.maxAngle<e.component.object.level.info.minAngle)return toastr.warning("最大角度不能大于360且不小于最小角"),void d();if(e.component.object.level.info.maxAngle==Pe.level.info.maxAngle)return;var t={maxAngle:e.component.object.level.info.maxAngle},i=o.SaveCurrentOperate();o.ChangeAttributeValue(t,function(){e.$emit("ChangeCurrentPage",i)})}}function ee(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.lowAlarmValue)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.lowAlarmValue<1-Math.pow(10,9))return toastr.warning("小于最小临界值"),void d();if(e.component.object.level.info.lowAlarmValue==Pe.level.info.lowAlarmValue)return;var t={lowAlarmValue:e.component.object.level.info.lowAlarmValue},i=o.SaveCurrentOperate();o.ChangeAttributeValue(t,function(){e.$emit("ChangeCurrentPage",i)})}}function ne(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.highAlarmValue)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.highAlarmValue>Math.pow(10,9)-1)return toastr.warning("大于最大临界值"),void d();if(e.component.object.level.info.highAlarmValue==Pe.level.info.highAlarmValue)return;var t={highAlarmValue:e.component.object.level.info.highAlarmValue},i=o.SaveCurrentOperate();o.ChangeAttributeValue(t,function(){e.$emit("ChangeCurrentPage",i)})}}function oe(n){var i=o.getCurrentSelectObject(),r=null;if(i.type==t.MyButton){r=e.component.button.buttonModeId;var l=o.SaveCurrentOperate(),a={buttonModeId:r};o.ChangeAttributeButtonModeId(a,function(){e.$emit("ChangeCurrentPage",l)})}}function te(n){if(13==n.keyCode){if(e.component.object.level.info.text==Pe.level.info.text)return;var t={text:e.component.object.level.info.text},i=o.SaveCurrentOperate();o.ChangeAttributeTextContent(t,function(){e.$emit("ChangeCurrentPage",i)})}}function ie(n){var t=l.selectCharacterByIndex(n);if(t){e.component.object.level.info.fontName=t.fontName,e.component.object.level.info.fontFamily=t.fontFamily,e.component.object.level.info.fontSize=t.fontSize,e.component.object.level.info.fontColor=t.fontColor,e.component.object.level.info.fontBold=t.fontBold,e.component.object.level.info.fontItalic=t.fontItalic,e.component.object.level.info.boldBtnToggle=t.boldBtnToggle,e.component.object.level.info.italicBtnToggle=t.italicBtnToggle;var i={text:e.component.object.level.info.text,fontName:e.component.object.level.info.fontName,fontFamily:e.component.object.level.info.fontFamily,fontSize:e.component.object.level.info.fontSize,fontColor:e.component.object.level.info.fontColor,fontBold:e.component.object.level.info.fontBold,fontItalic:e.component.object.level.info.fontItalic,boldBtnToggle:e.component.object.level.info.boldBtnToggle,italicBtnToggle:e.component.object.level.info.italicBtnToggle};o.ChangeAttributeTextContent(i,function(n){e.$emit("ChangeCurrentPage",n)})}}function re(n){if(o.getCurrentSelectObject().type==t.MyTextArea){var i=l.selectCharacterByName(n);if(i){e.component.object.level.info.fontName=i.fontName,e.component.object.level.info.fontFamily=i.fontFamily,e.component.object.level.info.fontSize=i.fontSize,e.component.object.level.info.fontColor=i.fontColor,e.component.object.level.info.fontBold=i.fontBold,e.component.object.level.info.fontItalic=i.fontItalic,e.component.object.level.info.boldBtnToggle=i.boldBtnToggle,e.component.object.level.info.italicBtnToggle=i.italicBtnToggle;var r={text:e.component.object.level.info.text,fontName:e.component.object.level.info.fontName,fontFamily:e.component.object.level.info.fontFamily,fontSize:e.component.object.level.info.fontSize,fontColor:e.component.object.level.info.fontColor,fontBold:e.component.object.level.info.fontBold,fontItalic:e.component.object.level.info.fontItalic,boldBtnToggle:e.component.object.level.info.boldBtnToggle,italicBtnToggle:e.component.object.level.info.italicBtnToggle};o.ChangeAttributeTextContent(r,function(n){e.$emit("ChangeCurrentPage",n)})}}}function le(n){var o={fontName:"自定义",text:"自定义",fontFamily:_.cloneDeep(e.component.object.level.info.fontFamily),fontSize:_.cloneDeep(e.component.object.level.info.fontSize),fontColor:_.cloneDeep(e.component.object.level.info.fontColor),fontBold:_.cloneDeep(e.component.object.level.info.fontBold),fontItalic:_.cloneDeep(e.component.object.level.info.fontItalic),boldBtnToggle:_.cloneDeep(e.component.object.level.info.boldBtnToggle),italicBtnToggle:_.cloneDeep(e.component.object.level.info.italicBtnToggle)};l.addCharacterSet(o),n.stopPropagation()}function ae(e,n){l.deleteCharacterSetByIndex(n),e.stopPropagation()}function ce(n){if(13==n.keyCode){if(e.component.object.level.info.numOfDigits.toString().indexOf(".")>-1)return void d()
;if(e.component.object.level.info.numOfDigits==Pe.level.info.numOfDigits)return;if(e.component.object.level.info.numOfDigits<1||e.component.object.level.info.numOfDigits>10)return d(),void toastr.warning("超出范围");var t=e.component.object.level.info.numValue.toString().length+e.component.object.level.info.decimalCount;if(e.component.object.level.info.numOfDigits<=e.component.object.level.info.decimalCount||e.component.object.level.info.numOfDigits<t)return d(),void toastr.warning("超出范围");var i={numOfDigits:e.component.object.level.info.numOfDigits};o.SaveCurrentOperate();o.ChangeAttributeNumContent(i,function(n){e.$emit("ChangeCurrentPage",n)})}}function me(n){if(13==n.keyCode){if(e.component.object.level.info.decimalCount.toString().indexOf(".")>-1)return void d();if(e.component.object.level.info.decimalCount==Pe.level.info.decimalCount)return;if(e.component.object.level.info.decimalCount<0||e.component.object.level.info.decimalCount>e.component.object.level.info.numOfDigits-e.component.object.level.info.numValue.toString().length)return d(),void toastr.warning("超出范围");var t={decimalCount:e.component.object.level.info.decimalCount};o.SaveCurrentOperate();o.ChangeAttributeNumContent(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function ue(){var n=o.getCurrentSelectObject(),i=null;if(n.type==t.MyNum){i=e.component.num.numModeId;var r={numModeId:i};o.SaveCurrentOperate();o.ChangeAttributeOfNum(r,function(n){e.$emit("ChangeCurrentPage",n)})}}function fe(){var n=o.getCurrentSelectObject(),i=null;if(n.type==t.MyNum){i=e.component.num.symbolMode;var r={symbolMode:i};o.SaveCurrentOperate();o.ChangeAttributeNumContent(r,function(n){e.$emit("ChangeCurrentPage",n)})}}function ge(){var n=o.getCurrentSelectObject(),i=null;if(n.type==t.MyNum){i=e.component.num.frontZeroMode;var r={frontZeroMode:i};o.SaveCurrentOperate();o.ChangeAttributeNumContent(r,function(n){e.$emit("ChangeCurrentPage",n)})}}function ve(){var n=o.getCurrentSelectObject(),i=null;if(n.type==t.MyNum){i=e.component.num.overFlowStyle;var r={overFlowStyle:i};o.SaveCurrentOperate();o.ChangeAttributeOfNum(r,function(n){e.$emit("ChangeCurrentPage",n)})}}function de(n){if(13==n.keyCode){var t=e.component.object.level.info.numValue,i=e.component.object.level.info.minValue,r=e.component.object.level.info.maxValue,l=t.toString();if(t==Pe.level.info.numValue)return;if(t<i||t>r||isNaN(t)||-1!=l.indexOf("."))return toastr.warning("输入不合法"),void d();var a=e.component.object.level.info.numOfDigits-e.component.object.level.info.decimalCount,r=Math.pow(10,a);if(t<=r){var c={numValue:t};o.ChangeAttributeNumContent(c,function(n){e.$emit("ChangeCurrentPage",n)})}else toastr.warning("超出范围"),d()}}function pe(){if(e.component.object.level.info.align!=Pe.level.info.align){var n={align:e.component.object.level.info.align};o.ChangeAttributeNumContent(n,function(n){e.$emit("ChangeCurrentPage",n)})}}function be(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.knobSize)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.knobSize==Pe.level.info.knobSize)return;var t={knobSize:e.component.object.level.info.knobSize};o.ChangeAttributeKnobSize(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function se(n){if(13==n.keyCode){if(!_.isInteger(parseInt(e.component.object.level.info.value)))return toastr.warning("输入不合法"),void d();if(e.component.object.level.info.value==Pe.level.info.value)return;if(e.component.object.level.info.value<e.component.object.level.info.minValue||e.component.object.level.info.value>e.component.object.level.info.maxValue)return toastr.warning("超出范围"),void d();var t={value:e.component.object.level.info.value};o.ChangeAttributeKnobValue(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function he(n){if(13==n.keyCode){if(e.component.object.level.info.spacing==Pe.level.info.spacing)return;(e.component.object.level.info.spacing<=0||e.component.object.level.info.spacing>e.component.object.level.info.width)&&toastr.warning("超出范围");var t={spacing:e.component.object.level.info.spacing};o.SaveCurrentOperate();o.ChangeAttributeOscilloscopeForRender(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function Ce(n){if(13==n.keyCode){if(e.component.object.level.info.lineWidth==Pe.level.info.lineWidth)return;(e.component.object.level.info.lineWidth<=0||e.component.object.level.info.lineWidth>e.component.object.level.info.spacing/2)&&toastr.warning("超出范围");var t={lineWidth:e.component.object.level.info.lineWidth};o.SaveCurrentOperate();o.ChangeAttributeOscilloscopeForRender(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function je(n){if(13==n.keyCode){if(e.component.object.level.info.gridInitValue==Pe.level.info.gridInitValue)return;var t={gridInitValue:e.component.object.level.info.gridInitValue};o.SaveCurrentOperate();o.ChangeAttributeOscilloscopeForRender(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function Me(n){if(13==n.keyCode){if(e.component.object.level.info.gridUnitX==Pe.level.info.gridUnitX)return;var t={gridUnitX:e.component.object.level.info.gridUnitX};o.SaveCurrentOperate();o.ChangeAttributeOscilloscopeForRender(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function Ae(n){if(13==n.keyCode){if(e.component.object.level.info.gridUnitY==Pe.level.info.gridUnitY)return;var t={gridUnitY:e.component.object.level.info.gridUnitY};o.SaveCurrentOperate();o.ChangeAttributeOscilloscopeForRender(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function ye(){if(e.component.object.level.info.grid!=Pe.level.info.grid){var n={grid:e.component.object.level.info.grid};o.SaveCurrentOperate();o.ChangeAttributeOscilloscopeForRender(n,function(n){e.$emit("ChangeCurrentPage",n)})}}function Ie(n){if(13==n.keyCode){if(e.component.object.level.info.bindBit==Pe.level.info.bindBit)return;if(e.component.object.level.info.bindBit<0||e.component.object.level.info.bindBit>31)return toastr.warning("超出范围"),void d();toastr.info("修改成功");var t={bindBit:e.component.object.level.info.bindBit};o.SaveCurrentOperate();o.ChangeAttributeBindBit(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function Se(n){if(13==n.keyCode){if(e.component.object.level.info.initValue==Pe.level.info.initValue)return;if(e.component.object.level.info.initValue<e.component.object.level.info.minValue||e.component.object.level.info.initValue>e.component.object.level.info.maxValue)return toastr.warning("超出最大或最小范围"),void d();var t={initValue:e.component.object.level.info.initValue};o.SaveCurrentOperate();o.ChangeAttributeInitValue(t,function(n){e.$emit("ChangeCurrentPage",n)})}}function we(n){var i=o.getCurrentSelectObject(),r=null;if(i.type==t.MyDateTime){r=e.component.dateTime.dateTimeModeId,selectRTCModeId=e.component.dateTime.RTCModeId;var l=o.SaveCurrentOperate(),a={dateTimeModeId:r,RTCModeId:selectRTCModeId};o.ChangeAttributeDateTimeModeId(a,function(){e.$emit("ChangeCurrentPage",l)})}}function Ve(){var n={align:e.component.group.alignModeId};o.ChangeAttributeGroupAlign(n)}function ke(){return"rgba("+_.random(64,255)+","+_.random(64,255)+","+_.random(64,255)+",1.0)"}function Oe(n){var t=e.component.video.sourceId,i={source:t};o.SaveCurrentOperate();o.changeVideoSource(i,function(n){e.$emit("ChangeCurrentPage",n)})}function Te(n){var t=e.component.video.scaleId,i={scale:t};o.SaveCurrentOperate();o.changeVideoScale(i,function(n){e.$emit("ChangeCurrentPage",n)})}var Pe=null;e.$on("GlobalProjectReceived",function(){u(),f()}),e.$on("ToolShowChanged",function(n,o){e.component.textArea.toolShow=o})}]);