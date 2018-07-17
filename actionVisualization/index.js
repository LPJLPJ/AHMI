import React from 'react';
import ReactDOM from 'react-dom';


import {AGView} from "./src/AGView";
import {AGPoint,AGRect,AGSize,AGColor,AGLine,AGText} from "./src/AGProperties";
import {AGWindow} from "./src/AGWindow";
import AGDraw from "./src/AGDraw"

import {AGNode,AGEdge,AGLayoutDefault} from "./src/AGLayout";

import {AGLabel, AGVGraph, AGWidget, AGLink, AGVisualization} from "./src/AGVisualization";


class ActionVisualizer extends React.Component{
    constructor(){
        super()
    }

    renderGraph(){
        let viewWindow = new AGWindow(1000,1000,this.container)
        let rootView = new AGView(new AGPoint(50,50),new AGSize(800,800))
        rootView.initLayer()
        viewWindow.addRootView(rootView)
        let agv = new AGVisualization(rootView)

        //init nodes
        let data = this.props.data
        let nodeW = 50
        let nodeH = 50
        //project
        let projectWidget  = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),data.name)
        agv.addWidgetNode(projectWidget)
        //tags
        for(let i=0;i<data.tagList.length;i++){
            let curTagWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),data.tagList[i].name)
            agv.addWidgetNode(curTagWidget)
            agv.linkWidgets(projectWidget,curTagWidget)
        }

        function showActions(elem){

        }
        //pages
        for(let i=0;i<data.pageList.length;i++){
            let curPage = data.pageList[i]
            let curPageWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curPage.name)
            agv.addWidgetNode(curPageWidget)
            agv.linkWidgets(projectWidget,curPageWidget)
            if (curPage.canvasList && curPage.canvasList.length){
               for(let j=0;j<curPage.canvasList.length;j++){
                   let curC = curPage.canvasList[j]
                   let curCWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curC.name)
                   agv.addWidgetNode(curCWidget)
                   agv.linkWidgets(curPageWidget,curCWidget)
                   if (curC.subCanvasList&&curC.subCanvasList.length){
                        for(let k=0;k<curC.subCanvasList.length;k++){
                            let curSC = curC.subCanvasList[k]
                            let curSCWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curSC.name)
                            agv.addWidgetNode(curSCWidget)
                            agv.linkWidgets(curCWidget,curSCWidget)
                            if (curSC.widgetList&&curSC.widgetList.length){
                                for(let h=0;h<curSC.widgetList.length;h++){
                                    let curWidget = curSC.widgetList[h]
                                    let curWidgetWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curWidget.name)
                                    agv.addWidgetNode(curWidgetWidget)
                                    agv.linkWidgets(curSCWidget,curWidgetWidget)
                                }
                            }
                        }
                   }
               }
            }
        }

        // let widget = new AGWidget(new AGPoint(),new AGSize(50,50))
        // widget.toggleDraggable(true)
        //
        //
        // let label = new AGLabel(new AGPoint(),new AGSize(50,50),'hello')
        // label.toggleDraggable(true)
        //
        // let label2 = new AGLabel(new AGPoint(),new AGSize(50,50),'world')
        // label2.toggleDraggable(true)
        // agv.addWidgetNode(widget)
        // agv.addWidgetNode(label)
        // agv.addWidgetNode(label2)
        // agv.linkWidgets(widget,label)
        // agv.linkWidgets(widget,label2)
        agv.layout()
        agv.sortLinks()
        rootView.draw()


    }

    componentDidMount(){
        this.renderGraph()
    }

    render(){
        let self = this
        return (<div ref={(container) => {
            self.container = container;
        }}>

        </div>)
    }
}


var playButton = document.getElementById('play');
playButton.addEventListener('click',function () {
    ReactDOM.render(<ActionVisualizer data={window.projectData} />,document.getElementById('action-visualizer'))
})

