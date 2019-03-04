/**
 * Created by ChangeCheng on 16/8/24.
 */
var React = require('react');
var StringConverter = require('./StringConverter')
module.exports = React.createClass({
    getInitialState: function () {
        return {
            registers:[],
            inputing:-1
        };
    },
    handleValueInputFocus:function (registerKey) {
        this.setState({inputing:registerKey})
    },
    handleValueInputBlur:function () {
        this.setState({inputing:-1})
    },
    handleValueInputChange: function (key, e) {
        // this.props.handleRegisterChange(key, Number(e.target.value));
        var registers = this.state.registers;
        registers[key].value = e.target.value;
        this.setState({registers:registers})
    },
    componentWillReceiveProps:function (newProps) {
        this.setState({registers:newProps.registers})
        this.encoding = newProps.encoding
    },
    handleInputKeyRelease:function (key, e) {
        if (e.keyCode == 13){
            //enter
            var registers = this.state.registers
            if (registers[key].inputType == 1){
                //string
                this.props.handleRegisterChange(key, StringConverter.convertStrToUint8Array(e.target.value,this.encoding).slice(0,32)||0);
            }else{
                //num
                this.props.handleRegisterChange(key, Number(e.target.value)||0);
            }

            e.target.blur();
        }
    },
    handleRegisterInputTypeChange:function (registerKey,e) {
        var registers = this.state.registers
        registers[registerKey].inputType = e.target.value
        this.setState({registers:registers})
    },
    render: function () {
        // console.log('curRegisters',this.props.registers);
        var tdDefaultStyle = {
            'verticalAlign':'middle'
        }
        return (
            <div className='simulator-tag-table-wrapper'>
                <table className='simulator-tag-table simulator-tag-title'>
                    <thead className='simulator-tag-table__header'>
                        <tr className='simulator-tag-table__row'>
                            <td className='simulator-tag-table__col tag-table-col-4'>寄存器号</td>
                            <td className='simulator-tag-table__col tag-table-col-2'>值类型</td>
                            <td className='simulator-tag-table__col tag-table-col-4'>值</td>
                        </tr >
                    </thead>
                </table>

                <div className='simulator-tag-content'>
                    <table className='simulator-tag-table'>
                        <tbody className='simulator-tag-table__body'>
                        {
                            Object.keys(this.props.registers).map(function (registerKey, index) {
                                var register = this.props.registers[registerKey];
                                var curValue
                                if(this.state.inputing!=-1){
                                    curValue = register.value
                                }else {
                                    if (register.inputType == 1){
                                        curValue = StringConverter.convertUint8ArrayToStr(register.value,this.encoding)
                                    }else{
                                        curValue = register.value
                                    }
                                }

                                return (
                                    <tr key={index} className='simulator-tag-table__row'>
                                        <td className='simulator-tag-table__col tag-table-col-4' style={tdDefaultStyle}> {registerKey}</td>
                                        <td className='simulator-tag-table__col tag-table-col-2' style={tdDefaultStyle}>
                                            <select className='simulator-tag-table__select'
                                                    onChange={this.handleRegisterInputTypeChange.bind(this,registerKey)}
                                                    value={register.inputType||0}>
                                                <option value={0} >数值</option>
                                                <option value={1} >字符</option>
                                            </select>
                                        </td>
                                        <td className='simulator-tag-table__col tag-table-col-4' style={tdDefaultStyle}>
                                            <input className='simulator-tag-table__input' name={registerKey} type='text'
                                                   value={curValue}
                                                   onFocus={this.handleValueInputFocus.bind(this, registerKey)}
                                                   onBlur={this.handleValueInputBlur}
                                                   onChange={this.handleValueInputChange.bind(this, registerKey)}
                                                   onKeyUp={this.handleInputKeyRelease.bind(this,registerKey)} />
                                        </td>
                                    </tr>
                                );
                            }.bind(this))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});