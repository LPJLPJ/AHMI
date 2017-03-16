/**
 * Created by lixiang on 2017/2/23.
 * Based on changeCheng's manageSpcae.js
 */

$(function(){
    /**
     * curUsers   用户数据           
     * tempUsers  临时用户数据       
     * usersCount 获取的用户数量     
     * pageSize   每页显示的用户条数  
     * pageCount  页面数量
     * curPageIdx 当前页面序号
     * searchState 搜索状态
     * searchStr 搜索关键字
     */
    const pageSize = 10;
    var curUsers = [];
    var tempUsers = [];
    var curPageIdx = 1;
    var searchState = false;
    var searchStr = "";
    var usersCount,
        pageCount;


    initProject();

    /**
     * 初始化工程
     * @return {[type]} [description]
     */
    function initProject(){
        var getUsersUrl = generateGetUsersUrl((curPageIdx-1)*pageSize,pageSize);
        getUsers(getUsersUrl);
    }

    /**
     * 获取用户信息
     * param  string getUsersUrl 请求地址
     * cb 回调函数
     * @return {[type]} [description]
     */
    function getUsers(getUsersUrl,cb){
        //console.log(getUserUrl);
        $.ajax({
            type:'GET',
            url:getUsersUrl,
            success:function(data,status,xhr){
                var tempData = JSON.parse(data);
                curUsers = tempData.users;
                tempUsers = curUsers.map(function(item,index,array){
                    item.createTime = item.createTime.substr(0,10);
                    return item;
                });
                //console.log('tempUsers',tempUsers);
                usersCount = tempData.count;
                pageCount = Math.ceil(usersCount/pageSize);
                curPageIdx = 1;
                initUI();
                cb&&cb();
            },
            error:function(err,status,xhr){
                console.log('err',err);
                cb&&cb();
            }
        })
    }

    /**
     * 初始化界面
     * step 1 渲染用户数据表
     * step 2 渲染分页标签
     * step 3 为分页标签注册点击事件
     * step 4 为搜索框注册回车事件
     * step 5 为选择框注册改变用户类型事件
     * @return {[type]} [description]
     */
    function initUI(){
        // step 1
        renderUserToView(tempUsers);
        // step 2
        generatePageIndexTag();
        // step 3
        addClickEvtToPageIndex();
        // step 4
        addKeypressEvtToSearchBox();
        //step 5
        addChangeTypeEvtToSelectTag();
    };

    /**
     * 生成用于渲染的html,并渲染至页面
     * @param  {array} user 用户数组
     * @return 
     */
    function renderUserToView(user) {
        var tempUsersHtml = new EJS({url:'../../public/login/assets/views/userPanel2.ejs'}).render({user: user});
        insertUserViews(tempUsersHtml);
    };


    /**
     * @辅助函数
     * 将生成的用户信息插入html
     * @param  {[type]} userViews html字符串
     * @return {[type]}           [description]
     */
    function insertUserViews(userViews) {
        var userTable = $("#userTable");
        if(!userTable){
            return;
        }
        userTable.empty();
        // for (var i = 0; i < userViews.length; i++) {
        //     userUL.append(userViews[i])
        // }
        userTable.append(userViews);
    };



    /**
     * 生成html上的页面序号
     * 
     * @return {[type]} [description]
     */
    function generatePageIndexTag(){
        var pageIndexNode = $("#pageIndex");
        pageIndexNode.empty();
        var initTag = "<li selectPage=\"-1\"><a href=\"#\"><<\/a><\/li>"+"<li selectPage=\"-2\"><a href=\"#\">><\/a><\/li>";
        pageIndexNode.append(initTag);

        for(var i=0;i<pageCount;i++){
            insertPageIndexNode(i+1);
        }
        //调整页面按钮当前状态
        changeSelectPageIndexState(curPageIdx);
    };

    /**
     * @辅助函数
     * 插入页面序号节点 
     * @param  {[type]} index [分页序号]
     * @return {[type]}       [description]
     */
    function insertPageIndexNode(index){
        var pageIndexTag = "<li selectPage=\""+index+"\"><a href=\"#\">"+index+"</a></li>";
        var pageIndexNode = $("#pageIndex li:last-child");
        if(!pageIndexNode){
            return
        }
        pageIndexNode.before(pageIndexTag);
    };


    /**
     * 为分页标签注册点击事件
     * step 1 获取li元素集
     * step 2 检查序号是否改变，未改变直接返回
     * step 3 改变页面序号样式
     * step 4 检查检索状态，如果处于搜索状态，在url上加入搜索关键字
     * step 5 发送请求，获取users数据
     */
    function addClickEvtToPageIndex(){
        //step 1
        var pageIndexLiNodes = $("#pageIndex").children();
        pageIndexLiNodes.click(function(){
            var nodeNum = parseInt($(this).attr('selectPage'));
            var selectIndex;
            if(nodeNum>0){
                selectIndex = nodeNum
                //step 2
                if(selectIndex==curPageIdx){
                    return
                }                
            }else if(nodeNum==-1){
                //向后翻页
                if(curPageIdx==1){
                    return;
                }
                selectIndex=curPageIdx-1;
            }else if(nodeNum==-2){
                //向前翻页
                if(curPageIdx==pageCount){
                    return;
                }
                selectIndex=curPageIdx+1;
            }
            //step 3
            changeSelectPageIndexState(selectIndex);
            curPageIdx = selectIndex;

            //step 4
            var getUsersUrl;
            if(searchState&&searchStr!=""){
                getUsersUrl = generateGetUsersUrl((selectIndex-1)*pageSize,pageSize,searchStr);
            }else{
                getUsersUrl = generateGetUsersUrl((selectIndex-1)*pageSize,pageSize);
            }
            postHTTPReqForUsers(getUsersUrl,renderUserToView);
        })

        pageIndexLiNodes = null;
    };

    /**
     * @辅助函数
     * 改变选中页面序号的样式
     * @param  {num} selectIndex 选中页面序号
     * @return {[type]}       [description]
     */
    function changeSelectPageIndexState(selectIndex){
        var pageUlNode = $("#pageIndex");

        var curNodeAttr = "[selectpage=\""+curPageIdx+"\"]";
        var curANode = pageUlNode.children(curNodeAttr).children('a:first-child');
        curANode.removeClass();

        var newNodeAttr = "[selectpage=\""+selectIndex+"\"]";
        var newANode = pageUlNode.children(newNodeAttr).children('a:first-child');
        newANode.removeClass().addClass('active');

        var forwardPageAttr = "[selectpage=\"-1\"]";
        var forwardPageLiNode = pageUlNode.children(forwardPageAttr);
        forwardPageLiNode.removeClass();

        var nextPageAttr = "[selectpage=\"-2\"]";
        var nextPageLiNode = pageUlNode.children(nextPageAttr);
        nextPageLiNode.removeClass();

        if(selectIndex==1){
            forwardPageLiNode.addClass('disabled');
        };
        if(selectIndex==pageCount){
            nextPageLiNode.addClass('disabled');
        };
    };




    /**
     * @辅助函数
     * 生成请求URL 
     * @param  {num} from  请求user的起始坐标
     * @param  {num} limit 请求user的范围
     * @param  {string } searchStr 搜索关键字
     * @return {string}    请求的URL
     */
    function generateGetUsersUrl(from,limit,searchStr){
        if(!((typeof from =="number")||(typeof limit == "number"))){
            return null;
        }
        if(from<0||limit<0){
            return null;
        }
        var url = '/admin/manage/users?from='+from+'&limit='+limit;
        if(searchStr&&typeof(searchStr)=='string'){
            url+="&searchStr="+searchStr;
        }
        return url;
    }


    /**
     * 为搜索框注册事件
     */
    function addKeypressEvtToSearchBox(){
        var searchInput = $("#search-input");
        var searchBtn = $("#search-btn");

        if(!searchInput){
            return;
        }
        searchInput.off('keyup');
        searchInput.on('keyup',function(e){
            if(e.keyCode==13){
                handleSearch();
            }
        });

        searchInput = null;
    }

    /**
     * @辅助函数
     * 执行搜索操作
     * @return {[type]} [description]
     */
    function handleSearch(){
        var searchInput = $('#search-input');
        searchStr = searchInput.val().trim();
        //console.log('searchStr',searchStr);
        curPageIdx=1;
        if(searchState&&searchStr==""){
            console.log('取消搜索');
            searchState=false;
            var getUsersUrl = generateGetUsersUrl((curPageIdx-1)*pageSize,pageSize);
            showOverLay();
            getUsers(getUsersUrl,hideOverLay);
        }else if(searchStr!=""){
            var getUsersUrl = generateGetUsersUrl((curPageIdx-1)*pageSize,pageSize,searchStr);
            searchState=true;
            showOverLay();
            getUsers(getUsersUrl,hideOverLay);
        }

        searchInput = null;
    }

    /**
     * 为选择框添加事件，用于改变用户类型
     */
    function addChangeTypeEvtToSelectTag(){
        var userTableUl = $("#userTable");
        userTableUl.off("change",".authSelect")
        userTableUl.on("change",".authSelect",function(e){
            var userId = e.target.dataset.userid;
            var newValue = e.target.value;
            //var trNode = $(e.target).parent().parent();
            //console.log('userId',userId,'newValue',newValue,'trNode',trNode);
            changeTypeById(userId,newValue,$(this));
        })
        userTableUl = null;
    }

    /**
     * 改变当前用户的type
     * @param  {string} userId   用户id
     * @param  {string} type     用户类型
     * @param  {Node} userNode 当前用户Node节点
     * @return {[type]}          [description]
     */
    function changeTypeById(userId,type,userNode){
        var curTempUser;
        for(var i=0;i<tempUsers.length;i++){
            if(tempUsers[i]._id==userId){
                curTempUser = tempUsers[i];
                //console.log('haha',curTempUser);
                break;
            }
        }
        if(curTempUser){
            $.ajax({
                type:"POST",
                url:'/admin/manage/changeusertype',
                data:{
                    userId:userId,
                    type:type
                },
                success:function(data,status,xhr){
                    curTempUser.type = type;
                    var curTempUserArr = new Array(curTempUser);
                    //userNode.replaceWith(renderUserToView(curTempUserArr));
                    //console.log('userNode',userNode.val());
                    toastr.info('修改成功');
                },
                error:function(err,status,xhr){
                    userNode.val(curTempUser.type);
                    toastr.error('修改失败');
                }
            })
        }
    }

    /**
     * @辅助函数
     * 发送http请求获取user数据，并执行回调
     * @param  {string} url 请求地址
     * @param  {function} cb 回调函数
     * @return {[type]}      [description]
     */
    function postHTTPReqForUsers(url,cb){
        //console.log('url',url);
        if(typeof(url)!="string"){
            return;
        }
        if(cb&&typeof(cb)!='function'){
            return;
        }
        $.ajax({
            type:"GET",
            url:url,
            success:function(data,status,xhr){
                var tempData = JSON.parse(data);
                //console.log('tempData',tempData);
                curUsers = tempData.users;
                tempUsers = curUsers.map(function(item,index){
                    item.createTime = item.createTime.substr(0,10);
                    return item;
                })
                cb&&cb(tempUsers);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    function showOverLay(){
        $('.overlay').show();
    }
    function  hideOverLay(){
        $('.overlay').hide();
    }

})