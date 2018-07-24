import {AGView} from "./AGView";
import {
    AGPoint, AGRect, AGSize, AGColor, AGLine, AGText, AGFont, AGPath, AGPathItemLine,
    AGPathItemCubicCurve, AGPathItemQuadraticCurve
} from "./AGProperties";
import {AGWindow} from "./AGWindow";
import AGDraw from "./AGDraw"

import {AGNode,AGEdge,AGLayoutDefault} from "./AGLayout";

import Bezier from 'bezier-js'
//fix utils bug
let utils = Bezier.getUtils()
utils.bboxoverlap = function(b1, b2) {
    var dims = ["x", "y"],
        len = dims.length,
        i,
        dim,
        l,
        t,
        d;
    for (i = 0; i < len; i++) {
        dim = dims[i];
        l = b1[dim].mid;
        t = b2[dim].mid;
        d = (b1[dim].size + b2[dim].size) / 2;
        if (Math.abs(l - t) > d) {
            return false;
        }
    }
    return true;
}

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

    toPath(){
        let tl = this.frame.origin.copy()
        let tr = new AGPoint(this.frame.origin.x + this.frame.size.width,this.frame.origin.y)
        let br = new AGPoint(this.frame.origin.x + this.frame.size.width,this.frame.origin.y + this.frame.size.height)
        let bl = new AGPoint(this.frame.origin.x , this.frame.origin.y + this.frame.size.height)
        return new AGPath([new AGPathItemLine(tl,tr),new AGPathItemLine(tr,br),new AGPathItemLine(br,bl),new AGPathItemLine(bl,tl)])
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
        AGDraw.canvas.drawText(this,new AGText(new AGPoint(this.bounds.origin.x+0.5*this.bounds.size.width,this.bounds.origin.y+0.5*this.bounds.size.height),this.text,this.font))
    }
}

export class AGLink extends AGWidget{
    constructor(origin,size,lineStart=new AGPoint(),lineStop=new AGPoint(),widgetSrc=null,widgetDst=null,opts={}){
        super(origin,size,opts)
        this.lineStart = lineStart
        this.lineStop = lineStop
        this.widgetSrc = widgetSrc
        this.widgetDst = widgetDst
        this.lineWidth = 1
        this.lineType = 'solid'
        this.lineColor = new AGColor(0,0,0,1)
        this.arrowSrcType = AGLink.arrowTypes.none
        this.arrowDstType = AGLink.arrowTypes.none
        let keys = ['lineWidth','lineType','lineColor','arrowSrcType','arrowDstType']
        keys.forEach(k=> {
            if (k in opts) this[k]=opts[k]
        })
    }

    updatePoint(start,stop){
        if (start||stop){
            let tempStart = start || this.lineStart.add(this.frame.origin)
            let tempStop = stop || this.lineStop.add(this.frame.origin)
            //update frame origin
            this.frame.origin = new AGPoint(Math.min(tempStart.x,tempStop.x),Math.min(tempStart.y,tempStop.y))
            this.lineStart = tempStart.relative(this.frame.origin)
            this.lineStop = tempStop.relative(this.frame.origin)
            let lineV = this.lineStop.relative(this.lineStart)
            this.updateSize(Math.abs(lineV.x),Math.abs(lineV.y))
        }
    }

    isPosHitView(pos){
        if (!super.isPosHitView(pos)){return false}
        let innerPos = pos.relative(this.frame.origin)
        let lineSegment = new AGLine(this.lineStart,this.lineStop)
        let d = lineSegment.distanceToLineSegment(innerPos)

        return d<10
    }

    drawLayer(){
        // super.drawLayer()
        AGDraw.canvas.drawLine(this,new AGLine(this.lineStart,this.lineStop,{lineColor:this.lineColor}))
    }
}

AGLink.arrowTypes = {
    none:'none',
    arrow:'arrow'
}

export class AGBrokenLineLink extends AGLink{
    constructor(origin,size,lineStart=new AGPoint(),lineBroken=new AGPoint(),lineStop=new AGPoint(),widgetSrc=null,widgetDst=null,opts={}){
        super(origin,size,lineStart,lineStop,widgetSrc,widgetDst,opts)
        this.lineBroken = lineBroken
    }

    updatePoint(start,broken,stop){
        super.updatePoint(start,stop)
        if (broken){
            this.lineBroken = broken.relative(this.frame.origin)
        }
    }

