/**
 * Created by changecheng on 2017/2/21.
 */
;(function () {
    function Paginationer(size,current,total,baseUrl) {
        this.baseUrl = baseUrl;
        this.size = (size>total?total:size);
        this.current = current>this.size?this.size:current;
        this.total = total;
    }


    Paginationer.prototype.setElem = function ($elem) {
        $elem.innerHTML = this.render()
    }

    Paginationer.prototype.render = function () {
        var result="";
        var pageNums = [];
        if (this.total<2){
            pageNums.push({
                num:1,
                active:true
            })
        }else{
            //>=2

            var leftNum = this.size - 2;
            var i;
            if (this.current == 1){
                pageNums.push({
                    num:1,
                    active:true
                })
                for (i=0;i<leftNum;i++ ){
                    pageNums.push({
                        num:i+2,
                        active:false
                    })
                }
                pageNums.push({
                    num:this.total,
                    active:false
                })
            }else if (this.current == this.total){
                pageNums.push({
                    num:1,
                    active:false
                })
                for (i=0;i<leftNum;i++ ){
                    pageNums.push({
                        num:i+2,
                        active:false
                    })
                }
                pageNums.push({
                    num:this.total,
                    active:true
                })
            }else{
                pageNums.push({
                    num:1,
                    active:false
                })
                var leftMax = this.current-2;
                var rightMax = this.total-this.current-1;
                var leftOpt = Math.ceil((leftNum -1)/2)
                var rightOpt = leftNum - leftOpt -1;
                if (rightOpt>rightMax){
                    leftOpt = leftNum - rightMax -1;
                }

                leftOpt = (leftOpt>leftMax?leftMax:leftOpt)
                for (i=0;i<leftOpt;i++ ){
                    pageNums.push({
                        num:this.current-leftOpt+i,
                        active:false
                    })
                }
                pageNums.push({
                    num:this.current,
                    active:true
                })
                i++
                for(;i<leftNum;i++){
                    pageNums.push({
                        num:this.current-leftOpt+i,
                        active:false
                    })
                }

                pageNums.push({
                    num:this.total,
                    active:false
                })
            }
        }
        var baseUrl = this.baseUrl;
        var pageButtons = pageNums.map(function (_page) {
            return '<li class="'+_page.active+'"><a href="'+baseUrl+"?page="+_page.num+'">'+_page.num+'</a></li>'
        })
        var prev = this.current-1
        prev = prev <=0? 1:prev;
        var next = this.current+1
        next = next>this.total?this.total:next;
        result =  '<nav aria-label="Page navigation">'+
        '<ul class="pagination">'+
            '<li><a href="'+this.baseUrl+"?page="+prev+'" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a> </li>'+ pageButtons.join("")+
            '<li><a href="'+this.baseUrl+"?page="+next+'" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>'+
        '</ul></nav>'
        return result;
    }
    window.Paginationer = Paginationer;
}())