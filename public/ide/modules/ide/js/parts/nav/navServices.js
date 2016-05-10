/**
 * Created by shenaolin on 16/3/4.
 * 控制navbar按钮的状态
 */
ideServices.
    service('NavService', function (CanvasService, ProjectService, OperateQueService, Type) {
    var _self=this;

    /**
     * 获得删除按钮的状态
     * @returns {boolean}
     */
    this.getDeleteStatus= function () {
        var selectObj=ProjectService.getCurrentSelectObject();
        //return selectObj.type!=Type.MyPage&&selectObj.type!=Type.MySubLayer;
        return selectObj.type!=Type.MyPage;


    };
    this.getOperateQueStatus= function () {
        return OperateQueService.getOperateQueStatus();
    };
    this.getLayerStatus= function () {
        return ProjectService.isEditingPage();
    };

    this.getSubLayerStatus=function(){
        var selectObj=ProjectService.getCurrentSelectObject();
        return selectObj.type==Type.MyLayer;
    }
    this.getWidgetStatus= function () {
        return !ProjectService.isEditingPage();
    }

    this.getCopyStatus= function () {
        return (ProjectService.getCurrentSelectObject().type!=Type.MyPage&&ProjectService.getCurrentSelectObject().type!=Type.MySubLayer)
    }

    this.getPasteStatus= function () {
        return ProjectService.shearPlateEnable();
    }

    this.DoCopy= function (_callback) {
        if (!_self.getCopyStatus()){
            return;
        }
        var selectObject=ProjectService.getCurrentSelectObject();
        if (selectObject.type==Type.MyLayer){
            ProjectService.CopyLayer(selectObject.level, function () {
                //$scope.$emit('DoCopy');
                _callback&&_callback();

            })
        }else if (selectObject.type==Type.MyGroup&&selectObject.mode==0){
            ProjectService.CopyLayerGroup(selectObject.target, function () {
                //$scope.$emit('DoCopy');
                _callback&&_callback();

            })
        }else if (Type.isWidget(selectObject.type)){
            ProjectService.CopyWidget(selectObject.level, function () {
                //$scope.$emit('DoCopy');
                _callback&&_callback();

            })
        }else if (selectObject.type==Type.MyGroup&&selectObject.mode==1){
            ProjectService.CopyWidgetGroup(selectObject.target, function () {
                //$scope.$emit('DoCopy');
                _callback&&_callback();

            })
        }else{
            console.warn('无效的复制');
        }
    };
    this.DoPaste=function(_callback){
        if (!_self.getPasteStatus()){
            return;
        }

        ProjectService.DoPaste(function () {
            _callback&&_callback();

        });
    }


    var deleting=false;     //删除中标志位,防止连续删除
    this.DoDelete= function (_callback) {
        if (!_self.getDeleteStatus()){
            return;
        }
        if(deleting){
            return;
        }

        deleting=true;

        var currentObject=ProjectService.getCurrentSelectObject();
        if (currentObject.type==Type.MyLayer||(currentObject.type==Type.MyGroup&&currentObject.mode==0)){
            ProjectService.DeleteActiveLayers( function () {

                _callback&&_callback();
                deleting=false;

            })
        }else if(currentObject.type==Type.MySubLayer){

            ProjectService.DeleteCurrentSubLayer(function () {
                _callback&&_callback();
                deleting=false;

            });
        }else if (Type.isWidget(currentObject.type)||(currentObject.type==Type.MyGroup&&currentObject.mode==1)){
            ProjectService.DeleteActiveWidgets( function () {
                //$scope.$emit('ChangeCurrentPage',oldOperate)
                _callback&&_callback();
                deleting=false;

            })

        }
        else {
            deleting=false;

            console.warn('不可删除');
        }
    };
    this.DoUndo= function (_callback) {
        if(!_self.getOperateQueStatus().undoEnable){
            return;
        }
        OperateQueService.undo(function () {
            _callback&&_callback();
        })
    };

    this.DoRedo= function (_callback) {
        if(!_self.getOperateQueStatus().redoEnable){
            return;
        }
        OperateQueService.redo(function () {
            _callback&&_callback();
        })
    };





    })