    drawLayer(){
        AGDraw.canvas.drawBrokenLine(this,new AGLine(this.lineStart,this.lineBroken),new AGLine(this.lineBroken,this.lineStop))
    }
}



export class AGVisualization{
    constructor(view,opts={}){
        this.renderView = view
        this.graph = new AGVGraph(opts)
    }

    addWidgetView(widget){
        for (let i=0;i<this.renderView.children.length;i++){
            let curW = this.renderView.children[i]
            if (curW === widget){
                return
            }
        }
        this.renderView.addChildView(widget)
    }
    addWidgetNode(widget){
        this.addWidgetView(widget)
        this.graph.addNode(widget)
    }

    removeWidgetView(widget){
        this.renderView.removeChildView(widget)
    }

    removeWidgetNode(widget){
        this.removeWidgetView(widget)
        this.graph.removeNode(widget)
    }

    widgetInGraph(widget){
        return this.graph.widgetInGraph(widget)
    }

    addLinkView(link){
        for (let i=0;i<this.renderView.children.length;i++){
            let curW = this.renderView.children[i]
            if (curW.widgetSrc === link.widgetSrc && curW.widgetDst === link.widgetDst){
                return
            }
        }
        //new
        this.renderView.addChildView(link)
    }

    static createLinkByWidgets(widgetSrc,widgetDst){
        let tempStart = widgetSrc.center()
        let tempStop = widgetDst.center()
        let oldLine = new AGPath([new AGPathItemLine(tempStart,tempStop)])
        let intersectionsSrc = AGVisualization.getIntersections(oldLine,widgetSrc.toPath())
        let intersectionsDst = AGVisualization.getIntersections(oldLine,widgetDst.toPath())
        // console.log(intersectionsSrc,intersectionsDst)
        //update frame origin
        let origin = new AGPoint(Math.min(tempStart.x,tempStop.x),Math.min(tempStart.y,tempStop.y))
        let lineStart = tempStart.relative(origin)
        let lineStop = tempStop.relative(origin)
        let lineV = lineStop.relative(lineStart)
        return new AGLink(origin,new AGSize(lineV.x,lineV.y),lineStart,lineStop,widgetSrc,widgetDst)
        // return new AGBrokenLineLink(origin,new AGSize(lineV.x,lineV.y),lineStart,new AGPoint((lineStart.x+lineStop.x)/2,(lineStart.y+lineStop.y)/2),lineStop,widgetSrc,widgetDst)
    }

    static getIntersections(path1,path2){
        let intersections = []
        for(let i=0;i<path1.pathItems.length;i++){
            let pi1 = path1.pathItems[i]

            for(let j=0;j<path2.pathItems.length;j++){
                let pi2 = path2.pathItems[j]
                if ((pi1 instanceof AGPathItemLine) && (pi2 instanceof AGPathItemLine)){
                    intersections = intersections.concat(AGVisualization.getIntersectionByLineItemAndLineItem(pi1,pi2))
                }else if (pi1 instanceof AGPathItemLine){
                    intersections = intersections.concat(AGVisualization.getIntersectionByLineItemAndCurveItem(pi1,pi2))
                }else if (pi2 instanceof AGPathItemLine){
                    intersections = intersections.concat(AGVisualization.getIntersectionByLineItemAndCurveItem(pi2,pi1))
                }else{
                    intersections = intersections.concat(AGVisualization.getIntersectionByCurveItemAndCurveItem(pi1,pi2))
                }
            }
        }
        return intersections
    }

    static makeBezier(pathItem) {
        let args = []
        if (pathItem instanceof AGPathItemCubicCurve){
            args.push(pathItem.points[0].x,pathItem.points[0].y,pathItem.points[1].x,pathItem.points[1].y,pathItem.points[2].x,pathItem.points[2].y)
        }else if(pathItem instanceof AGPathItemQuadraticCurve){
            args.push(pathItem.points[0].x,pathItem.points[0].y,pathItem.points[1].x,pathItem.points[1].y,pathItem.points[2].x,pathItem.points[2].y)
        }else{
            throw new Error('unsupported path item')
        }

        return new Bezier(...args)
    }


