/**
 * Created by changecheng on 2017/3/8.
 */


function Layer(w,h,hidden,interaction) {
    this.subLayers = {
        roi:null,
        font:null,
        texture:null,
        color:null
    };
    this.width = w;
    this.height = h;
    this.hidden = hidden||false;
    this.interaction = interaction||true;
}

function SubLayer(x,y,w,h) {
    this.x = x
    this.y = y
    this.width = w
    this.height = h
    this.hidden = false
}

//roi
function ROISubLayer(x,y,w,h,basePoint,theta,beta) {
    SubLayer.call(this,x,y,w,h)
    this.basePoint = basePoint;
    this.theta = theta;
    this.beta = beta
}


ROISubLayer.prototype = Object.create(SubLayer.prototype);

ROISubLayer.prototype.constructor = ROISubLayer;

//font
function FontSubLayer(x,y,w,h,text,fontStyle) {
    SubLayer.call(this,x,y,w,h)
    this.text = text;
    this.fontStyle = fontStyle;
}
FontSubLayer.prototype = Object.create(SubLayer.prototype);

FontSubLayer.prototype.constructor = ROISubLayer;

//img
function TextureSubLayer(x,y,w,h,texture) {
    SubLayer.call(this,x,y,w,h)
    this.texture = texture;
}
TextureSubLayer.prototype = Object.create(SubLayer.prototype);

TextureSubLayer.prototype.constructor = ROISubLayer;

//color
function ColorSubLayer(x,y,w,h,color) {
    this.color = color;
}
ColorSubLayer.prototype = Object.create(SubLayer.prototype);

ColorSubLayer.prototype.constructor = ROISubLayer;

