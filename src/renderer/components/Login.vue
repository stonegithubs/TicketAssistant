<template>

  <div align="center">
    <Input v-model="account" placeholder="12306 account" style="width: 293px" />
    <br>
    <Input type="password" v-model="password" placeholder="password" style="width: 293px" />
    <br>
    <canvas id="canvas" width="293" height="190"></canvas>
    <Button v-on:click="refreshCaptcha" type="primary">Reset Captcha</Button>
    <Button v-on:click="captchaCheck" type="primary">Login</Button>
  </div>
</template>
<script>
import iconPath from "@/images/icon_ok.png";
const http = require("http");
const fs = require("fs");
const request = require("request");
const querystring = require("querystring");
//获取主进程定义的kyfwAPI对象
const kyfwAPI = require("electron").remote.getGlobal("kyfwAPI");
export default {
  data() {
    return {
      coordinates: [],
      captchaImg: null,
      captchaIcon: null,
      account: "",
      password: "",
      canvas: null,
      cookie: "",
      captchaImgPath: "./src/renderer/images/captcha.jpg",
      cxt: null
    };
  },
  mounted: function() {
    this.canvas = document.getElementById("canvas");
    this.cxt = this.canvas.getContext("2d");
    this.captchaIcon = new Image();
    this.captchaIcon.src = iconPath;
    var that = this;
    // 监听点击事件
    this.canvas.addEventListener("click", function(event) {
      that.canvasClickEvent(that.canvas, event);
    });
    this.refreshCaptcha();
  },
  methods: {
    refreshCaptcha: function() {
      this.coordinates = [];
      var that = this;
      var requestData = {
        module: "login",
        login_site: "E",
        rand: "sjrand"
      };
      var content = querystring.stringify(requestData);
      var uri =
        "https://" + kyfwAPI.root + kyfwAPI.getCaptchaImage + "?" + content;
      request.head(uri, function(err, res, body) {
        request(uri)
          .pipe(fs.createWriteStream(that.captchaImgPath))
          .on("close", function() {
            that.captchaImg = new Image();
            that.captchaImg.src = that.captchaImgPath;
            //当图片加载完成时绘制canvas
            that.captchaImg.onload = function() {
              that.cxt.drawImage(that.captchaImg, 0, 0);
            };
            //设置cookie
            var cookies = res.headers["set-cookie"];
            that.cookie = "";
            cookies.forEach((item, index) => {
              that.cookie += item.split(";")[0] + ";";
            });
            that.cookie = that.cookie.substring(0, that.cookie.length - 1);
            console.log(that.cookie);
          })
          .on("error", function() {
            that.$Message.error(e.message);
          });
      });
    },
    captchaCheck: function() {
      var answer = "";
      this.coordinates.forEach((item, index) => {
        answer += item.x + "," + item.y + ",";
      });
      var requestData = {
        answer: answer.substring(0, answer.length - 1),
        login_site: "E",
        rand: "sjrand"
      };
      var content = querystring.stringify(requestData);
      var options = {
        hostname: kyfwAPI.root,
        port: 80,
        path: kyfwAPI.captchaCheck,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Cookie: this.cookie
        }
      };
      var that = this;
      var request = http.request(options, function(response) {
        console.log("STATUS: " + response.statusCode);
        console.log("HEADERS: " + JSON.stringify(response.headers));
        response.setEncoding("utf8");
        response.on("data", function(result) {
          var data = JSON.parse(result);
          if (data.result_code != 4) {
            that.$Message.error(data.result_message);
          }
        });
      });
      request.write(content);
      request.on("error", function(e) {
        that.$Message.error(e.message);
      });
      request.end();
    },
    canvasClickEvent: function(canvas, event) {
      //鼠标点击时获取坐标
      var rect = canvas.getBoundingClientRect();
      var x = event.clientX - rect.left * (canvas.width / rect.width);
      var y = event.clientY - rect.top * (canvas.height / rect.height);
      //屏蔽图片上方Y坐标三十个像素点内的点击.
      if (y <= 30) {
        return;
      }
      y -= 30;

      var flag = false;
      //some方法,当return true时跳出循环 (forEach无法break)
      this.coordinates.some((item, index) => {
        //判断是否重复点击了已点击的点(判断此次点击的坐标是否在坐标的画图范围内)
        if (
          item.x + 14 > x &&
          item.x - 14 < x &&
          item.y + 14 > y &&
          item.y - 14 < y
        ) {
          //从集合中移除这个点
          this.coordinates.splice(index, 1);
          //重新绘制
          this.canvasRect(canvas);
          flag = true;
          return true;
        }
      });
      if (flag) {
        return;
      }
      this.coordinates.push({ x: x, y: y });
      //重新绘制
      this.canvasRect(canvas);
    },
    canvasRect: function(canvas) {
      this.cxt = canvas.getContext("2d");
      this.cxt.fillStyle = "#FF0000";
      //清空画布
      this.cxt.clearRect(0, 0, canvas.width, canvas.height);
      //绘制图片
      this.cxt.drawImage(this.captchaImg, 0, 0);
      var that = this;
      //根据坐标集合画圆
      this.coordinates.forEach((item, index) => {
        //画图
        that.cxt.drawImage(that.captchaIcon, item.x - 15, item.y + 15);
        //画圆点
        // cxt.beginPath();
        // cxt.arc(item.x, item.y + 30, 10, 0, 2 * Math.PI);
        // cxt.fill();
        // cxt.closePath();
      });
    }
  }
};
</script>
