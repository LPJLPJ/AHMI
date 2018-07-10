
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

// subView.draw()