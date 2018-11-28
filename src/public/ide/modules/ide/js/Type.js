/**
 * Created by shenaolin on 16/3/4.
 */
ideServices.
    service('Type', [function () {
        var MyPage = this.MyPage = 'MyPage';
        var MyLayer = this.MyLayer = 'MyLayer';
        var MyLayerGroup = this.MyLayerGroup = 'group';
        var MySubLayer = this.MySubLayer = 'MySubLayer';
        var MyWidgetGroup = this.MyWidgetGroup = 'group';
        var MySlide = this.MySlide = 'MySlide';
        var MyButton = this.MyButton = 'MyButton';
        var MyButtonGroup = this.MyButtonGroup = "MyButtonGroup";
        var MyNumber = this.MyNumber = 'MyNumber';
        var MyProgress = this.MyProgress = 'MyProgress';
        var MyDashboard = this.MyDashboard = 'MyDashboard';
        var MyGroup = this.MyGroup = 'group';
        var MyLayerArray = this.MyLayerArray = 'MyLayerArray';
        var MyWidgetArray = this.MyWidgetArray = 'MyWidgetArray';

        var MyKnob = this.MyKnob = 'MyKnob';
        var MyTextArea = this.MyTextArea = 'MyTextArea';
        var MyNum = this.MyNum = 'MyNum';
        var MyOscilloscope=this.MyOscilloscope='MyOscilloscope';
        var MyImage=this.MyImage='MyImage';
        var MySwitch=this.MySwitch='MySwitch';
        var MyRotateImg=this.MyRotateImg='MyRotateImg';
        var MyDateTime=this.MyDateTime='MyDateTime';
        var MyScriptTrigger=this.MyScriptTrigger='MyScriptTrigger';
        var MySlideBlock=this.MySlideBlock="MySlideBlock";
        var MyVideo=this.MyVideo="MyVideo";
        var MyAnimation=this.MyAnimation="MyAnimation";
        var MyTexNum=this.MyTexNum="MyTexNum";
        var MyTexTime = this.MyTexTime = 'MyTexTime';
        var MyAlphaImg = this.MyAlphaImg = 'MyAlphaImg';
        var MyTouchTrack = this.MyTouchTrack = 'MyTouchTrack'
        this.MyAlphaSlide = 'MyAlphaSlide';
        this.MyTextInput = 'MyTextInput'



    this.getFabWidgetByName= function (_typeStr) {
        switch (_typeStr){
            case MySlide:return fabric.MySlide;
            default:return null
        }
    };

    this.isWidget= function (_typeStr) {

        var widgets = [
            this.MySlide,
            this.MyButton,
            this.MyProgress,
            this.MyNumber,
            this.MyButtonGroup,
            this.MyDashboard,
            this.MyKnob,
            this.MyTextArea,
            this.MyNum,
            this.MyOscilloscope,
            this.MyImage,
            this.MySwitch,
            this.MyRotateImg,
            this.MyDateTime,
            this.MyScriptTrigger,
            this.MySlideBlock,
            this.MyVideo,
            this.MyAnimation,
            this.MyTexNum,
            this.MyTexTime,
            this.MyAlphaImg,
            this.MyTouchTrack,
            this.MyAlphaSlide,
            this.MyTextInput
        ]
        for(var i=0;i<widgets.length;i++){
            if(widgets[i]==_typeStr){
                return true
            }
        }
        return false
    };





}]);