/**
 * created by Zzen1sS
 **/


export class AGSize{
    constructor(w=0,h=0){
        this.width = Number(w)||0
        this.height = Number(h)||0
    }
}

export class AGPoint{
    constructor(x=0,y=0){
        this.x = Number(x)||0
        this.y = Number(y)||0
    }

    relative(aPoint){
        return new AGPoint(this.x-aPoint.x,this.y-aPoint.y)
    }

    add(aPoint){
        return new AGPoint(this.x+aPoint.x,this.y+aPoint.y)
    }

    multiply(k){
        return new AGPoint(this.x*k,this.y*k)
    }

    copy(){
        return new AGPoint(this.x,this.y)
    }

    distanceToPoint(aPoint){
        return Math.sqrt(Math.pow(aPoint.x-this.x,2)+Math.pow(aPoint.y-this.y,2))
    }

    pointProduct(aPoint){
        return this.x * aPoint.x + this.y * aPoint.y
    }
}

export class AGColor{
    constructor(r=0,g=0,b=0,a=0){
        this.r = Number(r)||0
        this.g = Number(g)||0
        this.b = Number(b)||0
        this.a = Number(a)||0
    }
}

//shapes
export class AGFont{
    constructor(fontFamily='Arial',fontSize=8,fontColor=new AGColor(0,0,0,1)){
        this.fontFamily = fontFamily
        this.fontSize = fontSize
        this.fontColor = fontColor
    }

    toStr(){
        return '\"'+(this.fontFamily||'')+'\" '+fontSize+'px '
    }
}

export class AGPathItem{
    constructor(type=AGPathItem.pathItemTypes.line,points=[]){
        this.type = type
        this.points = points
    }


}

AGPathItem.pathItemTypes = {
    line:'line',
    quadratic:'quadratic',
    cubic:'cubic'
}


export class AGPathItemLine extends AGPathItem{
    constructor(statPoint,stopPoint){
        super(AGPathItem.pathItemTypes.line,[statPoint,stopPoint])
    }
}

export class AGPathItemQuadraticCurve extends AGPathItem{
    constructor(statPoint,controlPoint,stopPoint){
        super(AGPathItem.pathItemTypes.quadratic,[statPoint,controlPoint,stopPoint])
    }
}

export class AGPathItemCubicCurve extends AGPathItem{
    constructor(statPoint,controlPoint,controlPoint2,stopPoint){
        super(AGPathItem.pathItemTypes.cubic,[statPoint,controlPoint,controlPoint2,stopPoint])
    }
}

export class AGPath{
    constructor(pathItems=[]){
        this.pathItems = pathItems
    }
}

export class AGShape{
    constructor(){
        this.fillStyle = new AGColor()
        this.strokeStyle = new AGColor(0,0,0,1.0)
    }

    //包围盒
    getBoundingBox(){

    }

    toPath(){

    }



}

export class AGLine extends AGShape{
    constructor(start=new AGPoint(),stop=new AGPoint(),opts={}){
        super()
        this.start = start
        this.stop = stop
        this.lineWidth = opts.lineWidth||1
        this.lineColor = opts.lineColor||this.strokeStyle
    }


    distanceToLine(pos){
        let p1 = this.start
        let p2 = this.stop
        let l12 = p1.distanceToPoint(p2)
        if (l12 === 0){
            return p1.distanceToPoint(pos)
        }else{
            let v1 = pos.relative(p1)
            let v2 = p2.relative(p1)
            let k = v1.pointProduct(v2)/(l12*l12)
            let v3 = v2.multiply(k)
            let p3 = p1.add(v3)
            return p3.distanceToPoint(pos)
        }

    }

    distanceToLineSegment(pos){
        let p1 = this.start
        let p2 = this.stop
        let l12 = p1.distanceToPoint(p2)
        if (l12 === 0){
            return p1.distanceToPoint(pos)
        }else{
            let v1 = pos.relative(p1)
            let v2 = p2.relative(p1)
            let k = v1.pointProduct(v2)/(l12*l12)
            if (k>=0&&k<=1){
                let v3 = v2.multiply(k)
                let p3 = p1.add(v3)
                return p3.distanceToPoint(pos)
            }else if (k<0){
                return p1.distanceToPoint(pos)
            }else{
                return p2.distanceToPoint(pos)
            }

        }
    }
}

export class AGText extends AGShape{
    constructor(origin=new AGPoint(),text,font=new AGFont()){
        super()
        this.origin = origin
        this.text = text
        this.font = font
        this.textAlign = 'center'
        this.textBaseline = 'middle'
    }
}

export class AGRect extends AGShape{
    constructor(origin=new AGPoint(),size=new AGSize()){
        super()
        this.origin = origin
        this.size = size
    }

    inRect(pos){
        if (pos.x>=this.origin.x && pos.x <= this.origin.x + this.size.width && pos.y >= this.origin.y && pos.y <= this.origin.y+this.size.height){
            return true
        }else{
            return false
        }
    }


}

export class AGCircle extends AGShape{
    constructor(center=new AGPoint(),r=0){
        super()
        this.center = center
        this.r = r
    }
}


export class Transform{
    constructor(a,b,c,d,e,f,g,h,i){
        this.a = a
        this.b = b
        this.c = c
        this.d = d
        this.e = e
        this.f = f
        this.g = g
        this.h = h
        this.i = i
    }
}
export class AffineTransform extends Transform{
    constructor(a,b,c,d,e,f){
        super(a,b,c,d,e,f,0,0,1)
    }
}
