function postJSON(e,t,a,n){$.ajax({url:baseURL+t,data:JSON.stringify(e),dataType:"json",contentType:"application/json",type:"POST",success:a,error:n,timeout:1e4})}function getJSON(e,t,a){$.ajax({url:baseURL+e,contentType:"application/json",type:"get",success:t,error:a})}var baseURL="";