/**
 * Created by ChangeCheng on 16/4/5.
 */

ideServices.service('ViewService',[function () {
    var defaultScale = '100%';
    var pageScale = defaultScale;
    var canvasScale = defaultScale;
    this.setScale = function (value, type, cb) {
        if (type == 'page'){
            pageScale = value;
            cb && cb();
        }else if (type == 'canvas' || type == 'subCanvas'){
            canvasScale = value;
            cb && cb();
        }else{
            console.log('invalid type or value');
        }

    };

    function transScaleToFloat(scale){
        return parseFloat(scale.slice(0,-1))/100;
    }
    this.getScaleFloat = function(type){
        if (type == 'page'){
            return transScaleToFloat(pageScale);

        }else if (type == 'canvas' || type == 'subCanvas'){
            return transScaleToFloat(canvasScale);
        }else{
            console.log('invalid type');
        }
    }
    this.getScale = function(type){
        if (type == 'page'){
            return pageScale;

        }else if (type == 'canvas' || type == 'subCanvas'){
            return canvasScale;
        }else{
            console.log('invalid type');
        }
    }

    this.resetScale = function(type,cb){
        if (type=='all'){
            pageScale = defaultScale;
            canvasScale = defaultScale;
            cb && cb();
        }else{
            if (type == 'page'){
                pageScale = defaultScale;
                cb && cb();
            }else if (type == 'canvas' || type == 'subCanvas'){
                canvasScale = defaultScale;
                cb && cb();
            }else{
                console.log('invalid type for reset scale');
            }
        }
    }
}]);
