ideServices.service("RenderSerive",["ResourceService",function(e){function n(){var e,n="win32"===require("os").platform()?"win":"other",t="zip";"win"===n?(t=".\\utils\\7z\\7z.exe",e=["a"]):e=["-rj"];var i,r,o,a=function(){"win"===n&&"\\"!==r[r.length-1]&&(r+="\\*");var a=e.concat(i).concat(r),s=l(t,a);console.log("command",t,a),s.stdout.on("data",function(e){}),s.stderr.on("data",function(e){}),s.on("error",function(e){console.log(e),o(e)}),s.on("exit",function(e){0===e?o():o(new Error(e))})};this.compress=function(e,n,t){i=e,r=n,o=t,c.stat(e,function(n,t){t&&t.isFile()?c.unlink(e,function(e){e?o(e):a()}):a()})}}function t(e,n){this.width=e,this.height=n;var t=document.createElement("canvas");t.width=this.width,t.height=this.height,t.hidden=!0,this.canvasObj=t}function i(e){switch(e){case"jpg":case"jpeg":return"image/jpeg";case"png":return"image/png";case"bmp":return"image/bmp";default:return"image/png"}}function r(e){var n=s.extname(e),t=i(n),r="data:"+t+";base64,";return r+c.readFileSync(e).toString("base64")}function o(e,n){this.images=e||{},this.customFonts=n||{}}var a=!1;try{var s=require("path"),c=require("fs");a=!0}catch(e){}if(a){var l=require("child_process").spawn,g=new n;console.log("myzip",g),t.prototype.getContext=function(e){if("2d"===e)return this.canvasObj.getContext("2d")},t.prototype.pngStream=function(){var e=this.canvasObj.toDataURL();console.log("data base64",e);var n=new Buffer(e.split(",")[1],"base64");return n},t.prototype.toBuffer=function(){var e=this.canvasObj.toDataURL(),n=new Buffer(e.split(",")[1],"base64");return n},t.prototype.output=function(e,n){var t=this.pngStream();try{c.writeFileSync(e,t),console.log(e,global.__dirname),n&&n()}catch(e){n&&n(e)}};var d=renderingX.Size,f=renderingX.Pos;o.prototype.getTargetImage=function(e){return"undefined"!==this.images[e]?this.images[e]:null},o.prototype.addImage=function(e,n){this.images[e]=n},o.prototype.renderButton=function(e,n,i,o,a){var c=e.info;if(c){var l={},g={};g["font-style"]=e.info.fontItalic,g["font-weight"]=e.info.fontBold,g["font-size"]=e.info.fontSize,g["font-family"]=e.info.fontFamily,g["font-color"]=e.info.fontColor,l.color=g["font-color"],l.font=(g["font-style"]||"")+" "+(g["font-variant"]||"")+" "+(g["font-weight"]||"")+" "+(g["font-size"]||24)+"px "+(g["font-family"]||"arial"),l.textAlign="center",l.textBaseline="middle";var u=e.texList[0].slices,h=u.length;u.map(function(g,u){var w=new t(c.width,c.height),p=w.getContext("2d"),m=g.imgSrc;p.clearRect(0,0,c.width,c.height),p.save(),renderingX.renderColor(p,new d(c.width,c.height),new f,g.color);var v;if(""!==m){v=s.join(n,m);var b=this.getTargetImage(v);if(!b){var y=new Image;try{y.src=r(v),this.addImage(v,y),b=y}catch(e){b=null}}renderingX.renderImage(p,new d(c.width,c.height),new f,b,new f,new d(c.width,c.height))}u<2&&renderingX.renderText(p,new d(c.width,c.height),new f,c.text,l,!0,null,this.customFonts);var j=e.id.split(".").join(""),x=j+"-"+u+".png",I=s.join(i,x);console.log(I),w.output(I,function(n){n?(h-=1,h<=0&&a&&a(n)):(e.texList[0].slices[u].imgSrc=s.join(o||"",x),h-=1,h<=0&&a&&a())}.bind(this)),p.restore()}.bind(this))}else a&&a()},o.prototype.renderButtonGroup=function(e,n,i,o,a){var c=e.info;if(c){var l=c.width,g=c.height,u=c.interval,h=c.count,w="horizontal"===c.arrange;w?l=(l-(h-1)*u)/h:g=(g-(h-1)*u)/h;for(var p=e.texList,m=2*h,v=[],b=0;b<h;b++)for(var y=0;y<2;y++)v.push(p[b].slices[y]);p[h]&&(v.push(p[h].slices[0]),m++),v.map(function(c,u){var h=new t(l,g),w=h.getContext("2d"),p=c;w.clearRect(0,0,l,g),w.save(),renderingX.renderColor(w,new d(l,g),new f,p.color);var v=p.imgSrc;if(""!==v){var b=s.join(n,v),y=this.getTargetImage(b);if(!y){var j=new Image;try{j.src=r(b),this.addImage(b,j),y=j}catch(e){y=null}}renderingX.renderImage(w,new d(l,g),new f,y,new f,new d(l,g))}var x=e.id.split(".").join(""),I=x+"-"+u+".png",S=s.join(i,I);h.output(S,function(e){e?(m-=1,m<=0&&a&&a(e)):(p.imgSrc=s.join(o||"",I),m-=1,m<=0&&a&&a())}.bind(this)),w.restore()}.bind(this))}else a&&a()},o.prototype.renderDashboard=function(e,n,i,o,a){var c=e.info;if(c){var l=c.width,g=c.height,u=e.texList,h=u.length;u.map(function(w,p){1===p&&(l=g=c.pointerLength/Math.sqrt(2));var m=new t(l,g),v=m.getContext("2d"),b=u[p].slices[0];v.clearRect(0,0,l,g),v.save(),renderingX.renderColor(v,new d(l,g),new f,b.color);var y=b.imgSrc;if(""!==y){var j=s.join(n,y),x=this.getTargetImage(j);if(!x){var I=new Image;try{I.src=r(j),this.addImage(j,I),x=I}catch(e){x=null}}renderingX.renderImage(v,new d(l,g),new f,x,new f,new d(l,g))}var S=e.id.split(".").join(""),C=S+"-"+p+".png",B=s.join(i,C);m.output(B,function(e){e?(h-=1,h<=0&&a&&a(e)):(b.imgSrc=s.join(o||"",C),h-=1,h<=0&&a&&a())}.bind(this)),v.restore()}.bind(this))}else a&&a()},o.prototype.renderSlide=function(e,n,i,o,a){var c=e.info;if(c){var l=c.width,g=c.height,u=e.texList[0],h=u.slices.length;u.slices.map(function(c,w){var p=new t(l,g),m=p.getContext("2d"),v=u.slices[w];m.clearRect(0,0,l,g),m.save(),renderingX.renderColor(m,new d(l,g),new f,v.color);var b=v.imgSrc;if(""!==b){var y=s.join(n,b),j=this.getTargetImage(y);if(!j){var x=new Image;try{x.src=r(y),this.addImage(y,x),j=x}catch(e){j=null}}renderingX.renderImage(m,new d(l,g),new f,j,new f,new d(l,g))}var I=e.id.split(".").join(""),S=I+"-"+w+".png",C=s.join(i,S);p.output(C,function(e){e?a&&a(e):(v.imgSrc=s.join(o||"",S),h-=1,h<=0&&a&&a())}.bind(this)),m.restore()}.bind(this))}else a&&a()},o.prototype.renderOscilloscope=function(e,n,i,o,a){var c=e.info,l=c.width,g=c.height;if(c){var u=new t(l,g),h=u.getContext("2d");h.clearRect(0,0,l,g);var w=e.texList[0].slices[0];if(renderingX.renderColor(h,new d(l,g),new f,w.color),""!==w.imgSrc){var p=s.join(n,w.imgSrc),m=this.getTargetImage(p);if(!m){var v=new Image;try{v.src=r(p),this.addImage(p,v),m=v}catch(e){m=null}}renderingX.renderImage(h,new d(l,g),new f,m,new f,new d(l,g))}renderingX.renderGrid(h,new d(l,g),new f,new d(c.spacing,c.spacing),new f);var b=e.id.split(".").join(""),y=b+"-1.png",j=s.join(i,y);u.output(j,function(e){e?a&&a(e):(w.imgSrc=s.join(o||"",y),a&&a())}.bind(this))}else a&&a()},o.prototype.renderTextArea=function(e,n,i,o,a){var c=e.info,l=c.width,g=c.height;if(c){var u={},h={};h["font-style"]=e.info.fontItalic,h["font-weight"]=e.info.fontBold,h["font-size"]=e.info.fontSize,h["font-family"]=e.info.fontFamily,h["font-color"]=e.info.fontColor,u.color=h["font-color"],u.font=(h["font-style"]||"")+" "+(h["font-variant"]||"")+" "+(h["font-weight"]||"")+" "+(h["font-size"]||24)+"px "+(h["font-family"]||"arial"),u.textAlign="center",u.textBaseline="middle";var w=new t(l,g),p=w.getContext("2d");p.clearRect(0,0,l,g);var m=e.texList[0].slices[0];if(renderingX.renderColor(p,new d(l,g),new f,m.color),""!==m.imgSrc){var v=s.join(n,m.imgSrc),b=this.getTargetImage(v);if(!b){var y=new Image;try{y.src=r(v),this.addImage(v,y),b=y}catch(e){b=null}}renderingX.renderImage(p,new d(l,g),new f,b,new f,new d(l,g))}c.text&&""!==c.text&&renderingX.renderText(p,new d(l,g),new f,c.text,u,!0,new f(.5*l,.5*g),this.customFonts);var j=e.id.split(".").join(""),x=j+"-1.png",I=new Date,S=s.join(i,x);w.output(S,function(e){if(e)a&&a(e);else{m.imgSrc=s.join(o||"",x);var n=new Date;console.log("Output stream costs: ",(n-I)/1e3+"s"),a&&a()}})}else a&&a()},o.prototype.renderWidget=function(e,n,t,i,r){switch(e.subType){case"MyButton":this.renderButton(e,n,t,i,r);break;case"MyButtonGroup":this.renderButtonGroup(e,n,t,i,r);break;case"MySlide":this.renderSlide(e,n,t,i,r);break;case"MyOscilloscope":this.renderOscilloscope(e,n,t,i,r);break;case"MyTextArea":this.renderTextArea(e,n,t,i,r);break;case"MyDashboard":this.renderDashboard(e,n,t,i,r);break;default:r&&r()}},this.renderTest=function(n){var t={id:"0.0.0.5",info:{width:100,height:75,left:0,top:0,originX:"center",originY:"center",arrange:!0,buttonText:"button",buttonFontFamily:"Arial",buttonFontSize:20,buttonFontColor:"rgba(0,0,0,1)",buttonFontBold:"100",buttonFontItalic:"",boldBtnToggle:!1,italicBtnToggle:!1},normalImg:"",pressImg:"",name:"NewButton",type:"widget",expand:!0,url:"",buttonModeId:"0",zIndex:0,texList:[{name:"按钮纹理",currentSliceIdx:0,slices:[{color:"rgba(158,97,215,1.0)",imgSrc:"7373737373737373737373731468200611444.jpg",name:"按下前"},{color:"rgba(225,136,192,1.0)",imgSrc:"",name:"按下后"}]}],selected:!1,current:!1,actions:[{title:"action0",trigger:"Press",commands:[[{name:"INC",symbol:"+"},{tag:"a",value:""},{tag:"",value:"1"}]]}],subType:"MyButton"},i=function(e){e&&console.log(e),console.log("ok")},r=new o,a=e.getResourceUrl();r.renderButton(t,a,a,null,i)},this.renderProject=function(n,t,i){function r(e){console.log(e),d||(i&&i(),d=!0)}function a(){console.log("zip ok"),t&&t()}function l(e,n){g.compress(e,n,function(e){e?r(e):a()}.bind(this))}console.log(n);for(var d=!1,f=e.getProjectUrl(),u=e.getResourceUrl(),h=s.join(u,"data.json"),w=[],p=0;p<n.pageList.length;p++)for(var m=n.pageList[p],v=0;v<m.canvasList.length;v++)for(var b=m.canvasList[v],y=0;y<b.subCanvasList.length;y++)for(var j=b.subCanvasList[y],x=0;x<j.widgetList.length;x++)w.push(j.widgetList[x]);var I=w.length;if(I>0)for(var S=!0,C=function(e){e?(S=!1,r("generate error")):(I-=1,I<=0&&S&&(console.log("trans finished"),c.writeFile(h,JSON.stringify(n,null,4),function(e){if(e)r(e);else{console.log("write ok");var n=s.join(f,"resources"),t=s.join(f,"file.zip");l(t,n)}})))}.bind(this),B=new o,L=s.join(global.__dirname,s.dirname(window.location.pathname)),T=0;T<w.length;T++){var X=w[T];B.renderWidget(X,L,u,u,C)}else c.writeFile(h,JSON.stringify(n,null,4),function(e){if(e)r(res,500,e);else{var n=s.join(f,"resources"),t=s.join(f,"file.zip");l(t,n)}})}}}]);