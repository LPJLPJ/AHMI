/**
 * Created by shenaolin on 16/3/4.
 */
ideServices.
    service('Type', [function () {
        this.MyPage = 'MyPage';
        this.MyLayer = 'MyLayer';
        this.MyLayerGroup = 'group';
        this.MySubLayer = 'MySubLayer';
        this.MyWidgetGroup = 'group';
        this.MySlide = 'MySlide';
        this.MyButton = 'MyButton';
        this.MyButtonGroup = "MyButtonGroup";
        this.MyNumber = 'MyNumber';
        this.MyProgress = 'MyProgress';
        this.MyDashboard = 'MyDashboard';
        this.MyGroup = 'group';
        this.MyLayerArray = 'MyLayerArray';
        this.MyWidgetArray = 'MyWidgetArray';
        this.MyKnob = 'MyKnob';
        this.MyTextArea = 'MyTextArea';
        this.MyNum = 'MyNum';
        this.MyOscilloscope='MyOscilloscope';
        this.MyImage='MyImage';
        this.MySwitch='MySwitch';
        this.MyRotateImg='MyRotateImg';
        this.MyDateTime='MyDateTime';
        this.MyScriptTrigger='MyScriptTrigger';
        this.MySlideBlock="MySlideBlock";
        this.MyVideo="MyVideo";
        this.MyAnimation="MyAnimation";
        this.MyTexNum="MyTexNum";
        this.MyTexTime = 'MyTexTime';
        this.MyAlphaImg = 'MyAlphaImg';
        this.MyTouchTrack = 'MyTouchTrack';
        this.MyButtonSwitch = 'MyButtonSwitch';
        this.MyAlphaSlide = 'MyAlphaSlide';
        this.MyTextInput = 'MyTextInput';
        this.MyGallery = 'MyGallery';
        this.MyChart = 'MyChart';


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
            this.MyTextInput,
            this.MyGallery,
            this.MyButtonSwitch,
            this.MyChart
        ];
        for(var i=0;i<widgets.length;i++){
            if(widgets[i]==_typeStr){
                return true
            }
        }
        return false
    }.bind(this)
}]);