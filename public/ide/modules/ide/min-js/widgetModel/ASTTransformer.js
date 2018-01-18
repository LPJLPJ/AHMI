!function(e){"function"==typeof define&&define.amd?define("ASTTransformer",[],e):"object"==typeof module&&module.exports?module.exports=e():window.ASTTransformer=e()}(function(){function e(e,a){return{type:e,value:a}}function a(e){return e.sType&&"word"==e.sType}function r(e){return e.sType&&"compare"==e.sType}function t(e){switch(e.sType){case"number":return"Int";case"string":return-1!=e.value.indexOf("this")?"EXP":"String";case"word":return"ID"}}function u(e){switch(e){case"==":return"eq";case">":return"gt";case"<":return"lt";case">=":return"gte";case"<=":return"lte"}}function s(n){for(var i=[],o=0;o<n.length;o++){var l=n[o];if("function"==l.type){var p=l.args,h=p[1];switch(p[0]){case"var":if(!a(h[0]))throw new Error(c.paramNotMatch);i.push(["temp",h[0].value,e(t(h[1]),h[1].value)]);break;case"set":i.push(["set",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"setTag":i.push(["setTag",e(t(h[0]),h[0].value)]);break;case"getTag":i.push(["getTag",e(t(h[0]),h[0].value)]);break;case"print":i.push(["print",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"add":i.push(["add",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"minus":i.push(["minus",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"multiply":i.push(["multiply",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"divide":i.push(["divide",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"checkalarm":i.push(["checkalarm"]);break;case"setglobalvar":i.push(["setglobalvar",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"executeaction":i.push(["executeaction",e(t(h[0]),h[0].value)]);break;case"startanimation":i.push(["startanimation"]);break;case"starthlanimation":i.push(["starthlanimation"]);break;case"mod":i.push(["mod",e(t(h[0]),h[0].value),e(t(h[1]),h[1].value)]);break;case"not":i.push(["not",e(t(h[0]),h[0].value)]);break;default:throw new Error("undefined op "+p[0])}}else if("if"==l.type){var p=l.args;if(!r(p[0]))throw new Error(c.paramNotMatch);i.push(["if"]);var v=p[0].args;i.push([u(v[1]),e(t(v[0]),v[0].value),e(t(v[2]),v[2].value)]),i=i.concat(s(p[1])),p[2]&&(i.push(["else"]),i=i.concat(s(p[2]))),i.push(["end"])}else if("while"==l.type){var p=l.args;if(!r(p[0]))throw new Error(c.paramNotMatch,JSON.stringify(p[0]));i.push(["while"]);var v=p[0].args;i.push([u(v[1]),e(t(v[0]),v[0].value),e(t(v[2]),v[2].value)]),i=i.concat(s(p[1])),i.push(["end"])}}return i}var n={},c={paramNotMatch:"param not match"};return n.transAST=s,n});