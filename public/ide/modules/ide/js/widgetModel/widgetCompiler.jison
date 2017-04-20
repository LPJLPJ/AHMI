/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
\"[^"]*\"             return 'STRING'
\'[^']*\'             return 'STRING'
"PI"                  return 'PI'
"E"                   return 'E'
"temp"                return 'TEMP'
"if"                  return 'IF'
"while"               return 'WHILE'
"else"                return 'ELSE'
"Int"                 return 'INT'
"String"              return 'STR'
"EXP"                 return 'EXP'
":"                   return ':'
","                   return ','
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"("                   return '('
")"                   return ')'

"{"                   return "{"
"}"                   return "}"
"||"                  return '||'
"&&"                  return '&&'
">="                  return '>='
"<="                  return '<='
">"                   return '>'
"<"                   return '<'
"=="                  return '=='
"="                   return '='
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[a-zA-Z]+([a-zA-Z0-9_]+)?\b return 'WORD'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%right '='
%left '||' '&&'
%nonassoc '==' '>' '<' '>=' '<='
%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%{
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
%}

%start prog

%% /* language grammar */

prog
    :stmts EOF
        {return $1;}
    |EOF
        {return [];}
        ;
        

stmts
    : stmt
        {$$=addStmt($1);}
    | stmt stmts
        {$$=addStmt($1,$2);}
    ;

expressions
    :e EOF
        {return $1;}
        ;

stateblock
    :stmt
    | stateblock stmt
    ;

stmt
    :'TEMP' 'WORD' ':' type '=' e
        {$$ = {type:'initialStmt',args:[$2,$4,$6]};}
    | 'WORD' '=' e
        {$$ = {type:'assignStmt',args:[$1,$3]};}
    | 'IF' '(' e ')' '{' stmts '}'
        {$$={type:'if',args:[$3,$6]};}
    | 'IF' '(' e ')' '{' stmts '}' 'ELSE' '{' stmts '}'
    {$$={type:'if',args:[$3,$6,$10]};}
    | 'WHILE' '(' e ')' '{' stmts '}'
        {$$={type:'while',args:[$3,$6]};}
    | 'WORD' '(' parameters ')'
        {$$={type:'function',args:[$1,$3]};}
    ;

parameters
    : e ',' parameters
     {$$=addStmt($1,$3);}
    | type ',' parameters
     {$$=addStmt($1,$3);}
    | e
    {$$=addStmt($1);}
    |type
    {$$=addStmt($1);}
    ;


compare
    :'>'
    |'<'
    |'>='
    |'<='
    |'=='
    ;

type
    :'INT'
    {$$ = {type:'type',value:'INT'}}
    |'STR'
    {$$ = {type:'type',value:'STR'}}
    |'EXP'
    {$$ = {type:'type',value:'EXP'}}
    ;

e
    : e '+' e
        {$$ = {type:'exp',sType:'operate',op:'+',args:[$1,$3]};}
    | e '-' e
        {$$ = {type:'exp',sType:'operate',op:'-',args:[$1,$3]};}
    | e '*' e
        {$$ = {type:'exp',sType:'operate',op:'*',args:[$1,$3]};}
    | e '/' e
        {$$ = {type:'exp',sType:'operate',op:'/',args:[$1,$3]};}
    | e '^' e
        {$$ = {type:'exp',sType:'operate',op:'^',args:[$1,$3]};}
    | '-' e %prec UMINUS
        {$$ = {type:'exp',sType:'operate',op:'uminus',args:[$2]};}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = {type:'exp',sType:'number',value:Number(yytext)};}
    | WORD
        {$$ = {type:'exp',sType:'word',value:$1};}
    | STRING
        {$$ = {type:'exp',sType:'string',value:getRawStr($1)};}
    | E
        {$$ = {type:'exp',sType:'preserve',value:Math.E};}
    | PI
        {$$ = {type:'exp',sType:'preserve',value:Math.PI};}
    | e '==' e
        {$$ = {type:'exp',sType:'compare',args:[$1,$2,$3]};}
    | e '>=' e
        {$$ = {type:'exp',sType:'compare',args:[$1,$2,$3]};}
    | e '<=' e
        {$$ = {type:'exp',sType:'compare',args:[$1,$2,$3]};}
    | e '>' e
        {$$ = {type:'exp',sType:'compare',args:[$1,$2,$3]};}
    | e '<' e
        {$$ = {type:'exp',sType:'compare',args:[$1,$2,$3]};}
    | e '&&' e
        {$$ = {type:'exp',sType:'logic',args:[$1,$2,$3]};}
    | e '||' e
        {$$ = {type:'exp',sType:'logic',args:[$1,$2,$3]};}
    | 'WORD' '=' e
        {$$ = {type:'exp',sType:'assign',args:[$1,$3]};}
    ;




