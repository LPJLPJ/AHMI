!function(t){"function"==typeof define&&define.amd?define("LayerModel",[],t):"object"==typeof module&&module.exports?module.exports=t():window.LayerModel=t()}(function(){function t(t,e,o,i,r,s,n){this.subLayers={roi:null,font:null,image:null,color:null},this.x=t||0,this.y=e||0,this.width=o||0,this.height=i||0,this.rotateAngle=0,this.hidden=r||!1,this.validSubLayer=n||7,this.rotateCenterX=0,this.rotateCenterY=0}function e(){}function o(t,o,i,r,s,n,h,p,c,y,a){e.call(this),this.p1x=o||0,this.p1y=i||0,this.p2x=r||0,this.p2y=s||0,this.p3x=n||0,this.p3y=h||0,this.p4x=c||0,this.p4y=c||0,this.mode=t||0,this.alpha=y||0,this.beta=a||0}function i(t,o){e.call(this),this.text=t,this.fontStyle=o}function r(t){e.call(this),this.imgSrc=t}function s(t){e.call(this),this.r=t.r,this.g=t.g,this.b=t.b,this.a=t.a}return o.prototype=Object.create(e.prototype),o.prototype.constructor=o,i.prototype=Object.create(e.prototype),i.prototype.constructor=i,r.prototype=Object.create(e.prototype),r.prototype.constructor=r,s.prototype=Object.create(e.prototype),s.prototype.constructor=s,{Layer:t,ROISubLayer:o,FontSubLayer:i,TextureSubLayer:r,ColorSubLayer:s}});