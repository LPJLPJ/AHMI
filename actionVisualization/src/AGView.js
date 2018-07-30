/**
 *  Baisc View
    created by Zzen1sS
 **/

/**
 * AGView
 * frame
 * bounds
 * hidden
 * alpha
 * backgroundColor
 * canTouch
 * parent
 * children
 * transform
 * layer
 */

import {AGSize, AGPoint, AGColor, AGRect, AffineTransform, Transform} from "./AGProperties";

import {Matrix,Vector} from "../AGMatrix";

import {AGEventManager,AGEvent} from "./AGEvent";

import AGDraw from "./AGDraw"


class IdentityAffineTransform extends AffineTransform{
    constructor(){
        super(1,0,0,1,0,0)
    }
}

export class AGView {
    constructor(origin=new AGPoint(),size=new AGSize(),opts={}){
        this.frame = new AGRect(origin,size)
        this.bounds = new AGRect(new AGPoint(),size)

        this.hidden = false
        this.alpha = 1.0
        this.backgroundColor = new AGColor(255,255,255,1.0)
        this.canTouch = true
        let optKeys = ['hidden','alpha','backgroundColor','canTouch']
        optKeys.forEach(k=>{
            if (k in opts){
                this[k] = opts[k]
            }
        })


        this.parent = null
        this.children = []
        this.transform = new IdentityAffineTransform()
        this.layer = null
    }

    isPosHitView(pos){
        return this.frame.inRect(pos)
    }


    updateSize(width=0,height=0){
        this.frame.size.width = width
        this.frame.size.height = height
        this.bounds.size.width = width
        this.bounds.size.height = height
        if (this.layer){
            AGDraw.canvas.updateLayer(this)
        }
    }

    center(){
        let pointX = this.frame.origin.x + 0.5 * this.frame.size.width
        let pointY = this.frame.origin.y + 0.5 * this.frame.size.height
        return new AGPoint(pointX,pointY)
    }

    //transform
    static transformToMatrix(t){
        return new Matrix([t.a,t.b,t.e,t.c,t.d,t.f,t.g,t.h,t.i])
    }
    static matrixToTransform(m){
        return new Transform(m.m00,m.m01,m.m10,m.m11,m.m02,m.m12,m.m20,m.m21,m.m22)
    }
    translate(x,y){
        this.transform = AGView.matrixToTransform(AGView.transformToMatrix(this.transform).mulMatrix(new Matrix([1,0,x,0,1,y,0,0,1])))
    }

    rotate(rad){

    }

    resetMatrix(){
        this.transform = new IdentityAffineTransform()
    }

    initLayer(id){
        AGDraw.canvas.initLayer(this,id)
    }

    //add to parent view
    addToParentView(parentView){
        parentView.children.push(this)
        this.parent = parentView
    }

    //add child view

    addChildView(childView){
        this.children.push(childView)
        childView.parent = this
    }

    removeChildView(childView){
        for(let i=0;i<this.children.length;i++){
            if (this.children[i]===childView){
                childView.parent = null
                this.children.splice(i,1)
                return
            }
        }
    }

    draw(){
        if (!this.hidden){
            this.drawLayer()
            this.children.forEach(c=>c.draw())
        }

    }

    drawLayer(){
        //override
        let backRect = new AGRect(this.bounds.origin,this.bounds.size)
        backRect.fillStyle = this.backgroundColor
        backRect.strokeStyle = null
        AGDraw.canvas.drawRect(this,backRect)
    }


    //event system
    on(eventType,handler){
        let eventManager = AGEventManager.getEventManager()
        eventManager.register(this,eventType,handler)
    }

    cancelOn(eventType,handler){
        let eventManager = AGEventManager.getEventManager()
        eventManager.unRegister(this,eventType,handler)
    }
}