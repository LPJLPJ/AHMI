/**
 * Created by lixiang on 2016/11/16.
 */
ideServices.service('UserTypeService',[function(){
    var userType='basic';
    this.setUserType=function(type){
        userType=type||'basic';
    };

    this.getUserType=function(){
        return userType;
    };

    this.getAnimationAuthor=function(){
        var animationDisabled=false;
        switch(userType){
            case 'ultimate':
            case 'admin':
                animationDisabled=false;
                break;
            default:
                animationDisabled=true;
                break;
        }
        return animationDisabled;
    };
    this.getCustomFontAuthor=function(){
        var customFontDisabled=false;
        switch (userType){
            case 'pro':
            case 'ultimate':
            case 'admin':
                customFontDisabled=false;
                break;
            default :
                customFontDisabled=true;
                break;
        }
        return customFontDisabled;
    };
}]);