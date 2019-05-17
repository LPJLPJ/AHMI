var AudioManager = {}
var audios = []

var idx = 1
var audioStatus = {
    idle:'idle',
    playing:'playing',
    paused:'paused'
}
function getKey(){
    return 'audio_'+idx++
}

function playAudio(audio){
    if(audio.audioSrc){
        stopAudio(audio)
    }
    var bufferSrc = audioCtx.createBufferSource();
    bufferSrc.buffer = audio.buffer;
    bufferSrc.loop = audio.loop
    bufferSrc.connect(window.audioCtx.destination);
    audio.audioSrc = bufferSrc
    audio.startTime = audioCtx.currentTime

    if(audio.pausedAt && audio.status==audioStatus.paused){
        audio.audioSrc.start(0,audio.pausedAt)
    }else{
        audio.audioSrc.start(0)
    }
    audio.status = audioStatus.playing
}

function pauseAudio(audio){
    stopAudio(audio)
    audio.pausedAt = audio.pausedAt||0
    audio.pausedAt += audioCtx.currentTime - audio.startTime
    audio.status = audioStatus.paused

}

function resumeAudio(audio){


    playAudio(audio)

}

function stopAudio(audio){
    if(audio.audioSrc){
        audio.audioSrc.stop()
        audio.audioSrc = null
    }

    //audio.audioSrc = null
}

AudioManager.addNewAudio = function(buffer,opts){
    opts = opts||{}
    var key = getKey()
    audios.push({
        key:key,
        buffer:buffer,
        loop:opts.loop||false
    })
    return key

}

AudioManager.addNewAudioAndPlay = function(buffer,opts){
    opts = opts||{}
    var key = getKey()
    var curAudio = {
        key:key,
        buffer:buffer,
        loop:opts.loop||false
    }
    audios.push(curAudio)
    playAudio(curAudio)
    return key

}

AudioManager.recordAudio = function(audioSrc){
    var key = getKey()
    audios.push({
        key:key,
        audioSrc:audioSrc
    })
    return key
}


AudioManager.playAudioWithKey = function(key){
    for(var i=0;i<audios.length;i++){
        if(audios[i].key === key){
            return  playAudio(audios[i])
        }
    }
}

AudioManager.pauseAudioWithKey = function(key){
    for(var i=0;i<audios.length;i++){
        if(audios[i].key === key){
            return audios[i].audioSrc && (audios[i].status== audioStatus.playing) && pauseAudio(audios[i])
        }
    }
}

AudioManager.resumeAudioWithKey = function(key){
    for(var i=0;i<audios.length;i++){
        if(audios[i].key === key){
            return  (audios[i].status== audioStatus.paused) && resumeAudio(audios[i])
        }
    }
}


AudioManager.stopAudioWithKey = function(key){
    for(var i=0;i<audios.length;i++){
        if(audios[i].key === key){
            audios[i].audioSrc && stopAudio(audios[i]) && audios.splice(i,1)
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