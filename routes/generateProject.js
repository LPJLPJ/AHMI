/**
 * Created by ChangeCheng on 16/5/10.
 */
var fs = require('fs')
var path = require('path')
module.exports = function (req, res) {
    var tempData = JSON.stringify(req.body,null,4);
    // console.log(tempData);
    fs.writeFile(path.join(__dirname,'../public/data/example.bak.json'),tempData,function(err){
        if (err) {
            console.error(err);
            res.status(500).end('error')
        }
        res.end('success');
    })
}
