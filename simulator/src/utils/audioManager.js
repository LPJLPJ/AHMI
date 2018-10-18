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
    audio.startTime = audioCtx.currentTime
    audio.status = audioStatus.playing
    audio.audioSrc.start(0)
}

function pauseAudio(audio){
    stopAudio(audio)
    audio.pausedAt = audioCtx.currentTime - audio.startTime
    audio.status = audioStatus.paused
    
}

function resumeAudio(audio){
    var bufferSrc = audioCtx.createBufferSource()
    bufferSrc.buffer = audio.audioSrc.buffer
    
    bufferSrc.connect(window.audioCtx.destination)
    audio.audioSrc = bufferSrc
    audio.startTime = audioCtx.currentTime
    audio.status = audioStatus.playing
    audio.audioSrc.start(0,audio.pausedAt)
}

function stopAudio(audio){
    audio.audioSrc.stop()
    //audio.audioSrc = null
}

AudioManager.addNewAudio = function(buffer){
    var bufferSrc = audioCtx.createBufferSource();
    bufferSrc.buffer = buffer;
    
    bufferSrc.connect(window.audioCtx.destination);
    var key = getKey()
    audios.push({
        key:key,
        audioSrc:bufferSrc
    })
    return key
    
}

AudioManager.addNewAudioAndPlay = function(buffer){
    var bufferSrc = audioCtx.createBufferSource();
    bufferSrc.buffer = buffer;
    
    bufferSrc.connect(window.audioCtx.destination);
    var key = getKey()
    var curAudio = {
        key:key,
        audioSrc:bufferSrc
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
            return audios[i].audioSrc && playAudio(audios[i])
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
            return audios[i].audioSrc && (audios[i].status== audioStatus.paused) && resumeAudio(audios[i])
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