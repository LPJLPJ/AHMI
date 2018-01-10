/**
 * Created by ChangeCheng on 16/8/24.
 */
var React = require('react');
module.exports = React.createClass({
    getInitialState: function () {
        return {
            registers:[]
        };
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
            this.props.handleRegisterChange(key, Number(e.target.value)||0);
            e.target.blur();
        }
    },
    render: function () {
        // console.log('curRegisters',this.props.registers);
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
                            return (
                                <tr key={index} className='tag-table-row'>
                                    <td className='tag-table-col'> {registerKey}</td>
                                    <td className='tag-table-col'>
                                        <input className='value' name={registerKey} type='text'
                                               value={register.value}
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