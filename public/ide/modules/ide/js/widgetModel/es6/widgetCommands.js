;(function (factory) {
	if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.

        define('WidgetCommands',[], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory()
    } else {
        // Browser globals
        window.WidgetCommands = factory();
    }
}(function () {
    var WidgetCommands = {};
    WidgetCommands['Button'] = {
        onInitialize:`

            var(a,'this.mode')
            set(a,3)
            if(a>=100){
                set('this.layers.1.hidden',1)
            }else{
                set('this.layers.1.hidden',0)
            }
        `,
        onMouseDown:`
            var(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',0)
                set('this.layers.1.hidden',1)
                setTag(0)
            }else{
                var(c,0)
                getTag(c)
                if(c>0){
                    setTag(0)
                }else{
                    setTag(1)
                }
            }
        `,
        onMouseUp:`
            var(b,'this.mode')
            if(b==0){
                set('this.layers.0.hidden',1)
                set('this.layers.1.hidden',0)
                setTag(12)
            }
        `,
        onTagChange:`
            var(a,0)
            var(b,'this.mode')
            getTag(a)
            if(b==1){
                if(a>0){
                    set('this.layers.0.hidden',0)
                    set('this.layers.1.hidden',1)
                }else{
                    set('this.layers.0.hidden',1)
                    set('this.layers.1.hidden',0)
                }
            }
        `
    };
    WidgetCommands['ButtonGroup'] = {
        onInitialize:`
            
        `,
        onMouseDown:`
            var(a,0)
            var(b,0)
            var(c,0)
            set(c,'this.layers.length')
            minus(c,2)
            set(a,'this.innerX')
            set(b,'this.innerY')
            var(lx,0)
            var(ly,0)
            var(lw,0)
            var(lh,0)
            var(rx,0)
            var(ry,0)
            while(c>=0){
                set(lx,'this.layers.c.x')
                set(ly,'this.layers.c.y')
                set(lw,'this.layers.c.width')
                set(lh,'this.layers.c.height')
                set(rx,lx)
                set(ry,ly)
                add(rx,lw)
                add(ry,lh)
                if(a>=lx){
                    if(rx>a){
                        if(b>=ly){
                            if(ry>b){
                                divide(c,2)
                                setTag(c)
                                set(c,0)
                            }
                        }
                    }
                }
                minus(c,2)
            }
        `,
        onMouseUp:`
            var(d,1)
            set(d,1)
        `,
        onTagChange:`
            var(a,0)
            var(b,0)
            var(c,0)
            set(a,'this.layers.length')
            set(c,a)
            divide(c,2)
            while(a>0){
                minus(a,1)
                set('this.layers.a.hidden',0)
                minus(a,1)
                set('this.layers.a.hidden',1)
            }
            getTag(a)
            if(a>=0){
                if(c>a){
                    multiply(a,2)
                    set('this.layers.a.hidden',0)
                    add(a,1)
                    set('this.layers.a.hidden',1)
                }
            }

        `
    };

    WidgetCommands['Dashboard'] = {
        onInitialize:`
        `,
        onMouseDown:``,
        onMouseUp:``,
        onTagChange:`
            var(toffsetValue,0)
            var(tminValue,0)
            var(tmaxValue,0)
            var(tminAngle,0)
            var(tmaxAngle,0)
            var(ttagValue,0)
            var(tangleDist,0)   
            set(tminValue,'this.minValue')
            set(tmaxValue,'this.maxValue')
            set(tminAngle,'this.minAngle')
            set(tmaxAngle,'this.maxAngle')
            set(tangleDist,tmaxAngle)
            minus(tangleDist,tminAngle)
            var(ttempDist,0)
            set(toffsetValue,'this.otherAttrs.0')
            getTag(ttagValue)
            if (ttagValue>tmaxValue) {
                set(ttagValue,tmaxValue)
            }
            if (ttagValue<tminValue) {
                set(ttagValue,tminValue)
            }
            set(ttempDist,tmaxValue)
            minus(ttempDist,tminValue)
            var(ttagDist,0)
            set(ttagDist,ttagValue)
            minus(ttagValue,tminValue)
            var(tvalueRatio,0)
            set(tvalueRatio,ttagDist)
            divide(tvalueRatio,ttempDist)
            multiply(tvalueRatio,tangleDist)
            add(tvalueRatio,tminAngle)
            var(tclockwise,0)
            var(tStartAngle,0)
            set(tclockwise,'this.otherAttrs.1')
            if (clockwise==1) {

                add(tvalueRatio,toffsetValue)
                add(tStartAngle,toffsetValue)
            }else{
                var(uValueRatio,0)
                minus(uValueRatio,tvalueRatio)
                minus(uValueRatio,toffsetValue)
                set(tvalueRatio,uValueRatio)
                minus(tStartAngle,toffsetValue)
            }
            set('this.layers.1.rotateAngle',tvalueRatio)
            checkalarm(0)
            set('this.oldValue',ttagValue)

        `
    };

    WidgetCommands['Progress'] = {
        onInitialize:`
            var(mod,'this.mode')
            var(cur,'this.cursor')
            set('this.layers.0.hidden',0)
            set('this.layers.1.hidden',0)
            if(cur==1){
                set('this.layers.2.hidden',0)
            }
            set('this.layers.1.width',0)
        `,
        onMouseUp:`
            var(a,1)
        `,
        onMouseDown:`
            var(a,1)
        `,
        onTagChange:`
            var(a,'this.mode')
            if(a==0){
               var(tag,0)
               getTag(tag)
               var(min,'this.minValue')
               var(max,'this.maxValue')
               if(tag>=min){
                   if(tag<=max){
                      var(v,0)
                      var(temp1,0)
                      var(temp2,0)
                      set(temp1,tag)
                      set(temp2,max)
                      minus(temp1,min)
                      minus(temp2,min)
                      divide(temp1,temp2)
                      print(temp1)
                      var(w,'this.layers.0.width')
                      multiply(temp1,w)
                      print(temp1)
                      set('this.layers.1.hidden',0)
                      set('this.layers.1.width',temp1)
                   }
               }
            }
        `
    };



    return WidgetCommands;

}));


/**
 * commands example
 * set(a,3)
 * setTag(1)
 * getTag(a)
 * set(a,b)
 * add(a,1)
 * minus(a,1)
 * multiply(a,2)
 * divide(a,2)
 * mod(a,2)
 * set('this.layers.1.hidden',1)
 */

