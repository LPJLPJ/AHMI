/*
 * @Author: lixiang 
 * @Date: 2018-10-17 14:44:30 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-10-21 14:45:36
 * @Description: 工具函数，拓展imgElement对象,实现Gif的播放和停止（没有暂停）利用canvas缓存gif的第一帧
 */

(function () {
    if ('getContext' in document.createElement('canvas')) {

        /**
         * @params:play bool 启动后是否是播放状态
         */
        HTMLImageElement.prototype.start = function (play) {
            if (play) {
                return;
            }
            this.onload = function () {
                this.stop();
                this.onload = null;
            }
        }

        HTMLImageElement.prototype.play = function () {
            if (this.storeCanvas) {
                // 移除存储的canvas
                this.storeCanvas.parentElement.removeChild(this.storeCanvas);
                this.storeCanvas = null;
                this.style.opacity = '';
            }
            if (this.storeUrl) {
                this.src = this.storeUrl;
            }
        }

        HTMLImageElement.prototype.stop = function () {
            var canvas = document.createElement('canvas');
            var width = this.width;
            var height = this.height;
            if (width && height) {
                if (!this.storeUrl) {
                    // 存储原始url
                    this.storeUrl = this.src;
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(this, 0, 0, width, height);
                try {
                    // 重置src
                    this.src = canvas.toDataURL("image/gif");
                } catch (e) {
                    console.log('跨域', e);
                    this.removeAttribute('src');
                    canvas.className = this.className;
                    // 插入canvas
                    this.parentElement.insertBefore(canvas, this);
                    this.style.opacity = '0';
                    this.storeCanvas = canvas;
                }

            }
        }
    }


})()