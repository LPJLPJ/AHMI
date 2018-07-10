
import {AGView} from "./src/AGView";
import {AGPoint,AGRect,AGSize,AGColor} from "./src/AGProperties";
import {AGWindow} from "./src/AGWindow";
let viewWindow = new AGWindow(1000,500,'container')
let rootView = new AGView(new AGPoint(50,50),new AGSize(800,480))
let subView = new AGView(new AGPoint(50,50),new AGSize(400,400))
subView.backgroundColor = new AGColor(0,255,0,1)
console.log(rootView)
console.log(subView)


rootView.initLayer()
rootView.addChildView(subView)

viewWindow.addRootView(rootView)
rootView.draw()

rootView.on('mousedown',function (e) {
    console.log('rootview mousedown',e)
})

rootView.on('mousein',function (e) {
    rootView.backgroundColor = new AGColor(0,0,255,1)
    rootView.draw()
})

rootView.on('mouseout',function (e) {
    rootView.backgroundColor = new AGColor(255,0,0,1)
    rootView.draw()
})

let initPos
let initMousePos
let lastOrigin = new AGPoint()
subView.on('mousedown',function (e) {
    initPos = new AGPoint(e.innerPos.x,e.innerPos.y)
    initMousePos = new AGPoint(e.pageX,e.pageY)
    lastOrigin.x = subView.frame.origin.x
    lastOrigin.y = subView.frame.origin.y
})


subView.on('mousemove',function (e) {
    if (initPos){
        let curMousePos = new AGPoint(e.pageX,e.pageY)
        subView.frame.origin.x = lastOrigin.x+curMousePos.x - initMousePos.x
        subView.frame.origin.y = lastOrigin.y+curMousePos.y - initMousePos.y
        rootView.draw()
    }

})

subView.on('mouseup',function () {
    initPos = null
})
// subView.draw()