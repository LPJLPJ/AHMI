/**
 * Created by ChangeCheng on 2016/11/11.
 */
var UserModel = require('../db/models/UserModel');
var errHandler = require('../utils/errHandler');
var fse = require('fs-extra');
var path = require('path');
var archiver = require('archiver');

var Route_admin = {};
Route_admin.getLogin = function(req, res){
    res.render('login/adminLogin.html')

};

Route_admin.postLogin = function (req,res) {
    
};

Route_admin.getManageSpace = function (req,res) {
    res.render('login/manageSpace.html',{userName:req.session.user.username});
};
Route_admin.getReleaseVerSpace = function(req,res){
    res.render('login/releaseVerSpace.html',{userName:req.session.user.username});
};

Route_admin.getUsers = function (req, res) {
    var from = parseInt(req.query.from)||0;
    var limit = parseInt(req.query.limit)||0;
    var data = {};
    if((typeof(req.query.searchStr)=="string")&&(req.query.searchStr!=="")){
        //search user
        var searchStr = req.query.searchStr;
        UserModel.fetchFuzzy(searchStr,function(err,users){
            if(err){
                errHandler(res,500,'fetch user')
            }else{
                var count = users.length;
                var limitUsers = users.slice(from,from+limit);
                data = {
                    users:limitUsers,
                    count:count
                };
                res.end(JSON.stringify(data));
            }
        })
    }else{
        //all user
        UserModel.fetchBatch(from,limit,function (err,users) {
            if (err){
                errHandler(res,500,'fetchBatch user')
            }else{
                users.forEach(function (user) {
                    user.password = null;
                });
                UserModel.count({},function(err,count){
                    if(err){
                        errHandler(err,500,'conut');
                    }else{
                        data={
                            users:users,
                            count:count
                        };
                        res.end(JSON.stringify(data));
                    }
                })            
            }
        })
    }
};


Route_admin.changeUserType = function (req, res) {
    var userId = req.body.userId;
    var type = req.body.type;
    UserModel.findById(userId,function (err, user) {
        if (err || !user){
            console.log(err,user)
            errHandler(res,500,err)
        }else{
            user.type = type;
            user.save(function (err) {
                if (err){
                    errHandler(res,500,"error saving user type");
                }else{
                    res.end('ok');
                }
            })
        }
    })
};

//获取更新信息
Route_admin.getReleaseInfo = function(req,res){
    var logPath = path.join(__dirname,'../release','update','log.json');
    var from = parseInt(req.query.from)||0;
    var limit = parseInt(req.query.limit)||0;
    if(!fse.existsSync(logPath)){
        var tempArr = [];
        fse.writeFile(logPath,JSON.stringify(tempArr),function(err){
            if(err){
                errHandler(res,500,'create log.json err');
            }else{
                 fse.readFile(logPath,'utf-8',function(err,data){
                    if(err){
                        errHandler(res,500,'read release log.json');
                    }else{
                        var infoArr = JSON.parse(data).slice(from,from+limit);
                        var count = JSON.parse(data).length;
                        var tempData = {
                            data:infoArr,
                            count:count
                        };
                        res.send(JSON.stringify(tempData));
                    }
                })               
            }
        })
    }else{
        fse.readFile(logPath,'utf-8',function(err,data){
            if(err){
                errHandler(res,500,'read release log.json');
            }else{
                var infoArr = JSON.parse(data).slice(from,from+limit);
                var count = JSON.parse(data).length;
                var tempData = {
                    data:infoArr,
                    count:count
                };
                res.send(JSON.stringify(tempData));
            }
        })        
    }

};

