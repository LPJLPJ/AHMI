/**
 * Created by zzen1ss on 16/6/28.
 */
;(function () {
    'use strict';
    var parser = {};
    parser.parse = parse;

    /**
     * parse a program;
     */
    function parse(program) {
        var results = [];
        var loopFLag = true;
        while (program.length&&loopFLag) {
            var line = program[0];
            var block;
            // console.log(line[0]);
            switch (line[0].name) {
                //if
                case 'IF':
                    block = {};
                    block.type = 'IF';
                    block.args = [];
                    program.shift(); // if
                    block.args.push(program.shift()); //condition
                    block.args.push(parse(program)); //then
                    if (program[0][0].name==='ELSE') {
                        program.shift();
                        block.args.push(parse(program)); //else
                    }
                    program.shift();
                    results.push(block);
                    break;
                //while
                case 'WHILE':
                    block = {
                        type:'WHILE',
                        args:[]
                    };
                    program.shift();
                    block.args.push(program.shift());
                    block.args.push(parse(program));
                    program.shift();
                    results.push(block);
                    break;
                case 'ELSE':
                case 'END':
                    loopFLag = false;
                    break;
                default:
                    results.push({
                        type:'EXP',
                        args:[line]
                    });
                    program.shift();
                    break;

            }
        }
        return results;
    }



    var transformer = {};
    var labelCount = 0;

    function Command(label,cmd) {
        this.label = String(label);
        this.cmd = cmd;
    }

    var targetCompareOps = {
        'GTE':'LT',
        'LTE':'GT'
    };

    // transformer.transSingleIf = transSingleIf;
    // transformer.transBlock = transBlock;
    transformer.trans = trans;

    var JUMP = {
        name:'JUMP',
        symbol:'JUMP'
    }

    var END = {
        name:'END',
        symbol:'END'
    }

    var BLANK = {
        tag:'',
        value:''
    }
    
    function trans(block,changeIfConditon) {
        var tempResult = transBlock(block,changeIfConditon);
        adjustJumps(tempResult);
        return tempResult;
    }

    function adjustJumps(transedBlockResults) {
        var labels = {};
        var curLine;
        //build label index
        for (var i = 0; i < transedBlockResults.length; i++) {
            curLine = transedBlockResults[i];
            if (curLine.label !== '') {
                labels[curLine.label] = i;
            }
        }
        //change jumps
        for (i = 0; i < transedBlockResults.length; i++) {
            curLine = transedBlockResults[i];
            var curCmd = curLine.cmd;
            if (curCmd[0].name === 'JUMP') {
                //jump
                var labelIdx = labels[curCmd[2].value];
                curCmd[2].value = labelIdx - i;
            }
        }
    }

    function transBlock(block,changeIfConditon) {
        var results = [];
        for (var i = 0; i < block.length; i++) {
            var curExp = block[i];
            switch (curExp.type) {
                case 'EXP':
                    results.push(new Command('', curExp.args[0]));
                    break;
                case 'IF':
                    [].push.apply(results, transSingleIf(curExp,changeIfConditon));
                    break;
                case 'WHILE':
                    [].push.apply(results, transSingleWhile(curExp,changeIfConditon));
                    break;
                default:
                    results.push(new Command('', curExp.args[0]));
                    break;
            }
        }
        return results;
    }



    function transSingleIf(ifBlock, changeCondition) {
        var results = [];
        var args = ifBlock.args;
        if (args.length === 2) {
            //only then
            args.push([]);
        }
        var condition = args[0];
        var thenBlock = args[2];
        var elseBlock = args[1];

        changeCondition = changeCondition || false;
        if (changeCondition){
            //adjust if then else
            ///

            var ifBlockOp = condition[0].name;
            var oppositeOp = targetCompareOps[ifBlockOp];
            if (!!oppositeOp){
                condition[0].name = oppositeOp;
                thenBlock = args[1];
                elseBlock = args[2];
            }
        }

        //condition
        results.push(new Command('', condition));
        
        //jump to then
        var l1 = labelCount;
        labelCount = labelCount + 1;
        results.push(new Command('', [JUMP, BLANK, {tag:'',value:l1}]));

        [].push.apply(results, transBlock(elseBlock,changeCondition));
        //jump to END
        var l2 = labelCount;
        labelCount = labelCount + 1;
        results.push(new Command('', [JUMP, BLANK, {tag:'',value:l2}]));

        //then block;
        var transedThenBlock = transBlock(thenBlock,changeCondition);
        if (transedThenBlock.length > 0) {
            transedThenBlock[0].label = String(l1);
        } else {
            // transedThenBlock.push({
            //   label:String(l1),
            //   cmd:['END','','']
            // });
            transedThenBlock.push(new Command(l1, [END, '', '']));
        }

        // results.concat(transedThenBlock);
        [].push.apply(results, transedThenBlock);
        //END

        // results.push({
        //   label:String(l2),
        //   cmd:['END','','']
        // });
        results.push(new Command(l2, [END, '', '']));
        return results;


    }


    function transSingleWhile(whileBlock,changeCondition) {
        var results = [];
        var args = whileBlock.args;
        var condition = args[0];
        var block = args[1];
        var l1 = labelCount++;
        var l2 = labelCount++;
        var l3 = labelCount++;

        if (changeCondition){
            var oppositeOp = targetCompareOps[condition[0].name];
            if (!!oppositeOp){
                condition[0].name = oppositeOp;
                //condition
                results.push(new Command(l1, condition));

                //jump to then block;
                results.push(new Command('', [JUMP, BLANK, {tag:'',value:l2}]));
                //jump to end;
                results.push(new Command('', [JUMP, BLANK, {tag:'',value:l3}]));
            }else{
                //condition
                results.push(new Command(l1, condition));

                //jump to then block;
                results.push(new Command('', [JUMP, BLANK, {tag:'',value:l3}]));
                //jump to end;
                results.push(new Command('', [JUMP, BLANK, {tag:'',value:l2}]));
            }
        }



        //then block;
        var transedThenBlock = transBlock(block,changeCondition);
        transedThenBlock.push(new Command('', [JUMP, BLANK, {tag:'',value:l1}]));
        transedThenBlock[0].label = String(l2);
        [].push.apply(results, transedThenBlock);
        results.push(new Command(l3, [END, '', '']));

        return results;
    }


    var actionCompiler = {};
    actionCompiler.parser = parser;
    actionCompiler.transformer = transformer;
    if (typeof module !== 'undefined' && typeof exports === 'object'){
        module.exports = actionCompiler;
    }else{
        window.actionCompiler = actionCompiler;
    }
})();
