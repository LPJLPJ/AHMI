// lib
import React, {PureComponent} from 'react';
import {connect} from 'dva';

// component
import {Card, Tabs, Row, Col, Avatar, Form, Radio} from 'antd';
import {Bar, Pie} from '../../components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// style
import styles from './index.less';

// resouces
import projectImg from '../../assets/project.png'

// utils
import {calcTextureSize, calcConfigSize} from '../../utils/utils';

const {TabPane} = Tabs;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Analysis extends PureComponent {

  state = {
    loading: true,
    title: '',
    resolution: '',
    content: null,
    pagesCnt: null,
    layersCnt: null,
    subLayersCnt: null,
    widgetsCnt: null,
    resourcesCnt: null,
    tagsCnt: null,
    timersCnt: null,
    barDataWidgets: [],
    barDataResources: [],

    resFlashSize: 32,    //mb
    resourceSize: 0,

    cfgFlashSize: 64,    //kb
    configSize: 0,
    widgetClassCfgSize: 0,
    textureSize: 0,
    otherSize: 0,
  }

  componentDidMount() {

    this.parseData();

    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 2000)

  }

  // 解析工程数据
  parseData = () => {
    const basicInfo = this.parseBasicInfo();

    const barData = this.parseBarData();

    const resourceSize = this.parsePieData();

    const configSize = this.parseCfgPieData();

    this.setState({
      ...basicInfo,
      ...barData,
      ...resourceSize,
      ...configSize,
    })
  };

  // 解析工程基本信息
  parseBasicInfo = () => {
    const {project} = this.props;
    const title = project.name;
    const resolution = project.resolution;
    const content = JSON.parse(project.content);
    let pagesCnt = 0, layersCnt = 0, subLayersCnt = 0, widgetsCnt = 0, resourcesCnt = 0;
    let tagsCnt = content.tagClasses[0].tagArray.length,timersCnt = content.tagClasses[1].tagArray.length;

    let pages, layers, subLayers, widgets, resourceList;

    pages = content.pages;
    resourceList = content.resourceList;

    pagesCnt = pages.length;
    pages.forEach((page) => {
      layers = page.layers || [];
      layersCnt += layers.length;
      layers.forEach((layer) => {
        subLayers = layer.subLayers || [];
        subLayersCnt += subLayers.length;
        subLayers.forEach((subLayer) => {
          widgets = subLayer.widgets || [];
          widgetsCnt += widgets.length;
        })
      })
    })

    resourcesCnt = resourceList.length;

    return {
      title,
      resolution,
      pagesCnt,
      layersCnt,
      subLayersCnt,
      widgetsCnt,
      resourcesCnt,
      tagsCnt,
      timersCnt
    }
  }

  // 解析柱状图数据
  parseBarData = () => {
    const {project} = this.props;

    const content = JSON.parse(project.content);
    const barDataWidgets = [];
    const barDataResources = [];

    let pages, layers, subLayers, widgets, texList, slices;
    let pageIndex = 0;

    pages = content.pages;

    pages.forEach((page) => {
      pageIndex++;
      let widgetsCnt = 0;
      let resourcesCnt = 0;
      if (!!page.backgroundImage) {
        resourcesCnt++;
      }
      layers = page.layers;
      layers.forEach((layer) => {
        subLayers = layer.subLayers;
        subLayers.forEach((subLayer) => {
          widgets = subLayer.widgets;
          widgetsCnt += widgets.length;

          widgets.forEach((widget) => {
            texList = widget.texList || [];
            texList.forEach((tex) => {
              slices = tex.slices || [];
              slices.forEach((slice) => {
                if (slice.imgSrc) {
                  resourcesCnt++;
                }
              })
            })
          });

        })
      })

      barDataWidgets.push({
        x: `${pageIndex}页`,
        y: widgetsCnt,
      });

      barDataResources.push({
        x: `${pageIndex}页`,
        y: resourcesCnt,
      })
    })

    return {
      barDataWidgets,
      barDataResources,
    }
  }

  // 解析资源饼图数据
  parsePieData = () => {
    const {project} = this.props;
    const content = JSON.parse(project.content);
    const total = calcTextureSize(content);
    return {
      resourceSize: parseInt(total, 10),
    };
  }

  // 解析配置文件饼图数据
  parseCfgPieData = () => {
    const {project} = this.props;
    const content = JSON.parse(project.content);
    const result = calcConfigSize(content);
    return {
      configSize: result.total,
      widgetClassCfgSize: result.widgetClassCfgSize,
      textureSize: result.textureSize,
      otherSize: result.otherSize,
    }
  }


  // 改变资源flash的大小
  changeResFlashSize = (e) => {
    this.setState({
      resFlashSize: e.target.value,
    })
  }


  changeCfgFlashSize = (e) => {
    this.setState({
      cfgFlashSize: e.target.value,
    })
  }

  render() {
    const {resourceSize, resFlashSize, cfgFlashSize, configSize, widgetClassCfgSize, textureSize, otherSize} = this.state;

    const resourcesData = [
      {
        x: '资源占比',
        y: resourceSize,
      },
      {
        x: '剩余空间',
        y: resourceSize < resFlashSize ? (resFlashSize - resourceSize) : 0,
      }
    ];

    const configeData = [
      {
        x: '控件配置',
        y: widgetClassCfgSize,
      },
      {
        x: '纹理配置',
        y: textureSize,
      },
      {
        x: '其他配置',
        y: otherSize,
      },
      {
        x: '剩余空间',
        y: configSize < cfgFlashSize ? (cfgFlashSize - configSize) : 0,
      }
    ];

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src={projectImg}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}> {this.state.title}</div>
          <div>分辨率 | {this.state.resolution}</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>页面数</p>
          <p>{this.state.pagesCnt}</p>
        </div>
        <div className={styles.statItem}>
          <p>画布数</p>
          <p>
            {this.state.layersCnt}
          </p>
        </div>
        <div className={styles.statItem}>
          <p>子画布数</p>
          <p>{this.state.subLayersCnt}</p>
        </div>
        <div className={styles.statItem}>
          <p>控件数</p>
          <p>{this.state.widgetsCnt}</p>
        </div>
        <div className={styles.statItem}>
          <p>资源数</p>
          <p>{this.state.resourcesCnt}</p>
        </div>
        <div className={styles.statItem}>
          <p>变量数</p>
          <p>{this.state.tagsCnt}</p>
        </div>
        <div className={styles.statItem}>
          <p>定时器数</p>
          <p>{this.state.timersCnt}</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Card loading={this.state.loading} bordered={false} bodyStyle={{padding: 0}}>
          <div className={styles.salesCard}>
            <Tabs defaultActiveKey="widgets" size="large" tabBarStyle={{marginBottom: 24}}>
              <TabPane tab="控件" key="widgets">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar height={295} title="控件在页面中的分布" data={this.state.barDataWidgets}/>
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>控件排布</h4>
                      <ul className={styles.rankingList}>
                        {this.state.barDataWidgets.slice(0, 7).sort((a, b) => b.y - a.y).map((item, i) => (
                          <li key={item.x}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.x}</span>
                            <span>{item.y}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="资源" key="resources">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar height={295} title="资源在页面中的引用分布" data={this.state.barDataResources}/>
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>资源引用排布</h4>
                      <ul className={styles.rankingList}>
                        {this.state.barDataResources.slice(0, 7).sort((a, b) => b.y - a.y).map((item, i) => (
                          <li key={item.x}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.x}</span>
                            <span>{item.y}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>

        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={this.state.loading}
              bordered={false}
              className={styles.salesCard}
              title="变量绑定情况"
              bodyStyle={{padding: 24}}
              style={{marginTop: 24, minHeight: 509}}
            >

            </Card>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={this.state.loading}
              bordered={false}
              className={styles.salesCard}
              title="生成后纹理大小(Texture.acf)"
              bodyStyle={{padding: 24}}
              style={{marginTop: 24, minHeight: 509}}
            >
              <Form layout="inline">
                <FormItem label="flash大小">
                  <RadioGroup value={this.state.resFlashSize} onChange={this.changeResFlashSize}>
                    <Radio value={32}>2*16 MB</Radio>
                    <Radio value={64}>2*32 MB</Radio>
                    <Radio value={256}>2*128 MB</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>

              <Pie
                hasLegend
                subTitle="资源大小"
                total={
                  () => <span>{resourcesData[0].y} MB</span>
                }
                data={resourcesData}
                valueFormat={value => <span>{value}</span>}
                height={248}
                lineWidth={4}
              />

            </Card>
          </Col>

          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={this.state.loading}
              bordered={false}
              className={styles.salesCard}
              title="生成后配置文件大小(ConfigData.acf)"
              bodyStyle={{padding: 24}}
              style={{marginTop: 24, minHeight: 509}}
            >
              <Form layout="inline">
                <FormItem label="flash大小">
                  <RadioGroup value={this.state.cfgFlashSize} onChange={this.changeCfgFlashSize}>
                    <Radio value={64}>64 KB</Radio>
                    <Radio value={128}>128 KB</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
              <Pie
                hasLegend
                subTitle="配置总大小"
                total={
                  () => <span>{configSize} KB </span>
                }
                data={configeData}
                valueFormat={value => <span>{value}</span>}
                height={248}
                lineWidth={4}
              />
            </Card>
          </Col>

        </Row>

      </PageHeaderLayout>
    )
  }
}

function mapStateToProps({global, loading}) {
  return {
    project: global.project,
    loading: loading,
  }
}

export default connect(mapStateToProps)(Analysis);
