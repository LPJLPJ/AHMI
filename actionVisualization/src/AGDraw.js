/**
 * created by Zzen1sS
 **/

function getViewLayerTrace(view) {
    let traces = []
    while (view){
        traces.unshift(view)
        if (!view.layer){
            //trace up

            view = view.parent
        }else{
            //hit
            break
        }
    }
    return traces
}

function translateLayerCtxByTrace(ctx,traces) {


    for(let i=0;i<traces.length;i++){
        //translate
        ctx.translate(traces[i].frame.origin.x,traces[i].frame.origin.y)
        let m = traces[i].transform
        ctx.transform(m.a,m.b,m.c,m.d,m.e,m.f)
    }
    return ctx
}

function getViewContext(view) {
    let layerTrace = getViewLayerTrace(view)
    let ctx
    if (layerTrace.length&&layerTrace[0].layer){
        ctx = layerTrace[0].layer.getContext('2d')
        ctx.resetTransform()
        ctx = translateLayerCtxByTrace(ctx,layerTrace)

    }else{
        console.log("can't find a layer to draw")
    }
    return ctx
}

function convertAGColor(agColor) {
    if(agColor){
        return 'rgba('+agColor.r+','+agColor.g+','+agColor.b+','+agColor.a+')'
    }else{
        return null
    }

}



let AGDraw = {
    canvas:{

        // drawView(view){
        //     let layerTrace = getViewLayerTrace(view)
        //     if (layerTrace.length&&layerTrace[0].layer){
        //         var ctx =
        //     }else{
        //         console.log("can't find a layer to draw")
        //     }
        // },
        // drawRect(ctx,shape){
        //     ctx.save()
        //     ctx.fillStyle = shape.fillStyle
        //     ctx.strokeStyle = shape.strokeStyle
        //     ctx.beginPath()
        //     ctx.rect(shape.origin.x,shape.origin.y,shape.size.width,shape.size.height)
        //     ctx.fill()
        //     ctx.stroke()
        //     ctx.restore()
        // },
        // drawCircle(ctx,shape){
        //     ctx.save()
        //     ctx.fillStyle = shape.fillStyle
        //     ctx.strokeStyle = shape.strokeStyle
        //     ctx.beginPath()
        //     ctx.arc(shape.center.x,shape.center.y,r,0,2*Math.PI);
        //     ctx.fill()
        //     ctx.stroke()
        //     ctx.restore()
        // }
        initLayer(view,id){
            if (view.layer){
                view.layer = null
            }
            if(id){
                view.layer = document.getElementById(id)
            }else{
                view.layer = document.createElement('canvas')
            }

            view.layer.width = view.bounds.size.width
            view.layer.height = view.bounds.size.height
        },
        updateLayer(view){
            view.layer.width = view.bounds.size.width
            view.layer.height = view.bounds.size.height
        },
        drawArrow(ctx,x1,y1,x2,y2,aw,ah){
            if (x1 === x2 && y1 === y2){
                return
            }
            let lineW = Math.sqrt(Math.pow(y2-y1,2)+Math.pow(x2-x1,2))
            let x3 = x2 - aw/lineW *(x2-x1)
            let y3 = y2 - aw/lineW * (y2-y1)
            let a = x2 -x1
            let b = y2 -y1
            let temp =0
            let x4=0,x5=0,y4=0,y5=0
            if (a){
                temp = ah*Math.sqrt(1.0/(b/a *b/a+1))
                y4 = y3 + temp
                y5 = y3 - temp
                x4 = x3-b/a*temp
                x5 = x3+b/a*temp
            }else{
                temp = ah * Math.sqrt(1.0/(a/b*a/b+1))
                x4 = x3 + temp
                x5 = x3 - temp
                y4 = y3-a/b*temp
                y5 = y3+a/b*temp
            }
            // console.log(x1,y1,x2,y2,x3,y3,x4,y4,x5,x5)

            ctx.beginPath()
            // ctx.arc(x3,y3,2,0,2*Math.PI)
            ctx.moveTo(x4,y4)
            ctx.lineTo(x2,y2)
            ctx.lineTo(x5,y5)
            ctx.closePath()
            ctx.fill()


        },
        drawLine(view,shape){
            let ctx = getViewContext(view)
            if (!ctx){
                console.error('no ctx supoorted')
                return
            }
            ctx.save()
            ctx.fillStyle = convertAGColor(shape.fillStyle)
            ctx.strokeStyle = convertAGColor(shape.strokeStyle)
            ctx.lineWidth = shape.lineWidth
            ctx.beginPath()
            ctx.moveTo(shape.start.x,shape.start.y)
            ctx.lineTo(shape.stop.x,shape.stop.y)
            ctx.stroke()
            ctx.save()
            ctx.fillStyle = ctx.strokeStyle
            this.drawArrow(ctx,shape.start.x,shape.start.y,shape.stop.x,shape.stop.y,8,4)
            ctx.restore()
            ctx.restore()
        },
        drawBrokenLine(view,line1,line2){
            this.drawLine(view,line1)
            this.drawLine(view,line2)
        },
        drawText(view,shape){
            let ctx = getViewContext(view)
            if (!ctx){
                console.error('no ctx supoorted')
                return
            }
            ctx.save()
            ctx.fillStyle = convertAGColor(shape.font.fontColor)
            // ctx.strokeStyle = convertAGColor(shape.font.color)
            ctx.font = shape.font.fontSize+'px'+' '+ '"'+shape.font.fontFamily +'"'
            ctx.textAlign = shape.textAlign
            ctx.textBaseline = shape.textBaseline

            ctx.beginPath()

            ctx.fillText(shape.text,shape.origin.x,shape.origin.y)
            ctx.restore()
        },
        drawRect(view,shape){
            let ctx = getViewContext(view)
            if (!ctx){
                console.error('no ctx supoorted')
                return
            }
            ctx.save()
            ctx.fillStyle = convertAGColor(shape.fillStyle)
            ctx.strokeStyle = convertAGColor(shape.strokeStyle)
            ctx.beginPath()
            ctx.rect(shape.origin.x,shape.origin.y,shape.size.width,shape.size.height)
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        },
        drawCircle(ctx,shape){
            ctx.save()
            ctx.fillStyle = shape.fillStyle
            ctx.strokeStyle = shape.strokeStyle
            ctx.beginPath()
            ctx.arc(shape.center.x,shape.center.y,r,0,2*Math.PI);
            ctx.fill()
            ctx.stroke()
            ctx.restore()
        }
    },
    svg:{
        drawRect(ctx,shape){

        },
        drawCircle(ctx,shape){

        }
    }
}







export default AGDraw