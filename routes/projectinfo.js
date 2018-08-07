/**
 * Created by ChangeCheng on 16/5/7.
 */
var ProjectModel = require('../db/models/ProjectModel')
var UserModel = require('../db/models/UserModel')
var TemplateModel = require('../db/models/TemplateModel')
var ClassModel = require('../db/models/ClassModel')
var projectRoute = {}
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var errHandler = require('../utils/errHandler')
var defaultProject = require('../utils/defaultProject')
var nodejszip = require('../utils/zip');
var MyZip = require('../utils/MyZip');
var mkdir = require('mkdir-p');
var Canvas = require('canvas');
var archiver = require('archiver');
var crypto = require('crypto');

var FileLoader = require('../utils/fileLoader')
var VersionManager = require('../utils/versionManager')
VersionManager.getAllVersions()

var Font = Canvas.Font;
//rendering
var Renderer = require('../utils/render/renderer');
var fse = require('fs-extra');
var moment = require('moment');
projectRoute.getAllProjects = function (req, res) {
    ProjectModel.fetch(function (err, projects) {
        if (err) {
            errHandler(res, 500, err)
        }
        res.end(projects)
    })
}

function generateUserKey(projectId, sharedKey, cb) {
    var hash = crypto.createHash('sha256');


    hash.update(projectId + sharedKey);
    var data = hash.digest('hex').slice(0, 5)
    cb && cb(data)


}

function hasValidKey(user, projectId, sharedKey, cb) {
    if (user && user.sharedKey) {
        generateUserKey(projectId, sharedKey, function (data) {
            if (data === user.sharedKey) {
                cb && cb(true)
            } else {
                cb && cb(false)
            }
        })
    } else {
        cb && cb(false)
    }
}


function checkAccessPriviledge(project, sessionUser, cb) {
    var userId = sessionUser.id
    if (userId) {
        if (project.userId == userId) {
            //own
            cb && cb(null, 'own')
        } else {
            //check share
            if (!!project.shared) {
                //check all rights sharedKey
                hasValidKey(sessionUser, project._id, project.sharedKey, function (result) {
                    if (result) {
                        cb && cb(null, 'shareOK')
                    } else {
                        hasValidKey(sessionUser, project._id, project.readOnlySharedKey, function (result) {
                            if (result) {
                                cb && cb(null, 'shareOKReadOnly')
                            } else {
                                cb && cb(null, 'shareLogin')
                            }
                        })
                    }
                })
            } else {
                cb && cb(null, 'forbidden')
            }
        }
    } else {
        cb && cb(null, 'unLogin')
    }

}

projectRoute.checkSharedKey = function (req, res) {
    var projectId = req.params.id
    var sharedKey = req.body.sharedKey
    var userId = req.session.user && req.session.user.id;
    if (userId && projectId) {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'error')
            }
            if (!project) {
                errHandler(res, 500, 'empty project')
            } else {
                if (project.shared && (project.sharedKey == sharedKey || project.readOnlySharedKey == sharedKey)) {
                    //valid key
                    generateUserKey(projectId, sharedKey, function (data) {
                        req.session.user.sharedKey = data
                        res.end('ok')
                    })
                } else {
                    //invalid key or not shared
                    errHandler(res, 500, 'invalid key')
                }
            }

        })
    } else {
        errHandler(res, 500, 'error')
    }
};

function addVersionQueryFunc(ideVersion) {
    return function (url) {
        return url + '?ideVersion=' + ideVersion
        // return url+'?ideVersion=1.10.1'
    }
}

function renderIDEEditorPageWithResources(res, ideVersion) {
    var versionScripts = ''

    if (ideVersion) {
        var curAddVersionQueryFunc = addVersionQueryFunc(ideVersion)
        versionScripts = VersionManager.versionScripts[ideVersion]
        var frontScriptDOMs = FileLoader.generateFiles((versionScripts.frontScripts || []).map(curAddVersionQueryFunc))
        var rearScriptsDOMs = FileLoader.generateFiles((versionScripts.rearScripts || []).map(curAddVersionQueryFunc))

        res.render('../legacy/' + ideVersion + '/views/ide/index.html', {
            frontScripts: frontScriptDOMs,
            rearScripts: rearScriptsDOMs
        })

        // res.render('../legacy/'+ideVersion+'/views/ide/index.html')
    } else {
        res.render('ide/index.html')
    }


}

projectRoute.getProjectById = function (req, res) {
    var projectId = req.params.id;
    var userId = req.session.user && req.session.user.id;
    var ideVersion = req.query.ideVersion
    console.log(ideVersion)
    if (req.session.user) {
        req.session.user.readOnlyState = false; //使用session保存只读状态，只读状态与当前用户有关，因此存放在req.session中
    }
    if (projectId && projectId != '') {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'error')
            }
            //console.log(project)
            if (!project) {
                errHandler(res, 500, 'project is null');
            } else if (project.userId == userId) {
                // res.render('ide/index.html')
                renderIDEEditorPageWithResources(res, ideVersion)
            } else if (!userId) {
                res.render('login/login.html', {
                    title: '重新登录'
                });
            } else {
                //user logged in, but not project owner
                if (!!project.shared) {
                    hasValidKey(req.session.user, projectId, project.sharedKey, function (result) {
                        if (result) {
                            res.render('ide/index.html')
                        } else {
                            hasValidKey(req.session.user, projectId, project.readOnlySharedKey, function (result) {
                                if (req.session.user) {
                                    req.session.user.readOnlyState = result;//+ save readOnly state in session
                                }
                                if (result) {
                                    res.render('ide/index.html')
                                } else {
                                    res.render('ide/share.html', {
                                        title: project.name,
                                        share: true
                                    })
                                }
                            })
                        }
                    })
                } else {
                    res.render('ide/share.html', {
                        title: '没有权限',
                        share: false
                    });
                }
            }
        })
    } else {
        errHandler(res, 500, 'error')
    }
};

