ideServices.service("AnimationService",[function(){function n(n,t,i,e,s,r,o,a,c,l,u){this.title=n,this.id=t,this.animationAttrs={translate:{srcPos:{x:i,y:e},dstPos:{x:o,y:a}},scale:{srcScale:{x:s,y:r},dstScale:{x:c,y:l}}},this.duration=u}function t(n,t,i){this.name=n||"",this.show=t||"",this.duration=i}var i=new t("NO_TRANSITION","无动画",0),e=new t("MOVE_LR","从左进入",1),s=new t("MOVE_RL","从右进入",1),r=new t("SCALE","缩放",1),o=[i,e,s,r];this.getNewAnimation=function(){return new n("动画",null,null,null,1,1,0,0,1,1,0)},this.getAllTransititon=function(){return _.cloneDeep(o)},this.getDefaultTransition=function(){return new t("NO_TRANSITION","无动画",0)}}]);