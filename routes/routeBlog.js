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
BlogRoute.getIndex = function (req, res) {
    res.render('blog/index.html')
}
BlogRoute.getEditor = function (req, res) {
    res.render('blog/editor.html')
}

BlogRoute.getManage = function (req, res) {
    res.render('blog/manage.html')
}

BlogRoute.getBlog = function (req, res) {
    res.render('blog/post.html')
}

BlogRoute.getAllPublishedBlogs = function (req, res) {
    BlogModel.fetchPublishedBatch(0,0,function (err,_blogs) {
        if (err){
            errHandler(res,500,'fetch failed')
        }else{
            //get _blogs
            //generate info
            var result = _blogs.map(function (_blog) {
                var info = {}
                info._id = _blog._id;
                info.authorId = _blog.authorId;
                info.title = _blog.title;
                info.desp = _blog.desp;
                info.keywords = _blog.keywords;
                info.digest = _blog.digest;
                info.publishTime = _blog.publishTime;
                return info
            })
            res.end(JSON.stringify(result))
        }
    })
}

BlogRoute.publishBlog = function (req,res) {
    var user = req.session.user
    if (user && user.username && user.id){
        var blogId = req.body.blogId;
        var blogData = {}
        var info = req.body.info||{};
        var content = req.body.content;
        // console.log(blogId,info,content)
        if (!blogId){
            errHandler(res,500,'invalid blogId')
        }else{

            BlogModel.findById(blogId,function (err,_blog) {
                if (err){
                    errHandler(res,500,'blog not found')
                }else{
                    if (_blog.authorId != user.id){
                        errHandler(res,500,'invalid user')
                    }else{
                        //update
                        // console.log('updating',info,content)
                        _blog.title = info.title;
                        _blog.desp = info.desp;
                        _blog.keywords = info.keywords;
                        _blog.digest = info.digest;
                        _blog.content = content;
                        _blog.modifing = false;
                        _blog.publish = true;
                        _blog.drafts = [
                            {
                                title:info.title,
                                desp:info.desp,
                                keywords:info.keywords,
                                content:content
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

                }
            })
        }
    }else{
        errHandler(res,500,'not login')
    }
}

BlogRoute.getAllBlogs = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
        BlogModel.findByAuthor(user.id,function (err, blogs) {
            if (err){
                errHandler(res,500,'find error')
            }else{
                var results = blogs.map(function (blog) {
                    return {
                        _id: blog._id,
                        title: blog.title,
                        desp: blog.desp,
                        keywords: blog.keywords,
                        digest: blog.digest,
                        modifing: blog.modifing,
                        publish: blog.publish,
                        lastModifyTime: blog.lastModifyTime
                    }

                })
                res.end(JSON.stringify(results))
            }
        })
    }else{
        errHandler(res,500,'not login')
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

BlogRoute.deleteBlog = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
        var blogId = req.body.blogId;

        if (!blogId){
            errHandler(res,500,'invalid blogId')
        }else{

            BlogModel.findById(blogId,function (err,_blog) {
                if (err){
                    errHandler(res,500,'blog not found')
                }else{
                    if (_blog.authorId != user.id){
                        errHandler(res,500,'invalid user')
                    }else{
                        //valid
                        //delete resources
                        deleteBatchResources(_blog.resources,function (errFiles) {
                            BlogModel.deleteById(blogId,function (err) {
                                if (err){
                                    errHandler(res,500,'delete error')
                                }else{
                                    res.end('ok')
                                }
                            })
                        })
                    }
                }
            })
        }
    }else{
        errHandler(res,500,'not login')
    }
}

BlogRoute.unpublishBlog = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
        var blogId = req.body.blogId;

        if (!blogId){
            errHandler(res,500,'invalid blogId')
        }else{

            BlogModel.findById(blogId,function (err,_blog) {
                if (err){
                    errHandler(res,500,'blog not found')
                }else{
                    if (_blog.authorId != user.id){
                        errHandler(res,500,'invalid user')
                    }else{
                        //valid
                        //delete resources
                        _blog.publish = false;
                        _blog.save(function (err) {
                            if (err){
                                errHandler(res,500,'save error')
                            }else{
                                res.end('ok')
                            }
                        })
                    }
                }
            })
        }
    }else{
        errHandler(res,500,'not login')
    }
}

function deleteBatchResources(files,cb) {
    var count = files.length;
    var errFiles = []
    var deleteHandler = function (err,errFile) {
        if (err){
            errFiles.push(errFile)
        }
        count = count-1
        if (count<=0){
            //finish
            cb && cb(errFiles)
        }
    }
    if (count>0){
        files.map(function (_file) {
            deleteTargetResource(_file,deleteHandler)
        })
    }else{
        cb &&cb(errFiles)
    }

}
function deleteTargetResource(fileName,cb) {
    if (fileName) {
        var fileUrl = path.join(baseUrl,fileName)

        fs.stat(fileUrl,function (err,stats) {
            if (err){
                //already not exist
                cb && cb(null)
            }else{
                fs.unlink(fileUrl,function (err) {
                    if (err) {
                        cb && cb(err,fileName)
                    }else{
                        cb && cb(null)
                    }
                })
            }
        })
    }else {
        cb && cb(null)
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
                    if (_blog.authorId != user.id){
                        errHandler(res,500,'invalid user')
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
                }
            })
        }
    }else{
        errHandler(res,500,'not login')
    }
}

BlogRoute.getLastModified = function (req, res) {
    var user = req.session.user
    if (user && user.username && user.id){
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
    }else{
        errHandler(res,500,'not login')
    }


}

BlogRoute.getBlogData = function (req, res) {

    var blogId = req.query.blogId
    if (blogId){
        BlogModel.findById(blogId,function (err,_blog) {
            if (err){
                errHandler(res,500,'blog not found')
            }else{
                if (_blog.publish){
                    var result = {}
                    result.title = _blog.title;
                    result.authorId =_blog.authorId;
                    result.desp = _blog.desp;
                    result.keywords = _blog.keywords;
                    result.content = _blog.content;
                    res.end(JSON.stringify(result))
                }else{
                    errHandler(res,500,'not published')
                }

            }
        })
    }else{
        errHandler(res,500,'invalid blogId')
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