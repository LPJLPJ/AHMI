/**
 * Created by lixiang on 16/4/18.
 */
 window.addEventListener("beforeunload", function(event) {
     var flag =  document.getElementById("saveFlag").value;
     console.log(flag,typeof  flag);
     if(flag=='1'){
         event.returnValue="请确定已保存您的工程";
     }
     else{
         console.log('flag is not 0');
     }
 });