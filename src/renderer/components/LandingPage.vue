<style scoped>
</style>
<template>
 <h1>Fuck The World</h1>
</template>
<script>
export default {
  mounted: function() {
    this.showLogin();
  },
  methods: {
    showLogin: function() {
      //引入http模块
      var http = require("http");
      //获取主渲染进程窗口
      const mainWindow = require("electron").remote.getCurrentWindow();
      //获取主进程BrowserWindow对象
      const { BrowserWindow } = require("electron").remote;
      //获取主进程定义的mainURL对象
      const mainURL = require("electron").remote.getGlobal("mainURL");
      //定义一个子窗口,继承自主渲染进程
      let child = new BrowserWindow({
        parent: mainWindow,
        modal: true
      });
      //跳转到登录
      child.loadURL(mainURL + "/#/login");
      child.once("ready-to-show", () => {
        child.show();
      });
    },
    e: function() {
      var http = require("http");
      var querystring = require("querystring");
      var options = {
        host: "127.0.0.1", // google.com
        port: 80,
        path: path, eg:/upload
        method: "GET", 
        headers: {
          "Content-Type": "application/json"
        }
      };
      http.get(options, function(res) {
        var resData = "";
        res.on("data", function(data) {
          resData += data;
        });
        res.on("end", function() {
          callback(null, JSON.parse(resData));
        });
      });
    }
  }
};
</script>