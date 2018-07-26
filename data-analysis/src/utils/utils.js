
// 资源占用计算类
class SizeCalculator {
  constructor() {
    this.totalSize = 0;
  }

  convertTotalSize = () => {
    return Math.ceil((this.totalSize) / 1024 / 1024) + 'MB'
  }

  addSize = (width, height, bytePerPixel) => {
    const curSize = Number(Number(width) * Number(height)) || 0
    this.totalSize += curSize * (bytePerPixel || 4)
  }

  calcButton = (widget) => {
    let info = widget.info;
    if (info) {
      const slices = widget.texList[0].slices;
      slices.map((slice, index) => {
        return this.addSize(widget.info.width, widget.info.height)
      })
    }
  }

  calcButtonGroup = (widget) => {
    let info = widget.info;
    if (!!info) {
      //trans each slide
      let width = info.width;
      let height = info.height;

      let interval = info.interval;
      let count = info.count;
      let arrange = (info.arrange === 'horizontal');
      if (arrange) {
        width = (width - (count - 1) * interval) / count;
      } else {
        height = (height - (count - 1) * interval) / count;
      }

      let texList = widget.texList;

      let slices = [];
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < 2; j++) {
          slices.push(texList[i].slices[j]);
        }
      }
      if (texList[count]) {
        slices.push((texList[count].slices[0]));
      }
      slices.map(function (slice, i) {
        this.addSize(width, height)
      }.bind(this));

    }
  }

  calcDashboard = (widget) => {
    let info = widget.info;
    if (!!info) {
      //trans each slide


      let texList = widget.texList;
      texList.map(function (tex, i) {
        let width = info.width;
        let height = info.height;
        if (i === 1) {
          //pointer
          width = height = info.pointerLength / Math.sqrt(2);
        }
        this.addSize(width, height)
      }.bind(this));
    }
  }

  calcSlide = (widget) => {
    let info = widget.info;
    if (!!info) {
      //font
      //trans each slide
      let width = info.width;
      let height = info.height;

      let slideTex = widget.texList[0];
      slideTex.slices.map(function (slice, i) {
        this.addSize(width, height)
      }.bind(this));

    }
  }

  calcTexNum = (widget) => {
    let info = widget.info;
    if (!!info) {
      //trans each slide
      let width = info.characterW;
      let height = info.characterH;

      let slideTex = widget.texList[0];
      slideTex.slices.map(function (slice, i) {
        this.addSize(width, height)
      }.bind(this));


    }
  }

  calcTexTime = (widget) => {
    let info = widget.info;
    if (!!info) {
      //trans each slide
      let width = info.characterW;
      let height = info.characterH;

      // let slideTex = widget.texList[0];
      let slideTex = widget.texList[0];
      slideTex.slices.push(widget.texList[1].slices[0]);
      slideTex.slices.map(function (slice, i) {
        this.addSize(width, height)
      }.bind(this));

    }
  }

  calcRotateImg = (widget) => {
    let info = widget.info;
    if (!!info) {
      //trans each slide
      let width = info.width;
      let height = info.height;

      let slideTex = widget.texList[0];
      slideTex.slices.map(function (slice, i) {
        this.addSize(width, height)
      }.bind(this));

    }
  }

  calcOscilloscope = (widget) => {
    let info = widget.info;
    let width = info.width;
    let height = info.height;
    if (info) {
      //draw bg
      //draw grid
      this.addSize(width, height)

    }
  }

  calcTextArea = (widget) => {
    let info = widget.info;
    let width = info.width;
    let height = info.height;
    if (info) {
      this.addSize(width, height)
    }
  }

  calcPage = (page, width, height) => {
    if (page.backgroundImage) {
      this.addSize(width, height)
    }
  }

  calcWidget = (widget) => {
    switch (widget.type) {
      case 'MyButton':
      case 'MySwitch':
        this.calcButton(widget);
        break;
      case 'MyButtonGroup':
        this.calcButtonGroup(widget);
        break;
      case 'MySlide':
        this.calcSlide(widget);
        break;
      case 'MyAnimation':
        this.calcSlide(widget);
        break;
      case 'MyOscilloscope':
        this.calcOscilloscope(widget);
        break;
      case 'MyTextArea':
        this.calcTextArea(widget);
        break;
      case 'MyDashboard':
        this.calcDashboard(widget);
        break;
      case 'MyRotateImg':
        this.calcRotateImg(widget);
        break;
      case 'MyTexNum':
        this.calcTexNum(widget);
        break;
      case 'MyTexTime':
        this.calcTexTime(widget);
        break;
      default:
        break;
    }
  }
}

