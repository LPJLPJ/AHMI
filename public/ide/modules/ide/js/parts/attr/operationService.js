/**
 * Created by ChangeCheng on 16/6/2.
 */


ideServices.service('OperationService',[function () {
    var Operations = [];

    //operation class
    function Operation(name, symbol, icon){
        this.name = name;
        this.symbol = symbol;
        this.icon = icon;
    }

    var opsRaw = [
        ['SET','='],
        ['INC','+'],
        ['DEC','-'],
        ['MUL','*'],
        ['DIV','/'],
        ['MOD','%'],
        ['GOTO','->'],
        // ['RET','<-'],
        ['IF','if'],
        ['WHILE','while'],
        ['ELSE','else'],
        ['END','end'],
        ['EQ','=='],
        ['NEQ','!='],
        ['GT','>'],
        ['LT','<'],
        ['GTE','>='],
        ['LTE','<='],
        ['AND','&'],
        ['OR','||'],
        ['XOR','^'],
        ['NOT','!'],
        ['SL','<<'],
        ['SR','>>'],
        ['SET_TIMER_START','setTimerStart'],
        ['SET_TIMER_STOP','setTimerStop'],
        ['SET_TIMER_STEP','setTimerStep'],
        ['SET_TIMER_INTERVAL','setTimerInterval'],
        ['SET_TIMER_CURVAL','setTimerCurVal'],
        ['SET_TIMER_MODE','setTimerMode'],
        ['READ_DATA_MODBUS', 'r_modbus'],
        ['WRITE_DATA_MODBUS', 'w_modbus'],
        ['READ_DATA_CAN', 'r_can'],
        ['WRITE_DATA_CAN', 'w_can'],
        ['ANIMATE','animate']
    ];

    for (var i=0;i<opsRaw.length;i++ ){
        var curOp = new Operation(opsRaw[i][0],opsRaw[i][1]);
        Operations.push(curOp);
    }

    this.getOperations = function () {
        return Operations;
    }

}]);