/**
 * created by Zzen1sS
 */
import {AGPoint} from "./AGProperties";
import {AGView} from "./AGView";
import {AGEvent,AGEventManager} from "./AGEvent";

//container for view
export class AGWindow{
    constructor(width,height,id){
        this.width = width
        this.height = height
        if (typeof id === 'string'){
            this.domElem = document.getElementById(id)
        }else{
            this.domElem = id
        }
        this.domElem.innerHTML = ''
        this.layer = document.createElement('canvas')
        this.layer.width = this.width
        this.layer.height = this.height
        this.domElem.appendChild(this.layer)

        //reset domElem style
        this.resetDomElemStyle()
        this.initEventListen()
        this.rootView = null

        //inner
        this.currentView = null
        this.mouseDownView = null
        this.dragState = null

        this.scale = 1.0
    }

    resetDomElemStyle(){
        this.domElem.style.position = 'relative'
        this.domElem.style.padding = 0
        this.domElem.style.margin = 0
        this.domElem.style['min-width'] = this.width+'px'
        this.domElem.style['min-height'] = this.height+'px'
        this.domElem.style.width = '100%'
    }

    addRootView(rootView){
        this.rootView = rootView
        // this.domElem.appendChild(rootView.layer)
        rootView.layer.style.position = 'absolute'
        rootView.layer.style.left = rootView.frame.origin.x +'px'
        rootView.layer.style.top = rootView.frame.origin.y + 'px'
        // rootView.layer.style.display = 'none'
        // rootView.layer.style.width = '100%'
        // rootView.layer.style.height = '100'
    }

    display(opts={}){
        let self = this
        let ctx = self.layer.getContext('2d')
        let curScale = this.scale
        curScale = 1.0/curScale
        function limitValueIn(v,min,max) {
            if (v<min){
                v = min
            }else if (v>max){
                v = max
            }
            return v
        }
        ctx.save()
        ctx.save()
        ctx.fillStyle = 'gray'
        ctx.fillRect(0,0,self.layer.width,self.layer.height)
        ctx.restore()
        ctx.fillText("hello world",self.layer.width/2,self.layer.height/2)
        // console.log('display',self.rootView.frame.origin.x, self.rootView.frame.origin.y)
        // let rPos = (new AGPoint()).relative(self.rootView.frame.origin)
        // let dx = rPos.x*curScale
        // let dy = rPos.y*curScale
        // let dw = self.layer.width*curScale
        // let dh = self.layer.height*curScale
        // let dxr = dx+dw
        // let dyb = dy + dh
        // let dx2 = limitValueIn(dx,0,self.rootView.layer.width)
        // let dy2 = limitValueIn(dy,0,self.rootView.layer.height)
        // let dxr2 = limitValueIn(dxr,0,self.rootView.layer.width)
        // let dyb2 = limitValueIn(dyb,0,self.rootView.layer.height)
        // dw = dxr2-dx2
        // dh = dyb2 -dy2
        // ctx.drawImage(self.rootView.layer,dx2,dy2,dw||1,dh||1,(dx2-dx)/curScale,(dy2-dy)/curScale,dw/curScale,dh/curScale)
        ctx.save()
        ctx.scale(1/curScale,1/curScale)
        ctx.drawImage(self.rootView.layer,self.rootView.frame.origin.x,self.rootView.frame.origin.y)
        ctx.restore()
        ctx.restore()
    }

    static copyMouseEvent(e){
        //e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey
        return {
            x:e.x,
            y:e.y,
            screenX:e.screenX,
            screenY:e.screenY,
            clientX:e.clientX,
            clientY:e.clientY,
            layerX:e.layerX,
            layerY:e.layerY,
            offsetX:e.offsetX,
            offsetY:e.offsetY,
            pageX:e.pageX,
            pageY:e.pageY,
            innerPos:e.innerPos,
            ctrlKey:e.ctrlKey,
            altKey:e.altKey,
            shiftKey:e.shiftKey,
            metaKey:e.metaKey,

        }
    }

