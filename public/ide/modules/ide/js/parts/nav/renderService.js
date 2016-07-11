/**
 * Created by zzen1ss on 16/7/11.
 */
ideServices.service('RenderSerive',[function () {



    this.renderProject=function (projectData) {
        try {
            var Renderer = require('../../utils/render/renderer');
            console.log(Renderer);
        }catch (e){
            console.log(e);
        }
        console.log('eeeeee')
    }

}]);