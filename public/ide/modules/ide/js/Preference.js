/**
 * Created by shenaolin on 16/3/10.
 */
ideServices
//IDE的偏好设置
    .service('Preference', function () {

        /**
         * 空白Layer的URL
         * @type {string}
         */
        this.BLANK_LAYER_URL='/public/images/blank.png';


        this.getRandomImageURL= function () {
            return 'demo3'+'.jpg';
        };
        this.THUMB_URL='thumb.jpg';
        /**
         * 实时预览图的更新频率,负数不实时更新
         * @type {number}
         */
        this.THUMB_REAL_TIME=-1;
        /**
         * 删除组件时组件的渐变时间
         * @type {number}
         */
        this.FX_DURATION=100;

        /**
         * 给对象起名的最大长度
         * @type {number}
         */
        this.OBJECT_MAX_LENGTH=20;

        this.GROUP_CONTROL_VISIBLE={
            bl:false,br:false,mb:false,ml:false,
            mr:false,mt:false,tl:false,tr:false,mtr:false
        }
        this.WIDGET_CONTROL_VISIBLE={
            bl:true,br:true,mb:true,ml:true,
            mr:true,mt:true,tl:true,tr:true,mtr:true
        }

        this.WHITE_COLOR='rgba(255,255,255,1.0)';
        /**
         * 数字图片
         * @type {string[]}
         */
        this.NUMBER_IMAGES=['0.png','1.png','2.png','3.png','4.png',
        '5.png','6.png','7.png','8.png','9.png','add.png','sub.png','dot.png'];

    })