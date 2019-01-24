// config文件常量

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
const Texture_Long_Unit = 40;
const Texture_Short_Unit = 24;

// texture文件常量

const FORMAT_NORMAL = 'normal';
const FORMAT_DXT3 = 'dxt3';

const PNG = 'png';
const BMP = 'bmp';

const ARGB8888 = "ARGB8888";
const RGB565 = "RGB565";
const DXT1 = "DXT1";
const DXT5 = "DXT5";
const ALPH4 = "ALPH4";


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
    const {pages = [], customTags = [], timerTags = []} = project;

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
        const {commands = []} = action;
        commands.forEach((command) => {
          this.instructionsCnt++;
        })
      })
    }

    // 计算纹理数量
    const calcTextureCnt = () => {
      let count, long_count = 0, short_count = 0;
      const widgets = allWidgets;
      // let oldCount = 0;
      widgets.forEach(widget => {
        const {texList = [], type} = widget;

        // oldCount = count;
        switch (type) {
          case "MyProgress":
            const {info: {cursor}} = widget, {info: {progressModeId}} = widget, {info: {thresholdModeId}} = widget;
            if (cursor === '0') {//不带光标
              switch (progressModeId) {//模式
                case '0':
                  short_count += 4;
                  break;
                case '1':
                  short_count += 2;
                  break;
                case '3':
                  if (thresholdModeId === '1') {//二段
                    short_count += 4;
                  } else if (thresholdModeId === '2') {//三段
                    short_count += 4;
                  }
                  break;
                default:
                  break;
              }
            } else if (cursor === '1') {//有光标
              switch (progressModeId) {//模式
                case '0':
                  short_count += 7;
                  break;
                case '1':
                  short_count += 5;
                  break;
                case '3':
                  if (thresholdModeId === '1') {//二段
                    short_count += 7;
                  } else if (thresholdModeId === '2') {//三段
                    short_count += 7;
                  }
                  break;
                default:
                  break;
              }
            }
            break;
          case "MyDashBoard":
            const {info: {dashBoardModeId}} = widget;
            if (dashBoardModeId === '0') {//简单
              short_count+=1;
              long_count+=1;
            }  else if (dashBoardModeId === '1') {//复杂
              short_count+=3;
              long_count+=5;
            }
            break;
          case "MyDateTime":
            const {info: {dateTimeModeId}} = widget;
            if (dateTimeModeId === '0') {//时分秒
              short_count += 10;
            } else if (dateTimeModeId === '1') {//时分
              short_count += 7;
            } else if (dateTimeModeId === '2') {//斜杠
              short_count += 12;
            } else if (dateTimeModeId === '3') {//减号
              short_count += 12;
            }
            break;
          case "MyNum":
            short_count += 5;
            break;
          case "MyTexNum":
            let {info: {numOfDigits, decimalCount, symbolMode}} = widget;
            short_count += Number(numOfDigits);
            break;
          case "MyTextArea":
            short_count += 1;
            break;
          case "MyButton":
            short_count += 1;
            break;
          case "MySlide":
            long_count += 1;
            break;
          case "MyButtonGroup":
            const {info: {count: btnCount}} = widget;
            short_count += btnCount;
            break;
          case "MySwitch":
            long_count += 1;
            break;
          case "MyVideo":
            long_count += 1;
            break;
          case "MyRotateImg":
            long_count += 1;
            break;
          case "MySlideBlock":
            long_count += 2;
            break;
          case "MyAnimation":
            short_count += 1;
            break;
          case "MyTexTime":
            short_count += 8;
            break;
          case "MyTouchTrack":
            short_count += 2;
            break;
          case "MyAlphaImg":
            short_count += 3;
            break;
          case "MyTextInput":
            short_count += 5;
            break;
          default:
            // texList.forEach(tex => {
            //   const { slices = [] } = tex;
            //   count += slices.length;
            // })
            break;
        }

      });

      short_count += allPage.length;
      count = {
        short:short_count,
        long:long_count
      };
      //console.log(count);
      return count;
    };


    // 遍历
    pages.forEach((page) => {
      const {layers = [], actions} = page;
      allPage.push(page);

      addInstructionCnt(actions); // 计算指令数量-页面

      if (!!page.tag)
        allPagesBindTag.push(page);

      layers.forEach((layer) => {
        const {subLayers = [], actions} = layer;

        addInstructionCnt(actions);   // 计算指令数量-图层

        allCanvas.push(layer);
        if (!!layer.tag)
          allCanvasBindTag.push(layer);
        if (!!layer.animations)
          allAnimations.push(layer.animations);

        subLayers.forEach((subLayer) => {
          const {widgets = [], actions} = subLayer;

          addInstructionCnt(actions);

          allSubCanvas.push(subLayer);

          widgets.forEach((widget) => {
            const {actions} = widget;

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
    this.Texture = this.textureCnt.short*Texture_Short_Unit + this.textureCnt.long*Texture_Long_Unit;

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
      widgetClassCfgSize: Math.ceil(this.WidgetClassCfg / 1024),
      textureSize: Math.ceil(this.Texture / 1024),
      otherSize: Math.ceil((total - this.WidgetClassCfg - this.Texture) / 1024),
    }
  }
}

/**
 * 纹理类
 */
class Texture {
  constructor(w, h, type) {
    this.width = w;
    this.height = h;
    this.type = type;
  }

  getSize() {
    let size = 0;
    let {width, height, type} = this;
    switch (type) {
      case ARGB8888:
        size = width * height * 4;
        if (size % 8 !== 0) {
          size += (8 - size % 8);
        }
        break;
      case RGB565:
        size = width * height * 2;
        if (size % 8 !== 0) {
          size += (8 - size % 8);
        }
        break;
      case DXT1:
        if (width % 4 !== 0) {
          width += (4 - width % 4);
        }
        if (height % 4 !== 0) {
          height += (4 - height % 4);
        }
        size = width * height / 2;
        break;
      case DXT5:
        if (width % 4 !== 0) {
          width += (4 - width % 4);
        }
        if (height % 4 !== 0) {
          height += (4 - height % 4);
        }
        size = width * height;
        break;
      case ALPH4:
        if (width % 4 !== 0) {
          width += (4 - width % 4);
        }
        if (height % 4 !== 0) {
          height += (4 - height % 4);
        }
        size = width * height / 2;
        break;
      default:
        break;
    }
    return size;
  }
}

/**
 * 工具函数，检查数组中是否存在某一项
 * @param arr
 * @param obj
 */

function checkDup(arr, obj) {
  return arr.some(item => {
    return item === obj;
  })
}


// 纹理资源计算类
class TextureSizeCalculator {
  constructor() {
    this.texture = [];
    this.totalSize = 0;
    this.fonts = []; // 记录所有的字体，防止重复
    this.images = []; // 记录所有控件图片，防止重复
  }

  /**
   * 私有方法，解析页面
   * @param page
   * @param w
   * @param h
   * @param format
   */
  _parsePage(page, w, h, format = 'normal') {
    const {texture} = this;
    const {backgroundImage = ''} = page;
    const suffixArr = backgroundImage.split('.');
    const suffix = suffixArr[suffixArr.length - 1].toLowerCase();

    if (suffix === BMP) {
      if (format === FORMAT_NORMAL) {
        texture.push(new Texture(w, h, RGB565));
      } else if (format === FORMAT_DXT3) {
        texture.push(new Texture(w, h, DXT1))
      }
    } else if (suffix === PNG) {
      if (format === FORMAT_NORMAL) {
        texture.push(new Texture(w, h, ARGB8888))
      } else if (format === FORMAT_DXT3) {
        texture.push(new Texture(w, h, DXT5));
      }
    }


  }

  /**
   * 私有方法，解析控件
   * @param widget
   * @param format
   */
  _parseWidget(widget, format = 'normal') {

    let {type = ''} = widget;
    type = type.toLowerCase();
    switch (type) {
      case 'myanimation':
        this._parseAnimation(widget, format);
        break;
      case 'mynum':
      case 'mydatetime':
        this._parseNumText(widget, format);
        break;
      case 'myscripttrigger':
        break;
      default:
        this._parseNormalWidget(widget, format);
        break;
    }

  }

  /**
   * 私有方法，解析动画控件的纹理
   * @param widget
   * @param format
   */
  _parseAnimation(widget, format = 'normal') {
    const {texture, images} = this;
    const {texList = [], info: {width, height}} = widget;

    const suffixs = [];
    if (!texList) {
      return;
    }
    texList.forEach(tex => {
      const {slices = []} = tex;
      slices.forEach(slice => {
        const {imgSrc = ''} = slice;

        if (!!imgSrc) {
          const imgFlag = '' + imgSrc + width + height;
          if (checkDup(images, imgFlag)) {
            return;
          }
          images.push(imgFlag);

          const suffixArr = imgSrc.split('.');
          suffixs.push(suffixArr[suffixArr.length - 1])
        }
      })
    });

    if (format === FORMAT_NORMAL) {
      suffixs.forEach(suffix => {
        if (suffix === BMP) {
          texture.push(new Texture(width, height, RGB565));
        } else if (suffix === PNG) {
          texture.push(new Texture(width, height, RGB565));
        }
      })
    } else if (format === FORMAT_DXT3) {
      suffixs.forEach(suffix => {
        if (suffix === BMP) {
          texture.push(new Texture(width, height, DXT1));
        } else if (suffix === PNG) {
          texture.push(new Texture(width, height, DXT1));
        }
      })
    }
  }

  /**
   * 私有方法，解析使用了数字字符的控件纹理
   * @param widget
   * @param format
   * @private
   */
  _parseNumText(widget, format = 'normal') {
    const paddingRatio = 1.2;
    const {texture, fonts} = this;
    const {info: {fontFamily, fontSize, fontBold, fontItalic}} = widget;

    const fontStr = '\\' + fontFamily + '-' + fontSize + '-' + fontBold + '-' + (fontItalic || 'null') + '.png';
    if (checkDup(fonts, fontStr)) {
      return;
    }
    fonts.push(fontStr);

    const width = Math.ceil(paddingRatio * fontSize);
    const height = width;

    if (format === FORMAT_NORMAL) {
      for (let i = 0; i < 95; i++) {
        texture.push(new Texture(width, height, ALPH4));
      }
    } else if (format === FORMAT_DXT3) {
      for (let i = 0; i < 95; i++) {
        texture.push(new Texture(width, height, ALPH4));
      }
    }

  }

  /**
   * 私有方法，解析普通控件中的纹理
   * @param widget
   * @param format
   * @private
   */
  _parseNormalWidget(widget, format = 'normal') {
    const {texture, images} = this;
    const {
      texList = [],
      info: {width, height, text = '', fontFamily = '', fontSize = '', fontColor = '', fontBold = '', fontItalic = ''}
    } = widget;

    if (!texList) {
      return;
    }

    const suffixs = [];

    texList.forEach(tex => {
      const {slices = []} = tex;
      slices.forEach(slice => {
        const {imgSrc = '', color} = slice;

        const imgFlag = '' + imgSrc + color + width + height + text + fontFamily + fontSize + fontColor + fontBold + fontItalic;
        if (checkDup(images, imgFlag)) {
          console.log('dup');
          return;
        }
        images.push(imgFlag);

        const suffixArr = imgSrc.split('.');
        suffixs.push(suffixArr[suffixArr.length - 1])

      })
    });

    if (format === FORMAT_NORMAL) {
      suffixs.forEach(suffix => {
        if (suffix === BMP) {
          texture.push(new Texture(width, height, RGB565));
        } else if (suffix === PNG) {
          texture.push(new Texture(width, height, ARGB8888));
        }
      })
    } else if (format === FORMAT_DXT3) {
      suffixs.forEach(suffix => {
        if (suffix === BMP) {
          texture.push(new Texture(width, height, DXT1));
        } else if (suffix === PNG) {
          texture.push(new Texture(width, height, DXT5));
        }
      })
    }

  }

  // 加载工程
  load(project, format = 'normal') {
    const {pages = [], initSize: {width, height}} = project;
    // 遍历
    pages.forEach((page) => {
      this._parsePage(page, width, height, format);

      const {layers = []} = page;

      layers.forEach((layer) => {
        const {subLayers = []} = layer;

        subLayers.forEach((subLayer) => {
          const {widgets = []} = subLayer;

          widgets.forEach((widget) => {
            this._parseWidget(widget, format = 'normal');
          })

        })
      })
    });

    return this
  }

  // 计算
  calcSize() {
    const {texture} = this;
    this.totalSize = 0;
    for (let i = 0, il = texture.length; i < il; i++) {
      this.totalSize += texture[i].getSize();
    }
    return Math.ceil(this.totalSize / 1024 / 1024);
  }

}


// 计算配置文件大小
const calcConfigSize = function (project) {
  return new CfgSizeCalculator().load(project).calcSize();
};

const calcTextureSize = function (project, type) {
  return new TextureSizeCalculator().load(project, type).calcSize();
};

export {calcTextureSize, calcConfigSize}
