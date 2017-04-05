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



    this.getFabWidgetByName= function (_typeStr) {
        switch (_typeStr){
            case MySlide:return fabric.MySlide;
            default:return null
        }
    };

    this.isWidget= function (_typeStr) {
        if (_typeStr==this.MySlide||_typeStr==this.MyButton||
            _typeStr==this.MyProgress||_typeStr==this.MyNumber||_typeStr==this.MyButtonGroup||_typeStr == this.MyDashboard||
            _typeStr==this.MyKnob||_typeStr==this.MyTextArea||_typeStr==this.MyNum||_typeStr==this.MyOscilloscope||_typeStr==this.MyImage||
            _typeStr==this.MySwitch||_typeStr==this.MyRotateImg||_typeStr==this.MyDateTime||_typeStr==this.MyScriptTrigger||_typeStr==this.MySlideBlock||
            _typeStr==this.MyVideo||_typeStr==this.MyAnimation){
            return true;
        }
        return false
    };





}]);