const mDynamicPageCfg_Unit = 28;
const TagClassCfg_Unit = 12;
const WidgetLinkData_Unit = 2;
const PageLinkData_Unit = 4;
const CanvasLinkData_Unit = 2;
const CanvasVectorClass_Unit = 92;
const SubCanvasVectorClass_Unit = 36;
const WidgetClassCfg_Unit = 104;
const AnimationVectorClass_Unit = 44;
const Instruction_Unit = 5;
const Texture_Unit = 40;


/**
 * 配置文件占用计算类--参考文档 config文件大小评估
 * ConfigInfoClass  固定 48字节
 * cfgString        固定 98字节
 * mDynamicPageCfg  单位：28 字节。与页面数目有关--pageCnt
 * tagClassCfg      单位：12字节。与tag数目有关--tagCnt
 * WidgetLinkData   单位: 2字节。与绑定了tag的widget数目有关--widgetsBindTagCnt
 * PageLinkData     单位：4字节。与绑定了tag的page数目有关--pageBindTagCnt(每个page默认绑定一个tag)
 * CanvasLinkData   单位：2字节。与绑定了tag的canvas数目有关--canvasBindTagCnt
 * CanvasVectorClass 单位：92字节。与canvas数目有关--canvasCnt
 * SubCanvasVectorClass 单位：36字节。与SubCanvas数据有关--subCanvasCnt
 * WidgetClassCfg    单位：104字节。与widget数目有关--widgetCnt
 * AnimationVectorClass 单位：44字节。与Animation数目有关--animationCnt
 * Instruction       单位：5字节。与指令数目有关--instructionsCnt
 * Texture           单位：40字节。所有纹理数目有关--textureCnt 
 */
class CfgSizeCalculator {
  // 单位是Byte
  constructor() {
    this.configInfoClass = 48;
    this.cfgString = 98;
    this.mDynamicPageCfg = 0;
    this.TagClassCfg = 0;
    this.WidgetLinkData = 0;
    this.PageLinkData = 0;
    this.CanvasLinkData = 0;
    this.CanvasVectorClass = 0;
    this.SubCanvasVectorClass = 0;
    this.WidgetClassCfg = 0;
    this.AnimationVectorClass = 0;
    this.Instruction = 0;
    this.Texture = 0;

    // 页面相关
    this.pageCnt = 0;            // 页面个数
    this.canvasCnt = 0;          // 画布个数
    this.subCanvasCnt = 0;       // 子画布个数
    this.widgetCnt = 0;          // 控件个数

    // tag相关
    this.tagCnt = 0;             // 变量个数
    this.widgetsBindTagCnt = 0;  // 绑定了变量的控件个数
    this.canvasBindTagCnt = 0    // 绑定了变量的画布个数
    this.pageBindTagCnt = 0      // 绑定了变量的页面个数

    // 其他
    this.animationCnt = 0;       // 动画个数
    this.instructionsCnt = 0;    // 指令个数
    this.textureCnt = 0;         // 纹理个数

    return this;
  }

