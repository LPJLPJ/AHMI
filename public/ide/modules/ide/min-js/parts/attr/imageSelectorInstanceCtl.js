ide.controller("ImageSelectorInstanceCtl",["$scope","$timeout","$uibModalInstance","Type","ResourceService","widgetInfo","TexService",function(e,c,n,t,o,s,i){function a(c,n,t,o,s){e.canAddNewSlice=c,e.sliceNum=n,e.tex=t,e.disableEditName=o,e.disableEditImg=s}function l(){e.tempSlices=_.cloneDeep(e.tex.slices)}function r(e){e.name="selectSlice.color"}function d(){c(function(){e.tex.slices=_.cloneDeep(e.tempSlices)})}function u(){return"rgba("+_.random(64,255)+","+_.random(64,255)+","+_.random(64,255)+",1.0)"}switch(e.images=o.getAllImagesAndTemplates(),e.images.unshift({name:"---",src:""}),e.basicUrl=o.getResourceUrl(),e.$on("colorpicker-submit",function(e,c){r(c)}),e.$on("colorpicker-closed",function(e,c){d()}),e.$on("colorpicker-shown",function(e,c){l()}),e.canAddNewSlice=!1,e.disableEditImg=!1,e.sliceNum=0,s.type){case t.MyButton:a(!1,2,s.tex,!1,!1);break;case t.MyProgress:"1"!==s.objInfo.progressModeId&&"3"!==s.objInfo.progressModeId||1!=s.index&&2!=s.index&&3!=s.index?a(!1,1,s.tex,!1,!1):a(!1,1,s.tex,!1,!0);break;case t.MySlide:a(!0,2,s.tex,!1,!1);break;case t.MyNumber:a(!1,13,s.tex,!1,!1);break;case t.MyDashboard:a(!1,2,s.tex,!1,!1);break;case t.MyTextArea:case t.MyNum:a(!1,1,s.tex,!1,!1);break;case t.MyOscilloscope:case t.MyKnob:a(!1,2,s.tex,!1,!1);break;case t.MyImage:case t.MySwitch:case t.MyRotateImg:case t.MySlideBlock:a(!1,1,s.tex,!1,!1);break;case t.MyAnimation:a(!0,1,s.tex,!1,!1);break;case t.MyTexNum:a(!1,1,s.tex,!0,!1);break;default:a(!0,1,s.tex,!1,!1)}e.addSlice=function(){e.tex.slices.splice(e.curIndex+1,0,i.getDefaultSlice())},e.removeSlice=function(c){1==e.tex.slices.length?toastr.warning("至少有一张纹理"):e.tex.slices.splice(c,1)},e.save=function(){n.close(e.tex)},e.cancel=function(){n.dismiss("cancel")},e.disableColorInput=function(e,c){console.log(e,c),e.imgSrc?e.color="rgba(0,0,0,0)":e.color=u()},e.curIndex=0,e.selectItem=function(c){e.curIndex=c}}]);