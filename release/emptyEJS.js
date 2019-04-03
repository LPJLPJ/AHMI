const fs = require('fs');

//console.log('begin to rm ejs pharse...')

let local_html = fs.readFileSync('tempFolder/views/login/personalProject_local.html','utf-8');

fs.writeFileSync('tempFolder/views/login/personalProject.html',local_html);

//console.log('finish!')
