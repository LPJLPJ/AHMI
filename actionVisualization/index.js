import React from 'react';
import ReactDOM from 'react-dom';
import ActionVisualizer from './src/actionVisualizer';
import ProjectDataG6Transformer from './src/projectDataG6Transformer';

var playButton = document.getElementById('play');
playButton.addEventListener('click',function () {
    ReactDOM.render(<ActionVisualizer data={ProjectDataG6Transformer.trans(window.projectData)} />,document.getElementById('action-visualizer'))
})

