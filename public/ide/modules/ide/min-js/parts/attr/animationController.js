ide.controller("animationCtl",["$scope","ProjectService","Type","$uibModal","AnimationService","UserTypeService",function(t,n,a,e,i,o){function s(){r(),c(),t.status={collapsed:!1},t.collapse=function(n){t.status.collapsed=!t.status.collapsed}}function c(){var t=o.getAnimationAuthor();document.getElementById("addAnimationBtn").disabled=t}function r(){if(!n.getCurrentSelectObject())return void console.warn("空");var a=n.getCurrentSelectObject().level;switch(t.animations=_.cloneDeep(a.animations)||[],a.type){case"MyLayer":t.showAnimationPanel=!0;break;default:t.showAnimationPanel=!1}}function l(){t.$on("AttributeChanged",function(){r()}),t.deleteAnimation=function(a){a>=0&&a<t.animations.length&&(t.animations.splice(a,1),n.ChangeAttributeAnimation(_.cloneDeep(t.animations)))},t.openPanel=function(a){t.selectIdx=a;var o;-1==a?(o=i.getNewAnimation(),o.newAnimation=!0):a>=0&&a<t.animations.length&&(o=_.cloneDeep(t.animations[a]),o.newAnimation=!1);for(var s=[],c=0;c<t.animations.length;c++)s.push(t.animations[c].title);e.open({animation:!0,templateUrl:"animationPanelModal.html",controller:"AnimationInstanceCtrl",size:"lg",resolve:{animation:function(){return o},animationNames:function(){return s}}}).result.then(function(e){-1==t.selectIdx?(t.animations.push(e),n.ChangeAttributeAnimation(_.cloneDeep(t.animations))):t.selectIdx>=0&&t.selectIdx<t.animations.length&&a>=0&&a<t.animations.length&&(t.animations[a]=e,n.ChangeAttributeAnimation(_.cloneDeep(t.animations)))})}}t.$on("GlobalProjectReceived",function(){s(),l()}),t.$on("MaskView",function(n,a){t.myMask=a})}]).controller("AnimationInstanceCtrl",["$scope","$uibModalInstance","TagService","ProjectService","animation","animationNames",function(t,n,a,e,i,o){function s(n){for(var a=t.animationNames,e=0;e<a.length;e++)if(n.animation.title===a[e])return toastr.info("重复的动画名"),!1;return!0}function c(t,n){var a=t.animationAttrs,e=a.translate,i=a.scale;for(var o in n)switch(o){case"srcPos":case"dstPos":"on"===n[o].x?e[o].x.value=0:e[o].x.tag="","on"===n[o].y?e[o].y.value=0:e[o].y.tag="";break;case"srcScale":case"dstScale":"on"===n[o].x?i[o].x.value=1:i[o].x.tag="","on"===n[o].y?i[o].y.value=1:i[o].y.tag=""}}t.animation=i,t.animationNames=o,t.tags=a.getAllCustomTags(),t.checkDuration=function(n){t.animation.duration<0?(toastr.error("持续时间必须大于0s"),t.animation.duration=0):t.animation.duration>5e3&&(toastr.error("持续时间不能大于5s"),t.animation.duration=5e3)},t.confirm=function(a){var e=t.animation.animationAttrs.scale.srcScale.x,i=t.animation.animationAttrs.scale.srcScale.y;return e<0||i<0?void alert("缩放倍率禁止使用负数"):(c(t.animation,t.switchButtons),!1===a.animation.newAnimation&&a.animation.title===r?void n.close(t.animation):void(l&&s(a)&&n.close(t.animation)))},t.cancel=function(){n.dismiss()};var r=t.animation.title,l=!0;t.store=function(t){r=t.animation.title},t.restore=function(t){t.animation.title=r},t.enterName=function(n){if(n.animation.title!==r){if(!(l=e.inputValidate(n.animation.title))||!s(n))return void t.restore(n);toastr.info("修改成功"),r=n.animation.title}},t.enterPress=function(n,a){13==n.keyCode&&t.enterName(a)};var u=i.animationAttrs.translate,m=i.animationAttrs.scale;t.switchButtons={srcPos:{x:""!==u.srcPos.x.tag?"on":"off",y:""!==u.srcPos.y.tag?"on":"off"},dstPos:{x:""!==u.dstPos.x.tag?"on":"off",y:""!==u.dstPos.y.tag?"on":"off"},srcScale:{x:""!==m.srcScale.x.tag?"on":"off",y:""!==m.srcScale.y.tag?"on":"off"},dstScale:{x:""!==m.dstScale.x.tag?"on":"off",y:""!==m.dstScale.y.tag?"on":"off"}},t.timingFuns=["linear","easeInQuad","easeOutQuad","easeInOutQuad","easeInCubic","easeOutCubic","easeInOutCubic","easeInQuart","easeOutQuart","easeInOutQuart","easeInQuint","easeOutQuint","easeInOutQuint"]}]),ide.directive("mySwitchButton",function(){return{restrict:"EA",template:"<div id='btn' class='switch-button switch-button-close' ng-click='clickHandler()'><span class='switch-flag'></span></div>",scope:{status:"=status"},replace:!0,link:function(t,n){!function(){"on"===t.status?n.removeClass("switch-button-close"):n.addClass("switch-button-close")}(),t.clickHandler=function(){"on"===t.status?(t.status="off",n.addClass("switch-button-close")):"off"===t.status&&(t.status="on",n.removeClass("switch-button-close"))}}}});