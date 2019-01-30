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
    ReactDOM.render( < Simulator projectData = {window.projectData} />, simulatorContainer);
});

closeButton.addEventListener('click', function () {
    ReactDOM.render( < Simulator projectData = {{}} />, simulatorContainer);
});

