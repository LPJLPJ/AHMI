/**
 *Created by Zzen1sS on 3/12/18
 */

ideServices.service('WaveFilterService',[function () {
    var waveFilters = [];

    var waveFilterTypes = {
        Damping_PT1:'Damping_PT1',
        Damping_PT2:'Damping_PT2',
        Damping_Linear:'Damping_Linear'
    }

    function WaveFilter(){
        this.title = '滤波器'
        this.type = waveFilterTypes.Damping_Linear
        this.args = [0,0,0,0,0,0,0]
    }

    this.waveFilterTypes = function(){
        return waveFilterTypes
    }

    this.getWaveFilterAttrs = function(type){
        var args = []
        switch(type){
            case waveFilterTypes.Damping_Linear:
                args = ['Step','Delay','Freqence','Duration']
            break
            case waveFilterTypes.Damping_PT1:
                args = ['K','Threshold','Step','Delay','Frequence','Duration']
            break
            case waveFilterTypes.Damping_PT2:
                args = ['K1','K2','Threshold','Step','Delay','Frequence','Duration']
            break
            
        }
        return args
    }

    this.syncWaveFilters = function(_filters){
        waveFilters = _filters||[]
    }

    this.getWaveFilters = function(){
        return waveFilters
    }

    this.deleteByIdx = function(idx){
        if(idx>=0 && idx<waveFilters.length){
            waveFilters.splice(idx,1)
        }
    }

    this.addWaveFilter = function(_wavefilter){
        waveFilters.push(_wavefilter)
    }

    this.updateWaveFilterByIdx = function(_wavefilter,idx){
        if(idx>=0 && idx<waveFilters.length){
            waveFilters[idx] = _wavefilter
        }
    }

    this.getNewWaveFilter = function(){
        return new WaveFilter()
    }
    
}])