/**
 * Created by lixiang on 2016/11/16.
 */
ideServices.service('UserTypeService',[function(){
    var userType='basic';
    this.setUserType=function(type){
        userType=type;
    };

    this.getUserType=function(){
        return userType;
    };

    this.getAnimationAuthor=function(){
        var animationDisabled=false;
        switch(userType){
            case 'basic':
                animationDisabled=true;
                break;
            default:
                animationDisabled=false;
                break;
        }
        return animationDisabled;
    }
}]);