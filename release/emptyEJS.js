const fs = require('fs');

//console.log('begin to rm ejs pharse...')

const pattern = /<!--\s*webProFlag\s*-->[\s\S]+?<!--\s*webProFlag_end\s*-->/g;

let old_html = fs.readFileSync('tempFolder/views/login/personalProject.html','utf-8');

let new_html = old_html.replace(pattern,'');

fs.writeFileSync('tempFolder/views/login/personalProject.html',new_html);

//console.log('finish!')
