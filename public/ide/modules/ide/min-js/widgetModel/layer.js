!function(t){"function"==typeof define&&define.amd?define("LayerModel",[],t):"object"==typeof module&&module.exports?module.exports=t():window.LayerModel=t()}(function(){function t(t,o,e,r,i,n,c){this.subLayers={roi:null,font:null,texture:null,color:null},this.x=t||0,this.y=o||0,this.width=e||0,this.height=r||0,this.hidden=i||!1,this.interaction=n||!0,this.validSubLayer=c||7}function o(t,o){this.width=t,this.height=o}function e(t,e,r,i,n,c){o.call(this,t,e),this.p1=r,this.p2=i,this.p3=n,this.p4=c}function r(t,e,r,i){o.call(this,t,e),this.text=r,this.fontStyle=i}function i(t,e,r){o.call(this,t,e),this.texture=r}function n(t,e,r){o.call(this,t,e),this.color=r}e.prototype=Object.create(o.prototype),e.prototype.constructor=e,r.prototype=Object.create(o.prototype),r.prototype.constructor=r,i.prototype=Object.create(o.prototype),i.prototype.constructor=i,n.prototype=Object.create(o.prototype),n.prototype.constructor=n;var c={Layer:t,ROISubLayer:e,FontSubLayer:r,TextureSubLayer:i,ColorSubLayer:n};return c});