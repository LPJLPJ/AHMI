/**
 * Created by ChangeCheng on 16/8/29.
 */
var Utils = {};
var _ = require('lodash');
Utils.linkPageWidgets = linkPageWidgets;

function linkPageWidgets(page) {
    page.linkedWidgets = linkWidgets(getPageInteractiveWidgets(page));
}


function LinkedWidget(type, target, value, left, top) {
    this.type = type;
    this.target = target;
    this.value = value;
    this.left = left || 0;
    this.top = top || 0;
}

function linkWidgets(widgetList) {
    var i;
    var curWidget;
    var linkedWidgetList = [];
    for (i = 0; i < widgetList.length; i++) {
        curWidget = widgetList[i];
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
                    linkedWidgetList.push(new LinkedWidget(curWidget.subType, curWidget, j, curWidget.info.absoluteLeft + hori ? (j * (singleWidth + interval)) : 0, curWidget.info.absoluteTop + hori ? 0 : (j * (singleHeight + interval))));
                }

                break;
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
        return (a.top - b.top);
    });
    return linkedWidgetList;
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
            is = true;
            break;
        default:
            is = false;
    }
    return is;
}

module.exports = Utils;
