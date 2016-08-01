/**
 * Created by lixiang on 16/4/18.
 */
 window.addEventListener("beforeunload", function(event) {
     var status =  document.getElementById("saveFlag").value;
     //event.returnValue="请确定已保存您的工程";
     console.log(status,typeof  status);
     if(status=="false"){
         event.returnValue="请确定已保存您的工程";
     }
     else{
         console.log('projects have been saved');
     }
 });