    static getIntersectionByLineItemAndLineItem(pi1,pi2){
        let x1 = pi1.points[0].x
        let y1 = pi1.points[0].y
        let x2 = pi1.points[1].x
        let y2 = pi1.points[1].y
        let x3 = pi2.points[0].x
        let y3 = pi2.points[0].y
        let x4 = pi2.points[1].x
        let y4 = pi2.points[1].y
        let x0=0,y0=0
        let intersections = []
        let d = (y4-y3)*(x2-x1) - (y2-y1)*(x4-x3)

        if (!!d){
            let a = y1 - y3;
            let b = x1 - x3;
            let numerator1 = ((x4 - x3) * a) - ((y4 - y3) * b);
            let numerator2 = ((x2 - x1) * a) - ((y2 - y1) * b);
            a = numerator1 / d;
            b = numerator2 / d;


            x0 = x1 + (a * (x2 - x1));
            y0 = y1 + (a * (y2 - y1));

            if (a >= 0 && a <=1 && b>=0&&b<=1) {
                //hit
                intersections.push({
                    x:x0,
                    y:y0
                })
            }


        }
        return intersections
    }

    static getIntersectionByLineItemAndCurveItem(pi1,pi2){
        let intersections = []
        let curve1 = {
            p1:{
                x:pi1.points[0].x,
                y:pi1.points[0].y
            },
            p2:{
                x:pi1.points[1].x,
                y:pi1.points[1].y
            }
        }

        let curve2 = AGVisualization.makeBezier(pi2)
        //console.log(curve1.intersects(curve2))
        intersections = intersections.concat(curve2.intersects(curve1).map(function(t) {
            return curve2.get(t)
        }))
        return intersections
    }

    static getIntersectionByCurveItemAndCurveItem(pi1,pi2){
        let intersections = []
        let curve1 = AGVisualization.makeBezier(pi1)

        let curve2 = AGVisualization.makeBezier(pi2)
        //console.log(curve1.intersects(curve2))
        intersections = intersections.concat(curve1.intersects(curve2).map(function(pair) {
            let t = pair.split("/").map(function(v) { return parseFloat(v); });
            return curve1.get(t[0])
        }))
        return intersections
    }

    static appendUnique(elem,elems){
        for(let i=0;i < elems.length;i++){
            if (elems[i]===elem){
                return
            }
        }
        elems.push(elem)
    }

    sortLinks(){
        this.renderView.children.sort((a,b)=>{
            if ((a instanceof AGLink)&& !(b instanceof AGLink)){
                return -1
            }else{
                return 0
            }
        })
    }

    linkWidgets(widgetSrc,widgetDst){
        let link = AGVisualization.createLinkByWidgets(widgetSrc,widgetDst)
        this.addLinkView(link)
        widgetSrc.out = widgetSrc.out||[]
        AGVisualization.appendUnique(link,widgetSrc.out)
        widgetDst.in = widgetDst.in ||[]
        AGVisualization.appendUnique(link,widgetDst.in)
        this.graph.addEdge(widgetSrc,widgetDst,link)
    }

    layout(opts={}){
        let g
        let graph = this.graph
        function isAlone(view) {
            if ((view.in && view.in.length)||(view.out && view.out.length)){
                return false
            }
            return true
        }
        if (opts.compact){
            //compat graph

            for(let i=0;i<this.renderView.children.length;i++){
                let curV = this.renderView.children[i]
                if (!(curV instanceof AGLink)){
                    if (isAlone(curV) && this.widgetInGraph(curV)){
                        this.removeWidgetNode(curV)
                        i--
                    }
                }

            }
            g = graph.layout()
        }else{
            g = graph.layout()
        }

        function calIntersectionForEdge(e) {
            let oldLine = new AGPath([new AGPathItemLine(e.link.widgetSrc.center(),e.link.widgetDst.center())])
            let intersectionsSrc = AGVisualization.getIntersections(oldLine,e.link.widgetSrc.toPath())
            let intersectionsDst = AGVisualization.getIntersections(oldLine,e.link.widgetDst.toPath())
            // console.log(intersectionsSrc,intersectionsDst)
            //update frame origin
            // e.link && e.link.updatePoint(e.link.widgetSrc.center(),e.link.widgetDst.center())
            //console.log(oldLine,e.link.widgetSrc.toPath(),intersectionsSrc,intersectionsDst)
            let curStartPoint = intersectionsSrc[0]?new AGPoint(intersectionsSrc[0].x,intersectionsSrc[0].y):e.link.widgetSrc.center()
            let curStopPoint = intersectionsDst[0]?new AGPoint(intersectionsDst[0].x,intersectionsDst[0].y):e.link.widgetDst.center()
            // e.link && e.link.updatePoint(curStartPoint,new AGPoint((curStartPoint.x+curStopPoint.x)/2,(curStartPoint.y+curStopPoint.y)/2),curStopPoint)
            e.link && e.link.updatePoint(curStartPoint,curStopPoint)
        }

        this.renderView.updateSize(g.width,g.height)
        graph.edges.forEach(e=>{
            // calIntersectionForEdge(e)
            // let rawEdge = g.g.edge(e.start,e.stop)
            // let points = rawEdge.points
            // e.link && e.link.updatePoint(new AGPoint(points[0].x,points[0].y),new AGPoint(points[1].x,points[1].y),new AGPoint(points[2].x,points[2].y))
            calIntersectionForEdge(e)
        })
        return g
    }


}


