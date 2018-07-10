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

export class AGShape{
    constructor(){
        this.fillStyle = new AGColor()
        this.strokeStyle = new AGColor(255,255,255,1.0)
    }

    //包围盒
    getBoundingBox(){

    }



}

export class AGRect extends AGShape{
    constructor(origin=new AGPoint(),size=new AGSize()){
        super()
        this.origin = origin
        this.size = size
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