    // initEventListen(){
    //     let self = this
    //     this.domElem.addEventListener('mousedown',function (e) {
    //         for(let key in e){
    //             if (e.hasOwnProperty(key)){
    //                 console.log(key)
    //             }
    //         }
    //         let pos = AGWindow.getPointPos(e)
    //         let hitResult = self.getHitView(pos,self.rootView)
    //         if (hitResult){
    //             this.currentView = hitResult.hitView
    //             this.mouseDownView = hitResult.hitView
    //             e.innerPos = hitResult.relativePos
    //             //trigger view's mousedown
    //             let eventManager = AGEventManager.getEventManager()
    //             eventManager.dispatch(this.currentView,new AGEvent('mousedown',AGWindow.copyMouseEvent(e)))
    //
    //         }
    //     })
    //
    //     this.domElem.addEventListener('mousemove',function (e) {
    //         let pos = AGWindow.getPointPos(e)
    //         let hitResult = self.getHitView(pos,self.rootView)
    //         if (hitResult){
    //
    //             e.innerPos = hitResult.relativePos
    //             let eventManager = AGEventManager.getEventManager()
    //
    //             if(hitResult.hitView !== this.currentView){
    //                 if (!this.dragState){
    //                     let oldCurrentView = this.currentView
    //                     this.currentView = hitResult.hitView
    //                     //mouse out
    //                     eventManager.dispatch(oldCurrentView,new AGEvent('mouseout',AGWindow.copyMouseEvent(e)))
    //                     // //drag end
    //                     // eventManager.dispatch(oldCurrentView,new AGEvent('dragend',AGWindow.copyMouseEvent(e)))
    //
    //                     //mouse in
    //                     eventManager.dispatch(this.currentView,new AGEvent('mousein',AGWindow.copyMouseEvent(e)))
    //                 }else{
    //                     //dragging
    //                     eventManager.dispatch(this.currentView,new AGEvent('drag',AGWindow.copyMouseEvent(e)))
    //                 }
    //
    //             }else{
    //                 //trigger view's mousemove
    //                 eventManager.dispatch(this.currentView,new AGEvent('mousemove',AGWindow.copyMouseEvent(e)))
    //                 if (this.mouseDownView === this.currentView){
    //                     if (!this.dragState){
    //                         eventManager.dispatch(this.currentView,new AGEvent('dragstart',AGWindow.copyMouseEvent(e)))
    //                         this.dragState = 'dragging'
    //                     }else{
    //                         eventManager.dispatch(this.currentView,new AGEvent('drag',AGWindow.copyMouseEvent(e)))
    //                     }
    //                 }
    //             }
    //
    //         }
    //     })
    //
    //     this.domElem.addEventListener('mouseup',function (e) {
    //         let pos = AGWindow.getPointPos(e)
    //         let hitResult = self.getHitView(pos,self.rootView)
    //         let mouseDownView = this.mouseDownView
    //         this.mouseDownView = null
    //         let eventManager = AGEventManager.getEventManager()
    //         if (hitResult){
    //             this.currentView = hitResult.hitView
    //             e.innerPos = hitResult.relativePos
    //             //trigger view's mouseup
    //
    //             eventManager.dispatch(this.currentView,new AGEvent('mouseup',AGWindow.copyMouseEvent(e)))
    //             //drag end
    //             eventManager.dispatch(this.currentView,new AGEvent('dragend',AGWindow.copyMouseEvent(e)))
    //             this.dragState = null
    //             if (mouseDownView === this.currentView){
    //                 eventManager.dispatch(this.currentView,new AGEvent('click',AGWindow.copyMouseEvent(e)))
    //             }
    //
    //
    //         }else{
    //             if (this.dragState){
    //                 eventManager.dispatch(this.currentView,new AGEvent('dragend',AGWindow.copyMouseEvent(e)))
    //                 this.dragState = null
    //             }
    //         }
    //         this.currentView = null
    //     })
    // }

