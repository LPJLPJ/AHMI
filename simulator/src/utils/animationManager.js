/**
 * Created by ChangeCheng on 2016/10/16.
 */

var EasingFunctions = require('./easing');
var AnimationManager = {};

var animationKeys = [];
AnimationManager.animationKeys = animationKeys;
AnimationManager.deleteAnimationKey = function (key) {
    for (var i=0;i<this.animationKeys.length;i++){
        if (this.animationKeys[i]===key){
            this.animationKeys.splice(i,1);
            return true;
        }
    }
    return false;
};
AnimationManager.clearAnimationKey = function (key) {
    clearInterval(key);
    this.deleteAnimationKey(key);
}
AnimationManager.clearAllAnimationKeys = function () {
    for (var i=0;i<this.animationKeys.length;i++){
        clearInterval(this.animationKeys[i]);
    }
    this.animationKeys = [];
}

AnimationManager.moving = function (srcX,srcY,dstX,dstY,duration,frames,easing,intervalCb,finishCb) {
    var easingFunc = EasingFunctions[easing] || EasingFunctions.linear;
    var lastValue = 0;
    var curValue =0;
    var count = frames;
    var deltaX=0;
    var deltaY=0;
    var rangeX = dstX-srcX;
    var rangY = dstY - srcY;
    var animationKey = setInterval(function () {
        // offctx.transform(1,0,0,1,0,0,maxD-(frames-count)*maxD/frames);
        // offctx.save();
        curValue = easingFunc((frames-count)/frames);
        deltaX = rangeX*(curValue-lastValue);
        deltaY = rangY*(curValue-lastValue);
        curX = srcX+rangeX * curValue;
        curY = srcY+rangY * curValue;
        lastValue = curValue;
        intervalCb && intervalCb({curX:curX,curY:curY,deltaX:deltaX,deltaY:deltaY});

        count--;
        if (count<0){
            //finished
            this.clearAnimationKey(animationKey);
            finishCb && finishCb();
        }
    }.bind(this),duration/frames);
    animationKeys.push(animationKey);

}


AnimationManager.scaling = function (srcX,srcY,dstX,dstY,duration,frames,easing,intervalCb,finishCb) {
    var easingFunc = EasingFunctions[easing] || EasingFunctions.linear;
    var lastValue = 0;
    var curValue =0;
    var count = frames;
    var deltaX=0;
    var deltaY=0;
    var rangeX = dstX-srcX;
    var rangY = dstY - srcY;
    var animationKey = setInterval(function () {
        // offctx.transform(1,0,0,1,0,0,maxD-(frames-count)*maxD/frames);
        // offctx.save();
        curValue = easingFunc((frames-count)/frames);
        deltaX = rangeX*(curValue-lastValue);
        deltaY = rangY*(curValue-lastValue);
        curX = srcX+rangeX * curValue;
        curY = srcY+rangY * curValue;
        lastValue = curValue;
        intervalCb && intervalCb({curX:curX,curY:curY,deltaX:deltaX,deltaY:deltaY});

        count--;
        if (count<0){
            //finished
            this.clearAnimationKey(animationKey);
            finishCb && finishCb();
        }
    }.bind(this),duration/frames);
    animationKeys.push(animationKey);

}

module.exports = AnimationManager;