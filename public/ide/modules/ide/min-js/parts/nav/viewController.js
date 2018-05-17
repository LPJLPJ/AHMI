ide.controller("ViewCtl",["$scope","ViewService","ProjectService",function(t,i,o){function e(){t.defaultRatios=["25%","50%","75%","100%","125%","150%","175%","200%","225%","250%"],n(),t.ratioRange={min:25,max:250}}function n(){o.isEditingPage()?(t.isEditingPage=!0,t.viewRatio=i.getScale("page")):(t.isEditingPage=!1,t.viewRatio=i.getScale("canvas"))}function p(){function o(i){var o,e=parseInt(t.viewRatio);i<0?e<250&&(e+=5):i>0&&e>25&&(e-=5),o=e+"%",t.defaultRatios.splice(10,1,o),t.viewRatio=o}t.$on("AttributeChanged",function(){n()}),t.$on("wheelScale",function(t,i){o(i)}),t.$watch("viewRatio",function(){var o=t.isEditingPage?"page":"subCanvas";i.setScale(t.viewRatio,o),t.$emit("changeCanvasScale",o)}),t.startTip=function(){(new SXIntro).setIntro([{tooltip:"<h4>导航栏</h4><p>1.在文件菜单中可以对工程进行基本操作</p> <p>2.在开始菜单中有基本操作按钮</p><p>3.编辑中有常用辅助操作功能</p>  <p>4.在格式中可以选择字体</p> <p>5.视图能够显示或隐藏侧边栏, 帮助栏中有丰富的资料</p>",position:"bottom"},{tooltip:"<h4>页面缩略图栏</h4> <p>在这里您可以点击+号新增一个页面</p> <p>也可以通过缩略图选择页面，甚至可以拖动页面进行排序！</p>",position:"right"},{tooltip:"<h4>舞台区</h4> <p>在这里您的操作将直接反馈并实时显示到这里</p> <p>并且您可以直接和舞台上的元素进行交互。包括拖动，缩放，右键菜单等</p>",position:"right"},{tooltip:"<h4>功能栏</h4> <p>1.属性栏目可以查看并修改选中元素的属性</p> <p>2.资源栏目可以上传、查看您的资源，包括字体和图片。</p> <p>3.变量栏可以增加、查看、编辑变量和定时器</p><p>4.字体栏为支持字体属性的控件设置字体</p>",position:"left"},{tooltip:"<h4>层级栏</h4> <p>这里显示了当前页面的层级结构，包括图层控件，子控件等，可以在这里进行快速选择</p>",position:"left"}]).start()}}t.$on("GlobalProjectReceived",function(){e(),p()})}]);