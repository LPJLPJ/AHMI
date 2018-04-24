var path = require('path');
var fse = require('fs-extra');
var errHandler = require('../utils/errHandler')
var tag = {};
var titleMap = {
    default:'预设',
    default1:'主题1',
    default2:'主题2',
    default3:'主题3',
    default4:'主题4'
};

tag.getDefault = function(req,res){
    var query = req.query;
    var id = query&&query.id;
    if(!!id){
        var filesPath = 'public/ide/modules/tagConfig/template/tags.'+id+'.json';
        fse.readFile(filesPath,function(err,file){
            if(err){
                errHandler(res,500,err)
            }else{
                try{
                    var result = JSON.parse(file);
                    var title = titleMap[id];

                    res.render('ide/tagsPreview',{tags:result,title:title})
                }
                catch(e){
                    console.log(e);
                }
            }

        });
    }else{
        errHandler(res,500,'sorry,not found tags')
    }

};

module.exports = tag;