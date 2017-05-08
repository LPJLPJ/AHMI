/**
 * Created by ChangeCheng on 16/8/29.
 */
var Utils = {};
var _ = require('lodash');
var ctx;
Utils.linkPageWidgets = linkPageWidgets;

function linkPageWidgets(page) {
    page.linkedWidgets = linkWidgets(getPageInteractiveWidgets(page));
}


function measureMetrics(text,font) {
    if (!ctx){
        var curCanvas = document.createElement('canvas');
        ctx = curCanvas.getContext('2d');
    }
    ctx.save();
    if (font){
        ctx.font = font;
    }

    var metrics = ctx.measureText(text);
    ctx.restore();
    return  metrics.width;
}

function LinkedWidget(type, target, value, left, top) {
    this.type = type;
    this.target = target;
    this.value = value;
    this.left = left || 0;
    this.top = top || 0;
}

function Seq(childs,left,top) {
    this.childs = childs
    this.left = left
    this.top = top;
}

function linkWidgets(widgetList) {
    var i;
    var curWidget;
    var linkedWidgetList = [];
    var sequence = [];
    for (i = 0; i < widgetList.length; i++) {
        curWidget = widgetList[i];
        if (curWidget.info.disableHighlight==true){
            continue
        }
        switch (curWidget.subType) {
            case 'MyButtonGroup':
                var interval = curWidget.info.interval;
                var count = curWidget.info.count;
                var width = curWidget.info.width;
                var height = curWidget.info.height;
                var singleWidth = 0;
                var singleHeight = 0;
                var hori = false;
                if (curWidget.info.arrange == 'horizontal') {
                    singleWidth = (width - interval * (count - 1)) / count;
                    hori = true;
                } else {

                    singleHeight = (height - interval * (count - 1)) / count;

                }
                for (var j = 0; j < curWidget.info.count; j++) {

                    // linkedWidget.type = 'MyButtonGroup';
                    // linkedWidget.target = curWidget;
                    // linkedWidget.value = j;
                    // linkedWidget.left=curWidget.info.left + hori?(j*(singleWidth+interval)):0;
                    // linkedWidget.top=curWidget.info.top + hori?0:(j*(singleHeight+interval));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType, curWidget, j, curWidget.info.absoluteLeft + (hori ? (j * (singleWidth + interval)) : 0), curWidget.info.absoluteTop + (hori ? 0 : (j * (singleHeight + interval)))));
                }

                break;
            case 'MyDateTime':
                var mode = curWidget.info.dateTimeModeId;
                var fontSize = curWidget.info.fontSize;
                var fontFamily = curWidget.info.fontFamily;
                var fontStr = fontSize+'px '+fontFamily;
                var delimiterWidth;
                if(mode=='0'){
                    delimiterWidth = measureMetrics(':',fontStr);
                    curWidget.delimiterWidth = delimiterWidth;
                    var eachWidth = (curWidget.info.width-2*delimiterWidth)/3;
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,0,curWidget.info.absoluteLeft,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,1,curWidget.info.absoluteLeft+eachWidth+delimiterWidth,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,2,curWidget.info.absoluteLeft+(eachWidth+delimiterWidth)*2,curWidget.info.absoluteTop))
                }else if (mode == '1'){
                    delimiterWidth = measureMetrics(':',fontStr);
                    curWidget.delimiterWidth = delimiterWidth;
                    var eachWidth = (curWidget.info.width-delimiterWidth)/2;
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,0,curWidget.info.absoluteLeft,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,1,curWidget.info.absoluteLeft+eachWidth+delimiterWidth,curWidget.info.absoluteTop));

                }else if (mode == '2'){
                    delimiterWidth = measureMetrics('/',fontStr);
                    curWidget.delimiterWidth = delimiterWidth;
                    var eachWidth = (curWidget.info.width-2*delimiterWidth)/4;
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,0,curWidget.info.absoluteLeft,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,1,curWidget.info.absoluteLeft+2*eachWidth+delimiterWidth,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,2,curWidget.info.absoluteLeft+(eachWidth+delimiterWidth)*2+eachWidth,curWidget.info.absoluteTop))
                }else if (mode == '3'){
                    delimiterWidth = measureMetrics('-',fontStr);
                    curWidget.delimiterWidth = delimiterWidth;
                    var eachWidth = (curWidget.info.width-2*delimiterWidth)/4;
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,0,curWidget.info.absoluteLeft,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,1,curWidget.info.absoluteLeft+2*eachWidth+delimiterWidth,curWidget.info.absoluteTop));
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,2,curWidget.info.absoluteLeft+(eachWidth+delimiterWidth)*2+eachWidth,curWidget.info.absoluteTop))
                }
                break;
            case 'MyInputKeyboard':
                var keys = curWidget.info.keys;
                keys.forEach(function (key, index) {
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType,curWidget,index,key.x,key.y));
                })
            default:
                // linkedWidget.type = curWidget.subType;
                // linkedWidget.target = curWidget;
                // linkedWidget.value = 0;
                // linkedWidget.left=curWidget.info.left;
                // linkedWidget.top=curWidget.info.top;
                linkedWidgetList.push(new LinkedWidget(curWidget.subType, curWidget, 0, curWidget.info.absoluteLeft, curWidget.info.absoluteTop));

        }
    }

    linkedWidgetList.sort(function (a, b) {
        return (a.left - b.left);
    });
    linkedWidgetList.sort(function (a, b) {
        return (a.top - b.top);
    });

    return linkedWidgetList;
}


