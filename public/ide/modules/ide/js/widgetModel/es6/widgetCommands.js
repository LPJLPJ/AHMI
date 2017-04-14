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
            var(a,1)
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

