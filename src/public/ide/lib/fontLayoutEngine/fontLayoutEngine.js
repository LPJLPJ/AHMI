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
        this.y += box.h
        this.h -= box.h
    }

    LayoutBox.prototype.clone = function(){
        return new LayoutBox(this.x,this.y,this.w,this.h)
    }

    //layout the total article
    FontLayoutEngine.layoutArticle = function(article, box, options){
        
        for(var i=0;i<article.paragraphs.length;i++){
            //console.log('box before p',box.clone())
            this.layoutParagraph(article.paragraphs[i],box, options)
            //console.log('box after p', box.clone())
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
        box.deleteVertical(new LayoutBox(box.x,box.y,box.w,paragraph.paragraphAttrs.spacingBeforeParagraph))
        this.layoutLine(paragraph,box,lineTrack)
        box.deleteVertical(new LayoutBox(box.x,box.y,box.w,paragraph.paragraphAttrs.spacingAfterParagraph))
        //console.log('box after paragraph',box.clone())
    }

    FontLayoutEngine.preCalculateInfoInLine = function(paragraph,box,lineTrack,options){
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
                //spacing
                curTotalWidth +=  this.calculateNextSpacing(curSpan.text[j],curSpan.text[j+1],curSpan.fontAttrs.fontSpacing,curSpan.fontAttrs.fontHalfSpacing)
            }
            //next span
            if(paragraph.spans[i+1]){
                curTotalWidth +=  this.calculateNextSpacing(curSpan.text[j-1],paragraph.spans[i+1].text[0],curSpan.fontAttrs.fontSpacing,curSpan.fontAttrs.fontHalfSpacing)
            }
            
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
        var lineInfo = this.preCalculateInfoInLine(paragraph,box,lineTrack,options)
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
        var startTextIdx = lineTrack.firstTextIdx
        for(var i = lineTrack.firstSpanIdx;i <= lineTrack.lastSpanIdx;i++){
            var curSpan = paragraph.spans[i]
            var maxTextIdx
            if(i === lineTrack.lastSpanIdx){
                maxTextIdx = lineTrack.lastTextIdx
            }else{
                maxTextIdx = curSpan.text.length-1
            }
            if(!curSpan.characterLayouts){
                curSpan.characterLayouts = []
            }

            for(var j=startTextIdx;j <= maxTextIdx;j++){
                //calculate curCharacter
                curSpan.characterLayouts[j] = {
                    x:startXInLine,
                    y:box.y + lineTrack.lineHeight - curSpan.fontAttrs.fontSize
                }
                //update startXInLine
                startXInLine += curSpan.fontAttrs.fontSize + this.calculateNextSpacing(curSpan.text[j],curSpan.text[j+1],curSpan.fontAttrs.fontSpacing,curSpan.fontAttrs.fontHalfSpacing)// will add font spacing
            }
            if(paragraph.spans[i+1]){
                startXInLine +=  this.calculateNextSpacing(curSpan.text[j-1],paragraph.spans[i+1].text[0],curSpan.fontAttrs.fontSpacing,curSpan.fontAttrs.fontHalfSpacing)
            }
            //next span
            startTextIdx = 0
        }

        //next line
        var nextSpanIdx,nextTextIdx
        var hasNext = false
        if(lineTrack.lastSpanIdx >= paragraph.spans.length-1 && lineTrack.lastTextIdx >= paragraph.spans[paragraph.spans.length-1].text.length-1){
            //finish
        }else if(lineTrack.lastSpanIdx < paragraph.spans.length-1){
            if(lineTrack.lastTextIdx < paragraph.spans[lineTrack.lastSpanIdx].text.length-1){
                nextSpanIdx = lineTrack.lastSpanIdx
                nextTextIdx = lineTrack.lastTextIdx + 1
            }else{
                nextSpanIdx += 1
                nextTextIdx = 0
            }
            hasNext = true
            
        }else{
            nextSpanIdx = lineTrack.lastSpanIdx
            nextTextIdx = lineTrack.lastTextIdx + 1
            hasNext = true
            
        }

        if(hasNext){
            lineTrack.firstSpanIdx = nextSpanIdx
            lineTrack.firstTextIdx = nextTextIdx
            lineTrack.lineIdx+=1
            box.deleteVertical(new LayoutBox(box.x,box.y,box.w,lineTrack.lineHeight+paragraph.paragraphAttrs.spacingBetweenLines))
            lineTrack.lineHeight = 0
            this.layoutLine(paragraph,box,lineTrack,options)
        }else{
            //finish a paragraph
            // box.deleteVertical(new LayoutBox(box.x,box.y,box.w,paragraph.paragraphAttrs.spacingAfterParagraph))
            box.deleteVertical(new LayoutBox(box.x,box.y,box.w,lineTrack.lineHeight))
            
        }

    }

    FontLayoutEngine.calculateNextSpacing = function(formerCharacter,laterCharacter,fullWidthSpacing,halfWidthSpacing){
        var formerType = this.getCharacterType(formerCharacter)
        if(laterCharacter===undefined||laterCharacter===null||laterCharacter===''){
            return 0
        }
        var laterType = this.getCharacterType(laterCharacter)
        if(formerType == 0){
            if(laterType == 0){
                return halfWidthSpacing
            }else{
                return (fullWidthSpacing+halfWidthSpacing)/2
            }
        }else{
            if(laterType == 0){
                return (fullWidthSpacing+halfWidthSpacing)/2
            }else{
                return fullWidthSpacing
            }
        }
    }

    //0-127:half-width character, otherwise full-width character
    FontLayoutEngine.getCharacterType = function(c){
        if(c.charCodeAt(0)<128){
            return 0
        }else{
            return 1
        }
    }

    /*

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

    */
   FontLayoutEngine.showArticleLayout = function(article,canvas){
       article.paragraphs.forEach(function(p){
           this.showParagraphLayout(p,canvas)
       }.bind(this))
   }

    FontLayoutEngine.showParagraphLayout = function(paragraph,canvas){
        var ctx = canvas.getContext('2d')
        for(var i=0;i<paragraph.spans.length;i++){
            var span = paragraph.spans[i]
            var fontAttrs = span.fontAttrs
            var fontSize = fontAttrs.fontSize
            ctx.save()
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            ctx.font = (fontAttrs['fontStyle'] || '') + ' ' + (fontAttrs['fontVariant'] || '') + ' ' + (fontAttrs['fontWeight'] || '') + ' ' + (fontAttrs['fontSize'] || 24) + 'px' + ' ' + ('"' + fontAttrs['fontFamily'] + '"' || 'arial');
            for(var j=0;j<span.text.length;j++){
                // ctx.drawText(span.text[j],)
                ctx.rect(span.characterLayouts[j].x,span.characterLayouts[j].y,fontSize,fontSize)
                ctx.fillText(span.text[j],span.characterLayouts[j].x+fontSize/2,span.characterLayouts[j].y+fontSize/2)
            }
            ctx.restore()
        }
        ctx.stroke()
    }

    //test
    FontLayoutEngine.test = function(){
        var testParagraph = {
            paragraphAttrs:{
                align:'left',
                indentationLeft:10,
                indentationRight:10,
                firstLineIndentation:10,
                spacingBetweenLines:10,
                spacingBeforeParagraph:10,
                spacingAfterParagraph:10
            },
            spans:[
                {
                    fontAttrs:{
                        fontFamily:'Arial',
                        fontSize:24,
                        fontBold:true,
                        fontItalic:false,
                        fontColor:null,
                        fontSpacing:20,
                        fontHalfSpacing:10,
                        fontVerticalOffset:0
                    },
                    text:'a我c1'
                },
                {
                    fontAttrs:{
                        fontFamily:'Arial',
                        fontSize:30,
                        fontBold:true,
                        fontItalic:false,
                        fontColor:null,
                        fontSpacing:20,
                        fontHalfSpacing:10,
                        fontVerticalOffset:0
                    },
                    text:'a我c1'
                }
            ]
        }
        var testParagraph2 = {
            paragraphAttrs:{
                align:'left',
                indentationLeft:10,
                indentationRight:10,
                firstLineIndentation:10,
                spacingBetweenLines:10,
                spacingBeforeParagraph:10,
                spacingAfterParagraph:10
            },
            spans:[
                {
                    fontAttrs:{
                        fontFamily:'Arial',
                        fontSize:24,
                        fontBold:true,
                        fontItalic:false,
                        fontColor:null,
                        fontSpacing:20,
                        fontHalfSpacing:10,
                        fontVerticalOffset:0
                    },
                    text:'a我c123'
                }
            ]
        }
        var testArticle = {
            paragraphs:[testParagraph,testParagraph2]
        }
        var box = new LayoutBox(0,0,120,200)
        var canvas = document.createElement('canvas')
        canvas.width = box.w+50
        canvas.height = box.h+50
        document.body.appendChild(canvas)
        // this.layoutParagraph(testParagraph,box)
        // console.log(testParagraph)
        // this.showLayout(testParagraph,canvas)
        this.layoutArticle(testArticle,box)
        this.showArticleLayout(testArticle,canvas)
    }

    return FontLayoutEngine
}))