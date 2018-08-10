(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS

        module.exports =  factory()
    } else {
        // Browser globals
        window.ProjectDataG6Transformer = factory();
    }
}(function () {
        let ProjectDataG6Transformer = {}
        function actinsToNode(elem) {
            if (elem.actions && elem.actions.length){
                return elem.actions.map((a,i) => actionToNode(a,elem.id,i))
            }else{
                return []
            }
        }
        function actionToNode(action,parentId,index) {
            return {
                id:'action_'+parentId+'_'+index,
                color:'#333',
                shape:'rect',
                label:action.title
            }
        }

        function pageToNode(page) {
            return {
                id:page.id,
                color:'#333',
                shape:'rect',
                label:page.name,
                children:actinsToNode(page).concat((page.canvasList||[]).map((c,i)=>canvasToNode(c)))
            }
        }

        function canvasToNode(canvas) {
            return {
                id:canvas.id,
                color:'#333',
                shape:'rect',
                label:canvas.name,
                children:actinsToNode(canvas).concat((canvas.subCanvasList||[]).map((sc,i)=>subCanvasToNode(sc)))
            }
        }

        function subCanvasToNode(sc) {
            return {
                id:sc.id,
                color:'#333',
                shape:'rect',
                label:sc.name,
                children:actinsToNode(sc).concat((sc.widgetList||[]).map((w,i)=>widgetToNode(w)))
            }
        }
        function widgetToNode(widget) {
            return {
                id:widget.id,
                color:'#333',
                shape:'rect',
                label:widget.name,
                children:actinsToNode(widget)
            }
        }

        ProjectDataG6Transformer.trans = (project) => {
            let g6Data = null
            if(project){
                g6Data = {
                    roots:[
                        {
                            id: 'root',                    // 根节点 id
                            color: '#333',                 // 颜色
                            // size: 10 || [10, 10],          // 尺寸 || [宽, 高]
                            shape: 'rect',               // 根节点 id
                            style: {                       // 样式 (优先级高于 color)
                                fill: 'red',
                                stroke: 'blue'
                            },
                            label: project.name || {           // 文本标签 || 文本图形配置
                                text: '文本标签',
                                fill: 'green'
                            },
                            // parent: 'parentId',            // 父节点 id
                            collapsed: false,              // 是否折叠
                            index: 1,                      // 渲染层级
                            children: []
                        }
                    ]
                }
                //tags
                if(project.tagList){
                    g6Data.roots[0].children = g6Data.roots[0].children.concat(project.tagList.map((t,i) => {
                       return {
                           'id':'tag_'+i,
                           label:{
                               text:t.name,
                               fill:'green'
                           }
                       }


                    }))
                }
                //pageList
                if (project.pageList){
                    g6Data.roots[0].children = g6Data.roots[0].children.concat(project.pageList.map((p)=>pageToNode(p)))
                }
            }
            console.log(project,g6Data)
            return g6Data
        }
        return ProjectDataG6Transformer
}))