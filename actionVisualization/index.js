import React from 'react';
import ReactDOM from 'react-dom';


import {AGView} from "./src/AGView";
import {AGPoint,AGRect,AGSize,AGColor,AGLine,AGText,AGFont} from "./src/AGProperties";
import {AGWindow} from "./src/AGWindow";
import AGDraw from "./src/AGDraw"

import {AGNode,AGEdge,AGLayoutDefault} from "./src/AGLayout";

import {AGLabel, AGVGraph, AGWidget, AGLink, AGVisualization} from "./src/AGVisualization";

import Bezier from 'bezier-js'

import './src/css/index.css'

class ActionVisualizer extends React.Component{
    constructor(){
        super()
        this.state= {
            colors:{
                tag:new AGColor(0,255,0,1),
                timer:new AGColor(0,255,255,1),
                action:new AGColor(255,0,0,1),
                command:new AGColor(255,255,0,1),
                default:new AGColor(255,255,255,1)
            },
            rankSep:100,
            pageIdx:1,
            pageNum:1,
            scale:1,
            maxScale:1
        }
    }
    initWindow(){
        let viewWindow = new AGWindow(1200,1000,this.container)
        this.viewWindow = viewWindow


    }

    renderGraph(){
        let viewWindow = this.viewWindow
        let rootView = new AGView(new AGPoint(0,0),new AGSize(800,800))
        rootView.initLayer()
        viewWindow.addRootView(rootView)
        let agv = new AGVisualization(rootView,{
            ranksep:this.state.rankSep
        })



        //init nodes
        let data = this.props.data
        this.setState({pageNum:data.pageList&&data.pageList.length||1})
        let nodeW = 100
        let actionNodeW = 150
        let nodeH = 40
        let self = this
        //labels
        let indicatorW=40,indicatorH=40,indicatorD = 5
        let elemLabel = new AGLabel(new AGPoint(0,indicatorD),new AGSize(indicatorW,indicatorH),'元素',undefined,{
            backgroundColor:self.state.colors.default
        })
        let tagLabel = new AGLabel(new AGPoint(indicatorD+indicatorW,indicatorD),new AGSize(indicatorW,indicatorH),'tag',undefined,{
            backgroundColor:self.state.colors.tag
        })
        let timerLabel = new AGLabel(new AGPoint(2*(indicatorW+indicatorD),indicatorD),new AGSize(indicatorW,indicatorH),'timer',undefined,{
            backgroundColor:self.state.colors.timer
        })
        let actionLabel = new AGLabel(new AGPoint(3*(indicatorW+indicatorD),indicatorD),new AGSize(indicatorW,indicatorH),'动作',undefined,{
            backgroundColor:self.state.colors.action
        })
        let commandLabel = new AGLabel(new AGPoint(4*(indicatorW+indicatorD),indicatorD),new AGSize(indicatorW,indicatorH),'指令',undefined,{
            backgroundColor:self.state.colors.command
        })
        agv.addWidgetView(elemLabel)
        agv.addWidgetView(timerLabel)
        agv.addWidgetView(tagLabel)
        agv.addWidgetView(actionLabel)
        agv.addWidgetView(commandLabel)
        //project
        let projectWidget  = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),data.name)
        agv.addWidgetNode(projectWidget)
        data.node = projectWidget
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
        // setTagLink(data,false)
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

        // function showProjectActions() {
        //     for(let i=0;i<data.pageList.length;i++){
        //         let curPage = data.pageList[i]
        //         showActions(curPage)
        //         if (curPage.canvasList && curPage.canvasList.length){
        //             for(let j=0;j<curPage.canvasList.length;j++){
        //                 let curC = curPage.canvasList[j]
        //                 showActions(curC)
        //                 //subcanvas
        //                 if (curC.subCanvasList&&curC.subCanvasList.length){
        //                     for(let k=0;k<curC.subCanvasList.length;k++){
        //                         let curSC = curC.subCanvasList[k]
        //                         showActions(curSC)
        //                         //widgets
        //                         if (curSC.widgetList&&curSC.widgetList.length){
        //                             for(let h=0;h<curSC.widgetList.length;h++){
        //                                 let curWidget = curSC.widgetList[h]
        //                                 showActions(curWidget)
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        function showProjectActions() {
            for(let i=0;i<1;i++){
                let curPage = data.pageList[i]
                showPageActions(curPage)
            }
        }

        function showPageActions(curPage) {
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

        function showActions(elem){
            if (elem && elem.actions && elem.actions.length){
                for(let i=0;i<elem.actions.length;i++){
                    let curAction = elem.actions[i]
                    let curActionWidget = new AGLabel(new AGPoint(),new AGSize(actionNodeW,nodeH),curAction.title+': '+curAction.trigger,undefined,{
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
                        let curCmdName = curCmd[0].symbol +' '+(curCmd[1].tag?curCmd[1].tag:curCmd[1].value)+' '+(curCmd[2].tag?curCmd[2].tag:curCmd[2].value)
                        let curCmdWidget = new AGLabel(new AGPoint(),new AGSize(actionNodeW,nodeH),curCmdName,undefined,{
                            backgroundColor:self.state.colors.command
                        })
                        agv.addWidgetNode(curCmdWidget)
                        agv.linkWidgets(action.node,curCmdWidget)
                        curCmd.node = curCmdWidget
                        if (curCmd){
                            switch (curCmd[0].name){
                                //op
                                case 'IF':
                                case 'WHILE':
                                case 'ELSE':
                                case 'END':
                                    break;
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
                                case 'GOTO':
                                    let paramTag = findTagByName(data.tag)

                                    if (paramTag){
                                        agv.linkWidgets(curCmdWidget,paramTag.node)
                                    }
                                    paramTag = getTagByParam(curCmd[2])
                                    if (paramTag){
                                        agv.linkWidgets(paramTag.node,curCmdWidget)
                                    }else{
                                        //link page
                                        // let pageNum = parseInt(curCmd[2].value)
                                        // if(pageNum&&data.pageList[pageNum-1]){
                                        //     agv.linkWidgets(curCmdWidget,data.pageList[pageNum-1].node)
                                        // }
                                    }


                                    break;
                                default:
                                    for(let j=0;j<2;j++){
                                        let paramTag = getTagByParam(curCmd[j+1])
                                        if (paramTag){
                                            j===0?agv.linkWidgets(curCmdWidget,paramTag.node):agv.linkWidgets(paramTag.node,curCmdWidget)
                                        }
                                    }

                                    
                            }
                        }

                    }
                }
            }
        }

        function setTagLink(elem,direction) {
            direction = !!direction
            if (elem && elem.tag){
                // let timerId = findTimerIdByTag(elem.tag)
                // if (timerId!==null){
                //     //timer
                //     for(let j=0;j<timerList.length;j++){
                //         if (timerList[j].id === timerId){
                //             direction?agv.linkWidgets(elem.node,timerList[j].node):agv.linkWidgets(timerList[j].node,elem.node)
                //             break;
                //         }
                //     }
                // }else{
                //     //tag
                //     for(let j=0;j<data.tagList.length;j++){
                //         if (data.tagList[j].name === elem.tag){
                //             //hit
                //             direction?agv.linkWidgets(elem.node,data.tagList[j].node):agv.linkWidgets(data.tagList[j].node,elem.node)
                //         }
                //     }
                // }
                for(let j=0;j<data.tagList.length;j++){
                    if (data.tagList[j].name === elem.tag){
                        //hit
                        direction?agv.linkWidgets(elem.node,data.tagList[j].node):agv.linkWidgets(data.tagList[j].node,elem.node)
                    }
                }
            }
        }
        //pages
        //for(let i=0;i<data.pageList.length;i++){
            let curPage = data.pageList[this.state.pageIdx-1]
            let curPageWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),(this.state.pageIdx)+': '+curPage.name)
            curPage.node = curPageWidget
            agv.addWidgetNode(curPageWidget)
            agv.linkWidgets(projectWidget,curPageWidget)
            setTagLink(curPage,false)
            //canvas
            if (curPage.canvasList && curPage.canvasList.length){
               for(let j=0;j<curPage.canvasList.length;j++){
                   let curC = curPage.canvasList[j]
                   let curCWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curC.name)
                   curC.node = curCWidget
                   agv.addWidgetNode(curCWidget)
                   agv.linkWidgets(curPageWidget,curCWidget)
                   setTagLink(curC,false)
                   //subcanvas
                   if (curC.subCanvasList&&curC.subCanvasList.length){
                        for(let k=0;k<curC.subCanvasList.length;k++){
                            let curSC = curC.subCanvasList[k]
                            let curSCWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curSC.name)
                            curSC.node = curSCWidget
                            agv.addWidgetNode(curSCWidget)
                            agv.linkWidgets(curCWidget,curSCWidget)
                            setTagLink(curSC,false)
                            //widgets
                            if (curSC.widgetList&&curSC.widgetList.length){
                                for(let h=0;h<curSC.widgetList.length;h++){
                                    let curWidget = curSC.widgetList[h]
                                    let curWidgetWidget = new AGLabel(new AGPoint(),new AGSize(nodeW,nodeH),curWidget.name)
                                    curWidget.node = curWidgetWidget
                                    agv.addWidgetNode(curWidgetWidget)
                                    agv.linkWidgets(curSCWidget,curWidgetWidget)
                                    setTagLink(curWidget,false)
                                }
                            }
                        }
                   }
               }
            }
        //}

        // showProjectActions()
        showPageActions(curPage)

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
        let g = agv.layout({
            compact:true
        })

        //change max scale
        let maxWidthScale = rootView.frame.size.width / viewWindow.width
        let maxHeightScale = rootView.frame.size.height / viewWindow.height
        let maxScale = maxWidthScale//Math.max(maxWidthScale,maxHeightScale)
        // console.log(maxScale)
        this.setState({maxScale:maxScale})

        // agv.sortLinks()
        rootView.draw()
        viewWindow.display({
            scale:this.state.scale
        })
        let mouseDownHandler= function(e){
            rootView.dragStartPos=new AGPoint(e.pageX,e.pageY)
            rootView.lastOrigin=new AGPoint(rootView.frame.origin.x,rootView.frame.origin.y)
        }

        let dragHandler=function(e){
            let curMousePos = new AGPoint(e.pageX,e.pageY)
            rootView.frame.origin.x = rootView.lastOrigin.x+curMousePos.x - rootView.dragStartPos.x
            rootView.frame.origin.y = rootView.lastOrigin.y+curMousePos.y - rootView.dragStartPos.y
            // console.log(this.frame.origin.x,this.frame.origin.y)
            //rootView.draw()
            viewWindow.display({
                scale:this.state.scale
            })

        }.bind(this)

        rootView.on('mousedown',mouseDownHandler)
        rootView.on('drag',dragHandler)




    }

    componentDidMount(){
        this.initWindow()
        this.renderGraph()
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
           this.renderGraph()
        }
    }

    changeRankSep(e){
        this.setState({rankSep:parseInt(e.target.value)||0})
    }

    changePageIdx(e){
        this.setState({pageIdx:parseInt(e.target.value)},()=>this.renderGraph())
    }

    changeScale(e){
        this.setState({scale:Number(e.target.value)},()=>{
            this.viewWindow.display({
                scale:this.state.scale
            })
        })
    }

    handleInputKeyUp(e){
        if (e.keyCode === 13){
            //enter
            this.renderGraph()
        }
    }

    downloadActionVGraph(e){
        function dataURIToBlob(dataURI) {
            let binStr = atob(dataURI.split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }

            return new Blob([arr])
        }
        let link = e.target
        if(link){
            let dataUrl = this.viewWindow.rootView.layer.toDataURL()
            link.href = URL.createObjectURL(dataURIToBlob(dataUrl));
            link.download = '动作可视化.png'
        }

    }

    render(){
        let self = this
        let pageOptions = []
        for(let i=0;i<this.state.pageNum;i++){
            pageOptions.push(<option key={i+1} value={i+1}>{i+1}</option>)
        }
        let scaleOptions = []
        for(let i=1;i<=Math.floor(this.state.maxScale);i++){
            scaleOptions.push(<option key={i} value={1.0/i}>{parseInt((1.0/i)*100) + '%'}</option>)
        }
        scaleOptions.push(<option key={0} value={1.0/this.state.maxScale}>合适窗口</option>)
        return (
            <div>
                <div style={{backgroundColor:'white',top:0,right:0}}>
                    <span className="action-tool tool-page">页面：<select value={this.state.pageIdx} onChange={this.changePageIdx.bind(this)}>
                        {pageOptions}
                    </select></span>
                    <span className="action-tool tool-sep">节点间隔：<input value={this.state.rankSep} onChange={this.changeRankSep.bind(this)} onKeyUp={this.handleInputKeyUp.bind(this)} /></span>
                    <span className="action-tool tool-scale">缩放：<select value={this.state.scale} onChange={this.changeScale.bind(this)}>
                        {scaleOptions}
                    </select></span>
                    <span className="action-tool tool-download"><a target="blank" className="btn" onClick={this.downloadActionVGraph.bind(this)}>下载分析图</a></span>
                </div>
                <div ref={(container) => {
                    self.container = container;
                }}>


                </div>
         </div>)
    }
}


var playButton = document.getElementById('actionVisualization-play');
playButton.addEventListener('click',function () {
    ReactDOM.render(<ActionVisualizer data={_.cloneDeep(window.rawProject)} />,document.getElementById('action-visualizer'))
})

