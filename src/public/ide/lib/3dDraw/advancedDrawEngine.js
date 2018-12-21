//3d draw engine
//created by Zzen1sS
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.AdvancedDrawEngine = factory();
    }
}(function () {
    var AdvancedDrawEngine = {}

    

    return AdvancedDrawEngine

}))