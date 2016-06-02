/**
 * Created by ChangeCheng on 16/6/2.
 */


ideServices.service('OperationService',[function () {
    var Operations = {};

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
        ['RET','<-'],
        ['IF_EQ','if='],
        ['IF_GT','if>'],
        ['IF_LT','if<'],
        ['ELSE','else'],
        ['END','end'],
        ['AND','&'],
        ['OR','||'],
        ['XOR','^'],
        ['NOT','!'],
        ['SL','<<'],
        ['SR','>>']
    ]

    for (var i=0;i<opsRaw.length;i++ ){
        var curOp = new Operation(opsRaw[i][0],opsRaw[i][1]);
        Operations[opsRaw[i][0]] = curOp;
    }

    this.getOperations = function () {
        return Operations;
    }

}]);