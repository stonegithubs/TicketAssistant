# TicketAssistant

## 基于electron实现跨平台的票务助手.

### 1.组件
* electron 2.x
* vue 2.x
* TypeScript

### 2.项目结构
1. `src/components`存放`vue`源码.
2. `src/plugins`存放引用的第三方js.
3. `static`存放`vue`编译结果.

### 3.开发环境配置步骤
1. `node.js`下载地址`https://nodejs.org/en/download/current`.
2. 通过设置环境量`ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"`来指定electron的中国区下载源,不设置默认下载github地址的版本,如果网络无法访问或者超时会导致安装失败.
3. 项目目录执行`npm install electron -g`安装`electron`.
4. 项目目录下执行`npm start`启动程序.
5. 执行`npm config set registry https://registry.npm.taobao.org`设置npm中国区下载源

### 4.代码规范及约束约定

### 5.打包及部署
1. 执行`npm install electron-packager -g`全局安装`electron-packager`.
2. 通过`package.json->script->packager`设置打包命令.
3. 项目目录下执行`npm run packager`执行打包程序,编译结果放在`dist`目录下.

### 6.依赖
1. 依赖都通过`package.json`管理,`devDependencies`属性设置开发环境所需要的依赖及版本,`dependencies`属性设置正式环境依赖及版本.

### 7.快速启动
1. 手动安装`node.js`后,在项目根目录执行`npm install`,则会自动下载所需要的依赖及插件.
2. 项目根目录执行`npm start`启动程序.