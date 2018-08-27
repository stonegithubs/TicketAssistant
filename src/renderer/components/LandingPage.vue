<style scoped>
</style>
<template>
  <h1>I Love The World</h1>
</template>
<script>
//获取主进程BrowserWigit pndow对象
const { remote, ipcRenderer } = require("electron");
const BrowserWindow = remote.BrowserWindow;
//获取当前网页窗口
const currentWindow = remote.getCurrentWindow();
//获取主进程定义的mainURL对象
const mainURL = remote.getGlobal("mainURL");

export default {
  mounted: function() {
    var that = this;
    //监听用户登录事件
    ipcRenderer.on("login-event", (event, arg) => {
      that.$Message.info("您已成功登录");
    });
    this.showLogin();
  },
  methods: {
    showLogin: function() {
      //定义一个子窗口,继承自主渲染进程
      let child = new BrowserWindow({
        parent: currentWindow,
        modal: true,
        width: 400,
        height: 700
      });
      //跳转到登录
      child.loadURL(mainURL + "#/login");
      child.once("ready-to-show", () => {
        child.show();
      });
    }
  }
};
</script>