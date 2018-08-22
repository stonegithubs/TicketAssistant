# TicketAssistant

## 基于electron-vue实现跨平台的票务助手.

### 1.组件
* electron 2.x
* vue 2.x
* TypeScript
* electron-vue 1.x

### 2.项目结构

### 3.开发环境配置步骤
1. 安装`node.js`地址`https://nodejs.org/en/download/current`.
2. 设置环境变量`ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`指定electron中国区下载源.
3. 项目目录执行`npm install`安装依赖.
4. `npm start dev`运行程序.

### 4.代码规范及约束约定

### 5.打包及部署
1. 执行`npm run build`后编译结果在`build`文件夹

### 6.依赖
1. 依赖都通过`package.json`管理,`devDependencies`属性设置开发环境所需要的依赖及版本,`dependencies`属性设置正式环境依赖及版本.

### 7.快速启动
1. 手动安装`node.js`后,在项目根目录执行`npm install`,则会自动下载所需要的依赖及插件.
2. 项目根目录执行`npm run dev`启动程序.