projectRoute.getProjectTreeById = function (req, res) {
    var projectId = req.params.id;
    var userId = req.session && req.session.user && req.session.user.id;
    if (!userId) {
        res.render('login/login.html', {
            title: '重新登录'
        })
    } else {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'error')
            } else {
                if (!project) {
                    errHandler(res, 500, 'project is null');
                } else if (project.userId == userId) {
                    res.render('ide/projectTree.html')
                } else {
                    if (!!project.shared) {
                        hasValidKey(req.session.user, projectId, project.sharedKey, function (result) {
                            if (result) {
                                res.render('ide/projectTree.html')
                            } else {
                                hasValidKey(req.session.user, projectId, project.readOnlySharedKey, function (result) {
                                    if (result) {
                                        res.render('ide/projectTree.html')
                                    } else {
                                        res.render('ide/share.html', {
                                            title: project.name,
                                            share: true
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        res.render('ide/share.html', {
                            title: '没有权限',
                            share: false
                        });
                    }
                }
            }
        })
    }
};

projectRoute.renderDataAnalysis = function (req, res) {
    var projectId = req.params.id;
    var userId = req.session && req.session.user && req.session.user.id;
    if (!userId) {
        res.render('login/login.html', {
            title: '重新登录'
        })
    } else {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'error')
            } else {
                if (!project) {
                    errHandler(res, 500, 'project is null');
                } else if (project.userId == userId) {
                    res.sendFile(path.join(__dirname, '..', 'public', 'data-analysis', 'index.html'))
                } else {
                    if (!!project.shared) {
                        hasValidKey(req.session.user, projectId, project.sharedKey, function (result) {
                            if (result) {
                                res.render('ide/projectTree.html')
                            } else {
                                hasValidKey(req.session.user, projectId, project.readOnlySharedKey, function (result) {
                                    if (result) {
                                        res.sendFile(path.join(__dirname, '..', 'public', 'data-analysis', 'index.html'))
                                    } else {
                                        res.render('ide/share.html', {
                                            title: project.name,
                                            share: true
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        res.render('ide/share.html', {
                            title: '没有权限',
                            share: false
                        });
                    }
                }
            }
        })
    }
};

projectRoute.getProjectContent = function (req, res) {
    var projectId = req.params.id
    var v = req.query.v
    if (projectId && projectId != '') {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                console.log(err)
                errHandler(res, 500, 'error')
            }
            if (!project) {
                errHandler(res, 500, 'error');
                return;
            }
            if (v in project.backups) {
                project.content = project.backups[v].content || ''
            }
            project.backups = [];
            // console.log('readonly state in session',req.session.user.readOnlyState);
            project.readOnlyState = !!(req.session.user && req.session.user.readOnlyState);
            res.end(JSON.stringify(project));
        })
    } else {
        //console.log(projectId)
        errHandler(res, 500, 'error')
    }
}

projectRoute.updateShare = function (req, res) {

    var projectId = req.params.id
    var shareState = !!req.body.share
    var userId = req.session.user && req.session.user.id;

    if (projectId && projectId != '') {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'error')
            }
            //console.log(project)
            if (project && project.userId == userId) {
                //user own project
                var shareInfo = {}
                if (shareState) {
                    shareInfo = {
                        shared: true,
                        sharedKey: parseInt(Math.random() * 9000 + 1000)
                    }
                    var readOnlySharedKey
                    do {
                        readOnlySharedKey = parseInt(Math.random() * 9000 + 1000)
                    } while (readOnlySharedKey == shareInfo.shardKey)
                    shareInfo.readOnlySharedKey = readOnlySharedKey
                } else {
                    shareInfo = {
                        shared: false,
                        sharedKey: '',
                        readOnlySharedKey: ''
                    }
                }

                ProjectModel.updateShare(projectId, shareInfo, function (err, newProject) {
                    if (err) {
                        errHandler(res, 500, JSON.stringify(err))
                    } else {

                        res.end(JSON.stringify(shareInfo))
                    }
                })
            } else {
                errHandler(res, 500, 'forbidden')
            }
        })


    } else {
        //console.log(projectId)
        errHandler(res, 500, 'error')
    }
}


projectRoute.getShareInfo = function (req, res) {
    var projectId = req.params.id
    var userId = req.session.user && req.session.user.id;
    if (projectId && projectId != '') {

        ProjectModel.findById(projectId, function (err, _project) {
            if (err) {
                errHandler(res, 500, JSON.stringify(err))
            } else {
                if (userId == _project.userId) {
                    res.end(JSON.stringify({
                        own: true,
                        shared: _project.shared,
                        sharedKey: _project.sharedKey,
                        readOnlySharedKey: _project.readOnlySharedKey
                    }))
                } else {
                    res.end(JSON.stringify({
                        own: false,
                        shared: _project.shared,
                        sharedKey: '',
                        readOnlySharedKey: ''
                    }))
                }

            }
        })

    } else {
        //console.log(projectId)
        errHandler(res, 500, 'error')
    }

}

projectRoute.getBackupList = function (req, res) {
    var projectId = req.params.id
    if (projectId && projectId != '') {
        ProjectModel.findBackupsById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'error')
            }
            var backups = project.backups,
                backupList = [],
                item;
            if (backups) {
                for (var i = 0, il = backups.length; i < il; i++) {
                    item = {};

                    item.date = moment(backups[i].time).format("YYYY-MM-DD HH:mm");
                    // item.thumbnail = backups[i].thumbnail;
                    // console.log("backups[i].lastModifiedTime",backups[i].lastModifiedTime)
                    backupList.push(item);
                }
            }
            res.end(JSON.stringify(backupList));
        })
    } else {
        //console.log(projectId)
        errHandler(res, 500, 'error')
    }
}

