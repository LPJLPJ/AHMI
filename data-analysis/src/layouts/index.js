import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRouter from 'umi/withRouter';
import App from './App';

export default withRouter((props) => {
  return (
    <LocaleProvider local={zhCN}>
      <App location={props.location} >
        {props.children}
      </App>
    </LocaleProvider>
  )
})