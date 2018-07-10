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

import AGDraw from "./AGDraw"

class IdentityAffineTransform extends AffineTransform{
    constructor(){
        super(1,0,0,1,0,0)
    }
}

export class AGView {
    constructor(origin=new AGPoint(),size=new AGSize()){
        this.frame = new AGRect(origin,size)
        this.bounds = new AGRect(new AGPoint(),size)
        this.hidden = false
        this.alpha = 1.0
        this.backgroundColor = new AGColor(255,0,0,1.0)
        this.canTouch = true
        this.parent = null
        this.children = []
        this.transform = new IdentityAffineTransform()
        this.layer = null
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

    draw(){
        this.drawLayer()
        this.children.forEach(c=>c.draw())
    }

    drawLayer(){
        //override
        let backRect = new AGRect(this.bounds.origin,this.bounds.size)
        backRect.fillStyle = this.backgroundColor
        backRect.strokeStyle = null
        AGDraw.canvas.drawRect(this,backRect)
    }
}