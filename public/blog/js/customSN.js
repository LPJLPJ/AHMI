var ProgressBar = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;

    var progress;

    this.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;

        var body = '<div class="progress"><div class="progress-bar progress-bar-striped active" style="width:0"></div></div>'


        this.$dialog = ui.dialog({
            className: 'progress-dialog',
            title: "上传进度",
            fade: options.dialogsFade,
            body: body
        }).render().appendTo($container);
    };

    this.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
    };

    this.bindEnterKey = function ($input, $btn) {
        $input.on('keypress', function (event) {
            if (event.keyCode === key.code.ENTER) {
                $btn.trigger('click');
            }
        });
    };

    this.hideProgress = function () {
        self.$dialog.modal('hide');
    }

    this.showProgress = function () {
        return $.Deferred(function (deferred) {


            ui.onDialogShown(self.$dialog, function () {
                context.triggerEvent('dialog.shown');
                progress = self.$dialog.find('.progress-bar')
                self.updateProgress(0)
            });

            ui.onDialogHidden(self.$dialog, function () {
                // detach events
                if (deferred.state() === 'pending') {
                    deferred.reject();
                }
            });

            ui.showDialog(self.$dialog);
        }).promise();
    };

    /**
     * @param {Object} layoutInfo
     */
    this.show = function () {



        context.invoke('editor.saveRange');
        this.showProgress().then(function () {
            context.invoke('editor.restoreRange');
        }).fail(function () {
            context.invoke('editor.restoreRange');
        });
    };

    this.updateProgress = function (percentComplete) {
        if (progress) {
            progress.width(percentComplete)
        }
    }

    // context.memo('help.linkDialog.show', options.langInfo.help['linkDialog.show']);
};


