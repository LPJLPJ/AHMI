var widgetCompiler=function(){function t(t,e){return e=e||[],e.unshift(t),e}function e(t){var e=t.length;return t.slice(1,e-1)}function s(){this.yy={}}var i=function(t,e,s,i){for(s=s||{},i=t.length;i--;s[t[i]]=e);return s},n=[1,5],r=[1,6],a=[1,7],h=[1,8],o=[5,19],c=[1,21],l=[1,19],y=[1,18],u=[1,20],p=[1,22],g=[1,23],f=[1,24],m=[1,28],_=[1,29],b=[1,30],k=[5,10,11,15,19,21],d=[1,42],x=[1,43],v=[1,40],E=[1,41],$=[1,39],I=[1,34],S=[1,35],T=[1,36],w=[1,37],P=[1,38],A=[1,44],N=[1,45],L=[5,10,11,15,17,19,21,23,25,26,27,28,29,33,34,35,36,37,42,43],O=[14,17,23],R=[5,10,11,15,17,19,21,23,25,26,27,28,29,33,34,42,43],F=[5,10,11,15,17,19,21,23,25,26,27,28,29,33,34,35,36,42,43],j=[5,10,11,15,17,19,21,23,42,43],M={trace:function(){},yy:{},symbols_:{error:2,prog:3,stmts:4,EOF:5,stmt:6,expressions:7,e:8,stateblock:9,TEMP:10,WORD:11,":":12,type:13,"=":14,IF:15,"(":16,")":17,"{":18,"}":19,ELSE:20,WHILE:21,parameters:22,",":23,compare:24,">":25,"<":26,">=":27,"<=":28,"==":29,INT:30,STR:31,EXP:32,"+":33,"-":34,"*":35,"/":36,"^":37,NUMBER:38,STRING:39,E:40,PI:41,"&&":42,"||":43,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",10:"TEMP",11:"WORD",12:":",14:"=",15:"IF",16:"(",17:")",18:"{",19:"}",20:"ELSE",21:"WHILE",23:",",25:">",26:"<",27:">=",28:"<=",29:"==",30:"INT",31:"STR",32:"EXP",33:"+",34:"-",35:"*",36:"/",37:"^",38:"NUMBER",39:"STRING",40:"E",41:"PI",42:"&&",43:"||"},productions_:[0,[3,2],[3,1],[4,1],[4,2],[7,2],[9,1],[9,2],[6,6],[6,3],[6,7],[6,11],[6,10],[6,7],[6,4],[22,3],[22,3],[22,1],[22,1],[24,1],[24,1],[24,1],[24,1],[24,1],[13,1],[13,1],[13,1],[8,3],[8,3],[8,3],[8,3],[8,3],[8,2],[8,3],[8,1],[8,1],[8,1],[8,1],[8,1],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3],[8,3]],performAction:function(s,i,n,r,a,h,o){var c=h.length-1;switch(a){case 1:case 5:return h[c-1];case 2:return[];case 3:case 17:case 18:this.$=t(h[c]);break;case 4:this.$=t(h[c-1],h[c]);break;case 8:this.$={type:"initialStmt",args:[h[c-4],h[c-2],h[c]]};break;case 9:this.$={type:"assignStmt",args:[h[c-2],h[c]]};break;case 10:this.$={type:"if",args:[h[c-4],h[c-1]]};break;case 11:this.$={type:"if",args:[h[c-8],h[c-5],h[c-1]]};break;case 12:this.$={type:"if",args:[h[c-7],[],h[c-1]]};break;case 13:this.$={type:"while",args:[h[c-4],h[c-1]]};break;case 14:this.$={type:"function",args:[h[c-3],h[c-1]]};break;case 15:case 16:this.$=t(h[c-2],h[c]);break;case 24:this.$={type:"type",value:"INT"};break;case 25:this.$={type:"type",value:"STR"};break;case 26:this.$={type:"type",value:"EXP"};break;case 27:this.$={type:"exp",sType:"operate",op:"+",args:[h[c-2],h[c]]};break;case 28:this.$={type:"exp",sType:"operate",op:"-",args:[h[c-2],h[c]]};break;case 29:this.$={type:"exp",sType:"operate",op:"*",args:[h[c-2],h[c]]};break;case 30:this.$={type:"exp",sType:"operate",op:"/",args:[h[c-2],h[c]]};break;case 31:this.$={type:"exp",sType:"operate",op:"^",args:[h[c-2],h[c]]};break;case 32:this.$={type:"exp",sType:"operate",op:"uminus",args:[h[c]]};break;case 33:this.$=h[c-1];break;case 34:this.$={type:"exp",sType:"number",value:Number(s)};break;case 35:this.$={type:"exp",sType:"word",value:h[c]};break;case 36:this.$={type:"exp",sType:"string",value:e(h[c])};break;case 37:this.$={type:"exp",sType:"preserve",value:Math.E};break;case 38:this.$={type:"exp",sType:"preserve",value:Math.PI};break;case 39:case 40:case 41:case 42:case 43:this.$={type:"exp",sType:"compare",args:[h[c-2],h[c-1],h[c]]};break;case 44:case 45:this.$={type:"exp",sType:"logic",args:[h[c-2],h[c-1],h[c]]};break;case 46:this.$={type:"exp",sType:"assign",args:[h[c-2],h[c]]}}},table:[{3:1,4:2,5:[1,3],6:4,10:n,11:r,15:a,21:h},{1:[3]},{5:[1,9]},{1:[2,2]},i(o,[2,3],{6:4,4:10,10:n,11:r,15:a,21:h}),{11:[1,11]},{14:[1,12],16:[1,13]},{16:[1,14]},{16:[1,15]},{1:[2,1]},i(o,[2,4]),{12:[1,16]},{8:17,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:26,11:c,13:27,16:l,22:25,30:m,31:_,32:b,34:y,38:u,39:p,40:g,41:f},{8:31,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:32,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{13:33,30:m,31:_,32:b},i(k,[2,9],{25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N}),{8:46,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:47,11:c,16:l,34:y,38:u,39:p,40:g,41:f},i(L,[2,34]),i(L,[2,35],{14:[1,48]}),i(L,[2,36]),i(L,[2,37]),i(L,[2,38]),{17:[1,49]},{17:[2,17],23:[1,50],25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N},{17:[2,18],23:[1,51]},i(O,[2,24]),i(O,[2,25]),i(O,[2,26]),{17:[1,52],25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N},{17:[1,53],25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N},{14:[1,54]},{8:55,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:56,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:57,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:58,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:59,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:60,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:61,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:62,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:63,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:64,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:65,11:c,16:l,34:y,38:u,39:p,40:g,41:f},{8:66,11:c,16:l,34:y,38:u,39:p,40:g,41:f},i(L,[2,32]),{17:[1,67],25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N},{8:68,11:c,16:l,34:y,38:u,39:p,40:g,41:f},i(k,[2,14]),{8:26,11:c,13:27,16:l,22:69,30:m,31:_,32:b,34:y,38:u,39:p,40:g,41:f},{8:26,11:c,13:27,16:l,22:70,30:m,31:_,32:b,34:y,38:u,39:p,40:g,41:f},{18:[1,71]},{18:[1,72]},{8:73,11:c,16:l,34:y,38:u,39:p,40:g,41:f},i(R,[2,27],{35:T,36:w,37:P}),i(R,[2,28],{35:T,36:w,37:P}),i(F,[2,29],{37:P}),i(F,[2,30],{37:P}),i(L,[2,31]),i(j,[2,39],{33:I,34:S,35:T,36:w,37:P}),i(j,[2,40],{33:I,34:S,35:T,36:w,37:P}),i(j,[2,41],{33:I,34:S,35:T,36:w,37:P}),i(j,[2,42],{33:I,34:S,35:T,36:w,37:P}),i(j,[2,43],{33:I,34:S,35:T,36:w,37:P}),i(j,[2,44],{25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P}),i(j,[2,45],{25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P}),i(L,[2,33]),i([5,10,11,15,17,19,21,23],[2,46],{25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N}),{17:[2,15]},{17:[2,16]},{4:74,6:4,10:n,11:r,15:a,19:[1,75],21:h},{4:76,6:4,10:n,11:r,15:a,21:h},i(k,[2,8],{25:d,26:x,27:v,28:E,29:$,33:I,34:S,35:T,36:w,37:P,42:A,43:N}),{19:[1,77]},{20:[1,78]},{19:[1,79]},i(k,[2,10],{20:[1,80]}),{18:[1,81]},i(k,[2,13]),{18:[1,82]},{4:83,6:4,10:n,11:r,15:a,21:h},{4:84,6:4,10:n,11:r,15:a,21:h},{19:[1,85]},{19:[1,86]},i(k,[2,12]),i(k,[2,11])],defaultActions:{3:[2,2],9:[2,1],69:[2,15],70:[2,16]},parseError:function(t,e){function s(t,e){this.message=t,this.hash=e}if(!e.recoverable)throw s.prototype=Error,new s(t,e);this.trace(t)},parse:function(t){var e=this,s=[0],i=[null],n=[],r=this.table,a="",h=0,o=0,c=0,l=n.slice.call(arguments,1),y=Object.create(this.lexer),u={yy:{}};for(var p in this.yy)Object.prototype.hasOwnProperty.call(this.yy,p)&&(u.yy[p]=this.yy[p]);y.setInput(t,u.yy),u.yy.lexer=y,u.yy.parser=this,void 0===y.yylloc&&(y.yylloc={});var g=y.yylloc;n.push(g);var f=y.options&&y.options.ranges;"function"==typeof u.yy.parseError?this.parseError=u.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var m,_,b,k,d,x,v,E,$,I=function(){var t;return t=y.lex()||1,"number"!=typeof t&&(t=e.symbols_[t]||t),t},S={};;){if(b=s[s.length-1],this.defaultActions[b]?k=this.defaultActions[b]:(null!==m&&void 0!==m||(m=I()),k=r[b]&&r[b][m]),void 0===k||!k.length||!k[0]){var T="";$=[];for(x in r[b])this.terminals_[x]&&x>2&&$.push("'"+this.terminals_[x]+"'");T=y.showPosition?"Parse error on line "+(h+1)+":\n"+y.showPosition()+"\nExpecting "+$.join(", ")+", got '"+(this.terminals_[m]||m)+"'":"Parse error on line "+(h+1)+": Unexpected "+(1==m?"end of input":"'"+(this.terminals_[m]||m)+"'"),this.parseError(T,{text:y.match,token:this.terminals_[m]||m,line:y.yylineno,loc:g,expected:$})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+b+", token: "+m);switch(k[0]){case 1:s.push(m),i.push(y.yytext),n.push(y.yylloc),s.push(k[1]),m=null,_?(m=_,_=null):(o=y.yyleng,a=y.yytext,h=y.yylineno,g=y.yylloc,c>0&&c--);break;case 2:if(v=this.productions_[k[1]][1],S.$=i[i.length-v],S._$={first_line:n[n.length-(v||1)].first_line,last_line:n[n.length-1].last_line,first_column:n[n.length-(v||1)].first_column,last_column:n[n.length-1].last_column},f&&(S._$.range=[n[n.length-(v||1)].range[0],n[n.length-1].range[1]]),void 0!==(d=this.performAction.apply(S,[a,o,h,u.yy,k[1],i,n].concat(l))))return d;v&&(s=s.slice(0,-1*v*2),i=i.slice(0,-1*v),n=n.slice(0,-1*v)),s.push(this.productions_[k[1]][0]),i.push(S.$),n.push(S._$),E=r[s[s.length-2]][s[s.length-1]],s.push(E);break;case 3:return!0}}return!0}},z=function(){return{EOF:1,parseError:function(t,e){if(!this.yy.parser)throw new Error(t);this.yy.parser.parseError(t,e)},setInput:function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},unput:function(t){var e=t.length,s=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var i=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),s.length-1&&(this.yylineno-=s.length-1);var n=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:s?(s.length===i.length?this.yylloc.first_column:0)+i[i.length-s.length].length-s[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[n[0],n[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(t){this.unput(this.match.slice(t))},pastInput:function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var t=this.pastInput(),e=new Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},test_match:function(t,e){var s,i,n;if(this.options.backtrack_lexer&&(n={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(n.yylloc.range=this.yylloc.range.slice(0))),i=t[0].match(/(?:\r\n?|\n).*/g),i&&(this.yylineno+=i.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:i?i[i.length-1].length-i[i.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],s=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),s)return s;if(this._backtrack){for(var r in n)this[r]=n[r];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var t,e,s,i;this._more||(this.yytext="",this.match="");for(var n=this._currentRules(),r=0;r<n.length;r++)if((s=this._input.match(this.rules[n[r]]))&&(!e||s[0].length>e[0].length)){if(e=s,i=r,this.options.backtrack_lexer){if(!1!==(t=this.test_match(s,n[r])))return t;if(this._backtrack){e=!1;continue}return!1}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,n[i]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var t=this.next();return t||this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(t){return t=this.conditionStack.length-1-Math.abs(t||0),t>=0?this.conditionStack[t]:"INITIAL"},pushState:function(t){this.begin(t)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(t,e,s,i){switch(s){case 0:break;case 1:case 2:return 39;case 3:return 41;case 4:return 40;case 5:return 10;case 6:return 15;case 7:return 21;case 8:return 20;case 9:return 30;case 10:return 31;case 11:return 32;case 12:return 12;case 13:return 23;case 14:return 35;case 15:return 36;case 16:return 34;case 17:return 33;case 18:return 37;case 19:return 16;case 20:return 17;case 21:return"{";case 22:return"}";case 23:return 43;case 24:return 42;case 25:return 27;case 26:return 28;case 27:return 25;case 28:return 26;case 29:return 29;case 30:return 14;case 31:return 38;case 32:return 11;case 33:return 5;case 34:return"INVALID"}},rules:[/^(?:\s+)/,/^(?:"[^"]*")/,/^(?:'[^']*')/,/^(?:PI\b)/,/^(?:E\b)/,/^(?:temp\b)/,/^(?:if\b)/,/^(?:while\b)/,/^(?:else\b)/,/^(?:Int\b)/,/^(?:String\b)/,/^(?:EXP\b)/,/^(?::)/,/^(?:,)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:\|\|)/,/^(?:&&)/,/^(?:>=)/,/^(?:<=)/,/^(?:>)/,/^(?:<)/,/^(?:==)/,/^(?:=)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:[a-zA-Z]+([a-zA-Z0-9_]+)?\b)/,/^(?:$)/,/^(?:.)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],inclusive:!0}}}}();return M.lexer=z,s.prototype=M,M.Parser=s,new s}();"undefined"!=typeof require&&"undefined"!=typeof exports&&(exports.parser=widgetCompiler,exports.Parser=widgetCompiler.Parser,exports.parse=function(){return widgetCompiler.parse.apply(widgetCompiler,arguments)},exports.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var e=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return exports.parser.parse(e)},"undefined"!=typeof module&&require.main===module&&exports.main(process.argv.slice(1)));