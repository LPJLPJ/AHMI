
import {AGView} from "./src/AGView";
import {AGPoint,AGRect,AGSize,AGColor} from "./src/AGProperties";

let rootView = new AGView(new AGPoint(),new AGSize(800,480))
let subView = new AGView(new AGPoint(50,50),new AGSize(400,400))
subView.backgroundColor = new AGColor(0,255,0,1)
console.log(rootView)
console.log(subView)
rootView.initLayer('test')
rootView.addChildView(subView)
rootView.draw()

// subView.translate(-20,-20)
console.log(subView.transform)

subView.draw()

subView.translate(-50,-50)
subView.draw()

// subView.draw()