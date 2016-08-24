var React = require('react');
module.exports = React.createClass({
    getInitialState: function () {
        return {
            tagList: this.props.tagList || [],
            tagOldValue: '',
            curTagIdx: -1
        };
    },
    handleValueInputFocus: function (e) {
        var tagOldValue = this.state.tagOldValue;
        var tagList = this.props.tagList;
        var curTagName = e.target.name;
        var curTagIdx = -1;
        for (var i = 0; i < tagList.length; i++) {
            if (tagList[i].name == curTagName) {
                curTagIdx = i;
                break;
            }
        }
        this.setState({tagOldValue: e.target.value, curTagIdx: curTagIdx});
    },
    handleValueInputBlur: function (e) {
        var tagOldValue = this.state.tagOldValue;
        if (tagOldValue != '') {
            //handle blur
            if (this.state.curTagIdx != -1) {
                var curTag = this.state.tagList[this.state.curTagIdx];
                curTag.value = Number(tagOldValue);
                this.setState({curTag: curTag});
            }

        }
    },
    handleValueInputEnter: function (e) {

        if (e.keyCode == 13) {
            //enter
            if (this.state.curTagIdx != -1) {

                this.setState({tagOldValue: ''});
                this.updateTag(this.state.curTagIdx, Number(e.target.value));
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
                curTag.value = Number(e.target.value);
            }

            this.setState({curTag: curTag});
        }
    },
    componentWillReceiveProps: function (nextProps) {
        // var tagList = this.state.tagList;
        // tagList = nextProps.tagList;
        // this.setState({tagList: tagList});
    },
    render: function () {

        return (
            <div className='tag-table-wrapper col-md-3'>
                <table className='tag-table table table-responsive'>
                    <thead className='tag-table-header'>
                    <tr className='tag-table-row'>
                        <td className='tag-table-col'> 名称
                        </td>
                        <td className='tag-table-col'> 寄存器号
                        </td>
                        <td className='tag-table-col'> 值
                        </td>
                    </tr >
                    </thead>
                    <tbody className='tag-table-body'>
                    {
                        this.props.tagList.map(function (tag, index) {
                            if (tag.register) {
                                var disabled = !(tag.writeOrRead == 'true');

                                return (
                                    <tr key={index} className='tag-table-row'>
                                        <td className='tag-table-col'> {tag.name}</td>
                                        <td className='tag-table-col'> {tag.indexOfRegister}</td>
                                        <td className='tag-table-col'>
                                            <input className='value' name={tag.name} type='text' disabled={disabled}
                                                   value={tag.value}
                                                   onFocus={this.handleValueInputFocus}
                                                   onBlur={this.handleValueInputBlur}
                                                   onKeyDown={this.handleValueInputEnter}
                                            />
                                        </td>
                                    </tr>
                                );
                            }
                        }.bind(this))}
                    </tbody>
                </table>
            </div>
        );
    }
});