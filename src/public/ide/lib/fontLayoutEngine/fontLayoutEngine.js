//created by Zzen1sS 2019.3.7
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports = factory()
    } else {
        // Browser globals
        window.FontLayoutEngine = factory();
    }
}(function(){
    var FontLayoutEngine = {}

    //stand structure of an article
    /*

        article:{
            paragraphs:[
                {
                    paragraphAttrs,
                    spans:[
                        {
                            fontAttrs,
                            text,
                            characterLayouts:[
                                {x,y,lineIdx}
                            ]
                        }
                    ]
                }
            ]
        }





    */

    //font attrs
    /*
        font:{
            fontFamily,
            fontSize,
            fontBold,
            fontItalic,
            fontColor,
            fontSpacing,
            fontHalfSpacing,
            fontVerticalOffset,

        }

    */

    //paragraph attrs
    /*
        paragraph:{
            align,
            indentationLeft,
            indentationRight,
            firstLineIndentation,
            spacingBetweenLines,
            spacingBeforeParagraph,
            spacingAfterParagraph
        }



    */

    //the box to layout text
    function LayoutBox(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    LayoutBox.prototype.deleteVertical = function(box){
        return new LayoutBox(this.x,this.y+box.h,this.w,this.h-box.h)
    }

    //layout the total article
    FontLayoutEngine.layoutArticle = function(article, box, options){
        var lastParagraphBox = null
        var boxLeft = box
        for(var i=0;i<article.paragraphs.length;i++){
            lastParagraphBox = this.layoutParagraph(article.paragraphs[i],boxLeft, options)
            boxLeft = boxLeft.deleteVertical(lastParagraphBox)
        }
    }

    //layout paragraph
    FontLayoutEngine.layoutParagraph = function(paragraph,box, options){
        var lineTrack = {
            x:box.x,
            y:box.y,
            lineHeight:0,
            lineIdx:0,
            firstSpanIdx:0,
            firstTextIdx:0,
            lastSpanIdx:0,
            lastTextIdx:0
            
        }
        // var lineIdx = 0
        //this.layoutSpan(paragraph,box,0,0,lineTrack)
        this.layoutLine(paragraph,box,lineTrack)
    }

    function preCalculateInfoInLine(paragraph,box,lineTrack,options){
        //var lastSpanIdx = lineTrack.firstSpanIdx
        var lastTextIdx = lineTrack.firstTextIdx
        var curTotalWidth = 0
        var lineHeight = 0
        for(var i = lineTrack.firstSpanIdx;i < paragraph.spans.length;i++){
            var curSpan = paragraph.spans[i]
            if(curSpan.fontAttrs.fontSize > lineHeight){
                lineHeight = curSpan.fontAttrs.fontSize
            }
            for(var j=lastTextIdx;j < curSpan.text.length;j++){
                curTotalWidth += curSpan.fontAttrs.fontSize
                if(curTotalWidth > box.w){
                    //need change line
                    return {
                        lastSpanIdx:i,
                        lastTextIdx:j-1,
                        lineHeight:lineHeight,
                        totalWidth:curTotalWidth
                    }
                }
            }
            //next span
            lastTextIdx = 0
        }
        return {
            lastSpanIdx:i-1,
            lastTextIdx:j-1,
            lineHeight:lineHeight,
            totalWidth:curTotalWidth
        }
    }

    //layout a line of paragraph
    FontLayoutEngine.layoutLine = function(paragraph,box,lineTrack,options){
        //calculate span and text range
        //update lastSpanIdx and lastTextIdx
        var lineInfo = preCalculateInfoInLine(paragraph,box,lineTrack,options)
        lineTrack.lastSpanIdx = lineInfo.lastSpanIdx
        lineTrack.lastTextIdx = lineInfo.lastTextIdx
        lineTrack.lineHeight = lineInfo.lineHeight
        var curTotalWidth = lineInfo.totalWidth
        var startXInLine 
        switch(paragraph.align){
            case 'center':
                startXInLine = box.x + (box.w - curTotalWidth)/2
            break;
            case 'right':
                startXInLine = box.x + box.w - curTotalWidth
            break;
            default:
            //left
                startXInLine = box.x
        }

        //layout characters in line
        var lastTextIdx = lineTrack.lastTextIdx
        for(var i = lineTrack.firstSpanIdx;i < lineTrack.lastSpanIdx;i++){
            var curSpan = paragraph.spans[i]
            var maxTextIdx
            if(i === lineTrack.lastSpanIdx){
                maxTextIdx = lineTrack.lastTextIdx
            }else{
                maxTextIdx = curSpan.text.length
            }
            for(var j=lastTextIdx;j < maxTextIdx;j++){
                //calculate curCharacter
                curSpan.characterLayouts[j] = {
                    x:startXInLine,
                    y:box.y + lineTrack.lineHeight - curSpan.fontAttrs.fontSize
                }
                //update startXInLine
                startXInLine += curSpan.fontAttrs.fontSize // will add font spacing
            }
            //next span
            lastTextIdx = 0
        }

        //next line
        var nextSpanIdx,nextTextIdx
        var hasNext = false
        if(lineTrack.lastSpanIdx >= paragraph.spans.length-1 && lineTrack.lastTextIdx >= paragraph.spans[paragraph.spans.length-1].text.length-1){
            //finish
        }else if(lineTrack.lastSpanIdx < paragraph.spans.length-1){
            if(lineTrack.lastTextIdx < paragraph.spans[lineTrack.lastSpanIdx].text.length-1){
                nextSpanIdx = lineTrack.lastSpanIdx
                nextTextIdx += 1
            }else{
                nextSpanIdx += 1
                nextTextIdx = 0
            }
            hasNext = true
            
        }else{
            nextSpanIdx = lineTrack.lastSpanIdx
            nextTextIdx += 1
            hasNext = true
            
        }

        if(hasNext){
            lineTrack.firstSpanIdx = nextSpanIdx
            lineTrack.firstTextIdx = nextTextIdx
            lineTrack.lineIdx+=1
            box.deleteVertical(new LayoutBox(box.x,box.y,box.w,lineTrack.lineHeight))
            lineTrack.lineHeight = 0
            layoutLine(paragraph,box,lineTrack,options)
        }

    }



    //layout span with spanIdx and textIdx
    FontLayoutEngine.layoutSpan = function(paragraph,box,spanIdx,textIdx,lineTrack){
        var span = paragraph.spans[spanIdx]
        var character = span.text[textIdx]
        var fontSize = span.fontAttrs.fontSize
        //update lineHeight
        var lineHeight = fontSize
        if(lineHeight > lineTrack.lineHeight){
            lineTrack.lineHeight = lineHeight
            //update characters in same line
            // var firstCharacterPos = getFirstCharacterInLine(paragraph,spanIdx,textIdx,lineTrack.lineIdx)
            this.layoutSpan(paragraph,box,lineTrack.firstSpanIdx,lineTrack.firstTextIdx,lineTrack)
        }else{
            //same line
            
        }
    }

    return FontLayoutEngine
}))