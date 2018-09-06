var UserModel = require('../db/models/UserModel');
var UpdateLogModel = require('../db/models/UpdateLogModel');
var moment = require('moment');

var UpdateLogRoute = {};

UpdateLogRoute.getLogIndex = function (req,res){
    UpdateLogModel.fetch(function(err,data){
        if(err){
            errHandler(res, 500, 'update log not find');
        }else{
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
            res.render('updateLog/index.html',{logData:logData})
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



module.exports = UpdateLogRoute;