function getPageAllInteractiveWidgets(page) {
    var allInteractiveWidgets = [];
    var allWidgets = [];
    var curSubCanvas;
    var curCanvas;
    var count = 0;
    var widget;
    for (var i = 0; i < page.canvasList.length; i++) {//get all widgets
        curCanvas = page.canvasList[i];
        for (var j = 0; j < curCanvas.subCanvasList.length; j++) {
            curSubCanvas = curCanvas.subCanvasList[j];
            // curSubCanvas.widgetList.map(function (widget) {
            //     widget.info.absoluteLeft = widget.info.left + curCanvas.x;
            //     widget.info.absoluteTop = widget.info.top + curCanvas.y;
            // });
            for (var k=0;k<curSubCanvas.widgetList.length;k++){
                widget = curSubCanvas.widgetList[k];
                widget.wId = count++;
                widget.info.absoluteLeft = widget.info.left + curCanvas.x;
                widget.info.absoluteTop = widget.info.top + curCanvas.y;
            }
            allWidgets = allWidgets.concat(curSubCanvas.widgetList);
        }

    }

    allInteractiveWidgets = allWidgets.filter(isInteractiveWidget);
    // console.log(allInteractiveWidgets,allWidgets);
    return allInteractiveWidgets;
}

function getPageInteractiveWidgets(page) {
    var allInteractiveWidgets = [];
    var allWidgets = [];
    var curSubCanvas;
    var curCanvas;
    for (var i = 0; i < page.canvasList.length; i++) {//get all widgets
        curCanvas = page.canvasList[i];
        curSubCanvas = curCanvas.subCanvasList[curCanvas.curSubCanvasIdx || 0];
        curSubCanvas.widgetList.map(function (widget) {
            widget.info.absoluteLeft = widget.info.left + curCanvas.x;
            widget.info.absoluteTop = widget.info.top + curCanvas.y;
        });
        allWidgets = allWidgets.concat(curSubCanvas.widgetList);
    }

    allInteractiveWidgets = allWidgets.filter(isInteractiveWidget);
    // console.log(allInteractiveWidgets,allWidgets);
    return allInteractiveWidgets;
}

function isInteractiveWidget(widget) {
    var is = false;
    switch (widget.subType) {
        case 'MyButton':
        case 'MyButtonGroup':
        case 'MyDateTime':
        case 'MyInputKeyboard':
            is = true;
            break;
        default:
            is = false;
    }
    return is;
}

module.exports = Utils;
