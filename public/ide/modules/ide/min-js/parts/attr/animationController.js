ide.controller("animationCtl",["$scope","ProjectService","Type","$uibModal","AnimationService","UserTypeService",function(n,t,e,i,a,o){function l(){s(),c(),n.status={collapsed:!1},n.collapse=function(t){n.status.collapsed=!n.status.collapsed}}function c(){var n=o.getAnimationAuthor(),t=document.getElementById("addAnimationBtn");t.disabled=n}function s(){if(!t.getCurrentSelectObject())return void console.warn("空");var e=t.getCurrentSelectObject().level,i=_.cloneDeep(e.animations);a.setAnimations(i),n.animations=a.getAllAnimations();var o=t.getCurrentSelectObject().level;switch(o.type){case"MyPage":case"MySubLayer":case void 0:n.showAnimationPanel=!1;break;default:n.showAnimationPanel=!0}}function m(){n.$on("AttributeChanged",function(){s()}),n.deleteAnimation=function(t){a.deleteAnimationByIndex(t,function(){n.animations=a.getAllAnimations()}.bind(this))},n.openPanel=function(t){n.selectIdx=t;var e;t==-1?e=a.getNewAnimation():t>=0&&t<n.animations.length&&(e=_.cloneDeep(n.animations[t]));var o=i.open({animation:!0,templateUrl:"animationPanelModal.html",controller:"AnimationInstanceCtrl",size:"middle",resolve:{animation:function(){return e}}});o.result.then(function(t){n.selectIdx==-1?a.appendAnimation(t,function(){n.animations=a.getAllAnimations()}.bind(this)):n.selectIdx>=0&&n.selectIdx<n.animations.length&&a.updateAnimationByIndex(t,n.selectIdx,function(){n.animations=a.getAllAnimations()}.bind(this))})}}n.$on("GlobalProjectReceived",function(){l(),m()})}]).controller("AnimationInstanceCtrl",["$scope","$uibModalInstance","animation",function(n,t,e){n.animation=e,n.confirm=function(){t.close(n.animation)},n.cancel=function(){t.dismiss()}}]);