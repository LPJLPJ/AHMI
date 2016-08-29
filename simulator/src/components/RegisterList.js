/**
 * Created by ChangeCheng on 16/8/24.
 */
var React = require('react');
module.exports = React.createClass({
    getInitialState: function () {
        return {

        };
    },
    handleValueInputChange: function (key, e) {
        this.props.handleRegisterChange(key, Number(e.target.value));
    },
    render: function () {
        // console.log('curRegisters',this.props.registers);
        return (
            <div className='tag-table-wrapper col-md-3'>
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
                                               onChange={this.handleValueInputChange.bind(this, registerKey)}/>
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