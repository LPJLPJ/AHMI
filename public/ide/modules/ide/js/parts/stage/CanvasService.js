/**
 * Created by shenaolin on 16/2/28.
 * 本文件任何改动需要通过[沈奥林]确认
 */
ideServices


    .service('CanvasService', function () {
        var pageNode=null;
        this.setPageNode= function (_node) {

            pageNode=_node;
        };
        this.getPageNode= function () {
            return pageNode;
        };

        var subLayerNode=null;
        this.setSubLayerNode= function (_node) {
            subLayerNode=_node;
        };
        this.getSubLayerNode= function () {
            return subLayerNode;
        }


        //offcanvas
        var offCanvas = null;
        this.setOffCanvas = function (_offCanvas) {
            offCanvas = _offCanvas

        }
        this.getOffCanvas = function () {
            return offCanvas
        }




    })
;