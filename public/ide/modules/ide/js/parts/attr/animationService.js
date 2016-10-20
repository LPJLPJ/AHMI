/**
 * Created by lixiang on 2016/10/19.
 */
ideServices.service('AnimationService',['ProjectService','Type',function(ProjectService,Type){
    function Animation(title,id,xTranslate,yTranslate,xScale,yScale,duration){
        this.title=title;
        this.id=id;
        this.animationAttrs={
            translate:{
                dstPos:{
                    x:xTranslate,
                    y:yTranslate
                }
            },
            scale:{
                dstScale:{
                    x:xScale,
                    y:yScale
                }
            }
        };
        this.duration=duration;
    }

    var tempAnimation = new Animation('动画',null,0,0,1,1,0);
    var defaultAnimation = [tempAnimation];

    var animations=[];

    this.setAnimations=function(newAnimations){
        if(newAnimations){
            animations=newAnimations;
        }else{
            animations=_.cloneDeep(defaultAnimation);
        }
    };

    this.getAllAnimations=function(){
        return animations;
    };

    this.appendAnimation=function(newAnimation,cb){
        animations.push(newAnimation);
        cb&&cb();
    };

    this.getNewAnimation=function(){
        return _.cloneDeep(tempAnimation);
    };

    this.updateAnimationByIndex=function(animation,index,cb){
        if(index>=0&&index<animations.length){
            animations[index]=animation;
            cb&&cb();
        }
    };

    this.deleteAnimationByIndex=function(index,sCB,fCB){
        if(index<0&&index>=animations.length){
            fCB&&fCB();
            return false;
        }else{
            animations.splice(index,1);
            sCB&&sCB();
            return true;
        }
    }

}]);