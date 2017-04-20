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
                set('this.layers.0.hidden',1)
                set('this.layers.1.hidden',0)
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
                set('this.layers.0.hidden',0)
                set('this.layers.1.hidden',1)
                setTag(12)
            }
        `,
        onTagChange:`
            var(a,0)
            var(b,'this.mode')
            getTag(a)
            if(b==1){
                if(a>0){
                    set('this.layers.0.hidden',1)
                    set('this.layers.1.hidden',0)
                }else{
                    set('this.layers.0.hidden',0)
                    set('this.layers.1.hidden',1)
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
                set('this.layers.a.hidden',1)
                minus(a,1)
                set('this.layers.a.hidden',0)
            }
            getTag(a)
            if(a>=0){
                if(c>a){
                    multiply(a,2)
                    set('this.layers.a.hidden',1)
                    add(a,1)
                    set('this.layers.a.hidden',0)
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
            multiply(tvalueRatio,tangleDist)
            divide(tvalueRatio,ttempDist)
            add(tvalueRatio,tminAngle)
            var(tclockwise,0)
            var(tStartAngle,0)
            set(tclockwise,'this.otherAttrs.1')
            if (tclockwise==1) {
                add(tvalueRatio,45)
                add(tvalueRatio,toffsetValue)
                add(tStartAngle,toffsetValue)
                add(tStartAngle,90)
            }else{
                var(uValueRatio,0)
                minus(uValueRatio,tvalueRatio)
                minus(uValueRatio,toffsetValue)
                set(tvalueRatio,uValueRatio)
                minus(tStartAngle,toffsetValue)
                add(tStartAngle,90)
                add(tvalueRatio,45)
            }
            var(tp1x,0)
            var(tp1y,0)
            var(tMode,0)
            var(talpha,0)
            var(tbeta,0)
            set(tMode,'this.mode')
            if (tMode==1) {
                set('this.layers.1.rotateAngle',tvalueRatio)
            }
            if (tMode==0) {
                set('this.layers.1.rotateAngle',tvalueRatio)
            }
            add(tvalueRatio,45)
            if (tMode==1) {
                set(tp1x,'this.layers.1.x')
                set(tp1y,'this.layers.1.y')
                set('this.layers.2.subLayers.roi.p1x',tp1x)
                set('this.layers.2.subLayers.roi.p1y',tp1y)
                if (tclockwise==1) {
                    set('this.layers.2.subLayers.roi.alpha',tStartAngle)
                    set('this.layers.2.subLayers.roi.beta',tvalueRatio)
                }else{
                    set('this.layers.2.subLayers.roi.alpha',tvalueRatio)
                    set('this.layers.2.subLayers.roi.beta',tStartAngle)
                }

            }else{
                if (tMode==2) {
                    set(tp1x,'this.layers.0.width')
                    set(tp1y,'this.layers.0.height')
                    divide(tp1x,2)
                    divide(tp1y,2)
                    set('this.layers.0.subLayers.roi.p1x',tp1x)
                    set('this.layers.0.subLayers.roi.p1y',tp1y)
                    if (tclockwise==1) {
                        set('this.layers.0.subLayers.roi.alpha',tStartAngle)
                        set('this.layers.0.subLayers.roi.beta',tvalueRatio)
                    }else{
                        set('this.layers.0.subLayers.roi.alpha',tvalueRatio)
                        set('this.layers.0.subLayers.roi.beta',tStartAngle)
                    }
                }
            }
            
            checkalarm(0)
            set('this.oldValue',ttagValue)

        `
    }

    WidgetCommands['RotateImg'] = {
        onInitialize:`
        `,
        onTagChange:`
            var(tTagValue,0)
            getTag(tTagValue)
            var(tMinAngle,0)
            var(tMaxAngle,0)
            set(tMinAngle,'this.minValue')
            set(tMaxAngle,'this.maxValue')
            if (tTagValue>tMaxAngle) {
                set(tTagValue,tMaxAngle)
            }
            if(tTagValue<tMinAngle){
                set(tTagValue,tMinAngle)
            }
            set('this.layers.0.x',tTagValue)
            set('this.layers.0.rotateAngle',tTagValue)
        `
    }





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

