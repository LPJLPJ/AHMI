ideServices.service("ResourceService",[function(){var e=!1;try{require("path"),e=!0}catch(e){}var t=new Image;t.src="";var n=[{id:"blank",src:"blank",name:"blank",content:t,complete:!0}],r=[],i=[],o=0,c="",s="",a="",u=function(){var e=document.createElement("style");return e.appendChild(document.createTextNode("xxx")),document.head.appendChild(e),e}(),l=u.sheet;window.fontStyle=u,this.getGlobalResources=function(){return n},this.setGlobalResources=function(e){n=e},this.setTemplateFiles=function(e){i=e},this.getResourceFromCache=function(e,t){t=t||"src";for(var r=0;r<n.length;r++)if(n[r][t]==e)return n[r].complete?n[r].content:null;return null},this.setResourceNWUrl=function(e){s=e},this.getResourceNWUrl=function(){return s},this.setProjectUrl=function(e){a=e},this.getProjectUrl=function(){return a},this.getAllResource=function(){return r},this.setFiles=function(e){r=e||[]},this.getExt=function(e){var t=e.split(".");return t[t.length-1].toLowerCase()},this.syncFiles=function(e){r=e||[]},this.getAllCustomResources=function(){return r.slice()},this.getAllImages=function(){return _.filter(r,function(e){return!(!e.type||"image"!=e.type.split("/")[0]||"blank.png"==e.id)})},this.getAllImagesAndTemplates=function(){var e=_.filter(r,function(e){return!(!e.type||"image"!=e.type.split("/")[0]||"blank.png"==e.id)});return e=e.concat(i)},this.getAllFontResources=function(){return _.filter(r,function(e){var t=this.getExt(e.id);return"ttf"===t||"woff"===t}.bind(this))},this.ResourcesLength=function(){return r.length},this.getCurrentTotalSize=function(){for(var e=0,t=0;t<r.length;t++)e+=r[t].size;return e},this.setMaxTotalSize=function(e){o=e},this.getMaxTotalSize=function(){return o},this.getResourceByIndex=function(e){return r[e]},this.appendFile=function(e,t){r.push(e),t&&t()},this.addWebFont=function(t,n){console.log("font: ",t,n,t);var r=t.name.split(".")[0],i=t.src;e&&process&&process.platform&&-1!=process.platform.indexOf("win")&&(i=i.replace(/\\/g,"/"));var o="@font-face {font-family: '"+r+"'; src:url('"+i+"') format('"+n+"') ;} ";l.insertRule(o,0)},this.cacheFile=function(e,t,r,i){var o={};if(o.id=e.id,o.type=e.type,o.name=e.name,o.src=e.src,e.type.match(/image/)){var c=new Image;o.content=c,c.onload=function(e){o.complete=!0,r&&r(e,o)},c.onerror=function(e){o.complete=!1,i&&i(e,o)},c.src=e.src,n.push(o)}else if("ttf"===this.getExt(e.id)||"woff"===this.getExt(e.id)){var s,a=this.getExt(e.id);console.log(a),"ttf"===a?s="truetype":"woff"===a&&(s="woff"),this.addWebFont(e,s),o.type="font/"+s,n.push(o),console.log("added",n),r&&r({type:"ok"},o)}else r&&r({type:"ok"},{})},this.cacheFileToGlobalResources=function(e,t,r){this.cacheFile(e,n,t,r)},this.deleteFileCache=function(e){for(var t=0;t<n.length;t++)if(e==n[t].id)return n.splice(t,1),!0;return!1},this.appendFileUnique=function(e,t,n){t(e,r)&&(r.push(e),n&&n()),console.log(r)},this.deleteFileByIndex=function(e,t,n){var i=!1;return e>=0&&e<=r.length-1?(this.deleteFileCache(r[e].id),r.splice(e,1),i=!0):i=!1,i?(t&&t(),!0):(n&&n(),!1)},this.deleteFileById=function(e,t,n){for(var i=!1,o=0;o<r.length;o++){if(r[o].id==e){this.deleteFileCache(r[o].id),r.splice(o,1),i=!0;break}i=!1}return i?(t&&t(),!0):(n&&n(),!1)},this.setResourceUrl=function(e){c=e},this.getResourceUrl=function(){return c}}]).factory("uploadingService",["$http",function(e){var t=function(t,n,r){return e({method:"POST",data:t,url:n,params:r,headers:{"Content-Type":void 0}})};return{upload:function(e,n){return t(e,n)}}}]).factory("idService",[function(){var e=function(e,t){for(var n=0,r=0;r<e.length;r++)n+=parseInt(e.charCodeAt(0),10);return n=(n+Number(t)).toString(16)},t=function(e){for(var t=0,n=0;n<e.length;n++)t+=parseInt(e.charCodeAt(0),10);return t=(t+Number(date)).toString(16)};return{generateId:function(n,r){return r?e(n,r):t(n)}}}]),ideServices.directive("filereadform",["uploadingService","idService","ResourceService","Upload",function(e,t,n,r){return{restrict:"AE",template:"<input type='file' ngf-select='uploadFiles($files)'  ngf-multiple='true' />",replace:"true",link:function(e,i,o){function c(e){var t=e.name.split(".");switch(t[t.length-1].toLowerCase()){case"png":case"jpg":case"bmp":case"jpeg":case"tiff":case"ttf":case"woff":return!0;default:return!1}}function s(t){for(var n=e.component.top.uploadingArray,r=0;r<n.length;r++)if(n[r].id==t.id){n.splice(r,1);break}}function a(e,t){window.local?u(e,t):l(e,t)}function u(t,r){if(n.getCurrentTotalSize()>n.getMaxTotalSize())return toastr.info("资源超过限制"),void s(r);var i=function(){n.appendFileUnique(r,function(e,t){for(var n=0;n<t.length;n++)if(t[n].id==e.id)return!1;return!0},function(){n.cacheFileToGlobalResources(r,function(){s(r),e.$emit("ResourceUpdate")}.bind(this))}.bind(this))},o=function(){r.progress="上传失败",s(r)},c=function(e){r.progress=Math.round(1*e.loaded/e.total*100)+"%",console.log(r.progress)},a=n.getResourceUrl(),u=d.join(a,r.id);!function(e,t,n,r,i){var o,c,s,a=p.createWriteStream(t);try{console.log(e),o=p.createReadStream(e),c=p.statSync(e),s=c.size}catch(e){return void console.log("err load file",e)}a.on("finish",function(){n&&n()}),a.on("error",function(e){r&&r(e)}),o.on("data",function(e){var t={loaded:a.bytesWritten,total:s};i&&i(t)}),o.pipe(a)}(t.path,u,i,o,c)}function l(t,i){if(n.getCurrentTotalSize()>n.getMaxTotalSize())return toastr.info("资源超过限制"),void s(i);var o=function(t){console.log(t),200==t.status?n.appendFileUnique(i,function(e,t){for(var n=0;n<t.length;n++)if(t[n].id==e.id)return!1;return!0},function(){n.cacheFileToGlobalResources(i,function(){s(i),console.log("updating fonts"),e.$emit("ResourceUpdate")}.bind(this))}.bind(this)):(console.error(t),s(i),e.$emit("ResourceUpdate"))},c=function(e){switch(console.error(e),i.progress="上传失败",e.data.errMsg){case"not logged in":toastr.info("请重新登录");break;case"user not valid":toastr.info("请登录")}s(i)},a=function(e){i.progress=Math.round(1*e.loaded/e.total*100)+"%"};r.upload({url:"/project/"+n.getResourceUrl().split("/")[2]+"/upload",data:{file:t,name:i.id}}).then(o,c,a)}function f(e){var r,i={};if(r=h?n.getResourceNWUrl()+d.sep:n.getResourceUrl(),!e.name)return null;var o=e.name.split("."),c=t.generateId(e.name,Date.now())+"."+o[o.length-1],s=new FormData;return s.append("file",e),s.append("name",c),_.extend(i,e),i.id=c,i.name=o.slice(0,-1).join(""),i.src=r+i.id,i}var d,p,h=!1;try{d=require("path"),p=require("fs"),h=!0}catch(e){}n.getResourceUrl();e.uploadFiles=function(t){if(t&&t.length){t=t.filter(c);for(var n=0;n<t.length;n++){var r=f(t[n]);e.component.top.uploadingArray.push(r),a(t[n],r)}}}}}}]);