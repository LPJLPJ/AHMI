var UpdateLogRoute = {};

UpdateLogRoute.getLogIndex = function (req,res){
    res.render('updateLog/index.html')
};

UpdateLogRoute.releaseUpdateLog = function(req,res){
    res.render('updateLog/release.html')
};

UpdateLogRoute.saveUpdateLog = function(req,res){
    var data = req.body;
    console.log(data);
    res.end('ok');
};

UpdateLogRoute.getLogEditIndex = function(req,res){
};

UpdateLogRoute.deleteUpdateLog = function(req,res){
};



module.exports = UpdateLogRoute;
