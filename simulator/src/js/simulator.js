var React = require('react');
var ReactDOM = require('react-dom');

var Simulator = require('../components/Simulator');
var playButton = document.getElementById('play');
var simulatorContainer = document.getElementById('simulator-container');

//custom event
//(function () {
//
//    if ( typeof window.CustomEvent === "function" ) return false;
//
//    function CustomEvent ( event, params ) {
//        params = params || { bubbles: false, cancelable: false, detail: undefined };
//        var evt = document.createEvent( 'CustomEvent' );
//        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
//        return evt;
//    }
//
//    CustomEvent.prototype = window.Event.prototype;
//
//    window.CustomEvent = CustomEvent;
//})();
//
//var event = new CustomEvent("resetSimulator");


var closeButton = document.getElementById('close');


playButton.addEventListener('click', function () {

    ReactDOM.render( < Simulator
    projectData = {window.projectData
} />
    ,
    simulatorContainer
    )
    ;
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