  load(project) {
    // console.log('project', project);
    const { pages = [], customTags = [], timerTags = [] } = project;

    let allPage = [];
    let allCanvas = [];
    let allSubCanvas = [];
    let allWidgets = [];
    let allPagesBindTag = [];
    let allCanvasBindTag = [];
    let allWidgetsBindTag = [];
    let allAnimations = [];
    // let allTexture = [];

    // 收集指令
    const addInstructionCnt = (actions) => {
      if (!actions)
        return;
      actions.forEach((action) => {
        const { commands = [] } = action;
        commands.forEach((command) => {
          this.instructionsCnt++;
        })
      })
    }

    // 计算纹理数量
    const calcTextureCnt = () => {
      let count = 0
      const widgets = allWidgets;
      // let oldCount = 0;
      widgets.forEach(widget => {
        const { texList = [], type } = widget;

        // oldCount = count;
        switch (type) {
          case "MyProgress":
            texList.forEach(tex => {
              const { slices } = tex;
              count += slices.length;
            });
            count += 1;
            break;
          case "MyDashBoard":
            texList.forEach(tex => {
              const { slices } = tex;
              count += slices.length;
            });
            const { dashboardModeId } = widget;
            if (dashboardModeId !== '0') {
              count += 4;
            }
            break;
          case "MyDateTime":
            const { info: { dateTimeModeId } } = widget;
            if (dateTimeModeId === '0') {
              count += 8;
            } else if (dateTimeModeId === '1') {
              count += 5;
            } else if (dateTimeModeId === '2') {
              count += 10;
            } else if (dateTimeModeId === '3') {
              count += 10;
            }
            count += 2;
            break;
          case "MyNum":
          case "MyTexNum":
            let { info: { numOfDigits, decimalCount, symbolMode } } = widget;
            count += Number(numOfDigits);
            if (Number(decimalCount) > 0) {
              count += 1;
            }
            if (symbolMode === '1') {
              count += 1;
            }
            if (type === "MyNum") {
              count += 2;
            }
            break;
          case "MyTextArea":
            count += 1;
            break;
          case "MyButton":
            const { info: { disableHighlight } } = widget;
            count += 1;
            if (!disableHighlight) {
              count += 1;
            }
            break;
          case "MySlide":
            count += 1;
            break;
          case "MyButtonGroup":
            const { info: { count: btnCount } } = widget;
            count += btnCount;
            break;
          case "MySwitch":
            count += 1;
            break;
          case "MyRotateImg":
            count += 1;
            break;
          case "MySlideBlock":
            count += 2;
            break;
          case "MyAnimation":
            count += 1;
            break;
          default:
            // texList.forEach(tex => {
            //   const { slices = [] } = tex;
            //   count += slices.length;
            // })
            break;
        }

        // console.log('widget:', type, 'texture:', count - oldCount);
      });

      count += allPage.length;
      return count;

    }


    // 遍历
    pages.forEach((page) => {
      const { layers = [], actions } = page;
      allPage.push(page);

      addInstructionCnt(actions); // 计算指令数量-页面

      if (!!page.tag)
        allPagesBindTag.push(page);

      layers.forEach((layer) => {
        const { subLayers = [], actions } = layer;

        addInstructionCnt(actions);   // 计算指令数量-图层

        allCanvas.push(layer);
        if (!!layer.tag)
          allCanvasBindTag.push(layer);
        if (!!layer.animations)
          allAnimations.push(layer.animations);

        subLayers.forEach((subLayer) => {
          const { widgets = [], actions } = subLayer;

          addInstructionCnt(actions);

          allSubCanvas.push(subLayer);

          widgets.forEach((widget) => {
            const { actions } = widget;

            addInstructionCnt(actions); // 收集动作指令

            allWidgets.push(widget);
            if (!!widget.tag)
              allWidgetsBindTag.push(widget);
          })

        })
      })
    })

    this.pageCnt = pages.length;
    this.canvasCnt = allCanvas.length;
    this.subCanvasCnt = allSubCanvas.length;
    this.widgetCnt = allWidgets.length;

    this.tagCnt = customTags.length + timerTags.length;
    this.widgetsBindTagCnt = allWidgetsBindTag.length;
    this.canvasBindTagCnt = allCanvasBindTag.length;
    this.pageBindTagCnt = pages.length;

    this.textureCnt = calcTextureCnt();

    this.animationCnt = allAnimations.length;


    // console.log('widgetCnt', allWidgets.length);
    // console.log('texutreCnt', this.textureCnt);
    return this;
  }

  calcSize() {
    // KB
    this.mDynamicPageCfg = this.pageCnt * mDynamicPageCfg_Unit;
    this.TagClassCfg = this.tagCnt * TagClassCfg_Unit;
    this.WidgetLinkData = this.widgetsBindTagCnt * WidgetLinkData_Unit;
    this.PageLinkData = this.pageBindTagCnt * PageLinkData_Unit;
    this.CanvasLinkData = this.canvasBindTagCnt * CanvasLinkData_Unit;
    this.CanvasVectorClass = this.canvasCnt * CanvasVectorClass_Unit;
    this.SubCanvasVectorClass = this.subCanvasCnt * SubCanvasVectorClass_Unit;
    this.WidgetClassCfg = this.widgetCnt * WidgetClassCfg_Unit;
    this.AnimationVectorClass = this.animationCnt * AnimationVectorClass_Unit;
    this.Instruction = this.instructionsCnt * Instruction_Unit;
    this.Texture = this.textureCnt * Texture_Unit;

    const total = this.configInfoClass + this.cfgString + this.mDynamicPageCfg + this.TagClassCfg + this.WidgetLinkData
      + this.PageLinkData + this.CanvasLinkData + this.CanvasVectorClass + this.SubCanvasVectorClass + this.WidgetClassCfg
      + this.AnimationVectorClass + this.Instruction + this.Texture;

    // console.log('configInfoClass', this.configInfoClass);
    // console.log('cfgString', this.cfgString);
    // console.log('mDynamicPageCfg', this.mDynamicPageCfg);
    // console.log('TagClassCfg', this.TagClassCfg);
    // console.log('WidgetLinkData', this.WidgetLinkData);
    // console.log('PageLinkData', this.PageLinkData);
    // console.log('CnavasLinkData', this.CanvasLinkData);
    // console.log('CanvasVectorClass', this.CanvasVectorClass);
    // console.log('SubCanvasVectorClass', this.SubCanvasVectorClass);
    // console.log('WidgetClassCfg', this.WidgetClassCfg);
    // console.log('AnimationVectorClass', this.AnimationVectorClass);
    // console.log('Instuction', this.Instruction);
    // console.log('Texture', this.Texture);

    // return Math.ceil(total / 1024);
    return {
      total: Math.ceil(total / 1024),
      widgetCalssCfgSize: Math.ceil(this.WidgetClassCfg / 1024),
      textureSize: Math.ceil(this.Texture / 1024),
      otherSize: Math.ceil((total - this.WidgetClassCfg - this.Texture) / 1024),
    }
  }
}

