/**
 * Created by ChangeCheng on 16/7/12.
 */

(function () {
    // try {
        //basic modules
        var os = require('os');
        var fs = require('fs');
        var path = require('path');
        var __dirname = global.__dirname;

        //update project modules
        var manifestPath = path.join(__dirname,'/manifest.json');
        var gui = require('nw.gui');
        var pkg = require(manifestPath); // Insert your app's manifest here
        var updater = require('node-webkit-updater');
        var unzip2 = require('unzip2');
        var upd = new updater(pkg);
        var copyPath, execPath;
        var fse = require('fs-extra');
        var child_process = require('child_process');

        var timer;//定时器专用变量

        var menuConfig = {
            file: {
                title: '菜单',
                items: [
                    {
                        label: '关于',
                        icon: '',
                        type: 'normal',
                        click: function () {
                            //console.log('pkg',pkg);
                            if(typeof pkg.version=="string"){
                                alert("IDE version "+pkg.version);
                            }
                        },
                        key: 'a',
                        modifiers: 'ctrl'
                    },
                    {
                        label: '检查更新',
                        icon: '',
                        type: 'normal',
                        click: function(){
                            checkUpdate();
                        },
                        key: 'u',
                        modifiers: 'ctrl'
                    },
                    {
                        label: 'Quit',
                        icon: '',
                        type: 'normal',
                        click: function () {
                            nw.App.quit();
                        },
                        key: 'q',
                        modifiers: 'ctrl'
                    }
                ]
            }
        }

        /**
         * 检查更新
         * @return {[type]} [description]
         */
        //根据参数，检查是否进入更新的5、6步
        if(gui.App.argv.length) {
            // ------------- Step 5 -------------
            console.log('step 5');
            showUpdaterWrapper();
            copyPath = gui.App.argv[0];
            execPath = gui.App.argv[1];
            var zipFileFolder = gui.App.argv[2];

            // Replace old app, Run updated app from original location and close temp instance
            changeUpdateState('正在安装更新... 3/3',0);
            simulatorProcess();
            var localPath = upd.getAppPath();
            copyPath = path.join(copyPath,'package.nw');
            console.log('localPath',localPath,'copyPath',copyPath,'execPath',execPath,'zipFileFolder',zipFileFolder);
            fse.copy(zipFileFolder,copyPath,function(err){
                if(err){
                    alert('安装过程出现问题');
                    console.log('copy new pro to old localtion err',err);
                    gui.App.quit();
                }
                console.log('拷贝新工程成功');
                clearInterval(timer);
                changeUpdateState('更新完成即将重新启动！',100);
                setTimeout(function(){
                    gui.Shell.openItem(execPath);
                    gui.App.quit();
                },1000);

            })
        }
        var checkUpdate = function(){  
            showUpdaterWrapper();
            changeUpdateState('正在检查更新...',100);     

            // ------------- Step 1 检查服务器上的版本-------------
            upd.checkNewVersion(function(error, newVersionExists, manifest) {
                //显示更新进度面板
                showUpdaterWrapper();

                if(error){
                    alert('检查版本出错！');
                    console.log('error',error);
                    hideUpdaterWrapper();
                }
                if(!error&&!newVersionExists){
                    alert('已经是最新版');
                    hideUpdaterWrapper();
                }
                if (!error && newVersionExists) {
                    console.log('manifest',manifest.version);
                    if(!confirm('检查到新版本，是否升级？')){
                        hideUpdaterWrapper();
                        return;
                    }
                    // ------------- Step 2 如果存在新版本，下载最新版本文件-------------
                    changeUpdateState('正在下载 1/3',0);
                    var newVersion = upd.download(function(error, filename) {
                        if(!error){
                            //     ------------- Step 3 下载完成，拷贝旧的程序至临时文件夹-------------
            
                            var tempFolderPath = path.join(getFolderPathByFilePath(filename),'tempNW');
                            var oldAppPath = getFolderPathByFilePath(process.execPath);

                            console.log('tempFolderPath',tempFolderPath);
                            //创建临时程序文件夹
                            try{
                                fse.emptyDirSync(tempFolderPath)
                            }catch(e){
                                alert('更新时创建临时文件夹失败');
                                hideUpdaterWrapper();
                                return console.log('err in create temp folder',e);
                            }
                            changeUpdateState('下载完成，正在解压 2/3',0);
                            //模拟一个解压的假线程
                            simulatorProcess();
                            //拷贝旧APP至临时程序文件夹
                            fse.copy(oldAppPath,tempFolderPath,{filter:function(path){return path.indexOf('localproject')==-1;}},function(err){
                                if(err){
                                    alert('拷贝NW时失败');
                                    hideUpdaterWrapper();
                                    return console.error('err in copy old NW to temp dir',err)
                                }
                                //use unzip2 to unpack
                                var zipFileFolder = path.join(getFolderPathByFilePath(filename),'updFiles');
                                console.log('filename',filename);
                                fs.createReadStream(filename).pipe(unzip2.Extract({ path: zipFileFolder }))
                                .on('error',function(err){
                                    alert('解压失败');
                                    hideUpdaterWrapper();
                                    console.error('err in unpack zip',err);
                                })
                                .on('close',function(){
                                    //解压成功
                                    clearInterval(timer);
                                    changeUpdateState('解压完成，程序即将重启 2/3',100);
                                    if(fs.existsSync(zipFileFolder)){
                                        var NWPackagePath = path.join(tempFolderPath,'package.nw');
                                        fse.copy(zipFileFolder,NWPackagePath,function(err){
                                            if(err){
                                                alert('更新失败');
                                                return console.error(err)
                                            }
                                            console.log('copy updateFile success');
                                            var newNWPath = path.join(tempFolderPath,'NW.exe');
                                            setTimeout(function(){
                                                //运行临时程序
                                                upd.runInstaller(newNWPath, [upd.getAppPath(), upd.getAppExec(), zipFileFolder],{});
                                                //关闭当前程序
                                                gui.App.quit();
                                            },1000);
                                        });
                                    }
                                })
                            })
                        }else{
                            alert('下载失败');
                            hideUpdaterWrapper();
                            return console.error('err in download zip',error);
                        }
                    }, manifest);
                    var loaded = 0;
                    newVersion.on('data', function(chunk){
                        loaded += chunk.length;
                        var downloadValue = Math.floor(loaded / newVersion['content-length']*100);
                        changeUpdateState(null,downloadValue);
                    })
                }
            });

            /**
             * @private
             * 获取文件所处文件夹路径
             * @param  {[string]} filename [临时文件地址]
             * @return {[string]}          [临时文件所在的文件夹地址]
             */
            var getFolderPathByFilePath = function(filename){
                var temp = filename.split('\\');
                temp.pop();
                var folderPath = temp.join('\\');
                //console.log('folderPath',folderPath);
                return folderPath;
            }
        }

        /**
         * 展示更新面板
         * @return {[type]} [description]
         */
        function showUpdaterWrapper(){
            $("#updater_wrapper").show();
        }

        /**
         * 隐藏更新面板
         * @return {[type]} [description]
         */
        function hideUpdaterWrapper(){
            $("#updater_wrapper").hide();
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


        /**
         * 模拟一个假线程，使进度条动起来
         * @return {[type]} [description]
         */
        function simulatorProcess(){
            setTimeout(function(){
                var startC = Math.floor(Math.random()*10);
                timer = setInterval(function(){
                    startC += Math.floor(Math.random()*3);
                    if(startC>90){
                        clearInterval(timer);
                    }
                    changeUpdateState(null,startC); 
                },100)
            },100);
        }

        //create menubar
        var menu = new nw.Menu({type: 'menubar'});

        for (var name in menuConfig) {
            var curSubmenu = new nw.Menu();
            var items =  menuConfig[name].items;
            for (var i = 0; i <items.length; i++) {
                curSubmenu.append(new nw.MenuItem(items[i]));
            }
            menu.append(new nw.MenuItem({
                label: menuConfig[name].title,
                submenu: curSubmenu
            }))

        }
        console.log(menu);

        nw.Window.get().menu = menu;
    // } catch (e) {
    //     console.log(e);
    // }
})();