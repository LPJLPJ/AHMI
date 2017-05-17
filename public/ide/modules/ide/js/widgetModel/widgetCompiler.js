/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var widgetCompiler = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,6],$V2=[1,7],$V3=[1,8],$V4=[5,19],$V5=[1,21],$V6=[1,19],$V7=[1,18],$V8=[1,20],$V9=[1,22],$Va=[1,23],$Vb=[1,24],$Vc=[1,28],$Vd=[1,29],$Ve=[1,30],$Vf=[5,10,11,15,19,21],$Vg=[1,42],$Vh=[1,43],$Vi=[1,40],$Vj=[1,41],$Vk=[1,39],$Vl=[1,34],$Vm=[1,35],$Vn=[1,36],$Vo=[1,37],$Vp=[1,38],$Vq=[1,44],$Vr=[1,45],$Vs=[5,10,11,15,17,19,21,23,25,26,27,28,29,33,34,35,36,37,42,43],$Vt=[14,17,23],$Vu=[5,10,11,15,17,19,21,23,25,26,27,28,29,33,34,42,43],$Vv=[5,10,11,15,17,19,21,23,25,26,27,28,29,33,34,35,36,42,43],$Vw=[5,10,11,15,17,19,21,23,42,43];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"prog":3,"stmts":4,"EOF":5,"stmt":6,"expressions":7,"e":8,"stateblock":9,"TEMP":10,"WORD":11,":":12,"type":13,"=":14,"IF":15,"(":16,")":17,"{":18,"}":19,"ELSE":20,"WHILE":21,"parameters":22,",":23,"compare":24,">":25,"<":26,">=":27,"<=":28,"==":29,"INT":30,"STR":31,"EXP":32,"+":33,"-":34,"*":35,"/":36,"^":37,"NUMBER":38,"STRING":39,"E":40,"PI":41,"&&":42,"||":43,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",10:"TEMP",11:"WORD",12:":",14:"=",15:"IF",16:"(",17:")",18:"{",19:"}",20:"ELSE",21:"WHILE",23:",",25:">",26:"<",27:">=",28:"<=",29:"==",30:"INT",31:"STR",32:"EXP",33:"+",34:"-",35:"*",36:"/",37:"^",38:"NUMBER",39:"STRING",40:"E",41:"PI",42:"&&",43:"||"},
productions_: [0,[3,2],[3,1],[4,1],[4,2],[7,2],[9,1],[9,2],[6,6],[6,3],[6,7],[6,11],[6,10],[6,7],[6,4],[22,3],[22,3],[22,1],[22,1],[24,1],[24,1],[24,1],[24,1],[24,1],[13,1],[13,1],[13,1],[8,3],[8,3],[8,3],[8,3],[8,3],[8,2],[8,3],[8,1],[8,1],[8,1],[8,1],[8,1],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1: case 5:
return $$[$0-1];
break;
case 2:
return [];
break;
case 3: case 17: case 18:
this.$=addStmt($$[$0]);
break;
case 4:
this.$=addStmt($$[$0-1],$$[$0]);
break;
case 8:
this.$ = {type:'initialStmt',args:[$$[$0-4],$$[$0-2],$$[$0]]};
break;
case 9:
this.$ = {type:'assignStmt',args:[$$[$0-2],$$[$0]]};
break;
case 10:
this.$={type:'if',args:[$$[$0-4],$$[$0-1]]};
break;
case 11:
this.$={type:'if',args:[$$[$0-8],$$[$0-5],$$[$0-1]]};
break;
case 12:
this.$={type:'if',args:[$$[$0-7],[],$$[$0-1]]};
break;
case 13:
this.$={type:'while',args:[$$[$0-4],$$[$0-1]]};
break;
case 14:
this.$={type:'function',args:[$$[$0-3],$$[$0-1]]};
break;
case 15: case 16:
this.$=addStmt($$[$0-2],$$[$0]);
break;
case 24:
this.$ = {type:'type',value:'INT'}
break;
case 25:
this.$ = {type:'type',value:'STR'}
break;
case 26:
this.$ = {type:'type',value:'EXP'}
break;
case 27:
this.$ = {type:'exp',sType:'operate',op:'+',args:[$$[$0-2],$$[$0]]};
break;
case 28:
this.$ = {type:'exp',sType:'operate',op:'-',args:[$$[$0-2],$$[$0]]};
break;
case 29:
this.$ = {type:'exp',sType:'operate',op:'*',args:[$$[$0-2],$$[$0]]};
break;
case 30:
this.$ = {type:'exp',sType:'operate',op:'/',args:[$$[$0-2],$$[$0]]};
break;
case 31:
this.$ = {type:'exp',sType:'operate',op:'^',args:[$$[$0-2],$$[$0]]};
break;
case 32:
this.$ = {type:'exp',sType:'operate',op:'uminus',args:[$$[$0]]};
break;
case 33:
this.$ = $$[$0-1];
break;
case 34:
this.$ = {type:'exp',sType:'number',value:Number(yytext)};
break;
case 35:
this.$ = {type:'exp',sType:'word',value:$$[$0]};
break;
case 36:
this.$ = {type:'exp',sType:'string',value:getRawStr($$[$0])};
break;
case 37:
this.$ = {type:'exp',sType:'preserve',value:Math.E};
break;
case 38:
this.$ = {type:'exp',sType:'preserve',value:Math.PI};
break;
case 39: case 40: case 41: case 42: case 43:
this.$ = {type:'exp',sType:'compare',args:[$$[$0-2],$$[$0-1],$$[$0]]};
break;
case 44: case 45:
this.$ = {type:'exp',sType:'logic',args:[$$[$0-2],$$[$0-1],$$[$0]]};
break;
case 46:
this.$ = {type:'exp',sType:'assign',args:[$$[$0-2],$$[$0]]};
break;
}
},
table: [{3:1,4:2,5:[1,3],6:4,10:$V0,11:$V1,15:$V2,21:$V3},{1:[3]},{5:[1,9]},{1:[2,2]},o($V4,[2,3],{6:4,4:10,10:$V0,11:$V1,15:$V2,21:$V3}),{11:[1,11]},{14:[1,12],16:[1,13]},{16:[1,14]},{16:[1,15]},{1:[2,1]},o($V4,[2,4]),{12:[1,16]},{8:17,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:26,11:$V5,13:27,16:$V6,22:25,30:$Vc,31:$Vd,32:$Ve,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:31,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:32,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{13:33,30:$Vc,31:$Vd,32:$Ve},o($Vf,[2,9],{25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr}),{8:46,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:47,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},o($Vs,[2,34]),o($Vs,[2,35],{14:[1,48]}),o($Vs,[2,36]),o($Vs,[2,37]),o($Vs,[2,38]),{17:[1,49]},{17:[2,17],23:[1,50],25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr},{17:[2,18],23:[1,51]},o($Vt,[2,24]),o($Vt,[2,25]),o($Vt,[2,26]),{17:[1,52],25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr},{17:[1,53],25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr},{14:[1,54]},{8:55,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:56,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:57,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:58,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:59,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:60,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:61,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:62,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:63,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:64,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:65,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:66,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},o($Vs,[2,32]),{17:[1,67],25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr},{8:68,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},o($Vf,[2,14]),{8:26,11:$V5,13:27,16:$V6,22:69,30:$Vc,31:$Vd,32:$Ve,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{8:26,11:$V5,13:27,16:$V6,22:70,30:$Vc,31:$Vd,32:$Ve,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},{18:[1,71]},{18:[1,72]},{8:73,11:$V5,16:$V6,34:$V7,38:$V8,39:$V9,40:$Va,41:$Vb},o($Vu,[2,27],{35:$Vn,36:$Vo,37:$Vp}),o($Vu,[2,28],{35:$Vn,36:$Vo,37:$Vp}),o($Vv,[2,29],{37:$Vp}),o($Vv,[2,30],{37:$Vp}),o($Vs,[2,31]),o($Vw,[2,39],{33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vw,[2,40],{33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vw,[2,41],{33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vw,[2,42],{33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vw,[2,43],{33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vw,[2,44],{25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vw,[2,45],{25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp}),o($Vs,[2,33]),o([5,10,11,15,17,19,21,23],[2,46],{25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr}),{17:[2,15]},{17:[2,16]},{4:74,6:4,10:$V0,11:$V1,15:$V2,19:[1,75],21:$V3},{4:76,6:4,10:$V0,11:$V1,15:$V2,21:$V3},o($Vf,[2,8],{25:$Vg,26:$Vh,27:$Vi,28:$Vj,29:$Vk,33:$Vl,34:$Vm,35:$Vn,36:$Vo,37:$Vp,42:$Vq,43:$Vr}),{19:[1,77]},{20:[1,78]},{19:[1,79]},o($Vf,[2,10],{20:[1,80]}),{18:[1,81]},o($Vf,[2,13]),{18:[1,82]},{4:83,6:4,10:$V0,11:$V1,15:$V2,21:$V3},{4:84,6:4,10:$V0,11:$V1,15:$V2,21:$V3},{19:[1,85]},{19:[1,86]},o($Vf,[2,12]),o($Vf,[2,11])],
defaultActions: {3:[2,2],9:[2,1],69:[2,15],70:[2,16]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    function addStmt(stmt,array){
        array = array||[]
        array.unshift(stmt)
        return array;
    }

    function getRawStr(str){
        var length = str.length
        return str.slice(1,length-1)
    }

    function appendInst(inst,array){
        array = array||[]
        array.push(inst)
        return array;
    }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* comment */
break;
case 2:return 39
break;
case 3:return 39
break;
case 4:return 41
break;
case 5:return 40
break;
case 6:return 10
break;
case 7:return 15
break;
case 8:return 21
break;
case 9:return 20
break;
case 10:return 30
break;
case 11:return 31
break;
case 12:return 32
break;
case 13:return 12
break;
case 14:return 23
break;
case 15:return 35
break;
case 16:return 36
break;
case 17:return 34
break;
case 18:return 33
break;
case 19:return 37
break;
case 20:return 16
break;
case 21:return 17
break;
case 22:return "{"
break;
case 23:return "}"
break;
case 24:return 43
break;
case 25:return 42
break;
case 26:return 27
break;
case 27:return 28
break;
case 28:return 25
break;
case 29:return 26
break;
case 30:return 29
break;
case 31:return 14
break;
case 32:return 38
break;
case 33:return 11
break;
case 34:return 5
break;
case 35:return 'INVALID'
break;
}
},
rules: [/^(?:\s+)/,/^(?:\/\/.*)/,/^(?:"[^"]*")/,/^(?:'[^']*')/,/^(?:PI\b)/,/^(?:E\b)/,/^(?:temp\b)/,/^(?:if\b)/,/^(?:while\b)/,/^(?:else\b)/,/^(?:Int\b)/,/^(?:String\b)/,/^(?:EXP\b)/,/^(?::)/,/^(?:,)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:\|\|)/,/^(?:&&)/,/^(?:>=)/,/^(?:<=)/,/^(?:>)/,/^(?:<)/,/^(?:==)/,/^(?:=)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:[a-zA-Z]+([a-zA-Z0-9_]+)?\b)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = widgetCompiler;
exports.Parser = widgetCompiler.Parser;
exports.parse = function () { return widgetCompiler.parse.apply(widgetCompiler, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}