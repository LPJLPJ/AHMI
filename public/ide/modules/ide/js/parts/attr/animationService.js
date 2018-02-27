/**
 * Created by lixiang on 2016/10/19.
 */
ideServices.service('AnimationService', [function () {
    //Animation 构造函数
    function Animation(title, id, srcX, srcY, srcScaleX, srcScaleY, dstX, dstY, dstXScale, dstYScale, duration) {
        this.title = title;
        this.id = id;
        this.animationAttrs = {
            translate: {
                srcPos: {
                    x: {
                        value: srcX,
                        tag: ''
                    },
                    y: {
                        value: srcY,
                        tag: ''
                    }
                },
                dstPos: {
                    x: {
                        value: dstX,
                        tag: ''
                    },
                    y: {
                        value: dstY,
                        tag: ''
                    }
                }
            },
            scale: {
                srcScale: {
                    x: {
                        value: srcScaleX,
                        tag: ''
                    },
                    y: {
                        value: srcScaleY,
                        tag: ''
                    }
                },
                dstScale: {
                    x: {
                        value: dstXScale,
                        tag: ''
                    },
                    y: {
                        value: dstYScale,
                        tag: ''
                    }
                }
            }
        };
        this.duration = duration;
        this.timingFun = '';
    }

    //过渡动画构造函数
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
    var transitionModes = [noTransition,moveLR,moveRL,moveBT,moveTB,pushLR,pushRL,pushTB,pushBT,swipeH,swipeV,fadeInFadeOut,scale];


    this.getNewAnimation = function () {
        return new Animation('动画', null, 0, 0, 1, 1, 0, 0, 1, 1, 1000);
    };


    this.getTransitionModes = function () {
        return _.cloneDeep(transitionModes);
    };

    this.getDefaultTransition = function () {
        return new Transition('NO_TRANSITION', '无动画', 0);
    }

}]);