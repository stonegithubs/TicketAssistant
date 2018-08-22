<style scoped>
</style>
<template>
 <h1>Fuck The World</h1>
</template>
<script>
export default {
  e() {
    //获取主进程窗口
    const mainWindow = require("electron").remote.getCurrentWindow();
    //获取主进程BrowserWindow对象
    const { BrowserWindow } = require("electron").remote;
    let child = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      show: false
    });
    child.loadURL("https://www.google.com");
    child.once("ready-to-show", () => {
      child.show();
    });
    var http = require("http");
    var querystring = require("querystring");
    var options = {
      host: "127.0.0.1", // 请求地址 域名，google.com等..
      port: 80,
      path: path, // 具体路径eg:/upload
      method: "GET", // 请求方式, 这里以post为例
      headers: {
        // 必选信息,  可以抓包工看一下
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
};
</script>