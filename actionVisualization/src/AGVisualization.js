import {AGView} from "./AGView";
import {AGPoint, AGRect, AGSize, AGColor, AGLine, AGText, AGFont} from "./AGProperties";
import {AGWindow} from "./AGWindow";
import AGDraw from "./AGDraw"

import {AGNode,AGEdge,AGLayoutDefault} from "./AGLayout";

export class AGWidget extends AGView{
    constructor(origin,size,opts={}){
        super(origin,size,opts)
        //self values
        this.draggable = false


        //inner
        this.dragStartPos=null
        this.lastOrigin = null
    }

    mouseDownHandler(e){
        this.dragStartPos=new AGPoint(e.pageX,e.pageY)
        this.lastOrigin=new AGPoint(this.frame.origin.x,this.frame.origin.y)
    }

    dragHandler(e){
        let curMousePos = new AGPoint(e.pageX,e.pageY)
        this.frame.origin.x = this.lastOrigin.x+curMousePos.x - this.dragStartPos.x
        this.frame.origin.y = this.lastOrigin.y+curMousePos.y - this.dragStartPos.y
        // console.log(this.frame.origin.x,this.frame.origin.y)
        this.parent&&this.parent.draw()

    }

    toggleDraggable(canDrag){
        if (canDrag !== this.draggable){
            if (canDrag){
                this.on('mousedown',this.mouseDownHandler.bind(this))
                this.on('drag',this.dragHandler.bind(this))
            }else{
                this.cancelOn('mousedown',this.mouseDownHandler.bind(this))
                this.cancelOn('drag',this.dragHandler.bind(this))
            }
        }
    }
}

export class AGLabel extends AGWidget{
    constructor(origin,size,text='',font=new AGFont(),opts={}){
        super(origin,size,opts)
        this.text = text
        this.font = font
    }

    drawLayer(){
        super.drawLayer()
        AGDraw.canvas.drawText(this,new AGText(new AGPoint(this.bounds.origin.x+0.5*this.bounds.size.width,this.bounds.origin.y+0.5*this.bounds.size.height),this.text))
    }
}