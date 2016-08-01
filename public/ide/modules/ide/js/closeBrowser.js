/**
 * Created by lixiang on 16/4/18.
 */
 window.addEventListener("beforeunload", function(event) {
     event.returnValue="请确定已保存您的工程";
     console.log(event);
 });