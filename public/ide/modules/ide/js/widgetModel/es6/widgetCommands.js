;(function (factory) {
	if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('WidgetCommands',[], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory()
    } else {
        // Browser globals
        window.WidgetCommands = factory();
    }
}(function () {
    var WidgetCommands = {}
    WidgetCommands['Button'] = {
        onInitialize:`
            var(a,1)
            if(a>=3){
                set('this.layers.1.hidden',2)
            }
        `
    }

    return WidgetCommands;

}))

