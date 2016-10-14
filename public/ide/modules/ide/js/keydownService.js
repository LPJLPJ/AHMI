/**
 * Created by ChangeCheng on 16/4/5.
 */
ideServices.service('KeydownService',[function () {
    var actionKeys = ['Ctrl-C','Cmd-C','Ctrl-V','Cmd-V',
        'Ctrl-Delete','Cmd-Delete','Ctrl-BackSpace','Cmd-BackSpace','Ctrl-Z','Ctrl-Up','Ctrl-Down','Ctrl-Left','Ctrl-Right','Shift-Up','Shift-Down','Shift-Left','Shift-Right'];
    var keyAttrs = ['shiftKey','ctrlKey','altKey','metaKey','keyCode'];
    var currentPressingKey = '';
    var keyAbbrs = {
      'shiftKey':'Shift',
        'ctrlKey':'Ctrl',
        'altKey':'Alt',
        'metaKey':'Cmd',
        '8':'BackSpace',
        '9':'Tab',
        '12':'Clear',
        '13':'Enter',
        '20':'Caps Lock',
        '27':'Esc',
        '37':'Left',
        '38':'Up',
        '39':'Right',
        '40':'Down',
        '46':'Delete',
        '187':'+', //+=
        '189':'-' //-_
    };
    //A-Z
    for (var i=65;i<91;i++){
        keyAbbrs[i] = String.fromCharCode(i);
    }

    this.currentKeydown = function(e){
        // console.log(e)
        var keyStr = '';
        //handle key prefix
        for (var i=0;i<keyAttrs.length-1;i++){
            if (e[keyAttrs[i]]){
                //key exists
                keyStr+=keyAbbrs[keyAttrs[i]] +'-';
            }
        }
        //handle keycode
        if (e.keyCode in keyAbbrs){
            //hit
            keyStr += keyAbbrs[e.keyCode];
        }

        currentPressingKey = keyStr;
        return keyStr;

    }

    this.isValidKeyPair = function(keypair){
        for (var i=0;i<actionKeys.length;i++){
            if (keypair == actionKeys[i]){
                return true;
            }
        }
        return false;
    }

    this.isCtrlPressed = function () {
        var OSName = getPlatform();
        if (OSName == 'Windows' ){
            return currentPressingKey == 'Ctrl-';
        }else if (OSName == 'MacOS'){
            return currentPressingKey == 'Cmd-';
        }else{
            return currentPressingKey == 'Ctrl-';
        }

    };

    this.getActionKeys= function () {
        return actionKeys;
    }

    function getPlatform(){
        var OSName="Unknown OS";
        if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
        if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
        return OSName;
    }

    this.keyUp = function () {
        currentPressingKey = '';
    }
}]);