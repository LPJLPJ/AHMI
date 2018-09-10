var UserModel = require('../db/models/UserModel');
var UpdateLogModel = require('../db/models/UpdateLogModel');
var moment = require('moment');

var UpdateLogRoute = {};

UpdateLogRoute.getLogIndex = function (req,res){
    var pageOn = req.query.page?req.query.page:1;
    pageOn = parseInt(pageOn);

    UpdateLogModel.count(function(err,count){
        if(err){
            console.log(err)
        }else{
            //分页显示，显示5个页码，每页10条数据
            UpdateLogModel.findByPage(pageOn,function(err,data){
                var pageTotal = Math.ceil(count/2);
                var pageStart,pageEnd;

                if(pageTotal<=5){
                    pageStart = 1;
                    pageEnd = pageTotal;
                }else if((pageOn+2)<=pageTotal){
                    if((pageOn-2)>0){
                        pageStart = pageOn - 2;
                        pageEnd = pageOn + 2;
                    }else{
                        pageStart = 1;
                        pageEnd = 5;
                    }
                }else{
                    pageStart = pageTotal - 4;
                    pageEnd = pageTotal;
                }
                var page ={
                    total:pageTotal,
                    prev:pageOn==1?pageTotal:pageOn-1,
                    next:pageOn==pageTotal?pageTotal:pageOn+1,
                    now:pageOn,
                    start:pageStart,
                    end:pageEnd
                };

                var logData = data.map(function(log){
                    var logItem = {};
                    logItem.author = log.author;
                    logItem.title = log.title;
                    logItem.explain = log.explain;
                    logItem.content = log.content.map(function(item){
                        return JSON.parse(item)
                    });
                    logItem.createTime = moment(log.createTime).format('YYYY年MM月DD日 HH时mm分');
                    return logItem;
                });
                res.render('updateLog/index.html',{logData:logData,page:page})
            })
        }
    });
};

UpdateLogRoute.releaseUpdateLog = function(req,res){
    res.render('updateLog/release.html')
};

UpdateLogRoute.saveUpdateLog = function(req,res){
    var data = req.body;
    var logData = {};
    logData.userId = req.session.user.id;
    logData.author = req.session.user.username;
    logData.title = data.title;
    logData.explain = data.explain;
    logData.content = data.content;
    var newLog = new UpdateLogModel(logData);
    newLog.save(function(err){
        if(err){
            console.log('update log save error', err);
            errHandler(res, 500, 'update log save error');
        }else{
            res.end('ok');
        }
    });
};

UpdateLogRoute.getLogEditIndex = function(req,res){
    UpdateLogModel.fetch(function(err,data){
        if(err){
            errHandler(res, 500, 'update log not find');
        }else{
            var logData = data.map(function(log){
                var logItem = {};
                logItem.id = log._id;
                logItem.author = log.author;
                logItem.title = log.title;
                logItem.explain = log.explain;
                logItem.content = log.content.map(function(item){
                    return JSON.parse(item)
                });
                logItem.createTime = moment(log.createTime).format('YYYY年MM月DD日 HH时mm分');
                return logItem;
            });
            res.render('updateLog/manage.html',{logData:logData})
        }
    });
};

UpdateLogRoute.deleteUpdateLog = function(req,res){
    var logId = req.body.logId;
    UpdateLogModel.deleteById(logId,function(err){
        if(err){
            errHandler(res, 500, 'update log delete error');
        }else{
            res.end('ok')
        }
    })
};

UpdateLogRoute.editUpdateLog = function(req,res){
    var logId = req.query.id;
    UpdateLogModel.findById(logId,function(err,data){
        if(err){
            errHandler(res, 500, 'find log error');
        }else{
            var logData = {};
            logData.id = data._id;
            logData.author = data.author;
            logData.title = data.title;
            logData.explain = data.explain;
            logData.content = data.content.map(function(item){
                return JSON.parse(item)
            });
            logData.createTime = moment(data.createTime).format('YYYY年MM月DD日 HH时mm分');

            res.render('updateLog/edit.html',{logData:logData});
        }
    });
};

UpdateLogRoute.saveEditLog = function(req,res){
    var data = req.body.logData;
    UpdateLogModel.findById(data.id,function(err,log){
        if(err){
            errHandler(res, 500, 'find log error');
        }else{
            if(log){
                for(var key in data){
                    if(key!='id'){
                        log[key] = data[key];
                    }
                }
                log.save(function(err){
                    if(err){
                        errHandler(res, 500, 'log edit save error');
                    }{
                        res.end('ok');
                    }
                })
            }else{
                res.end('no log')
            }
        }
    })
};

UpdateLogRoute.getLogByPage = function(req,res){
    var data = req.query.page;
    console.log(data);
};



module.exports = UpdateLogRoute;