//layout
export class AGVGraph{
    constructor(opts={}){
        this.nodes = []
        this.edges = []
        let curOpts = {
            rankdir:'LR',
            // ranker:'longest-path',
            // ranksep:0,
            marginx:50,
            marginy:50
        }
        Object.assign(curOpts,opts)
        this.layoutObj = new AGLayoutDefault(curOpts)
    }

    static isIn(elem,elems,keys){
        for(let i=0;i<elems.length;i++){
            if (keys){
                let r = keys.reduce((a,c)=>{
                    return (elem === elems[i][a]) && c
                },false)
                if(r){
                    return true
                }
            }else{
                if (elem === elems[i]){
                    return true
                }
            }

        }
        return false
    }

    static getId(){
        return AGVGraph.id++
    }

    widgetInGraph(widget){
        for(let i=0;i<this.nodes.length;i++){
            if (this.nodes[i].view === widget){
                return true
            }
        }
        return false
    }
    getNodeByView(view){
        for(let i=0;i<this.nodes.length;i++){
            if (this.nodes[i].view === view){
                return this.nodes[i]
            }
        }
    }

    addNode(view){
        if (!AGVGraph.isIn(view,this.nodes,['view'])){
            this.nodes.push(new AGNode(AGVGraph.getId(),view.bounds.size.width,view.bounds.size.height,{view:view}))
        }
    }

    removeNode(view){
        for(let i=0;i<this.nodes.length;i++){
            if (this.nodes[i].view === view){
                //remove edges
                this.removeEdgesBySrc(view)
                this.removeEdgesByDst(view)
                this.nodes.splice(i,1)
                return true
            }
        }
        return false
    }

    addEdge(viewSrc,viewDst,link){
        let nodeSrc = this.getNodeByView(viewSrc)
        let nodeDst = this.getNodeByView(viewDst)
        if (nodeSrc && nodeDst){
            for(let i=0;i<this.edges.length;i++){
                let curEdge = this.edges[i]
                if (nodeSrc.id === curEdge.start && nodeDst.id === curEdge.stop){
                    //hit
                    return
                }
            }
            //add new
            this.edges.push(new AGEdge(nodeSrc.id,nodeDst.id,link))
        }
    }

    removeEdgesBySrc(viewSrc){
        let nodeSrc = this.getNodeByView(viewSrc)

       if(nodeSrc){
            for(let i=0;i<this.edges.length;i++){
                let curEdge = this.edges[i]
                if (nodeSrc.id === curEdge.start ){
                    this.edges.splice(i,1)
                    i--
                }
            }
        }
    }

    removeEdgesByDst(viewDst){

        let nodeDst = this.getNodeByView(viewDst)
        if(nodeDst){
            for(let i=0;i<this.edges.length;i++){
                let curEdge = this.edges[i]
                if (nodeDst.id === curEdge.stop){
                    this.edges.splice(i,1)
                    i--
                }
            }
        }
    }

    removeEdge(viewSrc,viewDst){
        let nodeSrc = this.getNodeByView(viewSrc)
        let nodeDst = this.getNodeByView(viewDst)
        if (nodeSrc && nodeDst){
            for(let i=0;i<this.edges.length;i++){
                let curEdge = this.edges[i]
                if (nodeSrc.id === curEdge.start && nodeDst.id === curEdge.stop){
                    this.edges.splice(i,1)
                    i--
                }
            }

        }
    }

    layout(){
        let g = this.layoutObj.layout(this.nodes,this.edges)


        this.nodes.forEach(n=>{
            n.view.frame.origin.x = n.x
            n.view.frame.origin.y = n.y
        })

        return g
    }
}

AGVGraph.id = 0;