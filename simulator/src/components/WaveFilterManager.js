/*
    created by Zzen1sS 2018/12/4
*/

var WaveFilterManager = {}

var waveFilters = {}


// case waveFilterTypes.Damping_Linear:
//     args = ['Step','Delay','Freqence','Duration']
// break
// case waveFilterTypes.Damping_PT1:
//     args = ['K','Threshold','Step','Delay','Frequence','Duration']
// break
// case waveFilterTypes.Damping_PT2:
//     args = ['K1','K2','Threshold','Step','Delay','Frequence','Duration']
// break
var waveFilterTypes = {
    Damping_PT1:'Damping_PT1',
    Damping_PT2:'Damping_PT2',
    Damping_Linear:'Damping_Linear'
}

function WaveFilter(tilte,type,args){
    
    this.title = tilte
    this.type = type
    this.args = args||[0,0,0,0,0,0,0]
    //set target attr
    switch(this.type){
        case waveFilterTypes.Damping_Linear:
            this.step = this.args[0]
            this.delay = this.args[1]
            this.frequence = this.args[2]
            this.duration = this.args[3]
            break
        case waveFilterTypes.Damping_PT1:
            this.k = this.args[0]
            this.threshold = this.args[1]
            this.step = this.args[2]
            this.delay = this.args[3]
            this.frequence = this.args[4]
            this.duration = this.args[5]
            break
        case waveFilterTypes.Damping_PT2:
            this.k1 = this.args[0]
            this.k2 = this.args[1]
            this.threshold = this.args[2]
            this.step = this.args[3]
            this.delay = this.args[4]
            this.frequence = this.args[5]
            this.duration = this.args[6]
            break
    }
    this.tags = {}
}

//from last actual value and the target value return new current actual value
WaveFilter.prototype.filter = function(tagStatus){
    
    switch(this.type){
        case waveFilterTypes.Damping_Linear:
        if(tagStatus.target>tagStatus.last)
		{
            tagStatus.delayCount++
            if(tagStatus.delayCount > this.delay){
                tagStatus.delayCount = 0
                tagStatus.current = tagStatus.last + this.step
                if(tagStatus.current > tagStatus.target){
                    tagStatus.current = tagStatus.target
                }
            }
			
		}
		else if(tagStatus.target<tagStatus.last){
			tagStatus.delayCount++
            if(tagStatus.delayCount > this.delay){
                tagStatus.delayCount = 0
                tagStatus.current = tagStatus.last - this.step
                if(tagStatus.current < tagStatus.target){
                    tagStatus.current = tagStatus.target
                }
            }
		}
            break
        case waveFilterTypes.Damping_PT1:
            if(tagStatus.target>tagStatus.last&&(tagStatus.target<=tagStatus.last+this.threshold))
            {
                tagStatus.delayCount++
                if (tagStatus.delayCount > this.delay){
                    tagStatus.delayCount = 0
                    tagStatus.current += this.step
                    if (tagStatus.current > tagStatus.target){
                        tagStatus.current = tagStatus.target
                    }
                }
            }
            else if(tagStatus.target<tagStatus.last&&(tagStatus.last<=tagStatus.target+this.threshold))
            {
                tagStatus.delayCount++
                if (tagStatus.delayCount > this.delay){
                    tagStatus.delayCount = 0
                    tagStatus.current -= this.step
                    if (tagStatus.current < tagStatus.target){
                        tagStatus.current = tagStatus.target
                    }
                }
            }
            /* PT1 Damping */
            else
            {   
                if(this.k >= 1){
                    tagStatus.current = parseInt((tagStatus.target + (this.k - 1) * (tagStatus.last)) / this.k)
                }

            }
            break
        case waveFilterTypes.Damping_PT2:
            if(tagStatus.target>tagStatus.last&&(tagStatus.target<=tagStatus.last+this.threshold))
            {
                tagStatus.delayCount++
                if (tagStatus.delayCount > this.delay){
                    tagStatus.delayCount = 0
                    tagStatus.current += this.step
                    if (tagStatus.current > tagStatus.target){
                        tagStatus.current = tagStatus.target
                    }
                }
            }
            else if(tagStatus.target<tagStatus.last&&(tagStatus.last<=tagStatus.target+this.threshold))
            {
                tagStatus.delayCount++
                if (tagStatus.delayCount > this.delay){
                    tagStatus.delayCount = 0
                    tagStatus.current -= this.step
                    if (tagStatus.current < tagStatus.target){
                        tagStatus.current = tagStatus.target
                    }
                }
            }
            /* PT1 Damping */
            else
            {   
                // if(((Para->mK1)!=0)&&((Para->mK2)!=0))
                // {
                //     Para->mOld1 = (InData + (Para->mK1 - 1) * Para->mOld1)/(Para->mK1);
                //     Para->mOld2 = (Para->mOld1 + (Para->mK2 - 1) * Para->mOld2)/(Para->mK2);
                // }
                if(tagStatus.last0 === undefined){
                    tagStatus.last0 = 0
                }
                if(this.k1 != 0 && this.k2 != 0){
                    tagStatus.last0 = parseInt((tagStatus.target + (this.k1 - 1) * (tagStatus.last0)) / this.k1)
                    tagStatus.current = parseInt((tagStatus.last0 + (this.k2 - 1) * (tagStatus.last)) / this.k2)
                }
                

            }
            break
    }
    tagStatus.last = tagStatus.current
    
}

