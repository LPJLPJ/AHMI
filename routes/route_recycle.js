/**
 * Created by tang on 2018/11/01.
 */
var ProjectModel = require('../db/models/ProjectModel');
var UserModel = require('../db/models/UserModel');
var TemplateModel = require('../db/models/TemplateModel');
var ClassModel = require('../db/models/ClassModel');
var fs = require('fs');
var path = require('path');
var errHandler = require('../utils/errHandler');
var moment = require('moment');

var recycleRoute = {};

var rmdirAsync = function (_path, callback) {
    fs.readdir(_path, function (err, files) {
        if (err) {
            // Pass the error on to callback
            callback(err, []);
            return;
        }
        var wait = files.length,
            count = 0,
            folderDone = function (err) {
                count++;
                // If we cleaned out all the files, continue
                if (count >= wait || err) {
                    fs.rmdir(_path, callback);
                }
            };
        // Empty directory to bail early
        if (!wait) {
            folderDone();
            return;
        }

        files.forEach(function (file) {
            var curPath = path.join(_path, file);
            fs.lstat(curPath, function (err, stats) {
                if (err) {
                    callback(err, []);
                    return;
                }
                if (stats.isDirectory()) {
                    rmdirAsync(curPath, folderDone);
                } else {
                    fs.unlink(curPath, folderDone);
                }
            });
        });
    });
};

recycleRoute.getRecycle = function (req, res) {
    var _user = req.session.user;

    if (_user && _user.id) {
        ProjectModel.findRecycle(_user.id, function (err, projects) {
            if (err) {
                console.log(err);
                res.status(500).end()
            } else {
                var processedProjects = projects.map(function (project) {
                    var recycle = project.recycle;
                    var info = {};
                    info._id = project._id;
                    info.name = project.name;
                    info.recycleTime = moment(recycle.recycleTime).format('YYYY-MM-DD HH:mm');
                    info.author = project.author;
                    var thumbnail = project.thumbnail;
                    return {
                        projectInfo: info,
                        thumbnail: thumbnail
                    }
                });
                res.render('recycle/recycle.html', {projects: processedProjects});
            }
        })
    } else {
        console.log('user not valid');
        res.redirect('/user/login');
    }
};

recycleRoute.deleteRecycle = function (req, res) {
    var projectId = req.body.projectId;
    if (projectId) {
        ProjectModel.deleteById(projectId, function (err) {
            if (err) {
                errHandler(res, 500, 'delete error')
            }
            //delete directory
            var targetDir = path.join(__dirname, '../project/', String(projectId))
            fs.stat(targetDir, function (err, stats) {
                if (stats && stats.isDirectory && stats.isDirectory()) {
                    //exists
                    //delete
                    rmdirAsync(targetDir, function (rmErr) {
                        if (rmErr) {
                            errHandler(res, 500, 'rm directory error')
                        } else {
                            res.end('ok')
                        }
                    })
                } else {
                    res.end('ok')
                }
            })
        })
    } else {
        errHandler(res, 500, 'invalid project id')
    }
};

recycleRoute.refundRecycle = function (req, res) {
    var projectId = req.body.projectId;
    if (projectId) {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'find error')
            }
            project.update({recycle: {recycleStatus: false, recycleTime: ''},createTime:Date.now()}, function (err) {
                if (err) {
                    errHandler(res, 500, 'update error');
                } else {
                    res.end('ok');
                }
            })
        });
    } else {
        errHandler(res, 500, 'invalid project id')
    }
};

recycleRoute.clearRecycle = function (req, res) {
    var _user = req.session.user;

    if(_user&&_user.id){
        ProjectModel.findRecycle(_user.id, function (err, projects) {
            if (err) {
                errHandler(res, 500, 'delete folder err')
            } else {
                if (projects != '') {
                    var proArr = projects.map(function (project) {
                        return project._id;
                    });

                    ProjectModel.clearRecycle(_user.id, function (err,docs) {
                        if (err) {
                            errHandler(res, 500, 'clear recycle err')
                        } else {
                            //删除project文件夹
                            proArr.map(function (pro) {
                                var targetDir = path.join(__dirname, '../project/', String(pro));
                                fs.stat(targetDir, function (err, stats) {
                                    if (stats && stats.isDirectory && stats.isDirectory()) {
                                        rmdirAsync(targetDir, function (rmErr) {
                                            if (rmErr) {
                                                errHandler(res, 500, 'rm directory error')
                                            } else {
                                                res.end('ok')
                                            }
                                        })
                                    } else {
                                        res.end('ok')
                                    }
                                })
                            });
                        }
                    });
                }
            }
        });
    }else{
        res.redirect('/user/login')
    }
};


module.exports = recycleRoute;