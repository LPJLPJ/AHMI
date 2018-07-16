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

export class AGLink extends AGWidget{
    constructor(origin,size,lineStart=new AGPoint(),lineStop=new AGPoint(),widgetSrc=null,widgetDst=null,opts={}){
        super(origin,size,opts)
        this.lineStart = lineStart
        this.lineStop = lineStop
        this.widgetSrc = widgetSrc
        this.widgetDst = widgetDst
        let keys = ['lineWidth','lineType','lineColor']
        keys.forEach(k=>this[k]=opts[k])
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

    drawLayer(){
        // super.drawLayer()
        AGDraw.canvas.drawLine(this,new AGLine(this.lineStart,this.lineStop))
    }
}



export class AGVisualization{
    constructor(view){
        this.renderView = view
        this.graph = new AGVGraph()
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
        //update frame origin
        let origin = new AGPoint(Math.min(tempStart.x,tempStop.x),Math.min(tempStart.y,tempStop.y))
        let lineStart = tempStart.relative(origin)
        let lineStop = tempStop.relative(origin)
        let lineV = lineStop.relative(lineStart)
        return new AGLink(origin,new AGSize(lineV.x,lineV.y),lineStart,lineStop,widgetSrc,widgetDst)
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

    layout(){
        this.graph.layout()
        console.log(this.graph.edges)
        this.graph.edges.forEach(e=>{
            e.link && e.link.updatePoint(e.link.widgetSrc.center(),e.link.widgetDst.center())
        })
    }
}


//layout
export class AGVGraph{
    constructor(){
        this.nodes = []
        this.edges = []
        this.layoutObj = new AGLayoutDefault({
            rankdir:'LR',
            marginx:50,
            marginy:50
        })
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
                return
            }
        }
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