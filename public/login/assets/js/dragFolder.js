/**
 * Created by lixiang on 2017/3/30.
 */
(function(){
    var local = false;
    try {
        var os = require('os');
        if (os){
            local = true;
            //console.log('os',os);
        }
    }catch (e){

    }
    var formData = new FormData();
    var project;
    if(window.File&&window.FileList&&window.FileReader){
        console.log('support File API congratulations!');
        init();
    }
    function init(){
        //var filedrag = document.getElementById('filedrag');
        var filedrag = document.getElementById('filedrag');
        filedrag.addEventListener('dragover', FileDragHover, false);
        filedrag.addEventListener('dragleave',FileDragHover,false);
        filedrag.addEventListener('drop',FileDrop,false);
        //add event to confirm button
        var confirmReleaseBtnNode = $("#confirmReleaseBtn");
        confirmReleaseBtnNode.off('click');
        confirmReleaseBtnNode.on('click',function(e){
            $('#uploadModal').modal('hide');
            sendFiles(hideWrapper);
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
        e.stopPropagation();
        e.preventDefault();
        filedrag.className = (e.type=='dragover'?'hover':'');
    }

    function FileDrop(e){
        e.preventDefault();
        filedrag.className = '';
        if(local){

        }else{
            showWrapper();
            changeUpdateState('正在预处理工程...',100);
            if(!isDropFileIsFolder(e)){
                hideWrapper();
                toastr.error('不合法的工程');
                return
            }
            var items = e.dataTransfer.items;
            for(var i=0;i<items.length;i++){
                //webkitGetAsEntry is the key point
                var item = items[i].webkitGetAsEntry();
                if(item){
                    var fcb = function(){
                        hideWrapper();
                        toastr.error('不合法的工程');
                        legal = false;
                    };
                    var scb = function(item){
                        traverseFileTree(item);
                        setTimeout(function(){
                            //hideWrapper();
                            $('#uploadModal').modal({backdrop:'static',keyboard:false});

                        },500);
                    };
                    readJSONFile(item,scb,fcb);
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
        var path = path||'';
        if(item.isFile){
            item.file(function(file){
                console.log('file.name',file.name);
                if(!!(file.name.match(/(jpeg|png|ttf|jpg)/))){
                    if(file.name==='thumbnail.jpg'){
                        var fileReader = new FileReader();
                        fileReader.onload = function(e){
                            project.thumbnail = e.target.result;
                        };
                        fileReader.readAsDataURL(file);
                    }else{
                        formData.append('/'+path,file);
                    }
                }
            });
        }else if(item.isDirectory){
            var dirReader = item.createReader();
            var readDir = function(){
                dirReader.readEntries(function(entries){
                    if(entries.length){
                        readDir();
                        console.log('entries.length',entries.length);
                        for(var i=0;i<entries.length;i++){
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

    /**
     * 判断拖拽事件的目标是否为文件夹并对json进行预处理
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
        if(item.isDirectory){
            return true;
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