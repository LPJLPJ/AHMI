/**
 * create by lixiang 
 * create time : 2018/10/16
 */
(function () {
    // 轮播图状态
    var state = {
        item1: 'slide-item-middle',
        item2: 'slide-item-left',
        item3: 'slide-item-right',
        changeState: function (clockwise) {
            // clockwise true向左（顺时针） false 向右（逆时针）
            var temp;
            if (clockwise) {
                temp = this.item1;
                this.item1 = this.item2;
                this.item2 = this.item3;
                this.item3 = temp;
            } else {
                temp = this.item3;
                this.item3 = this.item2;
                this.item2 = this.item1;
                this.item1 = temp;
            }
        },
        getCurrentItemName: function () {
            for (var key in this) {
                if (typeof this[key] !== 'string') {
                    return null;
                }
                if (this[key].indexOf('middle') > -1) {
                    return key;
                }
            }
            return null;
        }
    }
    // 轮播图class前缀
    var classPrefix = "slide-item ";

    // delay工具函数
    var delay = (time) => {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        })
    }

    // 获取元素当对于视口的offsettop
    var getOffsetTop = (elem) => {
        return elem && elem.getBoundingClientRect && elem.getBoundingClientRect().top || 0;
    }

    // 标题栏元素引用
    var titleElem = document.querySelector('.title');
    var titleMaster = titleElem.querySelector('.title-master');
    var titleSub = titleElem.querySelector('.title-sub');
    var titleButton = titleElem.querySelector('.title-button');

    // 首页大图元素引用
    var jumbotronElem = document.querySelector('.jumbotron');
    var jumbotronImg = jumbotronElem.querySelector('.jumbotron-img');
    var jumbotronList = jumbotronElem.querySelector('.jumbotron-list');
    var jumbotronListOffsetTop = getOffsetTop(jumbotronList); // 列表相对于顶端的偏移

    // video 引用
    var videoElem = document.querySelector('.video-box');

    // feature 引用
    var featureList = document.querySelector('.feature-list');

    // introduce 引用
    var introduceList = document.querySelector('.introduce-list');


    // 轮播图元素引用
    var selectorElem = document.querySelector('.slide');
    var selectrorContainer = selectorElem.querySelector('.slide-container');
    var item1 = selectorElem.querySelector('.slide-item-middle');
    var item2 = selectorElem.querySelector('.slide-item-left');
    var item3 = selectorElem.querySelector('.slide-item-right');
    var leftBtn = selectorElem.querySelector('.left-icon');
    var rightBtn = selectorElem.querySelector('.right-icon');




    // 初始化函数
    var initialize = function () {
        animateTitle();
        animateVido();
        animateFeatureList();
        animateIntroduceList();
        animateCarousel()
        initCarousel();
    }

    // 轮播图左按钮点击事件处理
    var hanldeLeftClick = function (e) {
        state.changeState(true);
        item1.className = classPrefix + state.item1;
        item2.className = classPrefix + state.item2;
        item3.className = classPrefix + state.item3;
        handleGifState();
    }

    // 轮播图右按钮点击事件处理
    var handleRightClick = function (e) {
        state.changeState(false);
        item1.className = classPrefix + state.item1;
        item2.className = classPrefix + state.item2;
        item3.className = classPrefix + state.item3;
        handleGifState()
    }

    // 处理Gif的状态
    var handleGifState = function () {
        item1.stop();
        item2.stop();
        item3.stop()
        setTimeout(function () {
            var current = state.getCurrentItemName();
            switch (current) {
                case 'item1':
                    item1.play();
                    break;
                case 'item2':
                    item2.play();
                    break;
                case 'item3':
                    item3.play();
                    break;
                default:
                    break;
            }

        }, 600)
    }


    var handleScroll = function (e) {
        if (!animateJumbotronList.triggered) {
            animateJumbotronList();
        }
        if (!animateVido.triggered) {
            animateVido();
        }
        if (!animateFeatureList.triggered) {
            animateFeatureList();
        }
        if (!animateIntroduceList.triggered) {
            animateIntroduceList();
        }
        if (!animateCarousel.triggered) {
            animateCarousel();
        }
    }

    // 初始化轮播图
    var initCarousel = function () {
        item1.start(true);
        item2.start();
        item3.start();
    }

    // tilte 动画
    var animateTitle = function () {
        delay(100)
            .then(() => {
                titleMaster.className += " active";
                return delay(100);
            })
            .then(() => {
                titleSub.className += " active";
                return delay(100);
            })
            .then(() => {
                titleButton.className += " active";
                return delay(100);
            })
            .then(() => {
                jumbotronImg.className += " active";
            })
            .catch((err) => {
                console.log('err', err);
            })
    }

    // 列表出现动画
    var animateJumbotronList = function () {
        var clientHeight = document.documentElement.clientHeight; // 视口高度
        var jumbotronHeight = jumbotronList.clientHeight;
        var offsetTop = getOffsetTop(jumbotronList);
        if (offsetTop < (clientHeight - jumbotronHeight / 3)) {
            animateJumbotronList.triggered = true;
            var listItems = jumbotronList.querySelectorAll('.list-item');
            delay(100)
                .then(() => {
                    listItems[0].className += " active";
                    return delay(100);
                })
                .then(() => {
                    listItems[1].className += " active";
                    return delay(100);
                })
                .then(() => {
                    listItems[2].className += " active";
                })
        }
    }

    // 主视频动画出现
    var animateVido = function () {
        var clientHeight = document.documentElement.clientHeight; // 视口高度
        var videoBoxHeight = videoElem.clientHeight;
        var offsetTop = getOffsetTop(videoElem);
        if (offsetTop < (clientHeight - videoBoxHeight / 4)) {
            animateVido.triggered = true;
            videoElem.className += " active";
        }
    }

    // 特点列表动画
    var animateFeatureList = function () {
        var clientHeight = document.documentElement.clientHeight; // 视口高度
        var featureListHeight = featureList.clientHeight;
        var offsetTop = getOffsetTop(featureList);
        if (offsetTop < (clientHeight - featureListHeight / 3)) {
            animateFeatureList.triggered = true;
            var listItems = featureList.querySelectorAll('span');
            delay(100)
                .then(() => {
                    listItems[0].className += " active";
                    return delay(100);
                })
                .then(() => {
                    listItems[1].className += " active";
                    return delay(100);
                })
                .then(() => {
                    listItems[2].className += " active";
                    return delay(100)
                })
                .then(() => {
                    listItems[3].className += " active";
                })
        }
    }

    // 介绍列表动画
    var animateIntroduceList = function () {
        var clientHeight = document.documentElement.clientHeight; // 视口高度
        var introduceListHeight = introduceList.clientHeight;
        var offsetTop = getOffsetTop(introduceList);
        if (offsetTop < (clientHeight - introduceListHeight / 3)) {
            animateIntroduceList.triggered = true;
            var listItems = introduceList.querySelectorAll('.introduce-list-item');
            delay(100)
                .then(() => {
                    listItems[0].className += " active";
                    return delay(100);
                })
                .then(() => {
                    listItems[1].className += " active";
                    return delay(100);
                })
                .then(() => {
                    listItems[2].className += " active";
                })
        }
    }

    // 轮播图出现动画
    var animateCarousel = function () {
        var clientHeight = document.documentElement.clientHeight; // 视口高度
        var selectrorContainerH = selectrorContainer.clientHeight;
        var offsetTop = getOffsetTop(selectrorContainer);
        if (offsetTop < (clientHeight - selectrorContainerH / 3)) {
            animateCarousel.triggered = true;
            selectrorContainer.className += " active";
        }
    }

    // 事件绑定
    leftBtn.addEventListener('click', hanldeLeftClick, false);
    rightBtn.addEventListener('click', handleRightClick, false);
    window.addEventListener('scroll', handleScroll, false);

    // 执行初始化函数
    initialize();

})()