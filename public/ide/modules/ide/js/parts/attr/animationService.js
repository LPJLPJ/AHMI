/**
 * Created by lixiang on 2016/10/19.
 */
ideServices.service('AnimationService',['ProjectService','Type',function(ProjectService,Type){
    function AnimationType(name,value){
        this.name=name||'';
        this.value=value||'';
    }

    var typeTranslation = new AnimationType('平移','translation');
    var typeZoom = new AnimationType('缩放','zoom');

    var defaultAnimation = [{
        title:'动画1',
        animationType:typeTranslation,
        targetPos:{x:0,y:0},
        duration:0
    }];

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
        return{
            title:'default',
            animationType:typeTranslation,
            targetPos:{x:null,y:null},
            duration:0
        }
    };

    this.updateAnimationByIndex=function(animation,index,cb){
        if(index>=0&&index<animations.length){
            animations[index]=anmiation;
            cb&&cb();
        }
    };

    this.deleteAnimationBuIndex=function(index,sCB,fCB){
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