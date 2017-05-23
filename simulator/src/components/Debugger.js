var Debugger = {}
var mode;
var watchingObj= {}
function BreakPoint(widgetType,f,line) {
	this.widgetType = widgetType
	this.function = f;
	this.line = line
}
Debugger.breakpoints = [new BreakPoint('Dashboard','onTagChange',4)]
Debugger.curBreakPoint = -1;
Debugger.getMode = function () {
	return mode;
}
Debugger.setMode = function (_mode) {
	mode = _mode;
}

Debugger.setNextStepHanle = function (nextStepHandle) {
	if (nextStepHandle && typeof nextStepHandle == 'function') {
		Debugger.nextStep = nextStepHandle
	}else{
		Debugger.nextStep = function () {
			
		}
	}
}

Debugger.nextStep = function () {
	
}

Debugger.shouldPause = function(generalCommands,widgetType,f,index){
	// console.log(widgetType,f,index,generalCommands)

	var cmds = (generalCommands[widgetType] && generalCommands[widgetType][f]) ||[]
	var maxLine = cmds.length;
	if (widgetType=='Dashboard') {
		console.log(f,index,maxLine)
	}
	for (var i=0;i<Debugger.breakpoints.length;i++){
		var curBP = Debugger.breakpoints[i]
		if (curBP.widgetType == widgetType && curBP.function == f) {
			//compare line number
			if (index >= curBP.line && index < maxLine) {
				//pause
				return true

			}
		}
	}
	return false;
}

Debugger.pause = function (nextStepHandle,watchingObj,cmds,current) {
	mode = 'debugging';
 	debugger;
 	nextStepHandle&&nextStepHandle()
}



module.exports = Debugger;