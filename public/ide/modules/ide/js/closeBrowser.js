/**
 * Created by lixiang on 16/4/18.
 */
 window.addEventListener("beforeunload", function(event) {
     var status =  document.getElementById("saveFlag").value;
     console.log(flag,typeof  flag);
     if(status=='false'){
         event.returnValue="请确定已保存您的工程";
     }
     else{
         console.log('projects have been saved');
     }
 });