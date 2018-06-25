CAN.service('CANService', [function(){
    function FrameInfo(index){
        this.index = index;
        this.registerId = null; 
        this.startBit = null;
        this.numOfBit = null;
        this.tagBit = null;
        this.scale = null;
        this.offset = null;
        //private
        this.showDataFrameInfo = true;
    };

    function DataFrame(index,show){
        this.index = index;
        this.CANId = null;
        this.frameInfoArr = [];
        //private
        this.showDataFrame = true; 
    };

    function Timer(duration,CANId){
        this.duration=duration||null;
        this.CANId=CANId||"";
        this.data="";
        this.dataArr=[];
    }

    function CANPort(){
        this.CANPortId = "";
        this.portMap = "";
        this.normalOrExpand = ""
        this.tsjw = null;
        this.tbs2 = null;
        this.tbs1 = null;
        this.brp = null;
        this.baudRate = null;
    }

    function IOConfigInfo(IO,pin,mode,tagBit){
        this.IO = IO||'';
        this.pinId = pin||null;
        this.mode = mode||'';
        this.tagBit = tagBit||null;
    }

    function IOConfig(enableConfig){
        this.enableConfig=enableConfig;
        this.registerId=null;
        this.configArr=[new IOConfigInfo()];
    }

    function TimerConfig(enableConfig){
        this.enableConfig = enableConfig;
        this.configArr = [new Timer(null,null)];
    }

    var project={};

    this.getBlankProject = function(){
        var newProject = {
            CANPort:new CANPort(),
            dataFrameArr:[],
            IOConfig:new IOConfig(false),
            timerConfig:new TimerConfig(false)
        };
        var newFrameInfo = new FrameInfo(0);
        var newDataFrame = new DataFrame(0);

        newDataFrame.frameInfoArr.push(newFrameInfo);
        newProject.dataFrameArr.push(newDataFrame);
        return newProject;
    };

    this.setProject = function(pro){
        project=pro;
    };

    this.getProject = function(){
        return project;
    };

    this.getNewDataFrame = function(index){
        var newDataFrame = new DataFrame(index);
        var newFrameInfo = new FrameInfo(0);

        newFrameInfo.showDataFrameInfo = false;
        newDataFrame.showDataFrame = false;

        newDataFrame.frameInfoArr.push(newFrameInfo);
        return newDataFrame;
    };

    this.getNewDataFrameInfo = function(index){
        return new FrameInfo(index);
    };

    this.getNewTimerConfig = function(){
        return new TimerConfig(false);
    }

    this.getNewTimerConfigInfo = function(){
        return new Timer(null,null);
    };

    this.getNewIOConfig = function(){
        return new IOConfig(false);
    }

    this.getNewIOConfigInfo = function(){
        return new IOConfigInfo();
    }

}]);