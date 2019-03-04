(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.spinner = factory();
    }
}(function () {
    var Spinner = {}
    var loadingDOM = document.createElement('div');
    loadingDOM.className = 'loading-wrap';
    loadingDOM.innerHTML = '<div class="loading-inner"><span></span><span></span><span></span><span></span><span></span><span></span><p id="loading-value">0%</p></div>';
    document.body.appendChild(loadingDOM);
    document.body.style.overflow = 'hidden';

    var loadingValue = document.querySelector('#loading-value');
    loadingValue.style.cssText="font-size:20px;font-family:Arial";

    Spinner.show = function (options) {
        loadingDOM.style.display = 'block';
        if(options && options.progress == false){
            loadingValue.style.display = 'none';
        }
    };
    
    Spinner.hide = function (resetFlag) {
        loadingDOM.style.display = 'none';
        document.body.style.overflowX = 'auto';
        if(resetFlag){
            this.reset();
        }
    };

    Spinner.update = function (value) {
        value = parseInt(value);
        loadingValue.innerText = value + '%';
    };

    Spinner.setBackgroundColor = function (color) {
        loadingDOM.style.background = color;
    };

    Spinner.reset = function () {
       this.update(0);
    };


    return Spinner
}))