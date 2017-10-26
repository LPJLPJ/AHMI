$(function(){

    //
    let margin = {
        top:20,
        right:90,
        bottom:50,
        left:140
    },
        width = 1000-margin.left-margin.right,
        height = 800-margin.top-margin.bottom;

    //将svg加入到body，并设置宽高
    //在group加入到svg，并移动到合适位置
    let svg = d3.select("body")
        .append("svg")
        .attr("width",width+margin.left+margin.right)
        .attr("height",height+margin.top+margin.bottom)
        .append("g")
        .attr("transform","translate("+margin.left+","+margin.bottom+")");

    //加入toolTip
    let toolTip = d3.select("body")
        .append("div")
        .attr("class",'toolTip')
        .style("opacity",0);

    //声明全局变量
    let i = 0,
        duration = 500,
        root,
        project,
        menu = function(data){
            if(!data.parent){
                return []
            }else{
                return [
                    {
                        title:'删除',
                        action:function(elm,d,i){
                            if(d.parent){
                                for(let ii=0;ii<d.parent.children.length;ii++){
                                    if(d.parent.children[ii].id===d.id){
                                        d.parent.children.splice(ii,1);
                                        if(d.parent.children.length===0){
                                            d.parent.children = null;
                                        }
                                        let idArr = [],
                                            getIds = function(data){
                                            idArr.push(data.data.id);
                                            if(data.parent&&data.parent.data&&data.parent.data.id){
                                                getIds(data.parent);
                                            }
                                        };
                                        getIds(d);
                                        syncProject(idArr);
                                        break;
                                    }
                                }
                            }
                            update(d);
                        }
                    }
                ]
            }
        },
        projectId = window.location.pathname&&window.location.pathname.split('/')[2];

    //声明一个tree布局并设置大小
    let treemap = d3.tree().size([height,width]);

    d3.json('/project/'+projectId+'/content',function(error,data){
        project = JSON.parse(data.content);
        project.name = data.name;
        root = d3.hierarchy(project,function(d){
            return d.pages||d.layers||d.subLayers||d.widgets;
        });
        root.x0 = height/2;
        root.y0 = 0;
        console.log('project',project);
        //展开数据的第三级;
        root.children.forEach(function(d){
            if(d.children){
                d.children.forEach(collapse)
            }else{
                collapse(d)
            }
        });

        setTimeout(function(){
            $('#loading').hide();

            // console.log('root',root);
            update(root);
        },500)

    });

    //更新视图
    function update(source){
        //重新设置svg和tree的高度
        let newHeight = Math.max(root.descendants().length*22,height);
        d3.select("svg")
            .attr("height",newHeight+margin.top+margin.bottom)
            .select("g")
            .attr("transform","translate("+margin.left+","+margin.bottom+")");
        treemap.size([newHeight,width]);

        //根据source配置树的布局
        let treeData = treemap(root);

        let nodes = treeData.descendants();//获取所有的子节点
        let links = treeData.descendants().slice(1);

        /**--------------------------nodes section------------------------**/
        //调整节点水平间距
        nodes.forEach(function(d){
            d.y = d.depth*180;
        });

        //更新节点
        let node = svg.selectAll('g.node')
            .data(nodes,function(d){
                return  d.id||(d.id=++i)
            });

        let nodeEnter = node.enter().append('g')
            .attr("class","node")
            .attr("transform",function(d){
                return "translate("+source.y0+","+source.x0+")";
            })
            .on("click",toggle)
            .on("contextmenu",d3.contextMenu(menu));

        nodeEnter.append("circle")
            .attr("class",'node')
            .attr('r',1e-6)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) { return d.data.name; })
            .on("mouseover",toolTip.show)
            .on("mouseout",toolTip.hide);

        // 更新
        let nodeUpdate = nodeEnter.merge(node);

        // 转换节点的位置
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // 更新节点属性和样式
        nodeUpdate.select('circle.node')
            .attr('r', 10)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr('cursor', 'pointer');


        // 移除多于的节点
        let nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // 移除节点上的圆圈
        nodeExit.select('circle')
            .attr('r', 1e-6);

        // 移除节点上的文字
        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        /**--------------------------link section------------------------**/

        //更新连线
        let link = svg.selectAll('path.link')
                .data(links, function(d) { return d.id; });

        // 加入连线
        let linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
                let o = {x: source.x0, y: source.y0};
                return diagonal(o, o)
            });

        // 更新
        let linkUpdate = linkEnter.merge(link);

        // 缩回到父节点位置
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d){ return diagonal(d, d.parent) });

        // 删除连线
        let linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
                let o = {x: source.x, y: source.y};
                return diagonal(o, o)
            })
            .remove();

        // 存储节点的旧位置
        nodes.forEach(function(d){
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }


    //画曲线
    function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path
    }


    //切换节点状态
    function toggle(d){
        if(d.children){
            d._children = d.children;
            d.children = null;
        }else{
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    //折叠当前节点及其所有子节点
    function collapse(d){
        if(d.children){
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    //同步工程数据
    function syncProject(idArr){
        let pageId = idArr.pop(),
            pages = project.pages;
        for(let i=0,il=pages.length;i<il;i++){
            if(pages[i].id===pageId){
                if(idArr.length===0){
                    pages.splice(i,1);
                    break;
                }else{
                    let layerId = idArr.pop(),
                        layers = pages[i].layers;
                    for(let j=0,jl=layers.length;j<jl;j++){
                        if(layers[j].id===layerId){
                            if(idArr.length===0){
                                layers.splice(j,1);
                                break;
                            }else{
                                let subLayerId = idArr.pop(),
                                    subLayers = layers[j].subLayers,
                                    showSubLayer = layers[j].showSubLayer;
                                for(let g=0,gl=subLayers.length;g<gl;g++){
                                    if(subLayers[g].id===subLayerId){
                                        if(idArr.length===0){
                                            if(g===0){
                                                showSubLayer=subLayers[1]
                                            }
                                            subLayers.splice(g,1);
                                            break;
                                        }else{
                                            let widgetId = idArr.pop(),
                                                widgets = subLayers[g].widgets;
                                            for(var z=0,zl=widgets.length;z<zl;z++){
                                                if(widgets[z].id===widgetId){
                                                    widgets.splice(z,1);
                                                    break;
                                                }
                                            }
                                            if(g===0){
                                                widgets = showSubLayer.widgets;
                                                for(var z=0,zl=widgets.length;z<zl;z++){
                                                    if(widgets[z].id===widgetId){
                                                        widgets.splice(z,1);
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Object.assign(toolTip,{
        show:function(d){
            let data = d.data||{};
            let str = ``;
            if(data.pages){
                str += `<div>宽度:${data.initSize.width}</div><div>高度:${data.initSize.height}</div>`;
                str += `<div>页数:${data.pages.length}</div>`;
            }else{
                str += `<div>tag:${data.tag||''}</div><div>宽度:${data.info&&data.info.width||''}</div><div>高度:${data.info&&data.info.height||''}</div>`;
                switch (data.type){
                    case 'MyPage':
                        str += `<div>画布数:${data.layers.length}</div>`;
                        break;
                    case 'MyLayer':
                        str += `<div>子画布数:${data.subLayers.length}</div>`;
                        break;
                    case 'MySubLayer':
                        str +=`<div>控件数:${data.widgets.length}</div>`;
                        break;
                    case 'MySwitch':
                        str +=`<div>bindBit:${data.info.bindBit}</div>`;
                        break;
                    default:
                        break;
                }
            }
            toolTip.transition()
                .duration(300)
                .style("opacity",1);
            toolTip.html(str)
                .style("top",d3.event.pageY+10+"px")
                .style("left",d3.event.pageX+20+"px");
        },
        hide:function(d){
            toolTip.transition()
                .duration(300)
                .style("opacity",0);
        }
    });


    //监听保存事件
    $('#saveBtn').on('click',function(e){
        if(confirm('确定保存?')){
            // console.log(project);
            var btn = $(this).text('保存中..').attr('disabled',true);
            $.ajax({
                type:'put',
                url:'/project/'+projectId+'/save',
                contentType:'application/json;charset=UTF-8',
                processData:false,
                data:JSON.stringify({
                    project: project
                }),
                success:function(data){
                    btn.text('保存修改').attr('disabled',false);
                    if(data==='ok'){
                        alert('保存成功')
                    }else{
                        console.log(data);
                        alert('保存出错');
                    }
                },
                error:function(err){
                    btn.text('保存修改').attr('disabled',false);
                    alert('保存出错');
                }
            })
        }
    })
});
