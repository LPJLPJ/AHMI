(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.AnimationAPI = factory();
    }
}(function () {

    var AnimationAPI = {}

    function copy(aObject) {
        if (typeof aObject !== 'object') {
            return aObject
        }
        if (aObject === null) {
            return aObject
        }
        var bObject, v, k;
        if (aObject instanceof Date) {
            return new Date(aObject)
        }
        bObject = Array.isArray(aObject) ? [] : {};
        for (k in aObject) {
            v = aObject[k];
            bObject[k] = copy(v)
        }
        return bObject;
    }

    var timingFunctions = {
        // no easing, no acceleration
        linear: function (t) { return t },
        // accelerating from zero velocity
        easeInQuad: function (t) { return t*t },
        // decelerating to zero velocity
        easeOutQuad: function (t) { return t*(2-t) },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        // accelerating from zero velocity
        easeInCubic: function (t) { return t*t*t },
        // decelerating to zero velocity
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        // accelerating from zero velocity
        easeInQuart: function (t) { return t*t*t*t },
        // decelerating to zero velocity
        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        // accelerating from zero velocity
        easeInQuint: function (t) { return t*t*t*t*t },
        // decelerating to zero velocity
        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },

        spring:function (t) {
            return -0.5 * Math.exp(-6*t)*(-2*Math.exp(6*t)+Math.sin(12*t)+2*Math.cos(12*t))
        }
    }

    var stateTypes = {
        idle:'idle',
        running:'running',
        paused:'paused'
    }

    function State(stateType,repeat,curFrame,curValue) {
        this.stateType = stateType || stateTypes.idle
        this.repeat = repeat || 0
        this.curFrame = curFrame || 0
        this.curValue = curValue
    }


    function interpolateValueWithFactor(startValue,stopValue,factor) {
        if (typeof startValue === 'object') {
            if (Array.isArray(startValue)) {
                return startValue.map(function (sv,i) {
                    return interpolateValueWithFactor(sv,stopValue[i],factor)
                })
            }else if (startValue instanceof Date) {
                var startSeconds = Number(startValue)
                var stopSeconds = Number(stopValue)
                return new Date(startSeconds+factor*(stopSeconds-startSeconds))
            }else{
                var iObject = {}
                for(var key in startValue){
                    iObject[key] = interpolateValueWithFactor(startValue[key],stopValue[key],factor)
                }
                return iObject
            }
        }else{
            return startValue + factor * ( stopValue - startValue)
        }
    }



    function Animation(refObj,refKey,startValue,stopValue,duration) {
        if (refObj !== null && typeof refObj==='object') {
            this.refObj = refObj

        }else{
            this.refObj = window

        }
        this.key = refKey
        if (typeof startValue !== typeof stopValue) {
            throw Error('start value should be same type as stopValue')
        }else{
            this.startValue = copy(startValue)
            this.stopValue = copy(stopValue)
        }
        this.duration = Number(duration)||0
        this.fps = 30
        this.startDelay = 0
        this.autoReverse = false
        this.repeatCount = 1
        this.appliedOnComplete = false
        this.timingFunction = timingFunctions.linear
        this.state = new State()
        this.lastState = null

        //events
        this.didStartCB = null
        this.onFrameCB = null
        this.didPauseCB = null
        this.didStopCB = null

        //internal vars
        this.timerId = 0
        this.singleRoundFrames = 0

    }

    Animation.prototype.interpolateValue = function () {
        var singleRoundFrames = this.singleRoundFrames
        var curFrame = this.state.curFrame
        var startValue = this.startValue
        var stopValue = this.stopValue

        var factor
        if (this.state.reversing) {
            factor = this.timingFunction(1.0*(singleRoundFrames-curFrame-1)/singleRoundFrames)
        }else{
            factor = this.timingFunction(1.0*(curFrame+1)/singleRoundFrames)
        }
        this.state.curValue = interpolateValueWithFactor(startValue,stopValue,factor)

    }

    var startHandler = function () {
        //stop if paused
        if (this.state.stateType === stateTypes.paused) {
            if (this.timerId) {
                clearInterval(this.timerId)
            }
            this.didPauseCB && this.didPauseCB()
        }


        this.lastState = copy(this.state)

        //stop if finished
        var nextFrame = this.state.curFrame+1
        var nextRepeat
        if (nextFrame > this.singleRoundFrames-1) {
            if (this.autoReverse) {
                if (this.state.reversing) {
                    //one loop finished
                    nextRepeat = this.state.repeat+1
                    if (this.repeatCount>0 && nextRepeat > this.repeatCount-1) {
                        return this.stop()
                    }else{
                        this.state.repeat++
                    }
                }
                this.state.reversing = !this.state.reversing
            }else{
                //single round finished
                nextRepeat = this.state.repeat+1
                if (this.repeatCount>0 && nextRepeat > this.repeatCount-1) {
                    return this.stop()
                }else{
                    this.state.repeat++
                }
            }


        }

        this.state.stateType = stateTypes.running
        this.state.curFrame++
        // this.state.repeat = Math.floor(this.state.curFrame/this.singleRoundFrames)
        this.state.curFrame = this.state.curFrame % this.singleRoundFrames
        this.interpolateValue()
        if (this.key!==null) {
            this.refObj[this.key] = this.state.curValue
        }

        this.onFrameCB && this.onFrameCB()
    }

    Animation.prototype.start = function () {
        if (this.state.stateType === stateTypes.idle) {
            setTimeout(function () {
                this.didStartCB && this.didStartCB()
                //
                this.singleRoundFrames = this.duration/1000*this.fps
                this.timerId = setInterval(startHandler.bind(this),1000/this.fps)
            }.bind(this),this.startDelay)
        }

    }

    Animation.prototype.pause = function () {
        if (this.state.stateType === stateTypes.running) {
            this.state.stateType = stateTypes.paused
        }


    }

    Animation.prototype.resume = function () {
        if (this.state.stateType === stateTypes.paused) {
            this.timerId =  setInterval(startHandler.bind(this),1000/this.fps)
        }

    }

    Animation.prototype.stop = function () {
        if (this.state.stateType !== stateTypes.idle) {
            this.state.stateType = stateTypes.idle
            if (this.timerId) {
                clearInterval(this.timerId)
            }
            this.didStopCB && this.didStopCB()
        }

    }


    //key frame animation

    function KeyFrameAnimation(refObj,refKey,values,timings,duration) {
        Animation.call(this,refObj,refKey,null,null,duration)
        this.values = values
        this.timings = timings
    }

    KeyFrameAnimation.prototype = Object.create(Animation.prototype)
    KeyFrameAnimation.prototype.constructor = KeyFrameAnimation


    KeyFrameAnimation.prototype.interpolateValue = function () {
        var singleRoundFrames = this.singleRoundFrames
        var curFrame = this.state.curFrame
        if (this.state.reversing) {
            curFrame = singleRoundFrames - curFrame
        }
        var frameFactor = 1.0*(curFrame+1)/singleRoundFrames
        var leftPos = calFramePosInKeyFrames(this.timings,curFrame,singleRoundFrames)
        var startValue = this.values[leftPos]
        var stopValue = this.values[leftPos+1]



        var factor = (frameFactor-this.timings[leftPos])/(this.timings[leftPos+1]-this.timings[leftPos])
        factor = this.timingFunction(factor)
        this.state.curValue = interpolateValueWithFactor(startValue,stopValue,factor)
    }


    function calFramePosInKeyFrames(timings,curFrame,singleRoundFrames) {
        // if (timings[timings.length-1]!=1.0) {
        //     timings.push(1.0)
        // }
        var frameFactor = 1.0*(curFrame+1)/singleRoundFrames
        for(var i=0;i<timings.length;i++){
            if (frameFactor<=timings[i]) {
                break
            }
        }
        return i-1
    }

    function calTimingFunctionBySpring(damping,stiffness,initialVelocity) {
        var c = damping
        var k = stiffness
        var v = initialVelocity
        var t = c*c - 4 * k
        var r1,r2
        var alpha,beta
        var f0
        var fp0
        f0 = 0 - 1
        fp0 = v
        var C1,C2
        if (t>0) {
            t = Math.sqrt(t)
            r1 = (-c+t)*0.5
            r2 = (-c-t)*0.5

            C1 = (fp0 - r2*f0)/(r1-r2)
            C2 = (fp0 - r1*f0)/(r2 - r1)
            console.log(r1,r2,C1,C2)
            return function (t) {
                return C1 * Math.exp(r1 * t) + C2 * Math.exp(r2 * t) + 1
            }

        }else if (t==0) {
            r1 = -c * 0.5
            C1 = f0
            C2 = fp0 - C1 * r1
            console.log(r1,C1,C2)
            return function (t) {
                return (C1 + C2 * t)*Math.exp(r1 * t) + 1
            }


        }else{
            t = Math.sqrt(-t)
            alpha = -c *0.5
            beta = t * 0.5

            C1 = f0
            C2 = (fp0-alpha*f0)/beta
            console.log(alpha,beta,C1,C2)


            return function (t) {
                return (C1 * Math.cos(beta*t) + C2 * Math.sin(beta*t)) * Math.exp(alpha * t) + 1
            }

        }
    }

    //Spring Animation
    function SpringAnimation(refObj,refKey,initialVelocity,damping,stiffness,startValue,stopValue,duration) {
        Animation.call(this,refObj,refKey,startValue,stopValue,duration)
        this.damping = damping
        this.stiffness = stiffness
        this.initialVelocity = initialVelocity|| 0
        this.timingFunction = calTimingFunctionBySpring(this.damping,this.stiffness,this.initialVelocity)
    }

    SpringAnimation.prototype = Object.create(Animation.prototype)
    SpringAnimation.prototype.constructor = SpringAnimation


    AnimationAPI.Animation = Animation

    AnimationAPI.KeyFrameAnimation = KeyFrameAnimation

    AnimationAPI.SpringAnimation =  SpringAnimation

    AnimationAPI.timingFunctions = timingFunctions


    return AnimationAPI
}))