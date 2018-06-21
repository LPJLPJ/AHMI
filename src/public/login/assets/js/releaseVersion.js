/**
 * Created by lixiang on 2017/2/27.
 * step 1 获取更新数据
 * step 2 初始化UI
 */
$(function(){
  /**
   * pageSize 每页显示条数
   * releaseInfo 发布信息数组
   * curPageIde 当前页面序号
   * infoCount 信息个数
   * pageCount 页面个数
   */
  const pageSize = 10;
	var releaseInfo=[];
  var curPageIdx = 1;
  var selectPageIdx = 1;
  var infoCount,
      pageCount;

	initProject();

	/**
	 * 初始化工程
	 * @return {[type]} [description]
	 */
	function initProject(){
    var getInfoUrl = generateGetInfoUrl((selectPageIdx-1)*pageSize,pageSize);
		getReleaseInfo(getInfoUrl,initUI);
	};

	/**
	 * 初始化UI
	 * step 1 将获取的日志信息渲染至页面表格
   * step 2 生成页码 
   * step 3 为分页标签注册点击事件
	 * step 4 为发布按钮注册发布事件
	 * @return {[type]} [description]
	 */
	function initUI(){
    //step 1
		renderLogToView(releaseInfo);
    //step 2
    generatePageIndexTag();
    //step 3
    addClickEvtToPageIndex();
    //step 4
		addEvtToReleaseBtn();
	}

	/**
	 * 获取版本信息
   * @param { String} url 请求的url 
	 * @return {[type]} [description]
	 */
	function getReleaseInfo(url,cb){
		$.ajax({
			type:"GET",
			url:url,
			success:function(data,status,xhr){
        var tempData = JSON.parse(data);
				releaseInfo = tempData.data;
        infoCount = tempData.count;
        //console.log('infoCount',infoCount);
        pageCount = Math.ceil(infoCount/pageSize); 
				cb&&cb(releaseInfo);
			},
			error:function(err,status,xhr){
				toastr.error('获取日志失败');
				console.log('err',err);
			}
		})
	}

	/**
	 * 将生成日志渲染至表格中
	 * @param  {[type]} releaseArr [description]
	 * @return {[type]}            [description]
	 */
	function renderLogToView(log){
		var tempLogsHtml = new EJS({url:'../../public/login/assets/views/releaseLog.ejs'}).render({log: log});
        insertUserViews(tempLogsHtml);
	}

	/**
	 * 将日志信息插入表格
	 * @param  {array} logViews 日志信息集合
	 * @return {[type]}           [description]
	 */
	function insertUserViews(logViews) {
        var logTable = $("#logTable");
        if(!logTable){
            return;
        }
        logTable.empty();
        logTable.append(logViews);
    };

    /**
     * 改变发布按钮的状态
     * @param  {String} state 状态值，只能为'loading'或'reset'
     * @return {[type]}       [description]
     */
    var changeReleaseBtnState = function(state){
    	if(state==='reset'||state==='loading'){
    		var confirmReleaseBtnNode = $("#releaseBtn");
    		confirmReleaseBtnNode.button(state);
    	}
    }
    /**
     * 为发布相关按钮添加事件
     */
    function addEvtToReleaseBtn(){
    	//var releaseBtnNode = $("#releaseBtn");
    	//var cancelReleaseBtnNode = $("#cancelReleaseBtn");
    	var confirmReleaseBtnNode = $("#confirmReleaseBtn");
    	confirmReleaseBtnNode.off('click');
    	confirmReleaseBtnNode.on('click',function(e){
    		console.log('confirmBtn');
    		$('#myModal').modal('hide');
    		changeReleaseBtnState('loading');
        var textArea = $('#message-text').val();
        var selectPublic = $('#checkboxPublic').prop('checked');
        var selectViews = $('#checkboxViews').prop('checked');
        showOverLay();
        if(selectPublic||selectViews){
          var postData = {
            description:textArea,
            selectPublic:selectPublic,
            selectViews:selectViews,
            limit:pageSize
          };
          postUpdateRequest(postData,function (data){
            releaseInfo = JSON.parse(data).data;
            infoCount = JSON.parse(data).count;
            pageCount = Math.ceil(infoCount/pageSize); 
            curPageIdx=1;
            renderLogToView(releaseInfo);
            generatePageIndexTag();
            addClickEvtToPageIndex();
              hideOverLay();
            changeReleaseBtnState('reset');
            toastr.info('发布成功！');
          },function(){
              hideOverLay();
              changeReleaseBtnState('reset');
              toastr.error('发布失败');
          });
        }else{
          toastr.warning('未选择更新文件');
          changeReleaseBtnState('reset');
        }

    	})

        confirmReleaseBtnNode=null;
    }

    /**
     * 模态框事件
     */
    $('#myModal').on('hidden.bs.modal', function (e) {
  	    // do something...
	  })
    $('#myModal').on('show.bs.modal', function (e) {
        // do something...
      //console.log('show');
      $('#message-text').val('');
      $('#checkboxPublic').attr('checked',false);
      $('#checkboxViews').attr('checked',false)
    })
    
    /**
     * 发送发布版本的请求
     * @param  {object} data 传输数据
     * @param  {Function} cb 回调函数
     * @return {[type]}      [description]
     */
    function postUpdateRequest(data,scb,fcb){
    	$.ajax({
    		type:"POST",
    		url:"/admin/manage/release/update",
        data:data,
    		success:function(data,status,xhr){
    			scb&&scb(data);
    		},
    		error:function(err,status,xhr){
                fcb&&fcb();
    			console.log(err);
    		}
    	})
    }

    /**
     * 生成获取URL
     * @param  {String} from  [请求更新信息的起始位置]
     * @param  {String} limit [请求更新信息的数量]
     * @return {String}       [请求URL]
     */
    function generateGetInfoUrl(from,limit){
      if(!((typeof from =="number")||(typeof limit == "number"))){
          return null;
      }
      if(from<0||limit<0){
          return null;
      }
      var url = "/admin/manage/releaseInfo?from="+from+'&limit='+limit;
      return url;
    }

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
     * 生成分页标签
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

        changeSelectPageIndexState(curPageIdx);
    }

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
            var getInfoUrl = generateGetInfoUrl((selectIndex-1)*pageSize,pageSize);
            getReleaseInfo(getInfoUrl,renderLogToView);
        })
        pageIndexLiNodes = null;
    };

    function showOverLay(){
        $('.overlay').show();
    }
    function  hideOverLay(){
        $('.overlay').hide();
    }
    
})