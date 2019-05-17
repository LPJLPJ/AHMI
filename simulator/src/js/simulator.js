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

    window.projectData.trackList.forEach(function(res){
        var bufferSrc = audioCtx.createBufferSource();
        bufferSrc.buffer = res.buffer;
        bufferSrc.connect(audioCtx.destination);
        bufferSrc.start(0)
        bufferSrc.stop()
    })

    ReactDOM.render( < Simulator projectData = {window.projectData} />, simulatorContainer);
});

closeButton.addEventListener('click', function () {
    ReactDOM.render( < Simulator projectData = {{}} />, simulatorContainer);
});

