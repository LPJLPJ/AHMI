ideServices.service("ActionService",["ProjectService","Type",function(e,t){function n(e,t){this.name=e||"",this.value=t||""}var i=[],a=(new n,new n("按下","Press")),c=new n("释放","Release"),r=new n("加载","Load"),s=new n("离开","UnLoad"),o=new n("进入低警报","EnterLowAlarm"),u=new n("离开低警报","LeaveLowAlarm"),g=new n("进入高警报","EnterHighAlarm"),l=new n("离开高警报","LeaveHighAlarm"),h=new n("进入","Enter"),A=new n("离开","Leave"),w=new n("Tag改变(对性能有影响，谨慎使用)","TagChange"),y=[{title:"action0",trigger:"",commands:[]}],d=[a,c];this.getAllActions=function(){return i},this.getTriggers=function(e){switch(e){case t.MyPage:d=[r,s];break;case t.MyLayer:break;case t.MySubLayer:d=[r,s];break;case t.MyButton:case t.MyButtonGroup:d=[c];break;case t.MyScriptTrigger:case t.MyProgress:case t.MyDashboard:case t.MyNum:case t.MySlideBlock:case t.MyTexNum:d=[o,u,g,l,w];break;default:d=[h,A]}return d},this.setActions=function(e){i=e||_.cloneDeep(y)},this.setTriggers=function(e){e&&(d=e)},this.deleteActionByIndex=function(t,n,a){return t<0||t>i.length-1?(a&&a(),!1):(i.splice(t,1),e.ChangeAttributeAction(_.cloneDeep(i)),n&&n(),!0)},this.appendAction=function(t,n){i.push(t),e.ChangeAttributeAction(_.cloneDeep(i)),n&&n()},this.updateActionByIndex=function(t,n,a,c){n>=0&&n<i.length?(i[n]=t,e.ChangeAttributeAction(_.cloneDeep(i)),a&&a()):c&&c()},this.getNewAction=function(){return{title:"default",trigger:"",commands:[]}}}]);