    initEventListen(){
        let self = this
        this.domElem.addEventListener('mousedown',function (e) {

            let pos = self.getPointPos(e)
            console.log(pos,self.rootView.frame.origin)
            let hitResult = self.getHitView(pos,self.rootView)//{hitView:self.rootView,relativePos:pos.relative(self.rootView.frame.origin)}
            // console.log(hitResult)
            if (hitResult){
                this.currentView = hitResult.hitView
                this.mouseDownView = hitResult.hitView
                e.innerPos = hitResult.relativePos
                //trigger view's mousedown
                let eventManager = AGEventManager.getEventManager()
                eventManager.dispatch(this.currentView,new AGEvent('mousedown',AGWindow.copyMouseEvent(e)))

            }
        })

        this.domElem.addEventListener('mousemove',function (e) {
            let pos = self.getPointPos(e)
            let hitResult = self.getHitView(pos,self.rootView)//{hitView:self.rootView,relativePos:pos.relative(self.rootView.frame.origin)}
            if (hitResult){

                e.innerPos = hitResult.relativePos
                let eventManager = AGEventManager.getEventManager()

                if(hitResult.hitView !== this.currentView){
                    if (!this.dragState){
                        let oldCurrentView = this.currentView
                        this.currentView = hitResult.hitView
                        //mouse out
                        eventManager.dispatch(oldCurrentView,new AGEvent('mouseout',AGWindow.copyMouseEvent(e)))
                        // //drag end
                        // eventManager.dispatch(oldCurrentView,new AGEvent('dragend',AGWindow.copyMouseEvent(e)))

                        //mouse in
                        eventManager.dispatch(this.currentView,new AGEvent('mousein',AGWindow.copyMouseEvent(e)))
                    }else{
                        //dragging
                        eventManager.dispatch(this.currentView,new AGEvent('drag',AGWindow.copyMouseEvent(e)))
                    }

                }else{
                    //trigger view's mousemove
                    eventManager.dispatch(this.currentView,new AGEvent('mousemove',AGWindow.copyMouseEvent(e)))
                    if (this.mouseDownView === this.currentView){
                        if (!this.dragState){
                            eventManager.dispatch(this.currentView,new AGEvent('dragstart',AGWindow.copyMouseEvent(e)))
                            this.dragState = 'dragging'
                        }else{
                            eventManager.dispatch(this.currentView,new AGEvent('drag',AGWindow.copyMouseEvent(e)))
                        }
                    }
                }

            }
        })

        this.domElem.addEventListener('mouseup',function (e) {
            let pos = self.getPointPos(e)
            let hitResult = self.getHitView(pos,self.rootView)//{hitView:self.rootView,relativePos:pos.relative(self.rootView.frame.origin)}
            let mouseDownView = this.mouseDownView
            this.mouseDownView = null
            let eventManager = AGEventManager.getEventManager()
            if (hitResult){
                this.currentView = hitResult.hitView
                e.innerPos = hitResult.relativePos
                //trigger view's mouseup

                eventManager.dispatch(this.currentView,new AGEvent('mouseup',AGWindow.copyMouseEvent(e)))
                //drag end
                eventManager.dispatch(this.currentView,new AGEvent('dragend',AGWindow.copyMouseEvent(e)))
                this.dragState = null
                if (mouseDownView === this.currentView){
                    eventManager.dispatch(this.currentView,new AGEvent('click',AGWindow.copyMouseEvent(e)))
                }


            }else{
                if (this.dragState){
                    eventManager.dispatch(this.currentView,new AGEvent('dragend',AGWindow.copyMouseEvent(e)))
                    this.dragState = null
                }
            }
            this.currentView = null
        })
    }

    getHitView(pos,views){

        // if(AGWindow.inRect(pos,view.frame)){
        //     //hit
        //     //compare children
        //     let hitView = view
        //     let nextView = null
        //     for(let i=0;i<view.children.length;i++){
        //         if (AGWindow.inRect(pos.relative(hitView.frame.origin),view.children[i].frame)){
        //             nextView = view.children[i]
        //         }
        //     }
        //     //
        //     if (nextView){
        //         return this.getHitView(pos,nextView)
        //     }else{
        //         return hitView
        //     }
        // }else{
        //     return null
        // }
        let hitView = null
        let nextView = null
        let nextPos = pos
        if (views instanceof Array){
            //children
            for(let i=0;i<views.length;i++){
                // if(views[i].canTouch&&AGWindow.inRect(pos,views[i].frame)){
                //     hitView = views[i]
                // }
                if(views[i].canTouch&&views[i].isPosHitView(pos)){
                    hitView = views[i]
                }
            }

        }else{
            //view
            // if(views.canTouch&&AGWindow.inRect(pos,views.frame)){
            //     //hit
            //     hitView = views
            //
            // }
            if(views.canTouch&&views.isPosHitView(pos)){
                hitView = views
            }
        }

        //next round

        // nextView = this.getHitView(nextPos,hitView.children)
        // if (nextView){
        //
        // }
        if (hitView){
            nextPos = pos.relative(hitView.frame.origin)
            return this.getHitView(nextPos,hitView.children)||{hitView:hitView,relativePos:nextPos}
        }else{
            return null
        }

    }

    static inRect(pos,rect){
        if (pos.x>=rect.origin.x && pos.x <= rect.origin.x + rect.size.width && pos.y >= rect.origin.y && pos.y <= rect.origin.y+rect.size.height){
            return true
        }else{
            return false
        }
    }


    //handle click
    getPointPos(e){
        let originalW = e.target.width;
        let originalH = e.target.height;

        let clientRect = e.target.getBoundingClientRect()
        // var ratioW = originalW / clientRect.width;
        // var ratioH = originalH / clientRect.height;
        let x = Math.round(e.clientX - clientRect.left);
        let y = Math.round(e.clientY - clientRect.top);
        x = x /this.scale
        y = y / this.scale
        return new AGPoint(x,y)
    }

    getPointPosInRootView(e){

    }
}