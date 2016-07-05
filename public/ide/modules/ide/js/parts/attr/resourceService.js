/**
 * Created by shenaolin on 16/3/10.
 */
ideServices
    .service('ResourceService', function () {


        var  files= [];
        var size = 0;
        //var resourceUrl = "/project/"+window.localStorage.getItem('projectId')+'/resources/';
        var resourceUrl = ''
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

        this.syncFiles = function (_files) {
            files = _files||[]
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

        this.appendFileUnique = function (file, noDuplication, cb) {
            if (noDuplication(file,files)) {
                files.push(file);
            }
            if (cb) {
                cb();
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

    })
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
            var str = '';
            for (var i = 0; i < name.length; i++) {
                str += parseInt(name.charCodeAt(0), 10).toString(16);
            }
            return str + String(date);
        };
        var generateIdFromName = function (name) {
            var str = '';
            for (var i = 0; i < name.length; i++) {
                str += parseInt(name.charCodeAt(i), 10).toString(16);
            }
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
        template:"<input type='file' ngf-select='uploadFiles($files)' accept='image/*' ngf-multiple='true' />",
        replace:'true',
        link: function (scope, element, attributes) {
            var baseUrl = ResourceService.getResourceUrl()

            scope.uploadFiles = function (files) {
                if (files && files.length){
                    for (var i=0;i<files.length;i++){
                        //加入等待上传数组
                        var translatedFile = transFile(files[i]);
                        scope.component.top.uploadingArray.push(translatedFile);
                        upload(files[i],translatedFile);
                    }
                }
            }
            function upload(file,translatedFile){

                //overload check
                var curSize = ResourceService.getCurrentTotalSize();
                var maxSize = ResourceService.getMaxTotalSize();
                if (curSize>maxSize){
                    toastr.info('资源超过限制');
                    deleteUploadingItem(translatedFile);
                    return;
                }


                function deleteUploadingItem(translatedFile){
                    var uploadingArray = scope.component.top.uploadingArray;
                    for (var i=0;i<uploadingArray.length;i++){
                        if (uploadingArray[i].id == translatedFile.id){
                            uploadingArray.splice(i,1);
                            break;
                        }
                    }
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
                            for (var i in files){
                                if (files[i].id == file.id ){
                                    return false;
                                }
                            }
                            return true;
                        });
                        //删除scope.uploadingArray中该项
                        deleteUploadingItem(translatedFile);
                        //update
                        //scope.component.top.files = ResourceService.getAllImages();
                        scope.$emit('ResourceUpdate');
                    }
                }

                var errHandler = function (e) {
                    console.log('err');
                    console.log(e);
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
                newSelectFile.src = baseUrl+newSelectFile.id;
                //console.log(newSelectFile)

                return newSelectFile;
            }
        }
    }
}]);