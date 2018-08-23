# TicketAssistant

## 基于electron-vue实现跨平台的票务助手.

### 1.组件
* node.js 10.9.0
* electron 2.x
* vue 2.x
* TypeScript
* electron-vue 1.x
* iView 3.x

### 2.项目结构

### 3.开发环境配置步骤
1. 安装`node.js`地址`https://nodejs.org/en/download/current`.
2. 设置环境变量`ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`指定electron中国区下载源.
3. `npm install yarn -g`安装`yarn`.
4. 项目目录执行`yarn`安装依赖.
5. `yarn start dev`运行程序.

### 4.代码规范及约束约定
1. 所有资源必须引用本地,不可使用CDN等网络资源.
2. `javascript`脚本结束行加`;`

### 5.打包及部署
1. 执行`yarn run build`后编译结果在`build`文件夹

### 6.依赖
1. 依赖都通过`package.json`管理,`devDependencies`属性设置开发环境所需要的依赖及版本,`dependencies`属性设置正式环境依赖及版本.

### 7.快速启动
1. 手动安装`node.js`后,在项目根目录执行`yarn`,则会自动下载所需要的依赖及插件.
2. 项目根目录执行`yarn run dev`启动程序.