ide.controller("ImageSelectorInstanceCtl",["$scope","$timeout","$uibModalInstance","Type","ResourceService","widgetInfo","TexService",function(e,c,t,n,o,s,i){function a(c,t,n,o){e.canAddNewSlice=c,e.sliceNum=t,e.tex=n,e.disableEditName=o}function l(){e.tempSlices=_.cloneDeep(e.tex.slices)}function r(e){e.name="selectSlice.color"}function u(){c(function(){e.tex.slices=_.cloneDeep(e.tempSlices)})}function m(){return"rgba("+_.random(64,255)+","+_.random(64,255)+","+_.random(64,255)+",1.0)"}switch(e.images=o.getAllImagesAndTemplates(),e.images.unshift({name:"---",src:""}),e.basicUrl=o.getResourceUrl(),e.$on("colorpicker-submit",function(e,c){r(c)}),e.$on("colorpicker-closed",function(e,c){u()}),e.$on("colorpicker-shown",function(e,c){l()}),e.canAddNewSlice=!1,e.sliceNum=0,s.type){case n.MyButton:a(!1,2,s.tex,!1);break;case n.MyProgress:a(!1,1,s.tex,!1);break;case n.MySlide:a(!0,2,s.tex,!1);break;case n.MyNumber:a(!1,13,s.tex,!1);break;case n.MyDashboard:a(!1,2,s.tex,!1);break;case n.MyTextArea:case n.MyNum:a(!1,1,s.tex,!1);break;case n.MyOscilloscope:case n.MyKnob:a(!1,2,s.tex,!1);break;case n.MyImage:case n.MySwitch:case n.MyRotateImg:case n.MySlideBlock:a(!1,1,s.tex,!1);break;case n.MyAnimation:a(!0,1,s.tex,!1);break;case n.MyTexNum:a(!1,1,s.tex,!0);break;default:a(!0,1,s.tex,!1)}e.addSlice=function(){e.tex.slices.splice(e.curIndex+1,0,i.getDefaultSlice())},e.removeSlice=function(c){1==e.tex.slices.length?toastr.warning("至少有一张纹理"):e.tex.slices.splice(c,1)},e.save=function(){t.close(e.tex)},e.cancel=function(){t.dismiss("cancel")},e.disableColorInput=function(e,c){console.log(e,c),e.imgSrc?e.color="rgba(0,0,0,0)":e.color=m()},e.curIndex=0,e.selectItem=function(c){e.curIndex=c}}]);