//生成更新文件,并生成新的完全版本地版压缩包，目前一并完成
Route_admin.releaseUpdate = function(req,res){
    var data = req.body;
    var selectPublic = req.body.selectPublic;
    var selectViews = req.body.selectViews;
    var limit = req.body.limit;
    var updateFolderPath = path.join(__dirname,'../release','update');
    var tempFolderPath = path.join(updateFolderPath,'tempFolder');
    var tempPublicFolderPath = path.join(tempFolderPath,'public');
    var tempViewsFolderPath = path.join(tempFolderPath,'views');
    var publicFolderPath = path.join(__dirname,'../public');
    var viewsFolderPath = path.join(__dirname,'../views');
    var manifestPath = path.join(__dirname,'../manifest.json');
    var completeIDENWFolderPath = path.join(__dirname,'../release','complete','IDENW','package.nw');

    //public文件夹过滤函数
    var filterFunForPub = function(src){
        var blogPattern = /public[\\\/]blog/;
        var downloadPattern = /public[\\\/]download/;
        var srcJSPattern = /public[\\\/]ide[\\\/]modules[\\\/]ide[\\\/]js/;
        return !(blogPattern.test(src)||srcJSPattern.test(src)||downloadPattern.test(src));
    }
    //views文件夹过滤函数
    var filterFunForViews = function(src){
        var blogPattern = /views[\\\/]blog/;
        var downloadPattern = /public[\\\/]download/;
        return !(blogPattern.test(src)||downloadPattern.test(src));
    };
    //打包更新包
    var zipDistFiles = function(){
        var targetZipPath = path.join(updateFolderPath,'updFiles.zip');
        var output = fse.createWriteStream(targetZipPath);
        var archive = archiver('zip',{store:true});
        output.on('close',function(){
            console.log(archive.pointer()+"total bytes",'relese new updfiles success');
            //将文件拷贝至complete文件夹并打包新的完全版
            copyToCompleteAndZip();
        });
        archive.on('error',function(err){
            errHandler(res,500,'package folder err');
        });
        archive.pipe(output);
        if(selectPublic==="true"){
            archive.directory(tempPublicFolderPath,'/public');
        }
        if(selectViews==="true"){
            archive.directory(tempViewsFolderPath,'/views');
        }
        archive.file(manifestPath,{name:'manifest.json'});
        archive.finalize();
    };

    //将文件拷贝至complete文件夹并打包新的完全版
    function copyToCompleteAndZip(){
        fse.copy(tempFolderPath,completeIDENWFolderPath,function(err){
            if(err){
                errHandler(res,500,'err in copy files to complete');
            }else{
                fse.copy(manifestPath,path.join(completeIDENWFolderPath,'manifest.json'),function(err){
                    if(err){
                        console.log('err',err);
                        errHandler(res,500,'err in copy manifest to complete');
                    }else{
                        var targetZipPath = path.join(__dirname,'../release','complete','localIDE.zip');
                        var output = fse.createWriteStream(targetZipPath);
                        var archive = archiver('zip');
                        output.on('close',function(){
                            console.log(archive.pointer()+"total bytes",'relese new updfiles success');
                            //编辑Log文件并返回响应
                            editLogAndRes();
                        });
                        archive.on('error',function(err){
                            errHandler(res,500,'package folder err');
                        });
                        archive.pipe(output);
                        archive.directory(path.join(__dirname,'../release','complete','IDENW'),'/IDENW');
                        archive.finalize();
                    }
                })
            }
        })
    }

    //编辑Log文件并返回响应
    function editLogAndRes(){
        //编辑log.json
        var logPath = path.join(updateFolderPath,'log.json');
        var tempLogFile = require(logPath);
        var manifest = require(manifestPath);
        var newLog = {};
        var dateNow = new Date();
        newLog.version = manifest.version;
        newLog.releaseDate = String(dateNow.getFullYear())+'-'+String(dateNow.getMonth()+1)+'-'+String(dateNow.getDate());
        newLog.admin = req.session.user.username;
        newLog.description = data.description;
        tempLogFile.unshift(newLog);
        fse.writeFile(logPath,JSON.stringify(tempLogFile),function(err){
            if(err){
                errHandler(res,500,'write logFile err');
            }else{
                var infoArr = tempLogFile.slice(0,limit);
                var tempData = {
                    data:infoArr,
                    count:tempLogFile.length
                };
                res.send(JSON.stringify(tempData));
            }
        })
    }

    /**
     * 文件对象构造函数
     * @param {string} src    源地址
     * @param {string} dst    目标地址
     * @param {function} filter 过滤函数
     * @param {string} type   文件夹类型/public or views
     */
    function FileObj(src,dst,filter,type){
        this.srcPath = src;
        this.dstPath = dst;
        this.filter = filter;
        this.type = type;
    }
    var files = [];
    if(selectPublic==='true'){
        files.push(new FileObj(publicFolderPath,tempPublicFolderPath,filterFunForPub,'public'));
    }
    if(selectViews==='true'){
        files.push(new FileObj(viewsFolderPath,tempViewsFolderPath,filterFunForViews,'views'));
    }
    fse.emptyDir(tempFolderPath,function(err){
        if(err){
            errHandler(res,500,'release temp folder empty err');
        }else{
            function copyFiles(){
                if(files.length===0){
                    zipDistFiles();
                    return;
                }
                var file = files.shift();
                fse.copy(file.srcPath,file.dstPath,{filter:file.filter},function(err){
                    if(err){
                        errHandler(res,500,'copy folder err'+file.type);
                    }else{
                        if(file.type==='views'){
                            //修改psersonalProject.html文件 删除ejs语句
                            var targetHtmlPath = path.join(tempViewsFolderPath,'login','personalProject.html');
                            var editHtmlStr = editPersonalProjectHtml(targetHtmlPath);
                            fse.writeFile(targetHtmlPath,editHtmlStr,function(err){
                                if(err){
                                    console.log('err',err);
                                    errHandler(res,500,'edit personalProject.html err');
                                    return;
                                }else{
                                    //递归
                                    copyFiles();
                                }
                            })
                        }else{
                            //递归
                            copyFiles();
                        }
                    }
                })
            }
            //执行copyFiles
            copyFiles();
        }
    })
};

/**
 * 重新编辑personalProject.html 的内容，删除ejs语句
 * @param  {string} url 文件的url
 * @return {[type]}     [description]
 */
function editPersonalProjectHtml(url){
    var htmlStr = fse.readFileSync(url,'utf-8');
    var pattern = /<!--\s*webProFlag\s*-->[\s\S]+?<!--\s*webProFlag_end\s*-->/g;
    var machesStr = htmlStr.replace(pattern,'');
    return machesStr;
}

/**
 * 编辑更新日志文件
 * @param  {string} url 日志文件的地址
 * @return {[type]}     [description]
 */
function editUpdateLog(url){

}

module.exports = Route_admin;