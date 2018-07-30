/**
 * Created by Zzen1sS
 */
import * as Dagre from 'dagre'

export class AGNode {
    constructor(id,width,height,opts={}){
        this.id = id
        this.width = width
        this.height = height
        Object.assign(this,opts)
    }
}

export class AGEdge{
    constructor(start,stop,link=null){
        this.start = start
        this.stop = stop
        this.link = link
    }
}

export class AGLayout{
    constructor(type,opts={}){
        this.type = type
        this.opts = opts
    }

    layout(view){

    }

}

function addViewNodesToGraph(v,g,baseIdx,nodeAdded) {
    if (v){
        if (!nodeAdded){
            g.setNode(''+baseIdx,{label:''+baseIdx,width:v.bounds.size.width,height:v.bounds.size.height})
        }

        if (v.children && v.children.length){
            for(let i=0;i<v.children.length;i++){
                g.setNode(''+baseIdx+'.'+i,{label:''+baseIdx+'.'+i,width:v.children[i].bounds.size.width,height:v.children[i].bounds.size.height})
                g.setEdge(''+baseIdx,''+baseIdx+'.'+i)
                addViewNodesToGraph(v.children[i],g,''+baseIdx+'.'+i,true)
            }
        }
    }
}

export class AGLayoutDefault extends AGLayout{
    constructor(opts={}){
        super('default',opts)
    }

    // layout(view){
    //     let g = new Dagre.graphlib.Graph();
    //
    //     g.setGraph({});
    //     g.setDefaultEdgeLabel(function() { return {}; });
    //
    //     //set nodes and edges
    //     addViewNodesToGraph(view,g,0)
    //
    //     Dagre.layout(g)
    //     console.log(g)
    //
    // }

    layout(nodes=[],edges=[]){
        let g = new Dagre.graphlib.Graph();

        g.setGraph(this.opts);
        g.setDefaultEdgeLabel(function() { return {}; });

        //console.log(_.cloneDeep(nodes),_.cloneDeep(edges))
        nodes.forEach(n=>{
            g.setNode(n.id,{label:n.id,width:n.width,height:n.height,ref:n})
        })

        edges.forEach(e=>{
            g.setEdge(e.start,e.stop)
        })

        Dagre.layout(g)
        g.nodes().forEach(id=>{
            let gn = g.node(id)
            if (!gn){
                console.log('hh')
                return
            }
            let node = gn.ref
            node.x = gn.x - gn.width/2
            node.y = gn.y - gn.height/2
        })
        let graph = g.graph()

        return {
            width:graph.width,
            height:graph.height,
            nodes:nodes,
            g:g
        }

    }
}