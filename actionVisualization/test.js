
import {AGView} from "./src/AGView";
import {AGPoint,AGRect,AGSize,AGColor,AGLine,AGText} from "./src/AGProperties";
import {AGWindow} from "./src/AGWindow";
import AGDraw from "./src/AGDraw"

import {AGNode,AGEdge,AGLayoutDefault} from "./src/AGLayout";

import {AGLabel, AGWidget} from "./src/AGVisualization";


let viewWindow = new AGWindow(1000,1000,'container')
let rootView = new AGView(new AGPoint(50,50),new AGSize(800,800))
let subView = new AGView(new AGPoint(50,50),new AGSize(400,400))

let childView = new AGView(new AGPoint(),new AGSize(200,200))
subView.backgroundColor = new AGColor(0,255,0,1)
childView.backgroundColor = new AGColor(255,255,255,1)
console.log(rootView)
console.log(subView)


//custom view
class LineView extends AGView{
    constructor(start=new AGPoint(),stop=new AGPoint()){
        super()
        // this.lineShape = new AGLine(start,stop)
        // let boundingBox = this.lineShape.getBoundingBox()

        let relativePoint = stop.relative(start)

        this.lineShape = new AGLine(new AGPoint(),new AGPoint(relativePoint.x,relativePoint.y))
        this.frame.origin = start
        this.frame.size = new AGSize(relativePoint.x,relativePoint.y)
        this.bounds.size = new AGSize(relativePoint.x,relativePoint.y)

    }

    drawLayer(){
        //override
        // super.drawLayer()
        //draw line
        AGDraw.canvas.drawLine(this,this.lineShape)
        AGDraw.canvas.drawText(this,new AGText(new AGPoint(0,50),'hello'))

    }
}

let lineView = new LineView(new AGPoint(50,50),new AGPoint(100,100))

rootView.initLayer()
rootView.addChildView(subView)
rootView.addChildView(childView)
rootView.addChildView(lineView)

viewWindow.addRootView(rootView)
rootView.draw()

rootView.on('mousedown',function (e) {
    console.log('rootview mousedown',e)
})

rootView.on('mousein',function (e) {
    rootView.backgroundColor = new AGColor(0,0,255,1)
    rootView.draw()
})

rootView.on('mouseout',function (e) {
    rootView.backgroundColor = new AGColor(255,0,0,1)
    rootView.draw()
})




let initPos
let initMousePos
let lastOrigin = new AGPoint()
subView.on('mousedown',function (e) {
    initPos = new AGPoint(e.innerPos.x,e.innerPos.y)
    initMousePos = new AGPoint(e.pageX,e.pageY)
    lastOrigin.x = subView.frame.origin.x
    lastOrigin.y = subView.frame.origin.y
})


subView.on('mousemove',function (e) {
    if (initPos){
        let curMousePos = new AGPoint(e.pageX,e.pageY)
        subView.frame.origin.x = lastOrigin.x+curMousePos.x - initMousePos.x
        subView.frame.origin.y = lastOrigin.y+curMousePos.y - initMousePos.y
        rootView.draw()
    }

})

subView.on('mouseup',function () {
    initPos = null
})

//layout childview subview lineview

let nodeSubView = new AGNode(0,subView.bounds.size.width,subView.bounds.size.height,{view:subView})
let nodeChildView = new AGNode(1,childView.bounds.size.width,childView.bounds.size.height,{view:childView})
let nodeLineView = new AGNode(2,lineView.bounds.size.width,lineView.bounds.size.height,{view:lineView})

let defaultLayout = new AGLayoutDefault({
    rankdir:'LR',
    marginx:50,
    marginy:50
})
let nodes = [nodeSubView,nodeChildView,nodeLineView]

// rootView.frame.size = new AGSize(g.width,g.height)
// rootView.bounds.size = new AGSize(g.width,g.height)

rootView.on('click',function (e) {
    let g = defaultLayout.layout(nodes,[
        new AGEdge(nodeSubView.id,nodeChildView.id),
        new AGEdge(nodeSubView.id,nodeLineView.id)
    ])


    nodes.forEach(n=>{
        n.view.frame.origin.x = n.x
        n.view.frame.origin.y = n.y
    })

    rootView.updateSize(g.width+100,g.height+100)
// rootView.initLayer()
    console.log(rootView)
    console.log(subView,childView,lineView)
    rootView.draw()
})


let widget = new AGWidget(new AGPoint(),new AGSize(50,50))
widget.toggleDraggable(true)

let label = new AGLabel(new AGPoint(),new AGSize(50,50),'hello')
label.toggleDraggable(true)

rootView.addChildView(widget)

rootView.addChildView(label)