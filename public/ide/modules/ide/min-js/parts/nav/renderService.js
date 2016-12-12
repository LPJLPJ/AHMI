ideServices.service("RenderSerive",["ResourceService","Upload","$http",function(e,t,n){function i(e){var t;t=e.split(",")[0].indexOf("base64")>=0?atob(e.split(",")[1]):unescape(e.split(",")[1]);for(var n=e.split(",")[0].split(":")[1].split(";")[0],i=new Uint8Array(t.length),r=0;r<t.length;r++)i[r]=t.charCodeAt(r);return new Blob([i],{type:n})}function r(e,n,r,o,a){var s=i(e),c=function(){console.log("save tex ok"),o&&o()},l=function(e){console.log(e),a&&a()};t.upload({url:r,data:{file:s,name:n}}).then(c,l)}function o(){for(var t=e.getGlobalResources(),n={},i=0;i<t.length;i++){var r=t[i];n[r.id]=r.content}return n}function a(e,t){this.width=e,this.height=t;var n=document.createElement("canvas");n.width=this.width,n.height=this.height,n.hidden=!0,this.canvasObj=n}function s(e){switch(e){case"jpg":case"jpeg":return"image/jpeg";case"png":return"image/png";case"bmp":return"image/bmp";default:return"image/png"}}function c(e){if(u){var t=d.extname(e),n=s(t),i="data:"+n+";base64,";return i+h.readFileSync(e).toString("base64")}return e}function l(e){var t=e.split("/");return t[t.length-1]}function g(e,t){this.images=e||{},window.images=this.images,this.customFonts=t||{}}function f(){var e,t="win32"===require("os").platform()?"win":"other",n="zip";"win"===t?(n=".\\utils\\7z\\7z.exe",e=["a"]):e=["-rj"];var i,r,o,a=function(){"win"===t&&"\\"!==r[r.length-1]&&(r+="\\*");var a=e.concat(i).concat(r),s=v(n,a);console.log("command",n,a),s.stdout.on("data",function(e){}),s.stderr.on("data",function(e){}),s.on("error",function(e){console.log(e),o(e)}),s.on("exit",function(e){0===e?o():o(new Error(e))})};this.compress=function(e,t,n){i=e,r=t,o=n,h.stat(e,function(t,n){n&&n.isFile()?h.unlink(e,function(e){e?o(e):a()}):a()})}}var d,u=!1;try{d=require("path");var h=require("fs");u=!0}catch(e){d={},d.sep="/",d.join=function(e,t){return e[e.length-1]==d.sep&&(e=e.slice(0,e.length-1)),t[0]==d.sep&&(t=t.slice(1)),e+d.sep+t}}a.prototype.getContext=function(e){if("2d"===e)return this.canvasObj.getContext("2d")},a.prototype.pngStream=function(){var e=this.canvasObj.toDataURL();if(u){var t=new Buffer(e.split(",")[1],"base64");return t}return e},a.prototype.toBuffer=function(){var e=this.canvasObj.toDataURL(),t=new Buffer(e.split(",")[1],"base64");return t},a.prototype.output=function(t,n){var i=this.pngStream(),o=l(t);if(u)try{h.writeFileSync(t,i),n&&n()}catch(e){n&&n(e)}else r(i,o,"/project/"+e.getResourceUrl().split("/")[2]+"/generatetex",n,n)};var p=renderingX.Size,w=renderingX.Pos;if(g.prototype.getTargetImage=function(e){return u?"undefined"!==this.images[e]?this.images[e]:null:this.images[l(e)]},g.prototype.addImage=function(e,t){this.images[e]=t},g.prototype.renderButton=function(e,t,n,i,r){var o=e.info;if(o){var s={},l={};l["font-style"]=e.info.fontItalic,l["font-weight"]=e.info.fontBold,l["font-size"]=e.info.fontSize,l["font-family"]=e.info.fontFamily,l["font-color"]=e.info.fontColor,s.color=l["font-color"],s.font=(l["font-style"]||"")+" "+(l["font-variant"]||"")+" "+(l["font-weight"]||"")+" "+(l["font-size"]||24)+"px "+(l["font-family"]||"arial"),s.textAlign="center",s.textBaseline="middle";var g=e.texList[0].slices,f=g.length;g.map(function(l,g){var u=new a(o.width,o.height),h=u.getContext("2d"),v=l.imgSrc;h.clearRect(0,0,o.width,o.height),h.save(),renderingX.renderColor(h,new p(o.width,o.height),new w,l.color);var m;if(""!==v){m=d.join(t,v);var j=this.getTargetImage(m);if(!j){var y=new Image;try{y.src=c(m),this.addImage(m,y),j=y}catch(e){j=null}}renderingX.renderImage(h,new p(o.width,o.height),new w,j,new w,new p(o.width,o.height))}g<2&&renderingX.renderText(h,new p(o.width,o.height),new w,o.text,s,!0,null,this.customFonts);var b=e.id.split(".").join(""),x=b+"-"+g+".png",S=d.join(n,x);u.output(S,function(t){t?(f-=1,f<=0&&r&&r(t)):(e.texList[0].slices[g].imgSrc=d.join(i||"",x),f-=1,f<=0&&r&&r())}.bind(this)),h.restore()}.bind(this))}else r&&r()},g.prototype.renderButtonGroup=function(e,t,n,i,r){var o=e.info;if(o){var s=o.width,l=o.height,g=o.interval,f=o.count,u="horizontal"===o.arrange;u?s=(s-(f-1)*g)/f:l=(l-(f-1)*g)/f;for(var h=e.texList,v=2*f,m=[],j=0;j<f;j++)for(var y=0;y<2;y++)m.push(h[j].slices[y]);h[f]&&(m.push(h[f].slices[0]),v++),m.map(function(o,g){var f=new a(s,l),u=f.getContext("2d"),h=o;u.clearRect(0,0,s,l),u.save(),renderingX.renderColor(u,new p(s,l),new w,h.color);var m=h.imgSrc;if(""!==m){var j=d.join(t,m),y=this.getTargetImage(j);if(!y){var b=new Image;try{b.src=c(j),this.addImage(j,b),y=b}catch(e){y=null}}renderingX.renderImage(u,new p(s,l),new w,y,new w,new p(s,l))}var x=e.id.split(".").join(""),S=x+"-"+g+".png",I=d.join(n,S);f.output(I,function(e){e?(v-=1,v<=0&&r&&r(e)):(h.imgSrc=d.join(i||"",S),v-=1,v<=0&&r&&r())}.bind(this)),u.restore()}.bind(this))}else r&&r()},g.prototype.renderDashboard=function(e,t,n,i,r){var o=e.info;if(o){var s=o.width,l=o.height,g=e.texList,f=g.length;g.map(function(u,h){1===h&&(s=l=o.pointerLength/Math.sqrt(2));var v=new a(s,l),m=v.getContext("2d"),j=g[h].slices[0];m.clearRect(0,0,s,l),m.save(),renderingX.renderColor(m,new p(s,l),new w,j.color);var y=j.imgSrc;if(""!==y){var b=d.join(t,y),x=this.getTargetImage(b);if(!x){var S=new Image;try{S.src=c(b),this.addImage(b,S),x=S}catch(e){x=null}}renderingX.renderImage(m,new p(s,l),new w,x,new w,new p(s,l))}var I=e.id.split(".").join(""),C=I+"-"+h+".png",L=d.join(n,C);v.output(L,function(e){e?(f-=1,f<=0&&r&&r(e)):(j.imgSrc=d.join(i||"",C),f-=1,f<=0&&r&&r())}.bind(this)),m.restore()}.bind(this))}else r&&r()},g.prototype.renderSlide=function(e,t,n,i,r){var o=e.info;if(o){var s=o.width,l=o.height,g=e.texList[0],f=g.slices.length;g.slices.map(function(o,u){var h=new a(s,l),v=h.getContext("2d"),m=g.slices[u];v.clearRect(0,0,s,l),v.save(),renderingX.renderColor(v,new p(s,l),new w,m.color);var j=m.imgSrc;if(""!==j){var y=d.join(t,j),b=this.getTargetImage(y);if(!b){var x=new Image;try{x.src=c(y),this.addImage(y,x),b=x}catch(e){b=null}}renderingX.renderImage(v,new p(s,l),new w,b,new w,new p(s,l))}var S=e.id.split(".").join(""),I=S+"-"+u+".png",C=d.join(n,I);h.output(C,function(e){e?r&&r(e):(m.imgSrc=d.join(i||"",I),f-=1,f<=0&&r&&r())}.bind(this)),v.restore()}.bind(this))}else r&&r()},g.prototype.renderOscilloscope=function(e,t,n,i,r){var o=e.info,s=o.width,l=o.height;if(o){var g=new a(s,l),f=g.getContext("2d");f.clearRect(0,0,s,l);var u=e.texList[0].slices[0];if(renderingX.renderColor(f,new p(s,l),new w,u.color),""!==u.imgSrc){var h=d.join(t,u.imgSrc),v=this.getTargetImage(h);if(!v){var m=new Image;try{m.src=c(h),this.addImage(h,m),v=m}catch(e){v=null}}renderingX.renderImage(f,new p(s,l),new w,v,new w,new p(s,l))}renderingX.renderGrid(f,new p(s,l),new w,new p(o.spacing,o.spacing),new w);var j=e.id.split(".").join(""),y=j+"-1.png",b=d.join(n,y);g.output(b,function(e){e?r&&r(e):(u.imgSrc=d.join(i||"",y),r&&r())}.bind(this))}else r&&r()},g.prototype.renderTextArea=function(e,t,n,i,r){var o=e.info,s=o.width,l=o.height;if(o){var g={},f={};f["font-style"]=e.info.fontItalic,f["font-weight"]=e.info.fontBold,f["font-size"]=e.info.fontSize,f["font-family"]=e.info.fontFamily,f["font-color"]=e.info.fontColor,g.color=f["font-color"],g.font=(f["font-style"]||"")+" "+(f["font-variant"]||"")+" "+(f["font-weight"]||"")+" "+(f["font-size"]||24)+"px "+(f["font-family"]||"arial"),g.textAlign="center",g.textBaseline="middle",g.arrange=e.info.arrange;var u=new a(s,l),h=u.getContext("2d");h.clearRect(0,0,s,l);var v=e.texList[0].slices[0];if(renderingX.renderColor(h,new p(s,l),new w,v.color),""!==v.imgSrc){var m=d.join(t,v.imgSrc),j=this.getTargetImage(m);if(!j){var y=new Image;try{y.src=c(m),this.addImage(m,y),j=y}catch(e){j=null}}renderingX.renderImage(h,new p(s,l),new w,j,new w,new p(s,l))}o.text&&""!==o.text&&renderingX.renderText(h,new p(s,l),new w,o.text,g,!0,new w(.5*s,.5*l),this.customFonts);var b=e.id.split(".").join(""),x=b+"-1.png",S=new Date,I=d.join(n,x);u.output(I,function(e){if(e)r&&r(e);else{v.imgSrc=d.join(i||"",x);var t=new Date;console.log("Output stream costs: ",(t-S)/1e3+"s"),r&&r()}})}else r&&r()},g.prototype.renderWidget=function(e,t,n,i,r){switch(e.subType){case"MyButton":this.renderButton(e,t,n,i,r);break;case"MyButtonGroup":this.renderButtonGroup(e,t,n,i,r);break;case"MySlide":this.renderSlide(e,t,n,i,r);break;case"MyOscilloscope":this.renderOscilloscope(e,t,n,i,r);break;case"MyTextArea":this.renderTextArea(e,t,n,i,r);break;case"MyDashboard":this.renderDashboard(e,t,n,i,r);break;default:r&&r()}},this.renderProject=function(t,i,r){function a(e){console.log(e),l||(r&&r(),l=!0)}function s(){console.log("zip ok"),i&&i()}function c(e,t){m.compress(e,t,function(e){e?a(e):s()}.bind(this))}for(var l=!1,f=e.getProjectUrl(),p=e.getResourceUrl(),w=d.join(p,"data.json"),v=[],j=0;j<t.pageList.length;j++)for(var y=t.pageList[j],b=0;b<y.canvasList.length;b++)for(var x=y.canvasList[b],S=0;S<x.subCanvasList.length;S++)for(var I=x.subCanvasList[S],C=0;C<I.widgetList.length;C++)v.push(I.widgetList[C]);var L=v.length;if(L>0){var R,X=!0,O=function(o){o?(X=!1,a("generate error")):(L-=1,L<=0&&X&&(console.log("trans finished"),u?h.writeFile(w,JSON.stringify(t,null,4),function(e){if(e)a(e);else{console.log("write ok");var t=d.join(f,"resources"),n=d.join(f,"file.zip");c(n,t)}}):n({method:"POST",url:"/project/"+e.getResourceUrl().split("/")[2]+"/savedatacompress",data:{data:JSON.stringify(t,null,4)}}).success(function(t){"ok"==t?window.location.href="/project/"+e.getResourceUrl().split("/")[2]+"/download":(console.log(t),toastr.info("生成失败")),i&&i()}).error(function(e){a(e),r&&r()})))}.bind(this);if(u){R=new g;var T=d.join(global.__dirname,d.dirname(window.location.pathname));console.log("viewUrl",T);for(var z=0;z<v.length;z++){var B=v[z];R.renderWidget(B,T,p,p,O)}}else{R=new g(o());for(var z=0;z<v.length;z++){var B=v[z];R.renderWidget(B,"/",p,p,O)}}}else u?h.writeFile(w,JSON.stringify(t,null,4),function(e){if(e)a(res,500,e);else{var t=d.join(f,"resources"),n=d.join(f,"file.zip");c(n,t)}}):n({method:"POST",url:"/project/"+e.getResourceUrl().split("/")[2]+"/savedatacompress",data:{data:JSON.stringify(t,null,4)}}).success(function(t){"ok"==t?window.location.href="/project/"+e.getResourceUrl().split("/")[2]+"/download":(console.log(t),toastr.info("生成失败")),i&&i()}).error(function(e){a(e),r&&r()})},u)var v=require("child_process").spawn,m=new f}]);