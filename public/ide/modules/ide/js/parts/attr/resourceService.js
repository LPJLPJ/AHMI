
ideServices
    .service('ResourceService', [function () {
        var blankImg = new Image();
        blankImg.src = '';
        var globalResources = [{
            id: 'blank',
            src: 'blank',
            name: 'blank',
            content: blankImg,
            complete: true
        }];
        var  files= [];
        var  templateFiles = [];
        var size = 0;
        //var resourceUrl = "/project/"+window.localStorage.getItem('projectId')+'/resources/';
        var resourceUrl = '';
        var resourceNWUrl = '';
        var projectUrl = '';
        var fontSheet = (function() {
            // 创建 <style> 标签
            var style = document.createElement("style");

            // 可以添加一个媒体(/媒体查询,media query)属性
            // style.setAttribute("media", "screen")
            // style.setAttribute("media", "only screen and (max-width : 1024px)")

            // 对WebKit hack :(
            style.appendChild(document.createTextNode(""));


            // 将 <style> 元素加到页面中
            document.head.appendChild(style);

            return style.sheet;
        })();

        this.getGlobalResources = function () {
            return globalResources;
        };

        this.setGlobalResources = function (glres) {
            globalResources = glres;
        };

        this.setTemplateFiles = function(templates){
            templateFiles=templates;
        };

        this.getResourceFromCache = function (key, type) {
            type = type || 'src';
            for (var i = 0; i < globalResources.length; i++) {
                if (globalResources[i][type] == key) {
                    if (globalResources[i].complete) {
                        return globalResources[i].content;
                    } else {
                        return null;
                    }
                }
            }
            return null;
        }
        this.setResourceNWUrl = function (_url) {
            resourceNWUrl = _url;
        };
        this.getResourceNWUrl = function () {
            return resourceNWUrl;
        };
        this.setProjectUrl = function (_projectUrl) {
            projectUrl = _projectUrl;
        };

        this.getProjectUrl = function () {
            return projectUrl;
        };

        this.getAllResource = function () {

            //var scope=null;
            //ProjectService.getProjectTo(scope);
            //
            //files = scope.project.resourceList;
            //
            //return scope.project.resourceList;
            return files

        };

        this.setFiles=function (_files) {
            files=_files||[];
        }

        this.getExt = function (fileName) {
            var extArray = fileName.split('.');
            var ext = extArray[extArray.length-1];
            return ext;
        }

        this.syncFiles = function (_files) {
            console.log('_files',_files)
            files = _files||[]
        }

        this.getAllCustomResources = function () {
            var res = files.slice();
            return res;
        }



        this.getAllImages = function(){

            var images = _.filter(files, function (file) {
                if (file.type && file.type.split('/')[0]=='image'&&file.id!='blank.png'){
                    return true;
                }else{
                    return false;
                }
            });
            // console.log(files);
            // console.log(images);
            return images;
        };

        this.getAllImagesAndTemplates = function(){
            var images = _.filter(files, function (file) {
                if (file.type && file.type.split('/')[0]=='image'&&file.id!='blank.png'){
                    return true;
                }else{
                    return false;
                }
            });
            return images = images.concat(templateFiles);
        };

        this.getAllFontResources = function () {
            // console.log(files)
            return _.filter(files,function (file) {
                var ext = this.getExt(file.id);
                if (ext==='ttf'||ext==='woff'){
                    return true;
                }else{
                    return false;
                }
            }.bind(this))
        }

        this.ResourcesLength = function () {
            return files.length;
        };

        this.getCurrentTotalSize = function () {
            var size = 0;
            for (var i=0;i<files.length;i++){
                size+=files[i].size;
            }
            return size;
        }

        this.setMaxTotalSize = function (_size) {
            size = _size;
        }

        this.getMaxTotalSize = function () {
            return size;
        }

        this.getResourceByIndex = function (index) {
            return files[index];
        };

        this.appendFile = function (file, cb) {
            files.push(file);
            if (cb) {
                cb();
            }
        };

        this.addWebFont = function (fontFile,type) {
            var fontName = fontFile.name.split('.')[0];
            var curRule = "@font-face {font-family: '"+fontName+ "';"+"url('"+fontFile.src+"') format('"+type+"') } ";
            fontSheet.insertRule(curRule, 0);
            //fontSheet.insertRule(".web-font{ font-family:\""+fontName+"\" !important; }",1);
            //console.log('added font: ',fontFile,fontSheet,curRule)
        }


        //cache file to targetarray
        this.cacheFile = function (file, targetArray, scb, fcb) {

            var resourceObj = {};
            resourceObj.id = file.id;
            resourceObj.type = file.type;
            resourceObj.name = file.name;
            resourceObj.src = file.src;
            if (file.type.match(/image/)) {
                var img = new Image();
                resourceObj.content = img;
                img.onload = function (e) {
                    resourceObj.complete = true;
                    scb && scb(e, resourceObj);
                };
                img.onerror = function (err) {
                    resourceObj.complete = false;
                    fcb && fcb(err, resourceObj);
                };
                img.src = file.src;
                globalResources.push(resourceObj);
            }else if (this.getExt(file.id)==='ttf'||this.getExt(file.id)==='woff'){
                //ttf
                //font
                var ext = this.getExt(file.id);
                var type;
                console.log(ext)
                if (ext==='ttf'){
                    type = 'truetype'
                }else if (ext === 'woff'){
                    type = 'woff'
                }
                this.addWebFont(file,type);
                resourceObj.type = 'font/'+type;
                globalResources.push(resourceObj);
                console.log('added',globalResources)
                scb && scb({type:'ok'},resourceObj);

            }else{
                //other
                scb && scb({type:'ok'},{})
            }

        };

        this.cacheFileToGlobalResources = function (file, scb, fcb) {
            this.cacheFile(file, globalResources, scb, fcb);
        };

        this.appendFileUnique = function (file, noDuplication, cb) {
            if (noDuplication(file,files)) {
                files.push(file);
                cb && cb();
            }

            console.log(files)

        };

        this.deleteFileByIndex = function (index, successCb, failCb) {
            var success = false;
            if ((index >= 0) && (index <= files.length - 1)) {
                //console.log(index);
                files.splice(index, 1);
                //console.log(files.length);
                success = true;
            } else {
                success = false;
            }
            if (success) {
                if (successCb) {
                    successCb();
                }
                return true;
            } else {
                if (failCb) {
                    failCb();
                }
                return false;
            }
        };

        this.deleteFileById = function (id, successCb, failCb) {

            //TODO:删除资源

            var success = false;
            for(var index=0;index<files.length;index++){
                if(files[index].id==id){
                    files.splice(index,1);
                    success = true;
                    break;
                } else{
                    success=false;
                }
            }
            if(success){
                if(successCb){
                    successCb();
                }
                return true;
            }else{
                if(failCb){
                    failCb();
                }
                return false;
            }
        };

        this.setResourceUrl = function (url) {
            resourceUrl = url;
        };
        this.getResourceUrl = function () {
            return resourceUrl;
        }

    }])
    .factory('uploadingService', ['$http', function ($http) {
        var doRequest = function (fileData, apiUrl,params) {
            return $http({
                method: 'POST',
                data: fileData,
                url: apiUrl,
                params:params,
                headers: {
                    "Content-Type": undefined
                }

            });
        };
        return {
            upload: function (fileData, apiUrl) {
                return doRequest(fileData, apiUrl);
            }
        };
    }])
    .factory('idService', [function () {
        var generateIdFromNameAndDate = function (name, date) {
            var str = 0;
            for (var i = 0; i < name.length; i++) {
                str += parseInt(name.charCodeAt(0), 10);
            }
            str = (str + Number(date)).toString(16);
            return str;
        };
        var generateIdFromName = function (name) {
            var str = 0;
            for (var i = 0; i < name.length; i++) {
                str += parseInt(name.charCodeAt(0), 10);
            }
            str = (str + Number(date)).toString(16);
            return str;
        };
        return {
            generateId: function (name, date) {
                if (date) {
                    return generateIdFromNameAndDate(name, date);
                } else {
                    return generateIdFromName(name);
                }
            }
        }
    }]);

