var UpdateLogRoute = {};

UpdateLogRoute.getLogIndex = function (req,res){
    res.render('updateLog/index.html')
};

UpdateLogRoute.releaseUpdateLog = function(req,res){
    res.render('updateLog/release.html')
};

UpdateLogRoute.changeUpdateLog = function(req,res){
    res.render('change')
};

UpdateLogRoute.getLogEditIndex = function(req,res){
    res.render('edit')
};

UpdateLogRoute.deleteUpdateLog = function(req,res){
    res.render('delete')
};



module.exports = UpdateLogRoute;
