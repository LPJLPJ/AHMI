/**
 * created by Zzen1sS
 */
import {AGPoint} from "./AGProperties";
import {AGView} from "./AGView";

//container for view
export class AGWindow{
    constructor(width,height,id){
        this.width = width
        this.height = height
        this.domElem = document.getElementById(id)
        //reset domElem style
        this.resetDomElemStyle()
        this.initEventListen()
        this.rootView = null

        //inner
        this.currentView = null
    }

    resetDomElemStyle(){
        this.domElem.style.position = 'relative'
        this.domElem.style.padding = 0
        this.domElem.style.margin = 0
        this.domElem.style.width = this.width+'px'
        this.domElem.style.height = this.height+'px'
    }

    addRootView(rootView){
        this.rootView = rootView
        this.domElem.appendChild(rootView.layer)
        rootView.layer.style.position = 'absolute'
        rootView.layer.style.left = rootView.frame.origin.x
        rootView.layer.style.top = rootView.frame.origin.y
    }

    initEventListen(){
        let self = this
        this.domElem.addEventListener('mousedown',function (e) {
            let pos = AGWindow.getPointPos(e)
            let currentHitView = self.getHitView(pos,self.rootView)
            console.log(currentHitView)
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
                if(AGWindow.inRect(pos,views[i].frame)){
                    hitView = views[i]
                }
            }

        }else{
            //view
            if(AGWindow.inRect(pos,views.frame)){
                //hit
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
    static getPointPos(e){
        var originalW = e.target.width;
        var originalH = e.target.height;

        var clientRect = e.target.getBoundingClientRect()
        // var ratioW = originalW / clientRect.width;
        // var ratioH = originalH / clientRect.height;
        var x = Math.round(e.clientX - clientRect.left);
        var y = Math.round(e.clientY - clientRect.top);
        return new AGPoint(x,y)
    }
}