ideServices.service("RenderSerive",["ResourceService",function(e){function t(){var e,t="win32"===require("os").platform()?"win":"other",n="zip";"win"===t?(n=".\\utils\\7z\\7z.exe",e=["a"]):e=["-rj"];var i,r,o,a=function(){"win"===t&&"\\"!==r[r.length-1]&&(r+="\\*");var a=e.concat(i).concat(r),s=g(n,a);s.stdout.on("data",function(e){}),s.stderr.on("data",function(e){}),s.on("error",function(e){o(e)}),s.on("exit",function(e){0===e?o():o(new Error(e))})};this.compress=function(e,t,n){i=e,r=t,o=n,c.stat(e,function(t,n){n&&n.isFile()?c.unlink(e,function(e){e?o(e):a()}):a()})}}function n(e,t){this.width=e,this.height=t;var n=document.createElement("canvas");n.width=this.width,n.height=this.height,n.hidden=!0,this.canvasObj=n}function i(e){switch(e){case"jpg":case"jpeg":return"image/jpeg";case"png":return"image/png";case"bmp":return"image/bmp";default:return"image/png"}}function r(e){var t=s.extname(e),n=i(t),r="data:"+n+";base64,";return r+c.readFileSync(e).toString("base64")}function o(e,t){this.images=e||{},this.customFonts=t||{}}var a=!1;try{var s=require("path"),c=require("fs");a=!0}catch(e){}if(a){var g=require("child_process").spawn,l=new t;n.prototype.getContext=function(e){if("2d"===e)return this.canvasObj.getContext("2d")},n.prototype.pngStream=function(){var e=this.canvasObj.toDataURL(),t=new Buffer(e.split(",")[1],"base64");return t},n.prototype.toBuffer=function(){var e=this.canvasObj.toDataURL(),t=new Buffer(e.split(",")[1],"base64");return t},n.prototype.output=function(e,t){var n=this.pngStream();try{c.writeFileSync(e,n),t&&t()}catch(e){t&&t(e)}};var d=renderingX.Size,f=renderingX.Pos;o.prototype.getTargetImage=function(e){return"undefined"!==this.images[e]?this.images[e]:null},o.prototype.addImage=function(e,t){this.images[e]=t},o.prototype.renderButton=function(e,t,i,o,a){var c=e.info;if(c){var g={},l={};l["font-style"]=e.info.fontItalic,l["font-weight"]=e.info.fontBold,l["font-size"]=e.info.fontSize,l["font-family"]=e.info.fontFamily,l["font-color"]=e.info.fontColor,g.color=l["font-color"],g.font=(l["font-style"]||"")+" "+(l["font-variant"]||"")+" "+(l["font-weight"]||"")+" "+(l["font-size"]||24)+"px "+(l["font-family"]||"arial"),g.textAlign="center",g.textBaseline="middle";var u=e.texList[0].slices,h=u.length;u.map(function(l,u){var w=new n(c.width,c.height),p=w.getContext("2d"),m=l.imgSrc;p.clearRect(0,0,c.width,c.height),p.save(),renderingX.renderColor(p,new d(c.width,c.height),new f,l.color);var v;if(""!==m){v=s.join(t,m);var b=this.getTargetImage(v);if(!b){var y=new Image;try{y.src=r(v),this.addImage(v,y),b=y}catch(e){b=null}}renderingX.renderImage(p,new d(c.width,c.height),new f,b,new f,new d(c.width,c.height))}u<2&&renderingX.renderText(p,new d(c.width,c.height),new f,c.text,g,!0,null,this.customFonts);var j=e.id.split(".").join(""),x=j+"-"+u+".png",I=s.join(i,x);w.output(I,function(t){t?(h-=1,h<=0&&a&&a(t)):(e.texList[0].slices[u].imgSrc=s.join(o||"",x),h-=1,h<=0&&a&&a())}.bind(this)),p.restore()}.bind(this))}else a&&a()},o.prototype.renderButtonGroup=function(e,t,i,o,a){var c=e.info;if(c){var g=c.width,l=c.height,u=c.interval,h=c.count,w="horizontal"===c.arrange;w?g=(g-(h-1)*u)/h:l=(l-(h-1)*u)/h;for(var p=e.texList,m=2*h,v=[],b=0;b<h;b++)for(var y=0;y<2;y++)v.push(p[b].slices[y]);p[h]&&(v.push(p[h].slices[0]),m++),v.map(function(c,u){var h=new n(g,l),w=h.getContext("2d"),p=c;w.clearRect(0,0,g,l),w.save(),renderingX.renderColor(w,new d(g,l),new f,p.color);var v=p.imgSrc;if(""!==v){var b=s.join(t,v),y=this.getTargetImage(b);if(!y){var j=new Image;try{j.src=r(b),this.addImage(b,j),y=j}catch(e){y=null}}renderingX.renderImage(w,new d(g,l),new f,y,new f,new d(g,l))}var x=e.id.split(".").join(""),I=x+"-"+u+".png",S=s.join(i,I);h.output(S,function(e){e?(m-=1,m<=0&&a&&a(e)):(p.imgSrc=s.join(o||"",I),m-=1,m<=0&&a&&a())}.bind(this)),w.restore()}.bind(this))}else a&&a()},o.prototype.renderDashboard=function(e,t,i,o,a){var c=e.info;if(c){var g=c.width,l=c.height,u=e.texList,h=u.length;u.map(function(w,p){1===p&&(g=l=c.pointerLength/Math.sqrt(2));var m=new n(g,l),v=m.getContext("2d"),b=u[p].slices[0];v.clearRect(0,0,g,l),v.save(),renderingX.renderColor(v,new d(g,l),new f,b.color);var y=b.imgSrc;if(""!==y){var j=s.join(t,y),x=this.getTargetImage(j);if(!x){var I=new Image;try{I.src=r(j),this.addImage(j,I),x=I}catch(e){x=null}}renderingX.renderImage(v,new d(g,l),new f,x,new f,new d(g,l))}var S=e.id.split(".").join(""),C=S+"-"+p+".png",B=s.join(i,C);m.output(B,function(e){e?(h-=1,h<=0&&a&&a(e)):(b.imgSrc=s.join(o||"",C),h-=1,h<=0&&a&&a())}.bind(this)),v.restore()}.bind(this))}else a&&a()},o.prototype.renderSlide=function(e,t,i,o,a){var c=e.info;if(c){var g=c.width,l=c.height,u=e.texList[0],h=u.slices.length;u.slices.map(function(c,w){var p=new n(g,l),m=p.getContext("2d"),v=u.slices[w];m.clearRect(0,0,g,l),m.save(),renderingX.renderColor(m,new d(g,l),new f,v.color);var b=v.imgSrc;if(""!==b){var y=s.join(t,b),j=this.getTargetImage(y);if(!j){var x=new Image;try{x.src=r(y),this.addImage(y,x),j=x}catch(e){j=null}}renderingX.renderImage(m,new d(g,l),new f,j,new f,new d(g,l))}var I=e.id.split(".").join(""),S=I+"-"+w+".png",C=s.join(i,S);p.output(C,function(e){e?a&&a(e):(v.imgSrc=s.join(o||"",S),h-=1,h<=0&&a&&a())}.bind(this)),m.restore()}.bind(this))}else a&&a()},o.prototype.renderOscilloscope=function(e,t,i,o,a){var c=e.info,g=c.width,l=c.height;if(c){var u=new n(g,l),h=u.getContext("2d");h.clearRect(0,0,g,l);var w=e.texList[0].slices[0];if(renderingX.renderColor(h,new d(g,l),new f,w.color),""!==w.imgSrc){var p=s.join(t,w.imgSrc),m=this.getTargetImage(p);if(!m){var v=new Image;try{v.src=r(p),this.addImage(p,v),m=v}catch(e){m=null}}renderingX.renderImage(h,new d(g,l),new f,m,new f,new d(g,l))}renderingX.renderGrid(h,new d(g,l),new f,new d(c.spacing,c.spacing),new f);var b=e.id.split(".").join(""),y=b+"-1.png",j=s.join(i,y);u.output(j,function(e){e?a&&a(e):(w.imgSrc=s.join(o||"",y),a&&a())}.bind(this))}else a&&a()},o.prototype.renderTextArea=function(e,t,i,o,a){var c=e.info,g=c.width,l=c.height;if(c){var u={},h={};h["font-style"]=e.info.fontItalic,h["font-weight"]=e.info.fontBold,h["font-size"]=e.info.fontSize,h["font-family"]=e.info.fontFamily,h["font-color"]=e.info.fontColor,u.color=h["font-color"],u.font=(h["font-style"]||"")+" "+(h["font-variant"]||"")+" "+(h["font-weight"]||"")+" "+(h["font-size"]||24)+"px "+(h["font-family"]||"arial"),u.textAlign="center",u.textBaseline="middle";var w=new n(g,l),p=w.getContext("2d");p.clearRect(0,0,g,l);var m=e.texList[0].slices[0];if(renderingX.renderColor(p,new d(g,l),new f,m.color),""!==m.imgSrc){var v=s.join(t,m.imgSrc),b=this.getTargetImage(v);if(!b){var y=new Image;try{y.src=r(v),this.addImage(v,y),b=y}catch(e){b=null}}renderingX.renderImage(p,new d(g,l),new f,b,new f,new d(g,l))}c.text&&""!==c.text&&renderingX.renderText(p,new d(g,l),new f,c.text,u,!0,new f(.5*g,.5*l),this.customFonts);var j=e.id.split(".").join(""),x=j+"-1.png",I=(new Date,s.join(i,x));w.output(I,function(e){if(e)a&&a(e);else{m.imgSrc=s.join(o||"",x);new Date;a&&a()}})}else a&&a()},o.prototype.renderWidget=function(e,t,n,i,r){switch(e.subType){case"MyButton":this.renderButton(e,t,n,i,r);break;case"MyButtonGroup":this.renderButtonGroup(e,t,n,i,r);break;case"MySlide":this.renderSlide(e,t,n,i,r);break;case"MyOscilloscope":this.renderOscilloscope(e,t,n,i,r);break;case"MyTextArea":this.renderTextArea(e,t,n,i,r);break;case"MyDashboard":this.renderDashboard(e,t,n,i,r);break;default:r&&r()}},this.renderTest=function(t){var n={id:"0.0.0.5",info:{width:100,height:75,left:0,top:0,originX:"center",originY:"center",arrange:!0,buttonText:"button",buttonFontFamily:"Arial",buttonFontSize:20,buttonFontColor:"rgba(0,0,0,1)",buttonFontBold:"100",buttonFontItalic:"",boldBtnToggle:!1,italicBtnToggle:!1},normalImg:"",pressImg:"",name:"NewButton",type:"widget",expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:"rgba(158,97,215,1.0)",imgSrc:"7373737373737373737373731468200611444.jpg",name:"按下前"},{color:"rgba(225,136,192,1.0)",imgSrc:"",name:"按下后"}]}],selected:!1,current:!1,actions:[{title:"action0",trigger:"Press",commands:[[{name:"INC",symbol:"+"},{tag:"a",value:""},{tag:"",value:"1"}]]}],subType:"MyButton"},i=function(e){},r=new o,a=e.getResourceUrl();r.renderButton(n,a,a,null,i)},this.renderProject=function(t,n,i){function r(e){d||(i&&i(),d=!0)}function a(){n&&n()}function g(e,t){l.compress(e,t,function(e){e?r(e):a()}.bind(this))}for(var d=!1,f=e.getProjectUrl(),u=e.getResourceUrl(),h=s.join(u,"data.json"),w=[],p=0;p<t.pageList.length;p++)for(var m=t.pageList[p],v=0;v<m.canvasList.length;v++)for(var b=m.canvasList[v],y=0;y<b.subCanvasList.length;y++)for(var j=b.subCanvasList[y],x=0;x<j.widgetList.length;x++)w.push(j.widgetList[x]);var I=w.length;if(I>0)for(var S=!0,C=function(e){e?(S=!1,r("generate error")):(I-=1,I<=0&&S&&c.writeFile(h,JSON.stringify(t,null,4),function(e){if(e)r(e);else{var t=s.join(f,"resources"),n=s.join(f,"file.zip");g(n,t)}}))}.bind(this),B=new o,L=s.join(global.__dirname,s.dirname(window.location.pathname)),T=0;T<w.length;T++){var X=w[T];B.renderWidget(X,L,u,u,C)}else c.writeFile(h,JSON.stringify(t,null,4),function(e){if(e)r(res,500,e);else{var t=s.join(f,"resources"),n=s.join(f,"file.zip");g(n,t)}})}}}]);