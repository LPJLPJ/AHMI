/**
 * 生成excel
 * @param tagExcel      excel实例
 * @param tag           tag数据
 * @param groupTitle    组分类名称
 * @param listNum       组数
 * @param startCell     每组数据的起始格子
 * @param endCell       每组数据的结束格子
 */

function generateExcel(tagExcel, tagData) {
    var defaultTitle = ['名称', '序号', '最小值', '最大值', '默认值', '备注'];

    var initCell = 1;
    var listNum = 0;
    for (var key in tagData) {
        for (var i = 0; i < tagData[key].length; i++) {
            var tag = tagData[key][i];
            var endCell = initCell + defaultTitle.length - 1;
            makeExcel(tagExcel, tag, defaultTitle, listNum, initCell, endCell);
            initCell += defaultTitle.length + 1;
            listNum++;
        }
    }
}

function makeExcel(tagExcel, tag, groupTitle, listNum, startCell, endCell) {
    var config = {
        fill: {//表格颜色
            title: {type: "pattern", pattern: "solid", fgColor: {argb: "FF3CB371"}},
            mark: {type: "pattern", pattern: "solid", fgColor: {argb: "FFFFFF00"}},
            repeat: {type: "pattern", pattern: "solid", fgColor: {argb: "FFFF0000"}}
        },
        border: {//边框
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
        },
        algin: {vertical: 'middle', horizontal: 'center'},//居中
        left: {vertical: 'middle', horizontal: 'left'},
        title: {size: 15, bold: true}//字体
    };

    //第一行 注释
    var note = tagExcel.getRow(1);
    note.getCell(1).value = '黄色为已经使用，红色为重复使用';
    note.eachCell(function(cell){
        cell.fill = config.fill.repeat;
        cell.alignment = config.algin;
    });

    //第二行 分类名称
    var name = tagExcel.getRow(2);
    name.alignment = config.algin;
    name.height = 30;
    name.font = config.title;
    if (listNum == 0) {
        name.getCell(startCell).value = '自定义序号';
    } else if (listNum == 1) {
        name.getCell(startCell).value = '系统默认';
    } else if (listNum > 1) {
        name.getCell(startCell).value = "主题(" + (listNum - 1) + ")";
    }
    var startMerge = getLetter(startCell, 2);
    var endMerge = getLetter(endCell, 2);
    tagExcel.mergeCells(startMerge + ":" + endMerge);

    //第三行 每条数据的类别名称
    tagExcel.getColumn(startCell).width = 30;
    tagExcel.getColumn(endCell).width = 20;
    var group = tagExcel.getRow(3);
    for (var i = 0; i < groupTitle.length; i++) {
        group.getCell(startCell + i).value = groupTitle[i];
    }
    group.eachCell(function (cell, index) {
        cell.fill = config.fill.title;
        cell.alignment = config.algin;
        cell.border = config.border;
    });

    //第四行之后 每条数据的详细类容
    for (var j = 0; j < tag.length; j++) {
        var row = tagExcel.getRow(j + 4);
        var tagItem = tag[j];
        var initCell = startCell;
        row.getCell(initCell).value = tagItem.name;
        row.getCell(initCell + 1).value = tagItem.indexOfRegister;
        row.getCell(initCell + 2).value = tagItem.min;
        row.getCell(initCell + 3).value = tagItem.max;
        row.getCell(initCell + 4).value = tagItem.value;
        row.getCell(initCell + 5).value = tagItem.remake;

        for (var k = 0; k < groupTitle.length; k++) {
            var cell = row.getCell(initCell + k);
            cell.border = config.border;
            if (k == 0) {
                cell.alignment = config.left;
            } else {
                cell.alignment = config.algin;
            }
            if (tagItem.mark == 'used') {
                cell.fill = config.fill.mark;
            } else if (tagItem.mark == 'repeat') {
                cell.fill = config.fill.repeat;
            }
        }
    }
}

//根据数字获取字母序号
function getLetter(n, index) {
    n -= 1;
    var str = "A";
    var initStr = str.charCodeAt();
    var newStr = '';

    if (n >= 26) {
        var mo = Math.floor(n / 26) - 1;
        var yu = n % 26;
        newStr = String.fromCharCode(initStr + mo) + String.fromCharCode(initStr + yu);
    } else {
        newStr = String.fromCharCode(initStr + n);
    }
    return newStr + index;
}

module.exports = generateExcel;