
ideServices


    .service('CanvasService', [function () {
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
            offCanvas = _offCanvas;

        }
        this.getOffCanvas = function () {
            return offCanvas;
        }




    }])
;