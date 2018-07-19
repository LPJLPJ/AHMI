import React from 'react';
import ReactDOM from 'react-dom';


import {AGView} from "./src/AGView";
import {AGPoint,AGRect,AGSize,AGColor,AGLine,AGText} from "./src/AGProperties";
import {AGWindow} from "./src/AGWindow";
import AGDraw from "./src/AGDraw"

import {AGNode,AGEdge,AGLayoutDefault} from "./src/AGLayout";

import {AGLabel, AGVGraph, AGWidget, AGLink, AGVisualization} from "./src/AGVisualization";

import Bezier from 'bezier-js'

class ActionVisualizer extends React.Component{
    constructor(){
        super()
        this.state= {
            colors:{
                tag:new AGColor(0,255,0,1),
                timer:new AGColor(0,0,255,1),
                action:new AGColor(255,0,0,1),
                command:new AGColor(255,255,0,1),
                default:new AGColor(255,255,255,1)
            }
        }
    }

    renderGraph(){
        let viewWindow = new AGWindow(1000,1000,this.container)
        let rootView = new AGView(new AGPoint(50,50),new AGSize(800,800))
        rootView.initLayer()
        viewWindow.addRootView(rootView)
        let agv = new AGVisualization(rootView)

        //init nodes
        let data = this.props.data
        let nodeW = 100
        let nodeH = 40
        let self = this
        //project
        let projectWidget  = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),data.name)
        agv.addWidgetNode(projectWidget)
        //tags
        data.tag = '当前页面序号'
        for(let i=0;i<data.tagList.length;i++){
            let curTagWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),data.tagList[i].name,undefined,{
                backgroundColor:self.state.colors.tag
            })
            data.tagList[i].node = curTagWidget
            agv.addWidgetNode(curTagWidget)
            // agv.linkWidgets(projectWidget,curTagWidget)
        }
        //timers
        let timerList = [];
        // var postfix = ['Start','Stop','Step','Interval','CurVal','Mode'];
        for (let i = 0; i < parseInt(data.timers); i++) {
            let newTimer = {};
            newTimer['timerID'] = 0;
            newTimer['id'] = i
            newTimer['name'] = 'SysTmr_'+i
            newTimer['SysTmr_' + i + '_Start'] = 0;
            newTimer['SysTmr_' + i + '_Stop'] = 0;
            newTimer['SysTmr_' + i + '_Step'] = 0;
            newTimer['SysTmr_' + i + '_t'] = 0;
            newTimer['SysTmr_' + i + '_Interval'] = 0;
            newTimer['SysTmr_' + i + '_Mode'] = 0;
            timerList.push(newTimer);
        }
        for(let i=0;i<timerList.length;i++){
            let curTagWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),timerList[i].name,undefined,{
                backgroundColor:self.state.colors.timer
            })
            timerList[i].node = curTagWidget
            agv.addWidgetNode(curTagWidget)
            // agv.linkWidgets(projectWidget,curTagWidget)
            //add tag
            let targetTag = findTagByName('SysTmr_'+timerList[i].id+'_t')
            if (targetTag){
                agv.linkWidgets(curTagWidget,targetTag.node)
            }

        }

        function findTagByName(name){
            for(let i=0;i<data.tagList.length;i++){
                if (data.tagList[i].name === name){
                    return data.tagList[i]
                }
            }
            return null
        }

        function showProjectActions() {
            for(let i=0;i<data.pageList.length;i++){
                let curPage = data.pageList[i]
                showActions(curPage)
                if (curPage.canvasList && curPage.canvasList.length){
                    for(let j=0;j<curPage.canvasList.length;j++){
                        let curC = curPage.canvasList[j]
                        showActions(curC)
                        //subcanvas
                        if (curC.subCanvasList&&curC.subCanvasList.length){
                            for(let k=0;k<curC.subCanvasList.length;k++){
                                let curSC = curC.subCanvasList[k]
                                showActions(curSC)
                                //widgets
                                if (curSC.widgetList&&curSC.widgetList.length){
                                    for(let h=0;h<curSC.widgetList.length;h++){
                                        let curWidget = curSC.widgetList[h]
                                        showActions(curWidget)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function showActions(elem){
            if (elem && elem.actions && elem.actions.length){
                for(let i=0;i<elem.actions.length;i++){
                    let curAction = elem.actions[i]
                    let curActionWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curAction.title,undefined,{
                        backgroundColor:self.state.colors.action
                    })
                    curAction.node = curActionWidget
                    agv.addWidgetNode(curActionWidget)
                    agv.linkWidgets(elem.node,curActionWidget)
                    showActionCommands(curAction)
                }
            }
        }
        
        function getTagByParam(param) {
            if (param && param.tag){
                for(let i=0;i<data.tagList.length;i++){
                    if (data.tagList[i].name == param.tag){
                        return data.tagList[i]
                    }
                }
            }
            return null
        }

        function findTimerIdByTag(tag){
            if (tag.search(/SysTmr_(\d+)_\w+/) !== -1) {
                //get SysTmr
                return parseInt(tag.match(/\d+/)[0]);

            }
            return null
        }
        function showActionCommands(action) {
            if (action){
                if (action.commands && action.commands.length){
                    for(let i=0;i<action.commands.length;i++){
                        let curCmd = action.commands[i]
                        //add curCmd
                        let curCmdName = curCmd[0].name +' '+(curCmd[1].tag?curCmd[1].tag:curCmd[1].value)+' '+(curCmd[2].tag?curCmd[2].tag:curCmd[2].value)
                        let curCmdWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curCmdName,undefined,{
                            backgroundColor:self.state.colors.command
                        })
                        agv.addWidgetNode(curCmdWidget)
                        agv.linkWidgets(action.node,curCmdWidget)
                        curCmd.node = curCmdWidget
                        if (curCmd){
                            switch (curCmd[0].name){
                                //op
                                case 'SET_TIMER_START':
                                case 'SET_TIMER_STOP':
                                case 'SET_TIMER_INTERVAL':
                                case 'SET_TIMER_STEP':
                                case 'SET_TIMER_MODE':
                                case 'SET_TIMER_CURVAL':
                                    //timer
                                    let param = curCmd[1]
                                    let timerId = null
                                    if (param && param.tag) {
                                        // if (param.tag.search(/SysTmr_(\d+)_\w+/) !== -1) {
                                        //     //get SysTmr
                                        //     timerId = parseInt(param.tag.match(/\d+/)[0]);
                                        //
                                        // }
                                        timerId = findTimerIdByTag(param.tag)
                                    }
                                    if (timerId!==null){
                                        for(let j=0;j<timerList.length;j++){
                                            if (timerList[j].id === timerId){
                                                agv.linkWidgets(curCmdWidget,timerList[j].node)
                                                break;
                                            }
                                        }

                                    }
                                    break;
                                default:
                                    for(let j=0;j<2;j++){
                                        let paramTag = getTagByParam(curCmd[j+1])
                                        console.log(paramTag)
                                        if (paramTag){
                                            agv.linkWidgets(curCmdWidget,paramTag.node)
                                        }
                                    }

                                    
                            }
                        }

                    }
                }
            }
        }

        function setTagLink(elem) {
            if (elem && elem.tag){
                let timerId = findTimerIdByTag(elem.tag)
                if (timerId!==null){
                    //timer
                    for(let j=0;j<timerList.length;j++){
                        if (timerList[j].id === timerId){
                            agv.linkWidgets(elem.node,timerList[j].node)
                            break;
                        }
                    }
                }else{
                    //tag
                    for(let j=0;j<data.tagList.length;j++){
                        if (data.tagList[j].name === elem.tag){
                            //hit
                            agv.linkWidgets(elem.node,data.tagList[j].node)
                        }
                    }
                }
            }
        }
        //pages
        for(let i=0;i<data.pageList.length;i++){
            let curPage = data.pageList[i]
            let curPageWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curPage.name)
            curPage.node = curPageWidget
            agv.addWidgetNode(curPageWidget)
            agv.linkWidgets(projectWidget,curPageWidget)
            setTagLink(curPage)
            //canvas
            if (curPage.canvasList && curPage.canvasList.length){
               for(let j=0;j<curPage.canvasList.length;j++){
                   let curC = curPage.canvasList[j]
                   let curCWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curC.name)
                   curC.node = curCWidget
                   agv.addWidgetNode(curCWidget)
                   agv.linkWidgets(curPageWidget,curCWidget)
                   setTagLink(curC)
                   //subcanvas
                   if (curC.subCanvasList&&curC.subCanvasList.length){
                        for(let k=0;k<curC.subCanvasList.length;k++){
                            let curSC = curC.subCanvasList[k]
                            let curSCWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curSC.name)
                            curSC.node = curSCWidget
                            agv.addWidgetNode(curSCWidget)
                            agv.linkWidgets(curCWidget,curSCWidget)
                            setTagLink(curSC)
                            //widgets
                            if (curSC.widgetList&&curSC.widgetList.length){
                                for(let h=0;h<curSC.widgetList.length;h++){
                                    let curWidget = curSC.widgetList[h]
                                    let curWidgetWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curWidget.name)
                                    curWidget.node = curWidgetWidget
                                    agv.addWidgetNode(curWidgetWidget)
                                    agv.linkWidgets(curSCWidget,curWidgetWidget)
                                    setTagLink(curWidget)
                                }
                            }
                        }
                   }
               }
            }
        }

        showProjectActions()

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
        // agv.sortLinks()
        rootView.draw()

        let curve = new Bezier(700, 295, 775, 295, 850, 295);
        let curve2 = new Bezier(650, 315, 650, 295, 650, 275);
        // var draw = function() {
        // 	drawSkeleton(curve);
        // 	drawCurve(curve);
        // 	setColor("red");
        // 	drawCurve(curve2);
        // 	setColor("black");
        // 	curve.intersects(curve2).forEach(function(pair) {
        // 		var t = pair.split("/").map(function(v) { return parseFloat(v); });
        // 		drawPoint(curve.get(t[0]));
        // 	});
        // }
        let points = curve.intersects(curve2,0.1).map(function(pair) {
            var t = pair.split("/").map(function(v) { return parseFloat(v); });
            return curve.get(t[0])
        });
        console.log(points)


    }

    componentDidMount(){
        this.renderGraph()
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
           this.renderGraph()
        }
    }

    render(){
        let self = this
        return (<div ref={(container) => {
            self.container = container;
        }}>

        </div>)
    }
}


var playButton = document.getElementById('actionVisualization-play');
playButton.addEventListener('click',function () {
    ReactDOM.render(<ActionVisualizer data={_.cloneDeep(window.rawProject)} />,document.getElementById('action-visualizer'))
})

