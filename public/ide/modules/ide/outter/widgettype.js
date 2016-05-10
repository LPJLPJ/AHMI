/**
 * Created by jhwang on 14-6-21.
 */
define(function(require, exports) {

    var Types = {
        /// <summary>
        /// 图片
        /// </summary>
        Img: 'Img',
        //动态图
        Gif: 'Gif',
        //文本
        TextField:'TextField',
        //公式
        Graphica:'Graphica',
        //表格
        Table:'Table',
        //热区
        Spot:'Spot',
        /// <summary>
        /// 画廊
        /// </summary>
        Gallery: 'Gallery',
        //视频
        Video: 'Video',
        //音频
        Audio: 'Audio',

        /// <summary>
        /// 练习题
        /// </summary>
        Exercise: 'Exercise',

        /// <summary>
        /// 评测卡片
        /// </summary>
        CnEval: 'CnEval',
        //英文评测
        EnEval:'EnEval',
        //情景对话
        Situdlg:'Situdlg',

        // 数学公式
        MathEquation :'MathEquation',

        // 函数图像
        MathGraph:'MathGraph',

        /// <summary>
        /// 其他第三方可执行程序
        /// </summary>
        Proc3rd: 'Proc3rd',

        //气泡
        Bubble:'Bubble',

        //翻翻卡
        Flipcard:'Flipcard',

        //时间轴
        History:'History',

        //分类选择
        Pickcard:'Pickcard',

        //PPT
        PPT:'PPT',

        //连线题
        Matchcard:'Matchcard',

        //下载进度
        Download:"Download",

        //iflybook
        Iflybook:"Iflybook"
    };

       //此类型Widget要在DOM上画
       var ComplexWidgetTypes=[Types.Situdlg,Types.Exercise,Types.Gallery,Types.CnEval,Types.Bubble,Types.EnEval,Types.Flipcard,Types.History,Types.PPT,Types.Pickcard,Types.Video,Types.Audio,Types.Spot,Types.Matchcard,Types.Gif,Types.Proc3rd,Types.Download,Types.Iflybook];

    /**
     * 是否是复杂类型Widget，此类型Widget要在DOM上画
     * @param wtype
     * @returns {boolean}
     */
       function isComplexWidget(wtype){
            return jQuery.inArray(wtype,ComplexWidgetTypes)!=-1;
       };

       exports.isComplexWidget=isComplexWidget;
       exports.Types=Types;
});