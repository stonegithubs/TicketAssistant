<template>
  <div align="center">
    <Input v-model="account" placeholder="account" style="width: 293px" />
    <br>
    <Input type="password" v-model="password" placeholder="password" style="width: 293px" />
    <br>
    <canvas style="border:1px solid #E6E6FA" id="canvas" width="293" height="190" />
    <br>
    <Button v-on:click="refreshCaptcha" type="primary">Reset Captcha</Button>
    <Button v-on:click="captchaCheck" type="primary">Login</Button>
  </div>
</template>
<script>
import icon from "@/images/icon_ok.png";
const fs = require("fs");
const request = require("request");
const { ipcRenderer, remote } = require("electron");
//获取主进程定义的kyfwAPI对象
const kyfwAPI = remote.getGlobal("kyfwAPI");

//获取当前网页窗口
const currentWindow = remote.getCurrentWindow();
export default {
  data() {
    return {
      coordinates: [],
      captchaImg: null,
      captchaIcon: null,
      account: "",
      password: "",
      canvas: null,
      captchaImgPath: "./src/renderer/images/captcha.jpg",
      cxt: null
    };
  },
  mounted: function() {
    this.canvas = document.getElementById("canvas");
    this.cxt = this.canvas.getContext("2d");
    this.captchaIcon = new Image();
    this.captchaIcon.src = icon;
    this.captchaImg = new Image();
    var that = this;
    // 监听点击事件
    this.canvas.addEventListener("click", function(event) {
      that.canvasClickEvent(that.canvas, event);
    });
    this.refreshCaptcha();
  },
  methods: {
    login: function() {
      var that = this;
      var content = {
        username: this.account,
        password: this.password,
        appid: "otn"
      };
      var options = {
        hostname: kyfwAPI.root,
        path: kyfwAPI.login,
        cookie: that.global.cookie
      };
      this.post(
        options,
        content,
        function(data, response) {
          if (data.result_code == 0) {
            //设置cookie
            that.refreshCookie(response.headers["set-cookie"]);
            //向主进程发送用户登录事件
            ipcRenderer.send("login-event");
            //关闭当前窗口
            currentWindow.close();
            return;
          }
          that.$Message.error(data.result_message);
          //登录失败重新刷新验证码
          that.refreshCaptcha();
        },
        function(e) {
          that.$Message.error(e.message);
        }
      );
    },
    refreshCaptcha: function() {
      var that = this;
      this.coordinates = [];
      request(kyfwAPI.getCaptchaImage, function(err, res, body) {
        //设置cookie
        that.refreshCookie(res.headers["set-cookie"]);
      })
        .pipe(fs.createWriteStream(that.captchaImgPath))
        .on("close", function() {
          //加上随机数防止浏览器缓存
          that.captchaImg.src =
            that.captchaImgPath +
            "?random=" +
            Math.floor(Math.random() * 100 + 1);
          //当图片加载完成时绘制canvas
          that.captchaImg.onload = function() {
            that.cxt.drawImage(that.captchaImg, 0, 0);
          };
        })
        .on("error", function() {
          that.$Message.error(e.message);
        });
    },
    captchaCheck: function() {
      var that = this;
      var answer = "";
      this.coordinates.forEach((item, index) => {
        answer += item.x + "," + item.y + ",";
      });
      var content = {
        answer: answer.substring(0, answer.length - 1),
        login_site: "E",
        rand: "sjrand"
      };
      var options = {
        hostname: kyfwAPI.root,
        path: kyfwAPI.captchaCheck,
        cookie: that.global.cookie
      };
      this.post(
        options,
        content,
        function(data, response) {
          if (data.result_code == 4) {
            that.login();
            return;
          }
          that.$Message.error(data.result_message);
          //验证失败重新刷新验证码
          that.refreshCaptcha();
        },
        function(e) {
          that.$Message.error(e.message);
        }
      );
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
      this.coordinates.push({ x: Math.floor(x), y: Math.floor(y) });
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
