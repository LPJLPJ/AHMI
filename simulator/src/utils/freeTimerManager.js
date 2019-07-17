//created by Zzen1sS
//2019/7/17

var FreeTimerManager = {}

FreeTimerManager.timerIds = []

FreeTimerManager.addTimerId = function(id){
    for(var i=0;i<this.timerIds.length;i++){
        if(this.timerIds[i] === id){
            return
        }
    }
    this.timerIds.push(id)
}

FreeTimerManager.deleteTimerId = function(id){
    for(var i=0;i<this.timerIds.length;i++){
        if(this.timerIds[i] === id){
            this.timerIds.splice(i,1)
            return
        }
    }
}

FreeTimerManager.clearTimerId = function(id){
    clearInterval(id)
    this.deleteTimerId(id)
}

FreeTimerManager.clearAll = function(){
    this.timerIds.forEach(function(id){
        clearInterval(id)
    })
    this.timerIds = []
}



module.exports = FreeTimerManager