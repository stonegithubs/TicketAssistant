# TicketAssistant

### 1.组件
* electron 2.x
* vue 2.x
* TypeScript

### 2.项目结构
1. `src/components`存放`vue`源码.
2. `static`存放`vue`编译结果.

### 3.开发环境配置步骤
1. `node.js`下载地址`https://nodejs.org/en/download/current`.
2. 通过设置环境量`ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`来指定electron的中国区下载源,不设置默认下载github地址的版本,如果网络无法访问或者超时会导致安装失败.
3. 执行`npm install electron -g`安装`electron`.
4. 项目目录下执行`npm start`启动程序.

### 4.代码规范及约束约定