ideServices.directive("filereadform", ['uploadingService','idService','ResourceService','Upload',function (uploadingService,idService,ResourceService,Upload) {
    return {
        restrict:'AE',
        template:"<input type='file' ngf-select='uploadFiles($files)'  ngf-multiple='true' />",
        replace:'true',
        link: function (scope, element, attributes) {
            var path;
            var fs;
            var local = false;
            try {
                path = require('path');
                fs = require('fs');
                local = true;
            } catch (e) {

            }
            var baseUrl = ResourceService.getResourceUrl()

            scope.uploadFiles = function (files) {

                if (files && files.length){
                    files = files.filter(isValidFile);
                    for (var i=0;i<files.length;i++){
                        //加入等待上传数组
                        var translatedFile = transFile(files[i]);
                        scope.component.top.uploadingArray.push(translatedFile);
                        upload(files[i],translatedFile);
                    }
                }
            }

            function isValidFile(file) {
                var fileExtArray = file.name.split('.');
                var fileExt = fileExtArray[fileExtArray.length-1].toLowerCase();
                switch (fileExt){
                    case 'png':
                    case 'jpg':
                    case 'bmp':
                    case 'jpeg':
                    case 'tiff':
                    case 'ttf':
                    case 'woff':
                        return true;
                    default:
                        return false;

                }
            }

            function deleteUploadingItem(translatedFile) {
                var uploadingArray = scope.component.top.uploadingArray;
                for (var i = 0; i < uploadingArray.length; i++) {
                    if (uploadingArray[i].id == translatedFile.id) {
                        uploadingArray.splice(i, 1);
                        break;
                    }
                }
            }

            function upload(file, translatedFile) {
                if (window.local) {
                    uploadLocal(file, translatedFile);
                } else {
                    uploadServer(file, translatedFile);
                }
            }

            function uploadLocal(file, translatedFile) {
                //overload check
                var curSize = ResourceService.getCurrentTotalSize();
                var maxSize = ResourceService.getMaxTotalSize();
                if (curSize > maxSize) {
                    toastr.info('资源超过限制');
                    deleteUploadingItem(translatedFile);
                    return;
                }

                var successHandler = function () {

                    ResourceService.appendFileUnique(translatedFile, function (file,files) {
                        for (var i =0;i< files.length;i++){
                            if (files[i].id == file.id ){
                                return false;
                            }
                        }
                        return true;
                    }, function () {
                        ResourceService.cacheFileToGlobalResources(translatedFile, function () {
                            //删除scope.uploadingArray中该项
                            deleteUploadingItem(translatedFile);
                            //update
                            //scope.component.top.files = ResourceService.getAllImages();
                            // console.log('updating fonts')
                            scope.$emit('ResourceUpdate');
                        }.bind(this));
                    }.bind(this));
                }

                var errHandler = function () {
                    translatedFile.progress = '上传失败';
                    deleteUploadingItem(translatedFile);

                }

                /**
                 * 处理进度
                 * @param e
                 */
                var progressHandler = function (e) {

                    translatedFile.progress = Math.round(1.0 * e.loaded / e.total * 100) + '%';
                    console.log(translatedFile.progress);
                };


                function saveFileAsync(data, dstUrl, successHandler, errHandler, progressHandler) {

                    var dstStream = fs.createWriteStream(dstUrl);
                    var srcStream;
                    var stats;
                    var totalSize;
                    try {
                        console.log(data);
                        srcStream = fs.createReadStream(data);
                        stats = fs.statSync(data);
                        totalSize = stats.size;
                    } catch (e) {
                        console.log('err load file', e);
                        return;
                    }
                    dstStream.on('finish', function () {
                        successHandler && successHandler();
                    });
                    dstStream.on('error', function (err) {
                        errHandler && errHandler(err);
                    });
                    srcStream.on('data', function (chunk) {
                        // console.log(arguments);
                        var e = {
                            loaded: dstStream.bytesWritten,
                            total: totalSize
                        };
                        progressHandler && progressHandler(e);
                    });

                    srcStream.pipe(dstStream);
                }

                // {file:file,name:translatedFile.id}
                var resourcePath = ResourceService.getResourceUrl();
                var filePath = path.join(resourcePath, translatedFile.id);
                saveFileAsync(file.path, filePath, successHandler, errHandler, progressHandler);


            }

            function uploadServer(file, translatedFile) {

                //overload check
                var curSize = ResourceService.getCurrentTotalSize();
                var maxSize = ResourceService.getMaxTotalSize();
                if (curSize>maxSize){
                    toastr.info('资源超过限制');
                    deleteUploadingItem(translatedFile);
                    return;
                }


                /**
                 * 上传成功处理
                 * @param data
                 * @param status
                 * @param headers
                 */

                var successHandler = function(e){

                    console.log(e);
                    if (e.status == 200){
                        //success
                        ResourceService.appendFileUnique(translatedFile, function (file,files) {
                            for (var i =0;i< files.length;i++){
                                if (files[i].id == file.id ){
                                    return false;
                                }
                            }
                            return true;
                        }, function () {
                            ResourceService.cacheFileToGlobalResources(translatedFile, function () {
                                //删除scope.uploadingArray中该项
                                deleteUploadingItem(translatedFile);
                                //update
                                //scope.component.top.files = ResourceService.getAllImages();
                                console.log('updating fonts')
                                scope.$emit('ResourceUpdate');
                            }.bind(this));
                        }.bind(this));

                    }else{
                        console.error(e)
                        deleteUploadingItem(translatedFile);
                        scope.$emit('ResourceUpdate');
                    }
                }

                var errHandler = function (e) {

                    console.error(e);
                    translatedFile.progress ='上传失败';
                    switch (e.data.errMsg){
                        case 'not logged in':
                            toastr.info('请重新登录');
                            break;
                        case 'user not valid':
                            toastr.info('请登录');
                            break;
                        default:

                    }
                    deleteUploadingItem(translatedFile);

                }

                /**
                 * 处理进度
                 * @param e
                 */
                var progressHandler = function(e){

                    translatedFile.progress = Math.round(1.0 * e.loaded / e.total * 100)+'%';

                }
                //console.log(ResourceService.getResourceUrl().split('/'))
                ////console.log('/project/'+ResourceService.getResourceUrl().split('/')[1]+'/upload')
                //
                //console.log(file);
                Upload.upload({
                    //url:baseUrl+'/resource',
                    //url:'/api/upload',
                    url:'/project/'+ResourceService.getResourceUrl().split('/')[2]+'/upload',
                    data:{file:file,name:translatedFile.id}
                    //data:{file:file},
                    //params:{
                    //    token:window.localStorage.getItem('token'),
                    //    pid:window.localStorage.getItem('editPid')
                    //}


                }).then(
                    successHandler,
                    errHandler,
                    progressHandler
                )



            }



            /**
             * 处理需要上传的文件,改变其id和名字.
             * @param uploadingFile
             * @returns {*}
             */

            function transFile(uploadingFile){
                var newSelectFile = {};
                //process newSelectFile with uploadingFile
                //every file with a unique id as fileName
                var _baseUrl;
                if (local) {
                    _baseUrl = ResourceService.getResourceNWUrl() + path.sep;
                } else {
                    _baseUrl = ResourceService.getResourceUrl();
                }
                if (!uploadingFile.name) {
                    return null;
                }
                var fileNameArray = uploadingFile.name.split('.');//从.后缀开始分割我一个字符串数组，数组的第一个元素是名字，第二个元素是后缀名。

                //生成唯一识别码，作为fileName。
                var fileName = idService.generateId(uploadingFile.name,Date.now())+'.'+fileNameArray[fileNameArray.length-1];
                var fd = new FormData();
                fd.append('file',uploadingFile);
                fd.append('name',fileName);

                _.extend(newSelectFile,uploadingFile);
                newSelectFile.id  = fileName;
                newSelectFile.name = fileNameArray.slice(0,-1).join('');
                newSelectFile.src = _baseUrl + newSelectFile.id;
                //console.log(newSelectFile)

                return newSelectFile;
            }
        }
    }
}]);