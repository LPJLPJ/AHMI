/**
 * Created by shenaolin on 16/3/10.
 */
ideServices
    .service('OperateQueService', function ($timeout,ProjectService) {
        var historyQue=[];
        var futureQue=[];

        var MAX_QUE_LEN=20;

        var operateQueStatus={
            undoEnable:false,
            redoEnable:false
        };

        /**
         * 获得当前操作历史的状态
         * @returns {{undoEnable: boolean, redoEnable: boolean}}
         */
        this.getOperateQueStatus= function () {
            operateQueStatus={
                undoEnable:(historyQue.length!=0),
                redoEnable:(futureQue.length!=0),

            };
            return  operateQueStatus;

        };
        /**
         * 向操作历史中插入一个函数
         * @param _operates
         * @returns {{operateQueStatus: {undoEnable, redoEnable}}} 当前操作历史的状态
         */

        this.pushNewOperate= function (_operates) {
            if (historyQue.length>=MAX_QUE_LEN){
                historyQue.shift();
            }
            historyQue.push(_operates);
            futureQue=[];

        }

        /**
         * 从历史操作中撤销
         */
        this.undo= function (_successCallback,_errCallback) {
            if (!this.getOperateQueStatus().undoEnable){
                console.warn('无效的撤销,请检查...');
                _errCallback&&_errCallback();
                return;
            }

            var topOperates=historyQue[historyQue.length-1];

            $timeout(function () {
                ProjectService.LoadCurrentOperate(topOperates.undoOperate, function () {
                    futureQue.push(historyQue.pop());
                    _successCallback&&_successCallback();

                },_errCallback);
            })


        };

        /**
         * 重做前一个被撤销的操作
         * @returns {{func: *, operateQueStatus: {undoEnable, redoEnable}}}
         */
        this.redo= function (_successCallback,_errCallback) {
            if (!this.getOperateQueStatus().redoEnable){
                console.warn('无效的重做,请检查...');
                _errCallback();

            }
            var topOperates=futureQue[futureQue.length-1];

            $timeout(function () {
                ProjectService.LoadCurrentOperate(topOperates.redoOperate, function () {
                    historyQue.push(futureQue.pop());

                    _successCallback&&_successCallback();
                },_errCallback);
            })


        }



    })
