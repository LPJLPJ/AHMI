
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('ASTTransformer',[], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory()
    } else {
        // Browser globals
        window.ASTTransformer = factory();
    }
}(function () {
	var ASTTransformer = {}
	var errors = {
		paramNotMatch:'param not match'
	}
	function Param(type,value) {
		return {
			type:type,
			value:value
		}
	}

	function isWord(a) {
		return a.sType && (a.sType=='word')
	}

	function isNumber(a) {
		return a.sType && (a.sType =='number')
	}

	function isType(a) {
		return a.type && (a.type=='type')
	}

	function isComapare(a) {
		return a.sType && (a.sType=='compare')
	}

	function judgeType(a) {
		switch(a.sType){
			case 'number':
				return 'Int'
			case 'string':
				if (a.value.indexOf('this')!=-1) {
					return 'EXP'
				}else{
					return 'String'
				}
			case 'word':
				return 'ID'
		}
	}

	function transType(type) {
		switch(type){
			case 'INT':
			case 'number':
				return 'Int'
			case 'STR':
			case 'string':
				return 'String'
			case 'EXP':
				return 'EXP'
		}
	}

	function transCompare(c) {
		switch(c){
			case '==':
				return 'eq'
			case '>':
				return 'gt'
			case '<':
				return 'lt'
			case '>=':
				return 'gte'
			case '<=':
				return 'lte'
		}
	}

	function transAST(progAST) {
		var insts = []
		
		for (var i=0;i<progAST.length;i++){
			var curStmt = progAST[i];
			if (curStmt.type == 'function') {
				var args = curStmt.args;
				var parameters = args[1];
				switch(args[0]){
					case 'var':
						if (isWord(parameters[0])) {
							insts.push(['temp',parameters[0].value,Param(judgeType(parameters[1]),parameters[1].value)])
						}else{
							throw new Error(errors.paramNotMatch)
						}
						
					break;
					case 'set':
						insts.push(['set',Param(judgeType(parameters[0]),parameters[0].value),Param(judgeType(parameters[1]),parameters[1].value)])
					break;
					case 'setTag':
						insts.push(['setTag',Param(judgeType(parameters[0]),parameters[0].value)]);
					break;
					case 'getTag':
						insts.push(['getTag',Param(judgeType(parameters[0]),parameters[0].value)]);
					break;
					case 'print':
						insts.push(['print',Param(judgeType(parameters[0]),parameters[0].value)]);
						break;
					case 'add':
						insts.push(['add',Param(judgeType(parameters[0]),parameters[0].value),Param(judgeType(parameters[1]),parameters[1].value)])
					break;
					case 'minus':
						insts.push(['minus',Param(judgeType(parameters[0]),parameters[0].value),Param(judgeType(parameters[1]),parameters[1].value)])
					break;
					case 'multiply':
						insts.push(['multiply',Param(judgeType(parameters[0]),parameters[0].value),Param(judgeType(parameters[1]),parameters[1].value)])
					break;
					case 'divide':
						insts.push(['divide',Param(judgeType(parameters[0]),parameters[0].value),Param(judgeType(parameters[1]),parameters[1].value)])
					break;
					case 'checkalarm':
						insts.push(['checkalarm'])
					break;
					default:
						throw new Error('undefined op '+args[0])

				}
			}else if(curStmt.type == 'if'){
				var args = curStmt.args;
				if (isComapare(args[0])) {
					insts.push(['if'])
					var cArgs = args[0].args;
					insts.push([transCompare(cArgs[1]),Param(judgeType(cArgs[0]),cArgs[0].value),Param(judgeType(cArgs[2]),cArgs[2].value)])

					//then block
					insts = insts.concat(transAST(args[1]))
					if (args[2]) {
						insts.push(['else'])
						insts = insts.concat(transAST(args[2]))
					}
					insts.push(['end'])
				}else{
					throw new Error(errors.paramNotMatch)
				}
			}else if(curStmt.type == 'while'){
				var args = curStmt.args;
				if (isComapare(args[0])) {
					insts.push(['while'])
					var cArgs = args[0].args;
					insts.push([transCompare(cArgs[1]),Param(judgeType(cArgs[0]),cArgs[0].value),Param(judgeType(cArgs[2]),cArgs[2].value)])
					insts = insts.concat(transAST(args[1]))
					insts.push(['end'])

				}else{
					throw new Error(errors.paramNotMatch,JSON.stringify(args[0]))
				}
			}
		}
		return insts;
	}

	ASTTransformer.transAST = transAST;
	return ASTTransformer;
}))






