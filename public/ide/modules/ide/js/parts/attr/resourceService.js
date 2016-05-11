/**
 * Created by shenaolin on 16/3/10.
 */
ideServices
    .service('ResourceService', function (ProjectService) {

        var files = [
            {
                id:'blank.png',
                name:'blank',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo0.jpg',
                name:'demo0',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo1.jpg',
                name:'demo1',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo2.jpg',
                name:'demo2',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo3.jpg',
                name:'demo3',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo4.jpg',
                name:'demo4',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo5.jpg',
                name:'demo5',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo6.jpg',
                name:'demo6',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo7.jpg',
                name:'demo7',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo8.jpg',
                name:'demo8',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo9.jpg',
                name:'demo9',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo10.jpg',
                name:'demo10',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo11.jpg',
                name:'demo11',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo12.jpg',
                name:'demo12',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo13.jpg',
                name:'demo13',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo14.jpg',
                name:'demo14',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo15.jpg',
                name:'demo15',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo16.jpg',
                name:'demo16',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo17.jpg',
                name:'demo17',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo18.jpg',
                name:'demo18',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo19.jpg',
                name:'demo19',
                type:'image/jpeg',
                size:'2345678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'demo20.png',
                name:'demo20',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'0.png',
                name:'0',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'1.png',
                name:'1',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'2.png',
                name:'2',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'3.png',
                name:'3',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'4.png',
                name:'4',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'5.png',
                name:'5',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'6.png',
                name:'6',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'7.png',
                name:'7',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'8.png',
                name:'8',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'9.png',
                name:'9',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'add.png',
                name:'add',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'sub.png',
                name:'sub',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'mul.png',
                name:'mul',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'div.png',
                name:'div',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'equal.png',
                name:'equal',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            },
            {
                id:'dot.png',
                name:'dot',
                type:'image/png',
                size:'2145678',
                lastModifiedDate: 'Wed Dec 31 2014 21:56:26 GMT+0800 (CST)'
            }
        ];
        //var  files= []
        var resourceUrl = "/project/"+window.localStorage.getItem('projectId')+'/resources/';

        this.getAllResource = function () {
            
            //var scope=null;
            //ProjectService.getProjectTo(scope);
            //
            //files = scope.project.resourceList;
            //
            //return scope.project.resourceList;
            return files
            
        };

        this.syncFiles = function () {
            var scope={};
            ProjectService.getProjectTo(scope);

            files = scope.project.resourceList;

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
                console.log(index);
                files.splice(index, 1);
                console.log(files.length);
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
        console.log('uploading service');
        console.log(fileData);
        console.log(apiUrl);
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
        return str + date.toLocalString();
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
        template:"<input type='file' ngf-select='uploadFiles($files)' accept='image/png,image/jpeg' ngf-multiple='true' />",
        replace:'true',
        link: function (scope, element, attributes) {

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
                        var uploadingArray = scope.component.top.uploadingArray;
                        for (var i=0;i<uploadingArray.length;i++){
                            if (uploadingArray[i].id == translatedFile.id){
                                uploadingArray.splice(i,1);
                                break;
                            }
                        }
                        //update
                        //scope.component.top.files = ResourceService.getAllImages();
                        scope.$emit('ResourceUpdate');
                    }
                }

                var errHandler = function (e) {
                    console.log('err');
                    console.log(e);
                    translatedFile.progress ='上传失败';

                }

                /**
                 * 处理进度
                 * @param e
                 */
                var progressHandler = function(e){

                    translatedFile.progress = Math.round(1.0 * e.loaded / e.total * 100)+'%';

                }


                console.log(file);
                Upload.upload({
                    //url:baseUrl+'/resource',
                    //url:'/api/upload',
                    url:'/project/'+window.localStorage.getItem('projectId')+'/upload',
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
                var fileName = idService.generateId(uploadingFile.name)+'.'+fileNameArray[fileNameArray.length-1];
                var fd = new FormData();
                fd.append('file',uploadingFile);
                fd.append('name',fileName);

                _.extend(newSelectFile,uploadingFile);
                newSelectFile.id  = fileName;
                newSelectFile.name = fileNameArray.slice(0,-1).join('');


                return newSelectFile;
            }
        }
    }
}]);