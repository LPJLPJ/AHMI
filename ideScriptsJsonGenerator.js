var cheerio = require('cheerio')
// var cheerioCreateTextNode = require('cheerio-create-text-node')
var fs = require('fs')
var path = require('path')
var legacyBaseUrl = path.join(__dirname,'legacy')
// var ideVersion = '1.10.2'

function retriveScripts(ideVersion) {
    if (!ideVersion){
        return console.log('please provide ideVersion')
    }
    fs.stat(path.join(legacyBaseUrl,ideVersion,'ideScripts.json'),function (err, stats) {
        if (err){
            retriveScriptsByVersion(ideVersion)
        }else{
            if (stats && stats.isFile()){
                //exits
                console.log('already exists')
            }else{
                retriveScriptsByVersion(ideVersion)
            }
        }
    })


}


function retriveScriptsByVersion(ideVersion) {
    fs.readFile(path.join(legacyBaseUrl,ideVersion,'views/ide/index.html'),function (err,data) {
        var $ = cheerio.load(data)

        // cheerioCreateTextNode.use($)
        var headContents = $('head').children()
        var frontScripts = []
        var shouldRemoveDOMs = []
        headContents.each(function (i, elem) {
            var curElem = $(this)
            if ((curElem.is('script') && curElem.attr('src') )){
                frontScripts.push(curElem.attr('src'))
                shouldRemoveDOMs.push(curElem)
            }else if((curElem.is('link') && curElem.attr('href'))){
                frontScripts.push(curElem.attr('href'))
                shouldRemoveDOMs.push(curElem)
            }
        })


        var bodyContents = $('body').children()
        var bodyDOMs = []
        bodyDOMs = bodyContents.map(function (i, elm) {
            return $(this)
        })
        var bodyScripts = []
        var shouldRemoveRearDOMs = []
        for(var i=0;i<bodyDOMs.length;i++){
            var curElem = bodyDOMs[i]
            if (curElem.is('script')&&curElem.attr('src')){
                bodyScripts.push(curElem.attr('src'))
                shouldRemoveRearDOMs.push(curElem)
            }else {
                bodyScripts = []
                shouldRemoveRearDOMs = []
            }
        }
        // console.log(bodyScripts)

        postProcessHTML(ideVersion,$,shouldRemoveDOMs.concat(shouldRemoveRearDOMs),frontScripts,bodyScripts)

    })
}




function postProcessHTML(ideVersion,$,shouldRemoveDOMs,frontScripts,bodyScripts) {
    shouldRemoveDOMs.forEach(function (elem) {
        elem.remove()
    })
    var processedHtml = addEJSanchor($.html())

    var ideScripts = {
        frontScripts:frontScripts,
        rearScripts:bodyScripts
    }

    fs.writeFile(path.join(legacyBaseUrl,ideVersion,'views/ide/index.html'),processedHtml,function (err) {
        if (err){
            console.log(err)
        }else{
            fs.writeFile(path.join(legacyBaseUrl,ideVersion,'ideScripts.json'),JSON.stringify(ideScripts,null,4),function (err) {
                if (err){
                    console.log(err)
                }else{
                    console.log('finished with ideVersion: '+ideVersion)
                }
            })
        }
    })






}


function addEJSanchor(htmlText) {
    var backslashTitleIdx = htmlText.indexOf('<\/title>')
    var frontScriptIdx
    if (backslashTitleIdx!==-1){
        frontScriptIdx = backslashTitleIdx + 8
        htmlText = htmlText.slice(0,frontScriptIdx) + '<%- frontScripts %>' + htmlText.slice(frontScriptIdx)
    }

    var backslashBodyIdx = htmlText.indexOf('<\/body>')
    var rearScriptIdx
    if (backslashBodyIdx!==-1){
        rearScriptIdx = backslashBodyIdx
        htmlText = htmlText.slice(0,rearScriptIdx) + '<%- rearScripts %>' + htmlText.slice(rearScriptIdx)
    }

    return htmlText
}


retriveScripts(process.argv[2])