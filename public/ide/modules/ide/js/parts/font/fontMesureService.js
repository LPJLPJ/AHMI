/**
 * Created by changecheng on 2017/1/5.
 */
// mesure text font

ideServices.service('FontMesureService',[function () {
    var _canvas = document.createElement('canvas')
    var _ctx = _canvas.getContext('2d')
    this.mesureChar = function (char,font) {
        _ctx.save()
        _ctx.font = font
        var metrics = _ctx.measureText(char)
        _ctx.restore()
        return metrics.width
    }

    this.mesureStr = function (str,font) {
        _ctx.save()
        _ctx.font = font
        var metrics = _ctx.measureText(char)
        _ctx.restore()
        return metrics.width
    }

    this.mesureChars = function (chars,font) {
        var metrics = []
        _ctx.save()
        _ctx.font = font
        for (var i=0;i<chars.length;i++){
            metrics.push(_ctx.measureText(chars[i]).width)
        }
        _ctx.restore()
        return metrics
    }

    this.getMaxWidth = function (chars, font) {
        var metrics = this.mesureChars(chars,font)
        return Math.max(metrics)
    }

    this.getMinWidth = function (chars,font) {
        var metrics = this.mesureChars(chars,font)
        return Math.min(metrics)
    }
}]);