var AudioManager = {}
var audios = []

var idx = 0
function getKey(){
    return 'audio_'+idx++
}

AudioManager.addNewAudio = function(buffer,key){
    var bufferSrc = audioCtx.createBufferSource();
    bufferSrc.buffer = buffer;
    
    bufferSrc.connect(window.audioCtx.destination);
    audios.push({
        key:key||getKey(),
        audioSrc:bufferSrc
    })
    
}

AudioManager.addNewAudioAndPlay = function(buffer,key){
    var bufferSrc = audioCtx.createBufferSource();
    bufferSrc.buffer = buffer;
    
    bufferSrc.connect(window.audioCtx.destination);
    audios.push({
        key:key||getKey(),
        audioSrc:bufferSrc
    })
    bufferSrc.start(0)
    
}

AudioManager.recordAudio = function(audioSrc,key){
    audios.push({
        key:key||getKey(),
        audioSrc:audioSrc
    })
}


AudioManager.playAudioWithKey = function(key){
    for(var i=0;i<audios.length;i++){
        if(audios[i].key === key){
            return audios[i].audioSrc && audios[i].audioSrc.start(0)
        }
    }
}


AudioManager.stopAudioWithKey = function(key){
    for(var i=0;i<audios.length;i++){
        if(audios[i].key === key){

            audios[i].audioSrc && audios[i].audioSrc.stop() && audios.splice(i,1)
            break
        }
    }
}


AudioManager.stopAllAudios = function(){
    for(var i=0;i<audios.length;i++){
        audios[i].audioSrc && audios[i].audioSrc.stop() 
    }
    audios = []
}




module.exports = AudioManager