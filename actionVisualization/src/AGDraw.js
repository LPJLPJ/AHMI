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
            if(id){
                view.layer = document.getElementById(id)
            }else{
                view.layer = document.createElement('canvas')
            }

            view.layer.width = view.bounds.size.width
            view.layer.height = view.bounds.size.height
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