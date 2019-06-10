/**
 * Created by lixiang on 2016/10/19.
 */
ideServices.service('AnimationService', ['ProjectService', 'Type', function (ProjectService, Type) {
    function Animation(title, id, srcX, srcY, srcScaleX, srcScaleY, dstX, dstY, dstXScale, dstYScale, duration, advanceMode) {
        this.title = title;
        this.id = id;
        this.animationAttrs = {
            translate: {
                srcPos: {
                    x: srcX,
                    y: srcY,
                },
                dstPos: {
                    x: dstX,
                    y: dstY,
                }
            },
            scale: {
                srcScale: {
                    x: srcScaleX,
                    y: srcScaleY
                },
                dstScale: {
                    x: dstXScale,
                    y: dstYScale
                }
            }
        };
        this.duration = duration;
        this.timingFun = '';
        this.advanceMode = advanceMode || false;
    }

    function Transition(name, show, duration) {
        this.name = name || '';
        this.show = show || '';
        this.duration = duration;
    }

    var noTransition = new Transition('NO_TRANSITION', '无动画', 0);
    var moveLR = new Transition('MOVE_LR', '从左进入(遮盖)', 1);
    var moveRL = new Transition('MOVE_RL', '从右进入(遮盖)', 1);
    var moveTB = new Transition('MOVE_TB', '从上进入(遮盖)', 1);
    var moveBT = new Transition('MOVE_BT','从下进入(遮盖)',1);
    var pushLR = new Transition('PUSH_LR','从左进入(推挤)',1);
    var pushRL = new Transition('PUSH_RL','从右进入(推挤)',1);
    var pushTB = new Transition('PUSH_TB','从上进入(推挤)',1);
    var pushBT = new Transition('PUSH_BT','从下进入(推挤)',1);
    var swipeH = new Transition('SWIPE_H','水平滑动',1);
    var swipeV = new Transition('SWIPE_V','垂直滑动',1);
    var fadeInFadeOut = new Transition('FADE-IN_FADE-OUT','淡入淡出',1);
    var scale = new Transition('SCALE', '缩放', 1);
    var transition = [noTransition,moveLR,moveRL,moveBT,moveTB,scale];


    var tempAnimation = new Animation('动画', null, null, null, 1, 1, 0, 0, 1, 1, 0);
    var defaultAnimation = [tempAnimation];

    var animations = [];

    this.setAnimations = function (newAnimations) {
        if (newAnimations) {
            animations = newAnimations;
        } else {
            animations = [];
        }
    };

    this.getAllAnimations = function () {
        return animations;
    };

    this.appendAnimation = function (newAnimation, cb) {
        animations.push(newAnimation);
        ProjectService.ChangeAttributeAnimation(_.cloneDeep(animations));
        cb && cb();
    };

    this.getNewAnimation = function () {
        return new Animation('动画', null, 0, 0, 1, 1, 0, 0, 1, 1, 1000);
    };

    this.updateAnimationByIndex = function (animation, index, cb) {
        if (index >= 0 && index < animations.length) {
            animations[index] = animation;
            ProjectService.ChangeAttributeAnimation(_.cloneDeep(animations));
            cb && cb();
        }
    };

    this.deleteAnimationByIndex = function (index, sCB, fCB) {
        if (index < 0 && index >= animations.length) {
            fCB && fCB();
            return false;
        } else {
            animations.splice(index, 1);
            ProjectService.ChangeAttributeAnimation(_.cloneDeep(animations));
            sCB && sCB();
            return true;
        }
    };

    this.getAllTransititon = function () {
        return _.cloneDeep(transition);
    };

    this.getDefaultTransition = function () {
        return new Transition('NO_TRANSITION', '无动画', 1000);
    };

}]);