var Library = function (context) {
    var self = this;
    var ui = $.summernote.ui;

    var $editor = context.layoutInfo.editor;
    var options = context.options;
    var lang = options.langInfo;
    var curFiles
    var uploadUrl = ""
    var retriveUrl = ""
    var resourceUrl = ""
    var deleteUrl = ""
    var progress
    var fileLimit=0
    var curFilesNum = 0
    var maxFilesNum = 10


    this.initialize = function () {
        var $container = options.dialogsInBody ? $(document.body) : $editor;

        var body = '<div class="row"><input class="input upload col-md-3" type="file"  multiple="multiple" /><div class="progress col-md-8" style="padding:0"><div class="progress-bar" style="transition:none"></div></div></div><div class="row"><div class="library-preview col-md-3"></div><div class="col-md-8"><table class="library-table table"></table></div></div><div class="row"><span class="msg"></span></div>'


        this.$dialog = ui.dialog({
            className: 'library-dialog',
            title: "资源",
            fade: options.dialogsFade,
            body: body
        }).render().appendTo($container);
    };

    this.destroy = function () {
        ui.hideDialog(this.$dialog);
        this.$dialog.remove();
    };

    this.bindEnterKey = function ($input, $btn) {
        $input.on('keypress', function (event) {
            if (event.keyCode === key.code.ENTER) {
                $btn.trigger('click');
            }
        });
    };

    this.setMaxFilesNum = function (maxNum) {
        maxFilesNum = maxNum
    }

    function exceedMaxNum(curNum) {
        return curNum > maxFilesNum
    }


    this.resourceType = function (url) {
        var ext = self.getExt(url)
        switch (ext.toLowerCase()){
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'bmp':
            case 'tiff':
            case 'gif':
                return 'img'
            case 'mp4':
            case 'm4v':
            case 'mov':
                return 'video'
            default:
                return null
        }
    }
    this.showPreview = function (fileName) {
        var type = self.resourceType(fileName)
        if (type ) {
            self.setPreview(fileName,type)
        }
    }

    function checkFileSize(fileSize,limit) {
        limit = limit||0
        if (limit>0){
            if(fileSize>limit){
                return false
            }else{
                return true
            }
        }else{
            return true
        }

    }
    function sendFiles(files,url,scb,fcb,pcb) {
        for (var i=0;i<files.length;i++){
            if (!checkFileSize(files[i].size,fileLimit)){
                return fcb&& fcb(new Error('文件过大，不能超过'+(fileLimit/1000/1000)+'MB'))
            }
        }

        if (exceedMaxNum(files.length+curFilesNum)){
            return fcb&& fcb(new Error('文件过多，不能超过'+(maxFilesNum)+'个'))
        }

        var data = new FormData();
        for (var i=0;i<files.length;i++){
            data.append("file", files[i]);
        }


        $.ajax({
            xhr: function(){
                var xhr = new window.XMLHttpRequest();
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        //Do something with upload progress
                        pcb && pcb(percentComplete)
                    }
                }, false);
                //Download progress
                xhr.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        //Do something with download progress
                        // console.log(percentComplete);
                    }
                }, false);
                return xhr;
            },
            data: data,
            type: "POST",
            url: url,
            cache: false,
            contentType: false,
            processData: false
        })
            .done(function (msg) {
                scb && scb(msg)
            })
            .fail(function (xhr) {
                fcb && fcb(xhr)
            })
    }


    this.setPreview = function (fileName,type) {
        var node
        var baseUrl = resourceUrl+'/'
        var $libraryPreview = self.$dialog.find('.library-preview')

        switch (type){
            case 'img':
                node = '<img width="100%" src="'+baseUrl+fileName+'" />'
                break
            case 'video':
                node = '<video width="100%" src="'+baseUrl+fileName+'" />'
                break
        }
        if (node) {
            $libraryPreview.html(node)
        }
    }

    this.setFileLimit = function (limit) {
        fileLimit = limit
    }

    this.setUploadUrl = function (url) {
        uploadUrl = url
    }

    this.setRetriveUrl = function (url) {
        retriveUrl = url
    }

    this.setResourceUrl = function (url) {
        resourceUrl = url
    }

    this.setDeleteUrl = function (url) {
        deleteUrl = url
    }

    this.deleteFile = function (fileName,cb) {
        $.ajax({
            type:"DELETE",
            url:deleteUrl,
            data:{fileName:fileName}
        })
            .done(function (msg) {
                console.log(msg)
                cb && cb()
            })
            .fail(function (xhr,status) {
                console.log('delete failed')
            })
    }

    this.copyUrl = function () {

    }

    this.showLibrary = function () {
        var baseUrl = resourceUrl
        return $.Deferred(function (deferred) {


            ui.onDialogShown(self.$dialog, function () {
                context.triggerEvent('dialog.shown');
                //bind click event
                progress = self.$dialog.find('.progress-bar')
                var $libraryTable = self.$dialog.find('.library-table')

                var DELAY = 300, clicks = 0, timer = null;
                $libraryTable.click(function (e) {
                    $('.msg').html('')
                    var targetClass = $(e.target).attr('class')
                    var curRow = $(e.target.parentNode)
                    var fileName = curRow.siblings('.library-filename').text()
                    if (targetClass.indexOf('library-filename')!==-1) {
                        self.showPreview(e.target.innerText)
                    }else if (targetClass.indexOf('btn-delete')!==-1) {
                        //delete
                        // self.deleteFile()

                        self.deleteFile(fileName,function () {
                            for (var i = curFiles.length - 1; i >= 0; i--) {
                                if(curFiles[i]==fileName){
                                    curFiles.splice(i,1)
                                    break
                                }
                            }
                            curRow.parent().remove()

                        })
                    }else if (targetClass.indexOf('btn-copy')!==-1) {
                        $('.msg').html('')
                        var copy = function (e) {
                            e.preventDefault();
                            console.log('copy');
                            var text = baseUrl+'/'+fileName
                            if (e.clipboardData) {
                                e.clipboardData.setData('text/plain', text);
                                $('.msg').html('复制成功')
                            } else if (window.clipboardData) {
                                window.clipboardData.setData('Text', text);
                                $('.msg').html('复制成功')
                            }
                        }
                        window.addEventListener('copy', copy);
                        document.execCommand('copy');
                        window.removeEventListener('copy', copy);

                    }



                })


                //bind upload event
                var $uploadBtn = self.$dialog.find('.upload')

                $uploadBtn.change(function (e) {
                    $('.msg').html('')
                    if (!uploadUrl) {return}
                    sendFiles(e.target.files,uploadUrl,function () {
                        self.updateLibrary(retriveUrl)
                    },function (err) {
                        $('.msg').html(err)
                    },function (percentComplete) {
                        self.updateProgress((percentComplete*100).toFixed(2))
                    })
                })

                if (retriveUrl) {
                    self.updateLibrary(retriveUrl)
                }
            });

            ui.onDialogHidden(self.$dialog, function () {
                // detach events
                if (deferred.state() === 'pending') {
                    deferred.reject();
                }
            });

            ui.showDialog(self.$dialog);
        }).promise();
    };

    this.updateProgress = function (percentComplete) {
        if (progress) {
            progress.width(percentComplete+'%')
        }
    }

    this.updateLibrary = function (url) {
        //update resources from url
        $.ajax({
            type:"GET",
            url:url
        }).done(function (msg) {
            //all files
            var files = JSON.parse(msg);
            files = files.filter(function (file) {
                return !self.isHiddenFile(file)
            })
            // console.log(files,files.map(function (file) {
            //     return self.getExt(file)
            // }))
            files.sort()
            curFilesNum = files.length
            curFiles = files
            self.insertFiles(files)
        })
            .fail(function (err) {
                console.log('failed',err.responseText)
            })
    }

    this.getExt = function (fileName) {
        var nameChunks = fileName.split('.')
        return nameChunks[nameChunks.length-1]
    }

    this.isHiddenFile = function (fileName) {
        return fileName.indexOf('.') == 0
    }

    this.insertFiles = function (files) {
        var libraryTable = self.$dialog.find('.library-table')[0]
        var fileDOMs = files.map(function (file) {
            return self.renderFile(file)
        })
        libraryTable.innerHTML = fileDOMs.join("")
        // var clipboard = new Clipboard('.btn-copy')
        // clipboard.on('success', function(e) {
        //     $('.msg').html('复制成功')
        // });
    }

    this.renderFile = function (file) {
        return '<tr><td class="library-filename">'+file+'</td><td>'+self.getExt(file)+'</td><td><button class="btn btn-default btn-copy" >复制</button></td><td><button class="btn btn-delete">x</button></td></tr>'
    }

    // context.memo('mis.lib', function () {
    //      return ui.button({
    //        contents: ui.icon(options.icons.picture),
    //        tooltip: 'lib',
    //        click: context.createInvokeHandler('library.showLibrary')
    //      }).render();
    //    });



};







