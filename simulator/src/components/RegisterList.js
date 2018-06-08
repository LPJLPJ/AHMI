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
    },
    handleInputKeyRelease:function (key, e) {
        if (e.keyCode == 13){
            //enter
            var registers = this.state.registers
            if (registers[key].inputType == 1){
                //string
                this.props.handleRegisterChange(key, StringConverter.convertStrToUint8Array(e.target.value).slice(0,32)||0);
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
            <div className='tag-table-wrapper'>
                <table className='tag-table table table-responsive'>
                    <thead className='tag-table-header'>
                    <tr className='tag-table-row'>
                        <td className='tag-table-col'> 寄存器号
                        </td>
                        <td className='tag-table-col'> 值
                        </td>
                    </tr >
                    </thead>
                    <tbody className='tag-table-body'>
                    {
                        Object.keys(this.props.registers).map(function (registerKey, index) {
                            var register = this.props.registers[registerKey];
                            var curValue
                            if(this.state.inputing!=-1){
                                curValue = register.value
                            }else {
                                if (register.inputType == 1){
                                    curValue = StringConverter.convertUint8ArrayToStr(register.value)
                                }else{
                                    curValue = register.value
                                }
                            }

                            return (
                                <tr key={index} className='tag-table-row'>
                                    <td className='tag-table-col' style={tdDefaultStyle}> {registerKey}</td>
                                    <td className='tag-table-col' style={tdDefaultStyle}>
                                        <select onChange={this.handleRegisterInputTypeChange.bind(this,registerKey)} value={register.inputType||0}>
                                            <option value={0} >数值</option>
                                            <option value={1} >字符</option>
                                        </select>
                                        <input className='value form-control' name={registerKey} type='text'
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
        );
    }
});