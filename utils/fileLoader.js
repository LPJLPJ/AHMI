/**
    Simple File Loader for dynamically loading files in list
    created by Zzen1sS on 2018/2/25
 **/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('FileLoader', factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory()
    } else {
        // Browser globals
        window.FileLoader = factory();
    }
}(function () {
    var FileLoader = {}


    /**
     * Get File Type
     * @param fileUrl
     * @return fileType
     */
    function getFileType(url) {
        url = ''+url
        url = url.split('?')[0]

        var parts = url.split('.')
        var ext = parts[parts.length-1]
        switch (ext.toLowerCase()){
            case 'js':
                return 'js'
            case 'css':
                return 'css'
            default:
                return null
        }
    }

    /**
     * Get Head DOM
     * @return Head
     */
    function getHead() {
        return document.getElementsByTagName('head')[0]
    }

    /**
     * Load JS
     * @param jsUrl
     * @param cb
     */
    function loadJS(jsUrl,cb) {
        var head = getHead()
        var s = document.createElement('script')
        s.setAttribute('src',jsUrl)
        s.onload = cb
        head.appendChild(s)
    }


    function generateJS(jsUrl) {
        return '<script src="'+jsUrl+'"></script>'
    }

    /**
     * Load CSS
     * @param cssUrl
     * @param cb
     */
    function loadCSS(cssUrl,cb) {
        var head = getHead()
        var c = document.createElement('link')
        c.setAttribute('rel',"stylesheet")
        c.setAttribute('href',cssUrl)
        c.onload = cb
        head.appendChild(c)
    }

    function generateCSS(cssUrl) {
        return '<link rel="stylesheet" href="'+cssUrl+'" >'
    }

    /**
     * Load File By url
     * @param url
     * @param cb
     */
    FileLoader.loadFile = function (url,cb) {
        var type = getFileType(url)
        if (type === 'js'){
            loadJS(url,cb)
        }else if (type === 'css'){
            loadCSS(url,cb)
        }
    }


    FileLoader.generateFile = function (url) {
        var type = getFileType(url)
        if (type === 'js'){
            return generateJS(url)
        }else if (type === 'css'){
            return generateCSS(url)
        }
    }

    /**
     * Load Files By urls sequence
     * @param urls
     * @param cb
     */
    FileLoader.loadFiles = function (urls,cb) {
        if (urls[0]!==undefined){
            FileLoader.loadFile(urls[0],function () {
                console.log('loaded ',urls[0])
                FileLoader.loadFiles(urls.slice(1),cb)
            })
        }else {
            cb && cb()
        }
    }

    FileLoader.generateFiles = function (urls) {
        var result = ''
        urls.forEach(function (url) {
            result += FileLoader.generateFile(url) + '\n'
        })
        return result
    }

    return FileLoader
}))