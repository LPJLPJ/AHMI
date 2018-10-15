window.fucku = 'fucku';
var React = require('react');
var ReactDOM = require('react-dom');
//
var Simulator = require('../components/Simulator');
var playButton = document.getElementById('play');
var simulatorContainer = document.getElementById('simulator-container');
//
var closeButton = document.getElementById('close');
// window.runSimulator = runSimulator;
// function runSimulator(projectData) {
//     ReactDOM.render( < Simulator
//             projectData = {projectData||window.projectData
//             } />
//         ,
//         simulatorContainer
//     )
//     ;
// }
playButton.addEventListener('click', function () {

    {/*ReactDOM.render( < Simulator projectData = {{}} />, simulatorContainer);*/}
    
    // window.audioList.forEach(function(res){
    //     res.start(0)
    //     res.stop(0)
    // })
    window.audioList.forEach(function(res){
        res.play()
        res.currentTime = 0
        res.pause()
    })
    // window.cachedResourceList.filter(function(res){return res.type && res.type.match(/audio/)}).forEach(function(res){
    //     // var track =  audioCtx.createMediaElementSource(res.content);
    //     // track.connect(audioCtx.destination)
    //     var request = new XMLHttpRequest();
    //     request.open('get', res.src, true);
    //     request.responseType = 'arraybuffer';
    //     request.onload = function() {
    //         audioCtx.decodeAudioData(request.response, function(buffer) {
                
    //             var gainNode = audioCtx.createGain();
    //             var bufferSrc = audioCtx.createBufferSource();
    //             bufferSrc.buffer = buffer;
    //             bufferSrc.connect(gainNode);
    //             gainNode.connect(audioCtx.destination);
    //             bufferSrc.start(0)
    //             bufferSrc.stop(0)
    //             window.audioList.push(bufferSrc)
               
    //          });
    //     };
    //     request.send();
        
    // })
    //const track = audioCtx.createMediaElementSource(audioElement);

    ReactDOM.render( < Simulator projectData = {window.projectData} />, simulatorContainer);
});

closeButton.addEventListener('click', function () {
    ReactDOM.render( < Simulator
    projectData = {
    {
    }
}/>
    ,
    simulatorContainer
    )
    ;
});

