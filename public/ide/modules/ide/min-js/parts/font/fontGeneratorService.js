ideServices.service("FontGeneratorService",["Type",function(n){function t(n,t){c.width=n,c.height=t,d.clearRect(0,0,n,t)}function i(n,t,i){d.fillText(String.fromCharCode(n),t,i)}function o(n,t,o){d.font=t,d.textAlign="center",d.textBaseline="middle";for(var e=0,f=0,r=0;r<128;r++)f=Math.ceil(r/l.w),e=r-(f-1)*l.w,o.showGrid&&d.strokeRect((e-1)*n,(f-1)*n,n,n),46===r?i(r,(e-.7)*n,(f-.5)*n):i(r,(e-.5)*n,(f-.5)*n);return c.toDataURL()}function e(n,t){var i=Math.ceil(Math.sqrt(t));return i?{w:i,h:i}:null}function f(n,i){var f=n["font-size"]||24;i=i||{};var r=i.paddingRatio||1;if(paddingFontSize=r*f,l=e(paddingFontSize,128)){t(l.w*paddingFontSize,l.h*paddingFontSize);var a=(n["font-italic"]||"")+" "+(n["font-variant"]||"")+" "+(n["font-bold"]||"")+" "+f+'px "'+n["font-family"]+'"';return o(paddingFontSize,a,i)}console.log("font num invalid")}function r(t){var i,o=[];return i=t.filter(function(t){return t.subType===n.MyNum||t.subType===n.MyDateTime}),i.forEach(function(n){var t,i=n.info,e={},f=i.fontFamily;if(new RegExp("[\\u4E00-\\u9FFF]+","g").test(f)){for(var r="",a=0;a<f.length;a++)r+=f.charCodeAt(a).toString(32);f=r}console.log("fontFamily",f),n.originFont={},n.originFont.src="\\"+f+"-"+i.fontSize+"-"+i.fontBold+"-"+(i.fontItalic||"null")+".png",n.originFont.w=i.fontSize,n.originFont.h=i.fontSize,n.originFont.W=Math.ceil(i.fontSize*g),n.originFont.H=Math.ceil(i.fontSize*g),n.originFont.paddingX=Math.ceil(i.fontSize*(g-1)/2),n.originFont.paddingY=Math.ceil(i.fontSize*(g-1)/2),n.originFont.paddingRatio=g,(t=o.some(function(n){return n.fontFamily===i.fontFamily&&n.fontSize===i.fontSize&&n.fontBold===i.fontBold&&n.fontItalic===i.fontItalic}))||(e["font-family"]=i.fontFamily,e["font-size"]=i.fontSize,e["font-bold"]=i.fontBold,e["font-italic"]=i.fontItalic,o.push(e))}),o}function a(n,t){if(t){return new Buffer(n.split(",")[1],"base64")}return n}var l,c=document.createElement("canvas"),d=c.getContext("2d"),g=1.2;this.generateSingleFont=f,this.getFontCollections=r,this.pngStream=a}]);