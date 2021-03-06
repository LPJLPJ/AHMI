var React = require('react');
var StringConverter = require('./StringConverter')
module.exports = React.createClass({
    getInitialState: function () {
        return {
            tagList: this.props.tagList || [],
            tagOldValue: '',
            curTagIdx: -1,
            inputingTag:false
        };
    },
    getTagTrueValue:function (tag) {
        if(tag){
            tag.valueType = tag.valueType||0
            switch (tag.valueType){
                case 0:
                    //num
                    return Number(tag.value)||0
                case 1:
                    //str
                    return StringConverter.convertUint8ArrayToStr(tag.value,this.encoding)
                default:
                    console.log('tag type unsupported')
            }
        }
    },
    handleValueInputFocus: function (e) {
        var tagList = this.state.tagList;
        var curTagName = e.target.name;
        var curTagIdx = -1;
        for (var i = 0; i < tagList.length; i++) {
            if (tagList[i].name == curTagName) {
                curTagIdx = i;
                break;
            }
        }
        this.setState({tagOldValue: e.target.value, curTagIdx: curTagIdx,inputingTag:true});
    },
    handleValueInputBlur: function (e) {
        var tagOldValue = this.state.tagOldValue;
        if (tagOldValue !== 'old') {
            //handle blur
            if (this.state.curTagIdx != -1) {
                var curTag = this.state.tagList[this.state.curTagIdx];
                curTag.value = Number(tagOldValue);
                this.setState({curTag: curTag});
            }

        }
        this.setState({inputingTag:false});
    },
    handleValueInputEnter: function (e) {

        if (e.keyCode == 13) {
            //enter

            if (this.state.curTagIdx != -1) {

                this.state.tagOldValue = 'old';
                this.updateTag(this.state.curTagIdx, e.target.value);
                e.target.blur();
            }else{
                e.target.blur();
            }

        }
    },
    updateTag: function (curTagIdx, value) {
        if (this.props.updateTag && (typeof this.props.updateTag == 'function')) {
            this.props.updateTag(curTagIdx, value);
        }

    },
    handleValueInputChange: function (e) {
        if (this.state.curTagIdx != -1) {
            var curTag = this.state.tagList[this.state.curTagIdx];
            if (e.target.value == '') {
                curTag.value = '';
            } else {
                curTag.value = e.target.value;
            }

            this.setState({curTag: curTag});
        }
    },
    componentWillReceiveProps: function (nextProps) {
        var inputingTag = this.state.inputingTag;
        if (!inputingTag){
            this.setState({tagList: nextProps.tagList});
        }

        this.encoding = nextProps.encoding


    },
    render: function () {
        var tdDefaultStyle = {
            'verticalAlign':'middle'
        }
        return (
            <div className='simulator-tag-table-wrapper'>
                <table className='simulator-tag-table simulator-tag-title'>
                    <thead className='simulator-tag-table__header'>
                        <tr className='simulator-tag-table__row'>
                            <td className='simulator-tag-table__col tag-table-col-4'>名称</td>
                            <td className='simulator-tag-table__col tag-table-col-2'>寄存器号</td>
                            <td className='simulator-tag-table__col tag-table-col-4'>值</td>
                        </tr >
                    </thead>
                </table>

                <div className='simulator-tag-content'>
                    <table className='simulator-tag-table'>
                        <tbody className='simulator-tag-table__body'>
                        {
                            this.state.tagList.map(function (tag, index) {
                                if (tag.register) {
                                    {/*var disabled = !(tag.writeOrRead == 'true' || tag.writeOrRead == 'readAndWrite');*/}
                                    var disabled = false;
                                    var curValue
                                    if (this.state.inputingTag && this.state.curTagIdx === index){
                                        curValue = tag.value
                                    }else{
                                        curValue = this.getTagTrueValue(tag)
                                    }
                                    return (
                                        <tr key={index} className={'simulator-tag-table__row '+(tag.valueType==1?'tagName-str':'') }>
                                            <td className='simulator-tag-table__col tag-table-col-4' style={tdDefaultStyle}> {tag.name}</td>
                                            <td className='simulator-tag-table__col tag-table-col-2' style={tdDefaultStyle}> {tag.indexOfRegister}</td>
                                            <td className='simulator-tag-table__col tag-table-col-4' style={tdDefaultStyle}>
                                                <input className={'simulator-tag-table__input'} name={tag.name} type='text' disabled={disabled}
                                                       value={curValue}
                                                       onFocus={this.handleValueInputFocus}
                                                       onBlur={this.handleValueInputBlur}
                                                       onKeyDown={this.handleValueInputEnter}
                                                       onChange={this.handleValueInputChange} />
                                            </td>
                                        </tr>
                                    );
                                }
                            }.bind(this))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});