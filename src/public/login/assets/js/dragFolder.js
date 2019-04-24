/**
 * Created by lixiang on 2017/3/30.
 */
(function(){
    var local = false;
    var fs,path,__dirname
    try {
        var os = require('os');
        if (os){
            local = true;
            fs = require('fs')
            path = require('path')
            __dirname = global.__dirname
            //console.log('os',os);
        }
    }catch (e){

    }
    var formData = new FormData();
    var localDirDataUrls = []
    var project;
    if(window.File&&window.FileList&&window.FileReader){
        console.log('support File API congratulations!!');
        init();
    }
    function init(){
        $('body').on('dragstart',function(){return false});
        var filedrag = document.getElementById('filedrag');
        filedrag.addEventListener('dragover', FileDragHover, false);
        filedrag.addEventListener('dragleave',FileDragHover,false);
        filedrag.addEventListener('drop',FileDrop,false);
        //add event to confirm button
        var confirmReleaseBtnNode = $("#confirmReleaseBtn");
        confirmReleaseBtnNode.off('click');
        confirmReleaseBtnNode.on('click',function(e){
            $('#uploadModal').modal('hide');
            var titleText = $('#uploadModal .modal-title').text();
            if(titleText==='上传本地工程'){
                //upload
                if(local){
                    sendFilesLocal(hideWrapper)
                }else{
                    sendFiles(hideWrapper);
                }
                
            }else if(titleText==='上传压缩包'){
                sendProjectZip();
            }
        });
        var cancelReleaseBtnNode = $('#cancelReleaseBtn');
        cancelReleaseBtnNode.off('click');
        cancelReleaseBtnNode.on('click',function(e){
            formData = new FormData();
            project = null;
            hideWrapper();
        });
    }

    function FileDragHover(e){
        //终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。
        e.stopPropagation();
        //取消事件的默认动作。
        e.preventDefault();
        //修改鼠标滑过的样式
        filedrag.className = (e.type=='dragover'?'hover':'');
    }

    function FileDrop(e){
        //取消事件的默认动作。
        e.preventDefault();
        //取消鼠标滑过的样式
        filedrag.className = '';

        var items,
            item;
        if(local){
            console.log(e)
            //本地版不支持拖拽上传工程zip
            //遮挡现有工程，显示：正在预处理工程...
            showWrapper();
            //初始化当前更新状态信息
            changeUpdateState('正在预处理工程...',100);
            if(isDropFileIsFolder(e)){
                //上传文件夹
                items = e.dataTransfer.items;
                for(var i=0;i<items.length;i++){
                    //webkitGetAsEntry is the key point
                    item = items[i].webkitGetAsEntry();
                    if(item){
                        var fcb = function(){//失败
                            hideWrapper();//隐藏遮挡层（显示：正在预处理工程...）
                            toastr.error('不合法的工程');
                            legal = false;
                        };
                        var scb = function(item){//成功
                            traverseFileTreeLocal(item);//遍历文件夹，进行预处理
                            setTimeout(function(){//模态框
                                //hideWrapper();
                                $('#uploadModal .modal-title').text('上传本地工程');
                                $('#uploadModal .modal-body p').text('合法的本地工程，确定上传？');
                                $('#uploadModal').modal({backdrop:'static',keyboard:false});
                            },500);
                        };
                        // console.log('item',item);
                        readJSONFile(item,scb,fcb);
                    }
                }
            }
        }else{
            //遮挡现有工程，显示：正在预处理工程...
            showWrapper();
            //初始化当前更新状态信息
            changeUpdateState('正在预处理工程...',100);
            if(!isDropFileIsFolder(e)){
                if(isDropFileIsZip(e)){//上传压缩包
                    console.log('生成的压缩包');
                    items = e.dataTransfer.items;
                    item = items[0].webkitGetAsEntry();
                    item.file(function(file){
                        formData.append('file.zip',file);
                        setTimeout(function(){
                            $('#uploadModal .modal-title').text('上传压缩包');
                            $('#uploadModal .modal-body p').text('此为生成的压缩文件，尝试从此文件恢复工程不保证所恢复工程完整性，确定上传？')
                            $('#uploadModal').modal({backdrop:'static',keyboard:false});
                        },500);
                        // sendProjectZip();
                    });
                }else{
                    hideWrapper();
                    toastr.error('不合法的工程');
                }
            }else{//上传文件夹
                items = e.dataTransfer.items;
                for(var i=0;i<items.length;i++){
                    //webkitGetAsEntry is the key point
                    item = items[i].webkitGetAsEntry();
                    if(item){
                        var fcb = function(){//失败
                            hideWrapper();//隐藏遮挡层（显示：正在预处理工程...）
                            toastr.error('不合法的工程');
                            legal = false;
                        };
                        var scb = function(item){//成功
                            traverseFileTree(item);//遍历文件夹，进行预处理
                            setTimeout(function(){//模态框
                                //hideWrapper();
                                $('#uploadModal .modal-title').text('上传本地工程');
                                $('#uploadModal .modal-body p').text('合法的本地工程，确定上传？');
                                $('#uploadModal').modal({backdrop:'static',keyboard:false});
                            },500);
                        };
                        // console.log('item',item);
                        readJSONFile(item,scb,fcb);
                    }
                }
            }
        }
        return false;
    }

    /**
     * 递归拖拽的文件夹内的文件,并进行预处理
     * @param  {obj} item 拖拽项目
     * @param  {string} path 记录路径
     * @param  {function} cb 回调函数
     * @return {[type]}      [description]
     */
    function traverseFileTree(item,path){
        path = path||'';
        if(item.isFile){
            item.file(function(file){
                // console.log('file.name',file.name);
                if(!!(file.name.match(/(\.jpeg|\.png|\.ttf|\.jpg|\.bmp)/))){
                    //图片
                    if(file.name==='thumbnail.jpg'){
                        //缩略图:读取为project.thumbnail
                        var fileReader = new FileReader();
                        fileReader.onload = function(e){
                            project.thumbnail = e.target.result;
                        };
                        fileReader.readAsDataURL(file);
                    }else if(!!(file.name.match(/(^-[0-9]+[0-9]{4}\.)/))){
                        console.log("file.name.match:",file.name);
                        //压缩后的图片
                        //do nothing
                    }else{
                        //原始资源图片：加入到formData中
                        formData.append('/'+path,file);
                    }
                }
            });
        }else if(item.isDirectory){
            //文件夹
            var dirReader = item.createReader();
            var readDir = function(){
                dirReader.readEntries(function(entries){
                    if(entries.length){
                        readDir();
                        // console.log('entries.length',entries.length);
                        for(var i=0;i<entries.length;i++){
                            //对于文件夹，读取文件夹后，对于文件夹内的每一项，通过递归调用traverseFileTree来读取
                            traverseFileTree(entries[i],path+item.name+"/");
                        }
                    }else{
                        return;
                    }

                });
            };
            readDir();
        }
    }

    function traverseFileTreeLocal(item,path){
        path = path||'';
        if(item.isFile){
            item.file(function(file){
                // console.log('file.name',file.name);
                localDirDataUrls.push(file.path)
            });
        }else if(item.isDirectory){
            //文件夹
            var dirReader = item.createReader();
            var readDir = function(){
                dirReader.readEntries(function(entries){
                    if(entries.length){
                        readDir();
                        // console.log('entries.length',entries.length);
                        for(var i=0;i<entries.length;i++){
                            //对于文件夹，读取文件夹后，对于文件夹内的每一项，通过递归调用traverseFileTree来读取
                            traverseFileTreeLocal(entries[i],path+item.name+"/");
                        }
                    }else{
                        return;
                    }

                });
            };
            readDir();
        }
    }

    /**
     * 发送文件至服务器
     * cb 回调函数
     * @return {null} [description]
     */
    function sendFiles(cb){
        formData.append('project',JSON.stringify(project));
        changeUpdateState('正在上传',0);
        $.ajax({
            type:"POST",
            url:'/upload/project',
            processData:false,
            contentType:false,
            data:formData,
            success:function(data){
                console.log(data);
                formData = new FormData();
                project = null;
                changeUpdateState('上传成功,正在解析。',100);
                setTimeout(function(){
                    location.reload();
                },1000);
                //cb&&cb();
            },
            error:function(err){
                console.log(err);
                cb&&cb();
            },
            xhr:function(){
                var xhr = $.ajaxSettings.xhr();
                var bar = $('#myprogress');
                //var percent = $('#percent');
                if(xhr.upload){
                    xhr.upload.addEventListener('progress',function(e){
                        var percentVal = Math.floor(e.loaded/e.total*100) + '%';
                        //console.log('percentVal',percentVal);
                        bar.width(percentVal);
                        //percent.html(percentVal);
                    },false);
                }
                return xhr;
            }
        })
    }

    function sendFilesLocal(cb){
        
        changeUpdateState('正在上传',0);
        var oldId = project._id
        project.createTime = new Date().toLocaleString();
        project.lastModifiedTime =  new Date().toLocaleString();
        project._id = ''+Date.now()+Math.round((Math.random()+1)*1000);
        project.maxSize = 1024*1024*100;
        var localProjectDir = path.join(__dirname,'localproject')
        var localprojectpath = path.join(localProjectDir,String(project._id));
        var localresourcepath = path.join(localprojectpath,'resources');
        project.originalSite = 'localIDE'
        
        try {
            //prepare directories
            mkdirSync(localresourcepath)
            mkdirSync(path.join(localresourcepath,'template'))
            mkdirSync(path.join(localprojectpath,'mask'))
            var count = localDirDataUrls.length
            var bar = $('#myprogress');
            var curCount = 0
            if(count){
                localDirDataUrls.forEach(function(url){
                    fs.copyFileSync(url,path.join(localprojectpath,url.split(oldId)[1]))
                    curCount++
                    var percentVal = Math.floor(curCount/count*100) + '%';
                    bar.width(percentVal);
                            
                })
            }
            //transform content src
            if(project.content){
                project.content = project.content.replace(new RegExp(oldId,'g'),project._id)

            }
            
            //save init project.json
            var filePath = path.join(localprojectpath,'project.json')
            fs.writeFileSync(filePath,JSON.stringify(project));
            changeUpdateState('上传成功,正在解析。',100);
            setTimeout(function(){
                location.reload();
            },1000);
            // addNewProject(project);
        }catch (e){
            console.log(e)
            toastr.error(e)
        }
        
    }

    function mkdirSync(dist) {
        dist = path.resolve(dist);
        try{
            var stats = fs.statSync(dist)
            if (!stats.isDirectory()) {
                mkdirSync(path.dirname(dist));
                fs.mkdirSync(dist);
            }
        }catch(e){
            mkdirSync(path.dirname(dist));
            fs.mkdirSync(dist);
        }

    }

    /**
     * 发送压缩包至服务器
     * @param cb
     */
    function sendProjectZip(cb){
        changeUpdateState('正在上传(压缩包)',0);
        $.ajax({
            type:"POST",
            url:'/upload/project/zip',
            processData:false,
            contentType:false,
            data:formData,
            success:function(data){
                console.log(data);
                formData = new FormData();
                project = null;
                changeUpdateState('上传成功,正在解析。',100);
                setTimeout(function(){
                    location.reload();
                },1000);
                //cb&&cb();
            },
            error:function(err){
                console.log(err);
                changeUpdateState('上传失败。',100);
                cb&&cb();
            },
            xhr:function(){
                var xhr = $.ajaxSettings.xhr();
                var bar = $('#myprogress');
                //var percent = $('#percent');
                if(xhr.upload){
                    xhr.upload.addEventListener('progress',function(e){
                        var percentVal = Math.floor(e.loaded/e.total*100) + '%';
                        //console.log('percentVal',percentVal);
                        bar.width(percentVal);
                        //percent.html(percentVal);
                    },false);
                }
                return xhr;
            }
        })
    }

    /**
     * 判断拖拽事件的目标是否为文件夹
     * @param  {obj}  e 事件
     * @return {Boolean}   [description]
     */
    function isDropFileIsFolder(e){
        if(!e.dataTransfer){
            return false;
        }
        if(!e.dataTransfer.items){
            return false;
        }
        var items = e.dataTransfer.items;
        var item = items[0].webkitGetAsEntry();
        if(item&&item.isDirectory){
            return true;
        }
        return false;
    }

    function isDropFileIsZip(e){
        if(!e.dataTransfer){
            return false;
        }
        if(!e.dataTransfer.items){
            return false;
        }
        var items = e.dataTransfer.items;
        var item = items[0].webkitGetAsEntry();
        // var namePattern = /^file(\s?\(\d+\))?\.zip$/g;
        var namePattern = /^file((\s?)\S)*\.zip$/g;
        if(item&&item.isFile){
            if(item.name){
                console.log('item',item);
                return namePattern.test(item.name);
            }
        }
        return false;
    }

    /**
     * 读取project.json文件，并在成功后执行回调
     * @param  {[type]} item [description]
     * @param  {[type]} scb  [description]
     * @param  {[type]} fcb  [description]
     * @return {[type]}      [description]
     */
    function readJSONFile(item,scb,fcb){
        var jsonExist = false;
        var dirReader = item.createReader();
        dirReader.readEntries(function(entries){
            for(var i=0;i<entries.length;i++){
                if(entries[i].name=='project.json'){
                    jsonExist = true;
                    entries[i].file(function(file){
                        var fileReader = new FileReader();
                        fileReader.onload=function(e){
                            project = JSON.parse(e.target.result);
                            scb&&scb(item);
                        };
                        fileReader.readAsText(file,'utf-8');
                    });
                    break;
                }
            }
            if(!jsonExist){
                fcb&&fcb();
            }

        });
    }

    function showWrapper(){
        $('#updater_wrapper').show();
    }

    function hideWrapper(){
        $('#updater_wrapper').hide();
    }

    /**
     * 改变当前更新状态信息
     * @param  {string} text  提示信息
     * @param  {number} value 进度条的值
     * @return {[type]}       通过jquery改变DOM属性和值
     */
    function changeUpdateState(text,value){
        var nodeText = $('#updateInfoText');
        var progressNode = $('#myprogress');
        if(nodeText&&typeof text ==="string"){
            nodeText.text(text);
        }
        if(progressNode&&typeof value==="number"){
            if(value>=0&&value<=100){
                progressNode.width(value+'%');
            }
        }
    }


})();