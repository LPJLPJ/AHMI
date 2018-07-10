import React, {Component} from 'react';
import { Layout } from 'antd';
import G6 from '@antv/g6';
const { Header, Content } = Layout;
class ActionVisualizer extends Component{
    constructor(){
        super()
    }

    getTreeDate(){
        return {
            roots: [
                {
                    id: 'root',                    // 根节点 id
                    color: '#333',                 // 颜色
                    // size: 10 || [10, 10],          // 尺寸 || [宽, 高]
                    shape: 'rect',               // 根节点 id
                    style: {                       // 样式 (优先级高于 color)
                        fill: 'red',
                        stroke: 'blue'
                    },
                    label: '文本标签' || {           // 文本标签 || 文本图形配置
                        text: '文本标签',
                        fill: 'green'
                    },
                    // parent: 'parentId',            // 父节点 id
                    collapsed: false,              // 是否折叠
                    index: 1,                      // 渲染层级
                    children: [
                        {                   // 子元素集 （自元素数据模型和根节点同构）
                            id: 'leaf',
                            color:'#444',
                            shape:'rect',
                            label:'叶子'
                        },
                        {                   // 子元素集 （自元素数据模型和根节点同构）
                            id: 'leaf2',
                            color:'#444',
                            shape:'rect',
                            label:'叶子'
                        },
                        {                   // 子元素集 （自元素数据模型和根节点同构）
                            id: 'leaf3',
                            color:'#444',
                            shape:'rect',
                            label:'叶子',
                            children:[
                                {
                                    id: 'leaf3.1',
                                    color:'#444',
                                    shape:'rect',
                                    label:'叶子',
                                    children:[
                                        {
                                            id: 'leaf3.1.1',
                                            color:'#444',
                                            shape:'rect',
                                            label:'叶子',
                                        }
                                    ]
                                }
                            ]
                        },

                    ],
                }
            ]
        }
    }

    renderG6Graph(){
        console.log('render')
        G6.registerNode('rect', {
            anchor: {
                type: 'circle',
                points: [
                    [0.5, 0],
                    [1, 0.5],
                    [0.5, 1],
                    [0, 0.5]
                ]
            },
            draw(item){
                const group = item.getGraphicGroup();
                const width = 100
                const height = 100
                const r = 6
                let x = 0
                let y = 0
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 0,
                        fill: '#333',
                        text: item.model.label
                    }
                });
                group.addShape('rect', {
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100,
                        stroke: 'red'
                    },

                });
                //上
                group.addShape('circle', {
                    attrs: {
                        x: (width - r) / 2,
                        y: y,
                        r: r,
                        fill: '#91d5ff'
                    }
                });
                //右
                group.addShape('circle', {
                    attrs: {
                        x: width,
                        y: (height - r) / 2,
                        r: r,
                        fill: '#91d5ff'
                    }
                });
                //下
                group.addShape('circle', {
                    attrs: {
                        x: (width - r) / 2,
                        y: height,
                        r: r,
                        fill: '#91d5ff'
                    }
                });
                //左
                group.addShape('circle', {
                    attrs: {
                        x: x,
                        y: (height - y) / 2,
                        r: r,
                        fill: '#91d5ff'
                    }
                });
                return group
            }
        });
        const self = this
        const container = self.container
        if (self.graph) {
            self.graph.destroy();
        }
        const layout = new G6.Layouts.CompactBoxTree({auto:false});
        // console.log(layout)
        const tree = new G6.Tree({
            container: container,
            width: 1200,
            height: 1200,
            layout,
            // layout:{auto:true},
            fitView: 'autoZoom'
        });

        const graph = new G6.Tree({
            container: container,
            width: 1200,
            height: 1200,
            // layout,
            layout:{auto:false},
            fitView: 'autoZoom'
        });

        tree.read(self.props.data||this.getTreeDate());
        let layoutedData = tree.save()
        tree.destroy()
        graph.read(layoutedData);
        // self.tree = self.graph = tree
        self.graph = graph
        let node = 0;
        let dx = 0;
        let dy = 0;

        // graph.update('root',{
        //     x:200,
        //     y:200
        // })

        graph.on('node:dragstart', function (ev) {
            let item = ev.item;
            console.log(ev,item)
            let model = item.model;
            node = item;
            dx = model.x - ev.x;
            dy = model.y - ev.y;
            // tree.update(node.id,{
            //     x:ev.x+100,
            //     y:ev.y+100
            // })
        });

        graph.on('node:drag', function (ev) {
            console.log('drag',ev.x,dx,node.getEdges())
            node && graph.update(node, {
                x: ev.x + dx,
                y: ev.y + dy
            });
            node && node.getEdges().map((e)=>graph.update(e))

        });
    }

    componentDidMount(){
        this.renderG6Graph()
    }

    componentDidUpdate() {
        // this.renderG6Graph();
    }

    render(){
        const self = this
        return (<Layout>
            <Header>Header</Header>
            <Content>
                <div ref={(container) => {
                    self.container = container;
                }}>

                </div>
            </Content>
        </Layout>);
    }

}

export default ActionVisualizer;