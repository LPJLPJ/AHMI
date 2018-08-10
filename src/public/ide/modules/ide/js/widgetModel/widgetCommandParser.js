/**
 * Created by changecheng on 2017/3/14.
 */
;(function () {
   var WidgetCommandParser = {};
   var Widget  = WidgetModel.Widget;
   var scope = {}
   WidgetCommandParser.transCommand = function (command) {
       var op = command[0];
       var result;
       var variable;
       var value;
       switch (op){
           case 'temp':
               variable = command[1];
               value = Widget.execute(command[2])
               scope[variable] = value;
               result = 'var '+variable+'='+value+';\n';
               break;
           case 'set':
               variable = command[1];
               value = Widget.execute(command[2])
               if (variable in scope){
                   scope[variable] = value;
               }
               result = variable+'='+value+';\n';
               break;
           case 'if':
               result = 'if';
               break;
           case 'pred':
               var pred1 = command[2];
               var pred2 = command[3];
               if (!(pred1 in scope)){
                   pred1 = Widget.execute(pred1)
               }
               if (!(pred2 in scope)){
                   pred2 = Widget.execute(pred2)
               }

               result = "("+pred1+command[1]+pred2+"){\n"
               break;
           case 'else':
               result = '}else{\n'
               break;
           case 'end if':
               result = '}\n';
               break;
       }
       return result;
   }
   WidgetCommandParser.transFunction = function (commands) {
       console.log(JSON.stringify(commands))
       scope = {}
       var result = "";
       for (var i=0;i<commands.length;i++){
           result +=this.transCommand(commands[i])
       }
       return result;
   }

   window.WidgetCommandParser = WidgetCommandParser;
}())