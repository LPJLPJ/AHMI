ideServices
    .service('characterSetService',['ResourceService', function (ResourceService) {
        var characterSet = [
            {
                text:'标题',
                fontName: '标题',
                fontFamily:'宋体',
                fontSize:25,
                fontColor:"#000000",
                fontBold:"bold",
                fontItalic:"",
                fontAlignment:null,
                boldBtnToggle:true,
                italicBtnToggle:false,
                underlineBtnToggle:false
            },
            {
                text:'正文',
                fontName: '正文',
                fontFamily:'宋体',
                fontSize:15,
                fontColor:'#000000',
                fontBold:'100',
                fontItalic:'',
                fontAlignment:null,
                boldBtnToggle:false,
                italicBtnToggle:false,
                underlineBtnToggle:false
            },
            {
                text:'说明',
                fontName: '说明',
                fontFamily:'times',
                fontSize:10,
                fontColor:'#000000',
                fontBold:'100',
                fontItalic:'',
                fontAlignment:null,
                boldBtnToggle:false,
                italicBtnToggle:false,
                underlineBtnToggle:false
            }
        ];




        this.getCharacterSet = function () {
            return characterSet;
        };

        this.selectCharacterByIndex=function(index){
            return _.cloneDeep(characterSet[index]);
        };

        this.selectCharacterByName=function(name){
            var character=null;
            for(var i=0;i<characterSet.length;i++){
                if(characterSet[i].fontName==name){
                    character= _.cloneDeep(characterSet[i]);
                }
            }
            return character;
        };

        this.addCharacterSet=function(customCharacterSet){
            var temp=customCharacterSet;
            characterSet.push(temp);
        };

        this.deleteCharacterSetByIndex=function(index,cb){
            if((index>=0)&&(index<=characterSet.length-1)){
                characterSet.splice(index,1);
                cb && cb();
            }
        }


    }]);