WaveFilter.prototype.startFilterTagToNewValue = function(tag,lastValue,value, cb){
    var curTagStatus = this.tags[tag]
    if(curTagStatus.timerId!=0){
        clearInterval(curTagStatus.timerId)
        curTagStatus.timerId = 0
    }
    curTagStatus.last = lastValue
    curTagStatus.target = value
    var innerTime = 0
    var d = parseInt(1000/this.frequence)
    curTagStatus.timerId = setInterval(function(){
        this.filter(curTagStatus)
        //process stop
        innerTime += d
        if(innerTime >= this.duration){
            //finish
            clearInterval(curTagStatus.timerId)
            curTagStatus.timerId = 0
        }
        cb && cb(curTagStatus.current)
    }.bind(this),d)
}



function WaveFilterTagStatus(){
    this.last = 0
    this.current = 0
    this.target = 0
    this.timerId = 0
    this.delayCount = 0
}

WaveFilterManager.getWaveFilters = function(){
    return waveFilters
}

//add new wavefilter indexed by title, if exists return false
WaveFilterManager.addWaveFilter = function(title,type,args){
    if (title in waveFilters){
        return false
    }else{
        var curWaveFilter = new WaveFilter(title,type,args)
        
        waveFilters[title] = curWaveFilter
        return true
    }
    
    
}

WaveFilterManager.registerWaveFilter = function(waveFilterTitle,tag){
    if(waveFilterTitle in waveFilters){
        waveFilters[waveFilterTitle].tags[tag] = new WaveFilterTagStatus()
        return true
    }else{
        return false
    }
}

//set tag with new value with wavefilter
//calCB: call every cal tick
WaveFilterManager.calTagWithWaveFilter = function(tag,lastValue,value,waveFilterTitle,calCB){
    var curWaveFilter = waveFilters[waveFilterTitle]
    curWaveFilter.startFilterTagToNewValue(tag,lastValue,value,calCB)
}


WaveFilterManager.waveFilterTypes = waveFilterTypes

WaveFilterManager.reset = function(){
    for(var wavefilter in waveFilters){
        //stop tags
        for(var tag in wavefilter.tags){
            var curTagStatus = wavefilter.tags[tag]
            if(curTagStatus.timerId!=0){
                clearInterval(curTagStatus.timerId)
                curTagStatus.timerId = 0
            }
        }
    }
    waveFilters = {}
}


module.exports = WaveFilterManager