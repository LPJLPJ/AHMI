/**
 * Created by lixiang on 2016/10/19.
 */
ideServices.service('AnimationService',[function(){
    //Animation 构造函数
    function Animation(title,id,srcX,srcY,srcScaleX,srcScaleY,xTranslate,yTranslate,xScale,yScale,duration){
        this.title=title;
        this.id=id;
        this.animationAttrs={
            translate:{
                srcPos:{
                    x:srcX,
                    y:srcY
                },
                dstPos:{
                    x:xTranslate,
                    y:yTranslate
                }
            },
            scale:{
                srcScale:{
                    x:srcScaleX,
                    y:srcScaleY
                },
                dstScale:{
                    x:xScale,
                    y:yScale
                }
            }
        };
        this.duration=duration;
    }

    //过渡动画构造函数
    function Transition(name,show,duration){
        this.name=name||'';
        this.show=show||'';
        this.duration=duration;
    }

    var noTransition=new Transition('NO_TRANSITION','无动画',0);
    var moveLR=new Transition('MOVE_LR','从左进入',1);
    var moveRL=new Transition('MOVE_RL','从右进入',1);
    var scale=new Transition('SCALE','缩放',1);
    var transition=[noTransition,moveLR,moveRL,scale];


    this.getNewAnimation=function(){
        return new Animation('动画',null,null,null,1,1,0,0,1,1,0);
    };


    this.getAllTransititon=function(){
        return _.cloneDeep(transition);
    };

    this.getDefaultTransition=function(){
        return new Transition('NO_TRANSITION','无动画',0);
    }

}]);