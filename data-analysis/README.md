# IDE-Data-analysis  数据分析


---

技术栈
---
   data-analysis功能抽离于IDE本身，data-analysis通过server的api获取ide工程数据即可。
   抽离之后避免了与IDE代码的耦合，相当于一个独立的app，方便维护。并且使用了新的技术栈，没有历史包袱。

 
 - 库：React、Redux、React-Router
 - UI组件：antd-design
 - 框架：DVA、Umi
 - 构建：webpack、eslint

开发方式
--

 - 开发模式：npm run start 
注意：使用代理获取IDE数据，因此IDE服务器需要先开启，随后地址栏输入http://localhost:8000/project/5b4571df79c88f0b18e5faf0，即可获取IDE数据
 
 - 部署模式：npm run build
build之后，静态文件会生成在ahmi-server/public/data-analysis 目录下，包含html，js，css。服务器接收到相关请求后，直接返回html文件即可。
