/**
 * Created by changecheng on 2017/2/9.
 */
var BlogModel = require('../db/models/BlogModel')
var path = require('path')
var fs = require('fs')
var errHandler = require('../utils/errHandler')
var formidable = require('formidable')
var _ = require('lodash')
var BlogRoute = {}
var baseUrl = path.join(__dirname,'../public/blog/media')
BlogRoute.getEditor = function (req, res) {
    res.render('blog/editor.html')
}

BlogRoute.getManage = function (req, res) {
    res.render('blog/manage.html')
}

BlogRoute.getAllBlogs = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
        BlogModel.findByAuthor(user.id,function (err, blogs) {
            if (err){
                errHandler(res,500,'find error')
            }else{
                res.end(JSON.stringify(blogs))
            }
        })
    }

}

BlogRoute.createBlog = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
        var blogData = {
            authorId:user.id
        }
        var currentBlog = new BlogModel(blogData)
        currentBlog.save(function (err) {
            if (err){
                errHandler(res,500,'save error')
            }else{
                res.end(''+currentBlog._id)
            }
        })
    }
}

BlogRoute.saveDrat = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
        var blogId = req.body.blogId;
        var blogData = {}
        var info = req.body.info||{};
        if (!blogId){
            //create new blog

            // blogData = {
            //     authorId:user.id,
            //     modifing:true,
            //     drafts:[
            //         {
            //             title:info.title,
            //             desp:info.desp,
            //             keywords:info.keywords,
            //             content:req.body.content
            //         }
            //     ]
            //
            // }
            // var currentBlog = new BlogModel(blogData)
            //
            // currentBlog.save(function (err) {
            //     if (err){
            //         console.log(err)
            //         errHandler(res,500,'save error')
            //     }else{
            //         res.end(''+currentBlog._id)
            //     }
            // })
            errHandler(res,500,'invalid blogId')
        }else{

            BlogModel.findById(blogId,function (err,_blog) {
                if (err){
                    errHandler(res,500,'blog not found')
                }else{
                    _blog.modifing = true
                    _blog.drafts = [
                        {
                            title:info.title,
                            desp:info.desp,
                            keywords:info.keywords,
                            content:req.body.content
                        }
                    ]
                    _blog.save(function (err) {
                        if (err){
                            errHandler(res,500,'save error')
                        }else{
                            res.end('ok')
                        }
                    })
                }
            })
        }
    }else{
        errHandler(res,500,'not login')
    }
}

BlogRoute.getLastModified = function (req, res) {
    var blogId = req.query.blogId
    if (blogId){
        BlogModel.findById(blogId,function (err,_blog) {
            if (err){
                errHandler(res,500,'blog not found')
            }else{
                if (_blog.modifing){
                    //return draft
                    if (_blog.drafts.length){
                        res.end(JSON.stringify(_blog.drafts[0]))
                    }else{
                        res.end(JSON.stringify({}))
                    }

                }else{
                    //return blog
                    var result = {}
                    result.title = _blog.title;
                    result.desp = _blog.desp;
                    result.keywords = _blog.keywords;
                    result.content = _blog.content;
                    res.end(JSON.stringify(result))
                }

            }
        })
    }else{
        res.end("new blog")
    }

}



BlogRoute.getResources = function (req,res) {
    var blogId = req.query.blogId
    if (blogId){
        BlogModel.findById(blogId,function (err, _blog) {
            if (err){
                errHandler(res,500,'invalid blogId')
            }else{
                res.end(JSON.stringify(_blog.resources))
            }
        })
    }else{
        errHandler(res,500,'invalid blogId')
    }
}

BlogRoute.deleteResource = function (req, res) {
    var blogId = req.query.blogId
    if (blogId){
        var fileName = req.body.fileName
        var successHandler = function(){
            BlogModel.findById(blogId,function (err, _blog) {
                if (err){
                    errHandler(res,500,'invalid blogId')
                }else{
                    _.pull(_blog.resources,fileName)
                    _blog.save(function (err) {
                        if (err) {
                            errHandler(res, 500, 'save error')
                        }else{
                            res.end('ok')
                        }
                    })
                }
            })
        }
        if (fileName) {
            var fileUrl = path.join(baseUrl,fileName)

            fs.stat(fileUrl,function (err,stats) {
                if (err){
                    //already not exist
                    successHandler()
                }else{
                    fs.unlink(fileUrl,function (err) {
                        if (err) {
                            errHandler(res,500,'delete error')
                        }else{
                            successHandler()
                        }
                    })
                }
            })
        }else {
            errHandler(res,500,'invalid filename')
        }
    }else{
        errHandler(res,500,'invalid blogId')
    }
    

}
BlogRoute.uploadImage = function (req,res) {
    var blogId = req.query.blogId
    if (blogId){
        uploadSingleFile(req,res,function (err,files) {
            if (err){
                errHandler(res,500,'upload error')
            }else{
                //save files
                BlogModel.findById(blogId,function (err,_blog) {
                    if (err){
                        errHandler(res,500,'invalid blogId')
                    }else{
                        var oldResources = _blog.resources ||[]
                        _blog.resources = _.union(oldResources,files)
                        _blog.save(function (err) {
                            if (err){
                                errHandler(res,500,'save resources error')
                            }else{
                                res.end('ok')
                            }
                        })

                    }
                })

            }
        })
    }else{
        errHandler(res,500,'invalid blogId')
    }

}

function uploadSingleFile(req, res,cb){

    var fields={}
    var files = []
    var form = new formidable.IncomingForm()
    form.encoding = 'utf-8'
    form.multiples = true
    form.uploadDir = baseUrl
    form.on('field',function(name, value){
        fields[name] = value
        // console.log(arguments)
    })
    form.on('file',function(name, file){
        fs.rename(file.path,path.join(form.uploadDir,file.name));
        files.push(file.name)
    })


    fs.stat(form.uploadDir, function (err, stats) {
        if (stats&&stats.isDirectory&&stats.isDirectory()){
            formParse(req)
        }else{
            fs.mkdir(form.uploadDir, function (err) {
                if (err){
                    cb&&cb(err)
                }else{
                    formParse(req)
                }
            })
        }
    })

    function formParse(req) {
        form.parse(req,function (err,fields,files) {
            if (err) {
                cb&&cb(err)
            }else{
                var _files = files.file;
                if (_files.length){
                    _files = _files.map(function (f) {
                        return f.name
                    })
                }else{
                    _files = [_files.name]
                }
                cb && cb(null,_files)
            }
        })
    }
}

module.exports = BlogRoute