$.extend($.summernote.plugins, {
    progressBar: ProgressBar,
    library:Library
});


var LibraryButton = function (context) {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: '<i class="fa fa-child"/> lib',
        tooltip: 'library',
        click: function () {
            // invoke insertText method with 'hello' on editor module.
            context.invoke('library.showLibrary');
        }
    });

    return button.render();   // return button as jquery object
}






var $summernote = $('#summernote')
$summernote.summernote({
    toolbar: [
        // [groupName, [list of button]]
        ['insert',['picture','link','video','hr','table']],
        ['style', ['style','bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['view', ['fullscreen', 'codeview']],
        ['sys',['undo','redo']],
        ['mis',['lib']]
    ],
    buttons:{
        lib:LibraryButton
    },
    height:400,
    lang:'zh-CN',
    popover: {
        image: [
            ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']]
        ],
        link: [
            ['link', ['linkDialogShow', 'unlink']]
        ]
    },
    prettifyHtml:true,
    callbacks:{
        onImageUpload:function (files) {
            var currentId = '59e81766895ec024825728e2'

            var url = '/support/'+currentId+'/resource'
            $summernote.summernote('progressBar.showProgress')
            sendFiles(files,url,function (msg) {
                //close dialog
                $summernote.summernote('progressBar.hideProgress')
                $summernote.summernote('restoreRange')

                var baseUrl = url+'/'
                for (var i=0;i<files.length;i++){
                    insertSingleImage($summernote,baseUrl+files[i].name,files[i].name)
                }
            },function (xhr,status) {
                console.log(xhr,status)
            },function (percentComplete) {
                $summernote.summernote('progressBar.updateProgress',percentComplete*100+'%')
            })
        },
        onImageUploadError:function (e) {
            $.alert({
                title: '',
                content: '插入图片失败，链接无效'
            });
        },
        onVideoInsertError:function () {
            $.alert({
                title: '',
                content: '插入视频失败，链接无效'
            });
        }
    }

});

function parseQuery() {
    var query = window.location.search.slice(1)
    var querys = query.split('&')
    var results = {}
    for (var i=0;i<querys.length;i++){
        var pair = querys[i].split('=')
        results[pair[0]] = pair[1]
    }
    return results;
}



function insertSingleImage($summernote,url,name) {
    $summernote.summernote('insertImage', url, name);

}


function sendFile(file,url,scb,fcb,pcb) {
    var data = new FormData();
    data.append("file", file);

    $.ajax({
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with upload progress
                    console.log(percentComplete);
                }
            }, false);
            //Download progress
            xhr.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with download progress
                    console.log(percentComplete);
                }
            }, false);
            return xhr;
        },
        data: data,
        type: "POST",
        url: url,
        cache: false,
        contentType: false,
        processData: false
    }).done(function (msg) {
        scb && scb(msg)
    }).fail(function (xhr) {
        fcb && fcb(xhr)
    })
}

function sendFiles(files,url,scb,fcb,pcb) {
    var data = new FormData();
    for (var i=0;i<files.length;i++){
        data.append("file", files[i]);
    }


    $.ajax({
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            //Upload progress
            xhr.upload.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with upload progress
                    pcb && pcb(percentComplete)
                }
            }, false);
            //Download progress
            xhr.addEventListener("progress", function(evt){
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    //Do something with download progress
                    // console.log(percentComplete);
                }
            }, false);
            return xhr;
        },
        data: data,
        type: "POST",
        url: url,
        cache: false,
        contentType: false,
        processData: false
    })
        .done(function (msg) {
            scb && scb(msg)
        })
        .fail(function (xhr) {
            fcb && fcb(xhr)
        })
}




// $summernote.summernote('library.showLibrary')








