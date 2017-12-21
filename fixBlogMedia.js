var dbConfig = require('./db/config/config');
var fs = require('fs');
var fse = require('fs-extra')
var path = require('path');
var mongoose = require('mongoose');
var BlogModel = require('./db/models/BlogModel');
var baseUrl = path.join(__dirname,'/public/blog/media');
mongoose.connect(dbConfig.dbPath,{

});

var db = mongoose.connection;
// console.log(db);
db.once('open',function(){
    console.log('opend ahmi');
});
db.on('error',function(err){
    console.log('error: '+err);
});


BlogModel.fetch(function (err,blogs) {
    blogs = blogs||[]
    var count = blogs.length
    var handler = function (err) {
        count--
        if (err){
            console.log(err)
        }
        if (count==0){
            console.log('finished')
        }
    }
    if (count){
        blogs.forEach(function (blog) {
            fixSingleBlog(blog,handler)
        })
    }else{
        console.log('finished')
    }
})



function fixSingleBlog(blog,cb) {
    var blogId = blog._id+''
    if (blogId){
        var resources = blog.resources
        fse.ensureDir(path.join(baseUrl,blogId),function (err) {
            if (err){
                cb && cb(err)
            }else{
                moveResources(blogId,resources,function (lastErr) {
                    cb && cb(lastErr)
                })
            }
        })
    }else{
        cb && cb(new Error('empty blogId'))
    }
}


function moveResources(blogId,resources,cb) {
    resources = resources||[]
    var count = resources.length
    var lastErr = null
    if (count){
        var handler = function (err) {
            count--
            if (err){
                console.log('copy error',err)
                lastErr = err
            }
            if (count==0){
                //finished
                cb && cb(lastErr)
            }
        }
        resources.forEach(function (r) {
            moveResource(blogId,r,function (err) {
                handler(err)
            })
        })
    }else{
        cb && cb(null)
    }

}


function moveResource(blogId,r,cb) {
    fse.copy(path.join(baseUrl,r),path.join(baseUrl,blogId,r),cb)
}