/**
 * 返回所有字符集
 * @param widgets
 * @returns {Array}
 */
function getFontCollections(widgets) {
  var fontWidgets,
    fonts = [],
    paddingRatio = 1.2;
  fontWidgets = widgets.filter(function (widget) {
    return ((widget.subType === 'MyNum') || (widget.subType === 'MyDateTime'))
  });
  fontWidgets.forEach(function (widget) {
    var info = widget.info,
      font = {},
      result,
      fontFamily = info.fontFamily,
      reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (reg.test(fontFamily)) {
      var str = '';
      for (var i = 0; i < fontFamily.length; i++) {
        str += fontFamily.charCodeAt(i).toString(32);
      }
      fontFamily = str;
    }
    widget.originFont = {};
    widget.originFont.src = '\\' + fontFamily + '-' + info.fontSize + '-' + info.fontBold + '-' + (info.fontItalic || 'null') + '.png';
    widget.originFont.w = info.fontSize;
    widget.originFont.h = info.fontSize;
    widget.originFont.W = Math.ceil(info.fontSize * paddingRatio);
    widget.originFont.H = Math.ceil(info.fontSize * paddingRatio);
    widget.originFont.paddingX = Math.ceil(info.fontSize * (paddingRatio - 1) / 2);
    widget.originFont.paddingY = Math.ceil(info.fontSize * (paddingRatio - 1) / 2);

    widget.originFont.paddingRatio = paddingRatio;
    result = fonts.some(function (item) {
      return ((item.fontFamily === info.fontFamily) && (item.fontSize === info.fontSize) && (item.fontBold === info.fontBold) && (item.fontItalic === info.fontItalic));
    });
    if (!result) {
      font['font-family'] = info.fontFamily;
      font['font-size'] = info.fontSize;
      font['font-bold'] = info.fontBold;
      font['font-italic'] = info.fontItalic;
      fonts.push(font);
    }
  });
  return fonts;
}

// 计算工程资源占用大小
const calcProjectSize = function (dataStructure) {
  let allWidgets = []
  let curSizeCalulator = new SizeCalculator()
  for (let i = 0; i < dataStructure.pages.length; i++) {
    let curPage = dataStructure.pages[i];
    curSizeCalulator.calcPage(curPage, dataStructure.initSize.width, dataStructure.initSize.height)
    for (let j = 0; j < curPage.layers.length; j++) {
      let curCanvas = curPage.layers[j];
      for (let k = 0; k < curCanvas.subLayers.length; k++) {
        let curSubCanvas = curCanvas.subLayers[k];
        for (let l = 0; l < curSubCanvas.widgets.length; l++) {
          allWidgets.push(curSubCanvas.widgets[l])
          curSizeCalulator.calcWidget(curSubCanvas.widgets[l]);
        }
      }
    }
  }

  var fontList = getFontCollections(allWidgets)
  for (var i = 0; i < fontList.length; i++) {
    var curFont = fontList[i]
    var curFontSize = curFont['font-size'] || 24
    var width = 1.2 * Math.sqrt(128) * curFontSize
    curSizeCalulator.addSize(width, width, 0.5)
  }

  return curSizeCalulator.convertTotalSize()
}

// 计算配置文件大小
const calcConfigSize = function (project) {
  return new CfgSizeCalculator().load(project).calcSize();
}

export { calcProjectSize, calcConfigSize }