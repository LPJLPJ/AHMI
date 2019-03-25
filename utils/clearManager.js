//created by Zzen1sS
//2019/3/22

// var fse = require('fse')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var ClearManager = {}

ClearManager.clearSingleProjectRenderedFiles = function(projectId,cb){
    var resourcesUrl = path.join(__dirname,'../project/',projectId,'/resources/')
    fs.stat(resourcesUrl,function(err,stats){
        if(err){   
            cb && cb(err)
        }else{
            if(stats.isFile()){
                cb && cb(new Error(resourcesUrl+' is not a directory'))
            }else{
                //check rendered files in this directory
                var regx = /\w+(-\w+)+/
                fs.readdir(resourcesUrl,function(err,files){
                    if(err){
                        cb && cb(err)
                    }else{
                        //filter rendered files
                        files = files.filter(function(f){
                            return f.match(regx)
                        })
                        if (files && files.length) {
                            
                            var count = files.length
                            var lastErr = null
                            var deleteFileCb = function(err){
                                if(err){
                                    lastErr = err
                                }
                                count--
                                if(count == 0){
                                    cb && cb(lastErr)
                                }
                            }
                            //filter
                            files.forEach(function (dFile) {
                                var dFilePath = path.join(resourcesUrl, dFile);
                                // console.log(dFilePath)
                                fs.stat(dFilePath, function (err, stats) {
                                    // console.log(stats)
                                    if(err){
                                        deleteFileCb(err)
                                    }else{
                                        if (stats && stats.isFile()) {
                                            fs.unlink(dFilePath,function(err){
                                                deleteFileCb(err)
                                            });
                                        }else{
                                            deleteFileCb()
                                        }
                                    }
                                    
                                })
                            });
                        }else{
                            cb && cb(null)
                        }
                    }
                })
            }
            
        }
    })
    
}


ClearManager.clearSingleProjectFileZip = function(projectId,cb){
    var projectUrl = path.join(__dirname,'../project/',projectId)
    fs.readdir(projectUrl,function(err,files){
        if(err){
            cb && cb(err)
        }else{
            //filter zip files
            files = files.filter(function(f){
                return path.extname(f) == '.zip'
            })
            if (files && files.length) {
                
                var count = files.length
                var lastErr = null
                var deleteFileCb = function(err){
                    if(err){
                        lastErr = err
                    }
                    count--
                    if(count == 0){
                        cb && cb(lastErr)
                    }
                }
                //filter
                files.forEach(function (dFile) {
                    var dFilePath = path.join(projectUrl, dFile);
                    // console.log(dFilePath)
                    fs.stat(dFilePath, function (err, stats) {
                        // console.log(stats)
                        if(err){
                            deleteFileCb(err)
                        }else{
                            if (stats && stats.isFile()) {
                                fs.unlink(dFilePath,function(err){
                                    deleteFileCb(err)
                                });
                            }else{
                                deleteFileCb()
                            }
                        }
                        
                    })
                });
            }else{
                cb && cb(null)
            }
        }
    })
    
}


ClearManager.clearSingleProject = function(projectId,cb){
    var tasks = [ClearManager.clearSingleProjectRenderedFiles, ClearManager.clearSingleProjectFileZip]
    var taskCount = tasks.length
    var lastErr = null
    var taskCB = function(err){
        if(err){
            lastErr = err
        }
        taskCount--
        if(taskCount==0){
            // console.log('cleared ',projectId)
            cb && cb(lastErr)
        }
    }
    tasks.forEach(function(t){
        t(projectId,function(err){
            taskCB(err)
        })
    })
    // tasks[0](projectId,function(err){
    //     console.log('rendered files')
    //         taskCB(err)
    // })

    // tasks[1](projectId,function(err){
    //     console.log('zip')
    //         taskCB(err)
    // })
}

ClearManager.clearOutdatedSingleProject = function(outdatedDuration, projectId, cb){
    var projectUrl = path.join(__dirname,'../project/',projectId)
    //console.log('clear...'+projectUrl)
    fs.stat(projectUrl,function(err,stats){
        if(err){
            cb && cb(err)
        }else{
            if(stats.isDirectory()){
                //check
                var lastModifiedDate = new Date(stats.mtime)
                var duration = Date.now() - lastModifiedDate
                if(duration > outdatedDuration){
                    //should clear
                    ClearManager.clearSingleProject(projectId,cb)
                }else{
                    cb&&cb()
                }
            }else{
                cb && cb(new Error(projectUrl+" is not a directory"))
            }
        }
    })
}

ClearManager.clearProjects = function(outdatedDuration,cb){
    var projectsUrl = path.join(__dirname,'../project/')
    fs.readdir(projectsUrl,function(err,files){
        if(err){
            cb&&cb(err)
        }else{
            if(files&&files.length){
                var count = files.length
                var lastErr = null
                var clearCB = function(err){
                    if(err){
                        lastErr = err
                    }
                    count--
                    if(count == 0){
                        cb && cb(lastErr)
                    }
                }
                files.forEach(function(f){
                    ClearManager.clearOutdatedSingleProject(outdatedDuration,f,clearCB)
                })
            }else{
                cb && cb()
            }
        }
    })
}

ClearManager.startClearJob = function(outdatedDuration, interval,cb){
    if(this.jobKey){
        clearInterval(this.jobKey)
    }
    setInterval(function(){
        ClearManager.clearProjects(outdatedDuration,cb)
    },interval||12*60*60*1000)
}

ClearManager.stopClearJob = function(){
    if(this.jobKey){
        clearInterval(this.jobKey)
    }
}


module.exports = ClearManager