projectRoute.createProject = function (req, res) {
    var data = _.cloneDeep(req.body)

    if (req.session.user) {
        //user exists
        data.userId = req.session.user.id;
        if (!data.template || data.template === 'defaultTemplate') {
            var newProject = new ProjectModel(data);
            newProject.save(function (err) {
                if (err) {
                    console.log('project save error', err);
                    //res.status(500).end('save error')
                    errHandler(res, 500, 'save error');
                }
                //create project directory
                var targetDir = path.join(__dirname, '../project/', String(newProject._id), 'resources');
                fse.ensureDir(targetDir, function (err) {
                    if (err) {
                        return errHandler(res, 500, JSON.stringify(err))
                    }
                    cpDefaultTemplates(newProject._id, function (err) {
                        if (err) {
                            return errHandler(res, 500, JSON.stringify(err))
                        }

                        res.end(JSON.stringify(getProjectInfo(newProject)))
                    });
                })

            })
        } else {
            //generate from template
            TemplateModel.findById(data.template, function (err, template) {
                if (err) {
                    errHandler(res, 500, 'find template err');
                }
                else if (!template) {
                    errHandler(res, 500, 'project is null');
                } else {
                    //console.log('find project');
                    var copyProject = copyProject = _.cloneDeep(data)

                    copyProject.thumbnail = _.cloneDeep(template.thumbnail);
                    copyProject.content = _.cloneDeep(template.content);


                    if (data.resolution != template.resolution) {
                        copyProject.content = saveAsReset(data.resolution, template.resolution, copyProject.content);
                    }

                    var newProject = new ProjectModel(copyProject);
                    var newId = newProject._id;
                    if (newProject.content) {
                        newProject.content = newProject.content.replace(/template\/[0-9a-f]+?\/resources/g, 'project/' + newId + '/resources');
                    }
                    newProject.save(function (err) {
                        if (err) {
                            errHandler(res, 500, 'save new project err')
                        } else {
                            //console.log('save new project success');
                            var targetDir = path.join(__dirname, '../project/', String(newProject._id));
                            var srcDir = path.join(__dirname, '../template/', data.template);
                            fse.ensureDir(targetDir, function (err) {
                                if (err) {
                                    console.log(err);
                                    errHandler(res, 500, 'ensureDir err');
                                } else {
                                    //console.log('make dir success');
                                    fse.copy(srcDir, targetDir, function (err) {
                                        if (err) {
                                            console.log(err);
                                            errHandler(res, 500, 'copy project folder err')
                                        } else {
                                            //console.log('copy dir success');
                                            res.end(JSON.stringify(getProjectInfo(newProject)))
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            })
        }

    } else {
        res.status(500).end('not login')
    }
}


function getProjectInfo(newProject) {
    var info = {};
    if (newProject.classId) {
        info.classId = newProject.classId;
    } else {
        info.classId = 'space';
    }
    info._id = newProject._id;
    info.userId = newProject.userId;
    info.resolution = newProject.resolution;
    info.name = newProject.name;
    info.thumbnail = newProject.thumbnail;
    info.template = newProject.template;
    info.createTime = moment(newProject.createTime).format('YYYY-MM-DD HH:mm');
    info.lastModifiedTime = moment(newProject.lastModifiedTime).format('YYYY-MM-DD HH:mm');
    info.supportTouch = newProject.supportTouch;
    info.author = newProject.author;
    return info
}


projectRoute.updateProject = function (req, res) {
    var newProject = req.body
    if (newProject._id) {
        ProjectModel.findById(newProject._id, function (err, project) {
            if (err) {
                //err
                console.log(err)
                res.end(err)
                return
            }
            if (project) {
                //update project
                for (var key in newProject) {
                    if (key != 'id') {
                        project[key] = newProject[key]
                    }
                }
                //resave
                project.save(function (err) {
                    if (err) {
                        console.log(err)
                        res.end('save error')
                        return
                    }
                    res.end('ok')
                })
            } else {
                //no project
                res.end('no project')
            }
        })
    } else {
        //no id
        res.end('error')
    }
}
var deleteFolderRecursive = function (_path) {
    var files = [];
    if (fs.existsSync(_path)) {
        files = fs.readdirSync(_path);
        files.forEach(function (file, index) {
            var curPath = path.join(_path, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(_path);
    }
};
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

projectRoute.deleteProject = function (req, res) {
    var projectId = req.body.projectId;
    //console.log(projectId)
    if (projectId) {
        //exitst
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
}

projectRoute.saveProject = function (req, res) {
    var projectId = req.params.id;
    if (projectId != "") {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'project error')
            } else {
                if (!project) {
                    errHandler(res, 500, 'project is null');
                } else {
                    checkAccessPriviledge(project, req.session.user || {}, function (err, access) {
                        if (err) {
                            errHandler(res, 500, JSON.stringify(err))
                        } else {
                            switch (access) {
                                case 'own':
                                case 'shareOK':
                                    var curProjectContent = req.body.project
                                    if (curProjectContent) {
                                        //backup last content
                                        var backups = project.backups || []
                                        if (backups.length >= 5) {
                                            backups.shift()
                                        }
                                        project.content = JSON.stringify(curProjectContent)
                                        backups.push({time: new Date(), content: project.content})
                                        project.save(function (err) {
                                            if (err) {
                                                console.log(err)
                                                errHandler(res, 500, 'project resave error')
                                            } else {
                                                res.end('ok');

                                                //delete other maskFiles , just keep one pic .
                                                if (curProjectContent.mask) {
                                                    var baseUrl = path.join(__dirname, '../project/', projectId, 'mask');
                                                    var mask = curProjectContent.mask.src.split("/");
                                                    var maskFile = mask[mask.length - 1];
                                                    fs.readdir(baseUrl, function (err, files) {
                                                        if (!err) {
                                                            files.forEach(function (fileName) {
                                                                if (fileName !== maskFile) {
                                                                    var url = path.join(baseUrl, fileName);
                                                                    fs.unlink(url, function () {
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    });
                                                }


                                                //delete files
                                                // var resourceList = curProjectContent.resourceList;
                                                var resourceList = []
                                                project.backups.forEach(function (backup) {
                                                    var c = JSON.parse(backup.content)
                                                    if (c) {
                                                        var curList = c.resourceList || []
                                                        resourceList = resourceList.concat(curList)
                                                    }
                                                })
                                                var resourceNames = resourceList.map(function (res) {
                                                    return res.id;
                                                })
                                                //console.log(resourceNames);
                                                var url = path.join(__dirname, '../project', projectId, 'resources');
                                                fs.readdir(url, function (err, files) {
                                                    if (err) {
                                                        console.log(err)
                                                    }
                                                    //console.log(files)
                                                    if (files && files.length) {

                                                        var diffResources = _.difference(files, resourceNames);
                                                        // console.log(diffResources)
                                                        // for (var i=0;i<diffResources.length;i++){
                                                        //     fs.unlink(path.join(url,diffResources[i]));
                                                        // }

                                                        //filter
                                                        diffResources.map(function (dFile) {
                                                            var dFilePath = path.join(url, dFile);
                                                            // console.log(dFilePath)
                                                            fs.stat(dFilePath, function (err, stats) {
                                                                // console.log(stats)
                                                                if (stats && stats.isFile()) {
                                                                    fs.unlink(dFilePath);
                                                                }
                                                            })
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        errHandler(res, 500, 'project save error')
                                    }
                                    break
                                default:
                                    errHandler(res, 500, 'forbidden to save')
                            }
                        }
                    })

                }

            }

        })
    } else {
        errHandler(res, 500, 'projectId error')
    }
};

projectRoute.saveProjectAs = function (req, res) {
    var projectId = req.params.id;
    var data = req.body;
    var userId = req.session.user && req.session.user.id;
    //console.log('receive request');
    if (req.session.user) {
        if (projectId != '') {
            ProjectModel.findById(projectId, function (err, project) {
                if (err) {
                    errHandler(res, 500, 'find project err');
                }
                else if (!project) {
                    errHandler(res, 500, 'project is null');
                } else {
                    //console.log('find project');
                    var copyProject = {};
                    copyProject.name = _.cloneDeep(project.name);
                    copyProject.userId = _.cloneDeep(userId);
                    copyProject.author = _.cloneDeep(project.author);
                    copyProject.resolution = _.cloneDeep(project.resolution);
                    copyProject.type = _.cloneDeep(project.type);
                    copyProject.template = _.cloneDeep(project.template);
                    copyProject.supportTouch = _.cloneDeep(project.supportTouch);
                    copyProject.curSize = _.cloneDeep(project.curSize);
                    copyProject.thumbnail = _.cloneDeep(project.thumbnail);
                    copyProject.content = _.cloneDeep(project.content);

                    copyProject.name = data.saveAsName ? (data.saveAsName) : (copyProject.name + "副本");
                    copyProject.author = data.saveAsAuthor ? (data.saveAsAuthor) : (copyProject.author);
                    //改变另存为分辨率 重新设置大小
                    if (data.saveAsResolution) {
                        copyProject.content = saveAsReset(data.saveAsResolution, copyProject.resolution, copyProject.content);
                        copyProject.resolution = data.saveAsResolution;
                    }

                    if (data.pullingRatio) {
                        copyProject.content = resolutionPulling(copyProject.content, data.pullingRatio);
                    }

                    var newProject = new ProjectModel(copyProject);
                    var newId = newProject._id;
                    if (newProject.content) {
                        newProject.content = newProject.content.replace(/project\/[\S]+?\/resources/g, 'project/' + newId + '/resources');
                    }
                    newProject.save(function (err) {
                        if (err) {
                            errHandler(res, 500, 'save new project err')
                        } else {
                            //console.log('save new project success');
                            var targetDir = path.join(__dirname, '../project/', String(newProject._id));
                            var srcDir = path.join(__dirname, '../project/', projectId);
                            fse.ensureDir(targetDir, function (err) {
                                if (err) {
                                    console.log(err);
                                    errHandler(res, 500, 'ensureDir err');
                                } else {
                                    //console.log('make dir success');
                                    fse.copy(srcDir, targetDir, function (err) {
                                        if (err) {
                                            console.log(err);
                                            errHandler(res, 500, 'copy project folder err')
                                        } else {
                                            //console.log('copy dir success');
                                            res.send('ok');
                                        }
                                    })
                                }
                            })
                        }
                    });
                }
            })
        }
    } else {
        res.status(500).end('not login')
    }

};

//另存为重新设置项目及其内部控件大小
function saveAsReset(newResolution, oldResolution, content) {
    var widthProportion = (newResolution.split("*")[0]) / (oldResolution.split("*")[0]);
    var heightProportion = (newResolution.split("*")[1]) / (oldResolution.split("*")[1]);
    var content = JSON.parse(content);
    for (var a in content.pages) {
        if (content.pages[a].layers) {
            for (var b in content.pages[a].layers) {
                var layerInfo = content.pages[a].layers[b].info;
                layerInfo.width = Math.round(layerInfo.width * widthProportion);
                layerInfo.height = Math.round(layerInfo.height * heightProportion);
                layerInfo.left = Math.round(layerInfo.left * widthProportion);
                layerInfo.top = Math.round(layerInfo.top * heightProportion);
                if (content.pages[a].layers[b].subLayers) {
                    for (var c in content.pages[a].layers[b].subLayers) {
                        for (var d in content.pages[a].layers[b].subLayers[c].widgets) {
                            var type = content.pages[a].layers[b].subLayers[c].widgets[d].type;
                            var widgetInfo = content.pages[a].layers[b].subLayers[c].widgets[d].info;

                            widgetInfo.width = Math.round(widgetInfo.width * widthProportion);
                            widgetInfo.height = Math.round(widgetInfo.height * heightProportion);
                            widgetInfo.left = Math.round(widgetInfo.left * widthProportion);
                            widgetInfo.top = Math.round(widgetInfo.top * heightProportion);
                            if (type == "MyButton" || type == 'MyTextArea') {
                                widgetInfo.fontSize = Math.round(widgetInfo.fontSize * widthProportion);
                            }
                            if (type == 'MyTexNum' || type == 'MyTexTime') {
                                widgetInfo.characterW = Math.round(widgetInfo.characterW * widthProportion);
                                widgetInfo.characterH = Math.round(widgetInfo.characterH * heightProportion);
                            }
                            //added by LH in 2017/12/20
                            if (type == 'MyTexTime') {
                                widgetInfo.characterW = Math.round(widgetInfo.characterW * widthProportion);
                                widgetInfo.characterH = Math.round(widgetInfo.characterH * heightProportion);
                            }
                            if (type == "MyDateTime" || type == 'MyNum') {
                                widgetInfo.fontSize = Math.round(widgetInfo.fontSize * widthProportion);
                                widgetInfo.maxFontWidth = Math.round(widgetInfo.maxFontWidth * widthProportion);
                                widgetInfo.spacing = Math.round((widgetInfo.spacing || 0) * widthProportion);
                            }
                            if (type == "MyDashboard") {
                                widgetInfo.pointerLength = Math.round(widgetInfo.pointerLength * widthProportion);
                            }

                        }
                    }
                }
                if (content.pages[a].layers[b].showSubLayer) {
                    for (var h in content.pages[a].layers[b].showSubLayer.widgets) {
                        var type1 = content.pages[a].layers[b].showSubLayer.widgets[h].type;
                        var showWidgetInfo = content.pages[a].layers[b].showSubLayer.widgets[h].info;

                        showWidgetInfo.width = Math.round(showWidgetInfo.width * widthProportion);
                        showWidgetInfo.height = Math.round(showWidgetInfo.height * heightProportion);
                        showWidgetInfo.left = Math.round(showWidgetInfo.left * widthProportion);
                        showWidgetInfo.top = Math.round(showWidgetInfo.top * heightProportion);
                        if (type1 == "MyButton" || type1 == 'MyTextArea') {
                            showWidgetInfo.fontSize = Math.round(showWidgetInfo.fontSize * widthProportion);
                        }
                        if (type1 == 'MyTexNum' || type == 'MyTexTime') {
                            showWidgetInfo.characterW = Math.round(showWidgetInfo.characterW * widthProportion);
                            showWidgetInfo.characterH = Math.round(showWidgetInfo.characterH * heightProportion);
                        }
                        if (type1 == "MyDateTime" || type1 == 'MyNum') {
                            showWidgetInfo.fontSize = Math.round(showWidgetInfo.fontSize * widthProportion);
                            showWidgetInfo.maxFontWidth = Math.round(showWidgetInfo.maxFontWidth * widthProportion);
                        }
                        if (type1 == "MyDashboard") {
                            showWidgetInfo.pointerLength = Math.round(showWidgetInfo.pointerLength * widthProportion);
                        }
                    }
                }
                //修改动画
                if (content.pages[a].layers[b].animations) {
                    for (var x in content.pages[a].layers[b].animations) {
                        var translate = content.pages[a].layers[b].animations[x].animationAttrs.translate;

                        translate.srcPos.x = Math.round(translate.srcPos.x * widthProportion);
                        translate.srcPos.y = Math.round(translate.srcPos.y * heightProportion);
                        translate.dstPos.x = Math.round(translate.dstPos.x * widthProportion);
                        translate.dstPos.y = Math.round(translate.dstPos.y * heightProportion);
                    }
                }
            }
        }
    }
    return JSON.stringify(content);
}

//控件拉伸 add by tang
function resolutionPulling(content, pullingRatio) {
    var newContent = JSON.parse(content);
    var widthRatio = pullingRatio.widthRatio;
    var heightRatio = pullingRatio.heightRatio;

    _.forEach(newContent.pages, function (page) {//page
        if (page.layers) {
            _.forEach(page.layers, function (layer) {//layer
                var layerInfo = layer.info;
                console.log(layerInfo.top, layerInfo.height);

                layerInfo.left += -Math.round((layerInfo.width * (widthRatio - 1)) / 2);
                layerInfo.top += -Math.round((layerInfo.height * (heightRatio - 1)) / 2);
                layerInfo.width = Math.round(layerInfo.width * widthRatio);
                layerInfo.height = Math.round(layerInfo.height * heightRatio);
                //console.log(layerInfo.left,layerInfo.width);
                console.log(layerInfo.top, layerInfo.height);

                if (layer.subLayers) {//sublayer
                    _.forEach(layer.subLayers, function (subLayer) {

                        if (subLayer.widgets) {//widget
                            _.forEach(subLayer.widgets, function (widget) {
                                var widgetInfo = widget.info;
                                widgetInfo.left += -Math.round((widgetInfo.width * (widthRatio - 1)) / 2);
                                widgetInfo.top += -Math.round((widgetInfo.height * (heightRatio - 1)) / 2);
                                widgetInfo.width = Math.round(widgetInfo.width * widthRatio);
                                widgetInfo.height = Math.round(widgetInfo.height * heightRatio);
                            })
                        }
                    })
                }

                if (layer.showSubLayer) {//show
                    _.forEach(layer.showSubLayer.widgets, function (widget) {
                        var widgetInfo = widget.info;
                        widgetInfo.left += -Math.round((widgetInfo.width * (widthRatio - 1)) / 2);
                        widgetInfo.top += -Math.round((widgetInfo.height * (heightRatio - 1)) / 2);
                        widgetInfo.width = Math.round(widgetInfo.width * widthRatio);
                        widgetInfo.height = Math.round(widgetInfo.height * heightRatio);
                    })
                }
            })
        }
    });

    return JSON.stringify(newContent);
}

projectRoute.saveThumbnail = function (req, res) {
    var projectId = req.params.id;
    if (projectId != "") {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'project error')
            } else {
                if (!project) {
                    errHandler(res, 500, 'project is null');
                } else {
                    var thumbnail = req.body.thumbnail;
                    if (!!thumbnail) {
                        project.thumbnail = thumbnail;
                        //console.log('thumbnail',thumbnail)
                        project.save(function (err) {
                            if (err) {
                                errHandler(res, 500, 'project resave error')
                            } else {
                                res.end('ok')
                            }
                        })
                    } else {
                        errHandler(res, 500, 'project save error')
                    }
                }
            }
        })
    } else {
        errHandler(res, 500, 'projectId error');
    }
}


projectRoute.generateProject = function (req, res) {
    var projectId = req.params.id;
    var dataStructure = req.body.dataStructure;
    if (projectId != "") {
        var ProjectBaseUrl = path.join(__dirname, '../project', String(projectId));
        var DataFileUrl = path.join(ProjectBaseUrl, 'resources', 'data.json');
        //trans all widgets
        var allWidgets = [];
        for (var i = 0; i < dataStructure.pageList.length; i++) {
            var curPage = dataStructure.pageList[i];
            for (var j = 0; j < curPage.canvasList.length; j++) {
                var curCanvas = curPage.canvasList[j];
                for (var k = 0; k < curCanvas.subCanvasList.length; k++) {
                    var curSubCanvas = curCanvas.subCanvasList[k];
                    for (var l = 0; l < curSubCanvas.widgetList.length; l++) {
                        allWidgets.push(curSubCanvas.widgetList[l]);
                    }
                }
            }
        }
        var totalNum = allWidgets.length;
        if (totalNum > 0) {
            var okFlag = true;
            var cb = function (err) {
                if (err) {
                    okFlag = false;
                    errHandler(res, 500, 'generate error');
                } else {
                    totalNum -= 1;
                    if (totalNum <= 0) {
                        if (okFlag) {
                            //ok
                            console.log('trans finished');
                            fs.writeFile(DataFileUrl, JSON.stringify(dataStructure, null, 4), function (err) {
                                if (err) {
                                    errHandler(res, 500, err);
                                } else {
                                    //write ok
                                    console.log('write ok');
                                    // var zip = new nodejszip();
                                    // var SrcUrl = path.join(ProjectBaseUrl,'resources');
                                    // var DistUrl = path.join(ProjectBaseUrl,'file.zip');
                                    // try {
                                    //     zip.compress(DistUrl, SrcUrl, ['-rj'], function (err) {
                                    //         if (err) {
                                    //             errHandler(res, 500, err);
                                    //         } else {
                                    //             res.end('ok')
                                    //
                                    //         }
                                    //     })
                                    // }catch (err){
                                    //     errHandler(res, 500, err);
                                    // }

                                    //using myzip
                                    var SrcUrl = path.join(ProjectBaseUrl, 'resources');
                                    var DistUrl = path.join(ProjectBaseUrl, 'file.zip');

                                }
                            })
                        }
                    }
                }
            }.bind(this);
            // var fonts = {'Songti':new Font('Songti',this.fontFile('Songti.ttc'))};
            //init fonts
            // console.log(dataStructure.resourceList);
            var fontRes = dataStructure.resourceList.filter(isFont);
            var customFonts = {};
            var resBaseUrl = path.join(ProjectBaseUrl, 'resources');
            for (i = 0; i < fontRes.length; i++) {
                var curFont = fontRes[i];
                customFonts[curFont.name] = fontFile(curFont.name, resBaseUrl, curFont.id);
            }
            console.log(customFonts)
            var renderer = new Renderer(null, customFonts);
            for (var m = 0; m < allWidgets.length; m++) {
                var curWidget = allWidgets[m];
                renderer.renderWidget(curWidget, path.join(__dirname, '..'), path.join(ProjectBaseUrl, 'resources'), path.join('project', String(projectId), 'resources'), cb);
            }
        } else {
            fs.writeFile(DataFileUrl, JSON.stringify(dataStructure, null, 4), function (err) {
                if (err) {
                    errHandler(res, 500, err);
                } else {
                    //write ok
                    console.log('write ok');
                    var SrcUrl = path.join(ProjectBaseUrl, 'resources');
                    var DistUrl = path.join(ProjectBaseUrl, 'file.zip');
                    MyZip.zipDir(SrcUrl, DistUrl, function (err) {
                        if (err) {
                            errHandler(res, 500, err);
                        } else {
                            res.end('ok')
                        }
                    })

                }
            })
        }

    } else {
        errHandler(res, 500, 'projectId error');
    }
}

projectRoute.generateLocalProject = function (req, res) {
    var projectId = req.params.id;
    if (projectId && projectId != '') {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'project model err!');
            } else {
                //generate local project json
                var filePath = path.join(__dirname, '../project/', projectId, 'project.json');
                var tempPro = {};
                tempPro.name = project.name;
                tempPro.author = project.author;
                tempPro.template = project.template;
                tempPro.supportTouch = project.supportTouch;
                tempPro.resolution = project.resolution;
                tempPro._id = project._id;
                tempPro.createTime = new Date().toLocaleString();
                tempPro.lastModifiedTime = new Date().toLocaleString();
                //check and change resource url
                var transformSrc = function (key, value) {
                    //console.log('key');
                    if (key == 'src' || key == 'imgSrc' || key == 'backgroundImage' || key == 'backgroundImg') {
                        if (typeof(value) == 'string' && value != '') {
                            try {
                                if (value.indexOf('http') == -1) {
                                    value = value.replace('/project', '../../localproject');
                                    value = value.replace(/\//g, "\\");
                                    //console.log('value',value);
                                    return value
                                } else {
                                    var arr = value.split('/');
                                    arr[0] = 'chrome-extension:';
                                    arr[2] = 'ide.graphichina.com';
                                    arr[3] = 'localproject';
                                    value = arr.join('/');
                                    return value;
                                }
                            } catch (e) {
                                console.log(e);
                                return value;
                            }
                        } else {
                            return value;
                        }
                    }
                    return value;
                };
                try {
                    var contentObj = JSON.parse(project.content);
                    contentNewJSON = JSON.stringify(contentObj, transformSrc);
                    tempPro.content = contentNewJSON;
                    fs.writeFileSync(filePath, JSON.stringify(tempPro, null));
                    //generate localpro zip
                    var zipName = '/' + projectId + '.zip';
                    var targetUrl = path.join(__dirname, '../project/', projectId, zipName);
                    var srcResourcesFolderUrl = path.join(__dirname, '../project/', projectId, 'resources/');
                    var srcMaskFolderUrl = path.join(__dirname, '../project/', projectId, 'mask/');
                    var srcJsonUrl = path.join(__dirname, '../project/', projectId, '/project.json');
                    var output = fs.createWriteStream(targetUrl);
                    var archive = archiver('zip', {
                        store: true
                    });
                    output.on('close', function () {
                        console.log(archive.pointer() + ' total bytes');
                        res.end('ok');
                    });
                    archive.on('error', function (err) {
                        console.log('error', err);
                        throw err;
                    });
                    archive.pipe(output);
                    archive.directory(srcResourcesFolderUrl, '/resources');

                    if (contentObj.mask) {
                        archive.directory(srcMaskFolderUrl, '/mask');
                    }

                    archive.file(srcJsonUrl, {name: 'project.json'});
                    archive.finalize();
                } catch (e) {
                    console.log(e);
                    errHandler(res, 500, 'err');
                }

            }
        })
    } else {
        errHandler(res, 500, 'err');
    }
}

projectRoute.downloadLocalProject = function (req, res) {
    var projectId = req.params.id;
    if (projectId != '') {
        var zipName = String(projectId) + '.zip';
        var ProjectBaseUrl = path.join(__dirname, '../project', String(projectId));
        var DistUrl = path.join(ProjectBaseUrl, zipName);
        res.download(DistUrl, zipName, function (err) {
            if (err) {
                errHandler(res, 500, err);
            } else {
                res.end('ok');
            }
        })
    } else {
        errHandler(res, 500, 'projectId is null');
    }
}

projectRoute.saveDataAndCompress = function (req, res) {
    var projectId = req.params.id;
    var dataStructure = req.body.dataStructure;
    if (projectId != "") {
        var ProjectBaseUrl = path.join(__dirname, '../project', String(projectId));
        var DataFileUrl = path.join(ProjectBaseUrl, 'resources', 'data.json');
        dataStructure.generateTime = moment().format("YYYY-MM-DD HH:mm:ss")
        fs.writeFile(DataFileUrl, JSON.stringify(dataStructure, null, 4), function (err) {
            if (err) {
                errHandler(res, 500, err);
            } else {
                //console.log('compress');
                var SrcUrl = path.join(ProjectBaseUrl, 'resources');
                var DistUrl = path.join(ProjectBaseUrl, 'file.zip');
                //MyZip.zipDir(SrcUrl,DistUrl,function (err) {
                //    if (err) {
                //        errHandler(res, 500, err);
                //    } else {
                //        res.end('ok')
                //
                //    }
                //})
                var output = fse.createWriteStream(DistUrl);
                var archive = archiver('zip');

                output.on('close', function () {
                    //console.log(archive.pointer()+"total bytes",'relese new updfiles success');
                    //编辑Log文件并返回响应
                    res.end('ok')

                });
                archive.on('error', function (err) {
                    errHandler(res, 500, 'package folder err');
                });

                archive.pipe(output);
                archive.directory(SrcUrl, '/');
                archive.finalize();
            }
        })
    } else {
        errHandler(res, 500, 'projectId error');
    }
};


//add hash function
function createHashForFile(fileUrl, algo, cb) {
    var algo = algo || 'md5'
    var hash = crypto.createHash(algo),
        stream = fs.createReadStream(fileUrl);

    stream.on('data', function (data) {
        hash.update(data, 'utf8')
    })

    stream.on('error', function (err) {
        cb && cb(err)
    })
    stream.on('end', function () {
        cb && cb(null, hash.digest('hex'))
    })
}

function isFont(font) {
    var names = font.src.split('.');
    var ext = names[names.length - 1];
    if (ext === 'ttf' || ext === 'woff') {
        return true;
    } else {
        return false;
    }
}

function fontFile(name, baseUrl, id) {
    // var fonts = {'Songti':new Font('Songti',this.fontFile('Songti.ttc'))};
    return new Font(name, path.join(baseUrl, id));
    // return path.join(baseUrl,id);
}


//cp templates
function cpTemplates(templateName, newProjectId, cb) {
    if (templateName) {
        if (templateName === 'defaultTemplate') {
            cpDefaultTemplates(newProjectId, cb)
        } else {
            //custom template
            var srcDir = path.join(__dirname, '../template/', String(templateName), 'resources')
            var dstDir = path.join(__dirname, '../project/', String(newProjectId), 'resources');
            fse.copy(srcDir, dstDir, function (err) {
                if (err) {
                    console.log(err);
                    cb && cb(err);
                } else {
                    cb && cb();
                }
            })
        }
    } else {
        //no template
        cb && cb()
    }

}


//cp default templates
function cpDefaultTemplates(newProjectId, cb) {
    var templateName = 'defaultTemplate'
    var srcDir = path.join(__dirname, '../public/templates/', templateName, 'defaultResources');
    var dstDir = path.join(__dirname, '../project/', String(newProjectId), 'resources', 'template');
    fse.copy(srcDir, dstDir, function (err) {
        if (err) {
            console.log(err);
            cb && cb(err);
        } else {
            cb && cb();
        }
    })
}


projectRoute.downloadProject = function (req, res) {
    var projectId = req.params.id;
    var shouldCalHash = !!req.query.hash
    if (projectId != "") {
        var ProjectBaseUrl = path.join(__dirname, '../project', String(projectId));
        var DistUrl = path.join(ProjectBaseUrl, 'file.zip');

        if (shouldCalHash) {
            //create hash
            createHashForFile(DistUrl, null, function (err, hash) {
                if (err) {
                    errHandler(res, 500, 'create hash error');
                } else {
                    res.download(DistUrl, 'file_' + hash + '.zip', function (err) {
                        if (err) {
                            errHandler(res, 500, err);
                        } else {
                            //res.end('ok');
                        }
                    })
                }
            })
        } else {
            res.download(DistUrl, 'file.zip', function (err) {
                if (err) {
                    errHandler(res, 500, err);
                } else {
                    //res.end('ok');
                }
            })
        }


    } else {
        errHandler(res, 500, 'projectId error');
    }
};

projectRoute.getUserType = function (req, res) {
    var projectId = req.params.id;
    if (projectId != "") {
        ProjectModel.findById(projectId, function (err, project) {
            if (err) {
                errHandler(res, 500, 'projectId error');
            } else {
                var userId = project.userId;
                UserModel.findById(userId, function (err, user) {
                    if (err) {
                        errHandler(res, 500, 'userId error');
                    } else {
                        var userType = user.type;
                        res.end(userType);
                    }
                });
            }
        });
    } else {
        errHandler(res, 500, 'projectId error');
    }
};

//下载资源
projectRoute.downloadFile = function (req,res) {
    var data = req.params.id;
    if(data!=''){
        data = JSON.parse(data);
        var projectId = data.projectId;
        var fileId = data.fileId;
        var fileOldName = data.fileName;

        if(projectId&&fileId){
            var fileUrl = path.join(__dirname,'../project',String(projectId),'resources',String(fileId));

            var formatName = fileId.substring(fileId.lastIndexOf('.'),fileId.length);
            var fileName = fileId.substring(0,fileId.lastIndexOf('.'));
            //文件名+(原始名)+格式名
            var newFile = fileName+'('+fileOldName+')'+formatName;

            res.download(fileUrl,newFile, function (err) {
                if (err){
                    errHandler(res,500,err);
                }else{

                }
            })
        }else{
            errHandler(res,500,'fileId error')
        }
    }else{
        errHandler(res,500,'fileId error')
    }


};


//分类操作 add by tang
projectRoute.createFolder = function (req, res) {
    var data = _.cloneDeep(req.body);
    data.userId = req.session.user.id;
    if (req.session.user) {
        var newFolder = new ClassModel(data);
        newFolder.save(function (err) {
            if (err) {
                console.log('folder save error', err);
                errHandler(res, 500, 'folder save error');
            } else {
                var folder = getFolderInfo(newFolder);
                res.end(JSON.stringify(folder))
            }
        })
    } else {
        res.status(500).end('not login')
    }
};

function getFolderInfo(newFolder) {
    var info = {};
    info._id = newFolder._id;
    info.name = newFolder.name;
    info.author = newFolder.author;
    info.createTime = moment(newFolder.createTime).format('YYYY-MM-DD HH:mm');
    info.lastModifiedTime = moment(newFolder.lastModifiedTime).format('YYYY-MM-DD HH:mm');
    return info;
}

projectRoute.updateFolder = function (req, res) {
    var newFolder = req.body;
    if (newFolder._id) {
        ClassModel.findById(newFolder._id, function (err, floder) {
            if (err) {
                console.log(err);
                res.end(err);
                return
            }
            if (floder) {
                for (var key in newFolder) {
                    if (key != 'id') {
                        floder[key] = newFolder[key];
                    }
                }
                floder.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.end('save error');
                        return
                    }
                    res.end('folder update')
                });
            } else {
                res.end('no folder')
            }
        })
    }
};
projectRoute.deleteFolder = function (req, res) {
    var folderId = req.body.folderId;
    var _user = req.session.user;
    if (folderId) {
        //删除分类
        ClassModel.deleteById(folderId, function (err) {
            if (err) {
                errHandler(res, 500, 'delete folder err')
            } else {
                //查找分类下的project
                ProjectModel.findProByClass(_user.id, folderId, function (err, projects) {
                    if (err) {
                        errHandler(res, 500, 'delete folder err')
                    } else {
                        if (projects != '') {
                            var proArr = _.cloneDeep(projects).map(function (project) {
                                return project._id;
                            });
                            //删除project
                            ProjectModel.deleteByClass(folderId, function (err) {
                                if (err) {
                                    errHandler(res, 500, 'delete folder err')
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
                        } else {
                            res.end('delete folder ok')
                        }
                    }
                });
            }
        })
    }

};
projectRoute.getFolderList = function (req, res) {
    var _user = req.session.user;
    if (_user) {
        ClassModel.findFolderByUser(_user.id, function (err, folders) {
            if (err) {
                console.log(err);
                res.end('find error');
            } else {
                var classList = _.cloneDeep(folders).map(function (folder) {
                    var info = {};
                    info.id = folder._id;
                    info.name = folder.name;
                    return {
                        classInfo: info
                    }
                });
                res.end(JSON.stringify(classList));
            }
        })
    } else {
        res.status(500).end('not login')
    }
};

module.exports = projectRoute;
