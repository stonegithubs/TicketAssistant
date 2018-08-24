<template>

<div>
     <h1>Page Login</h1>
<canvas id="canvas" width="293" height="190"></canvas>

</div>
</template>
<script>
export default {
  data() {
    return {
      coordinates: [],
      img: null,
      icon: null
    };
  },
  mounted: function() {
    this.loadImage();
    this.addEvents();
  },
  methods: {
    loadImage: function() {
      //获取主进程定义的kyfwURL对象
      const kyfwAPI = require("electron").remote.getGlobal("kyfwAPI");
      var canvas = document.getElementById("canvas");
      var cxt = canvas.getContext("2d");
      this.img = new Image();
      this.img.src = kyfwAPI.getCaptchaImage;
      var that = this;
      this.img.onload = function() {
        cxt.drawImage(that.img, 0, 0);
      };
    },
    addEvents: function() {
      var that = this;
      var canvas = document.getElementById("canvas");
      // 监听点击事件
      canvas.addEventListener("click", function(event) {
        that.canvasClickEvent(canvas, event);
      });
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
      this.coordinates.forEach((item, index) => {
        //判断是否重复点击了已点击的点(判断此次点击的坐标是否在坐标的画图范围内)
        if (
          item.x + 10 > x &&
          item.x - 10 < x &&
          item.y + 10 > y &&
          item.y - 10 < y
        ) {
          //从集合中移除这个点
          this.coordinates.splice(index, 1);
          //重新绘制
          this.canvasRect(canvas);
          flag = true;
          return;
        }
      });
      if (flag == true) {
        return;
      }
      this.coordinates.push({ x: x, y: y });
      //重新绘制
      this.canvasRect(canvas);
      console.log(this.coordinates);
    },
    canvasRect: function(canvas) {
      var cxt = canvas.getContext("2d");
      cxt.fillStyle = "#FF0000";
      //清空画布
      cxt.clearRect(0, 0, canvas.width, canvas.height);
      //绘制图片
      cxt.drawImage(this.img, 0, 0);
      //根据坐标集合画圆
      this.coordinates.forEach((item, index) => {
        cxt.beginPath();
        cxt.arc(item.x, item.y + 30, 10, 0, 2 * Math.PI);
        cxt.fill();
        cxt.closePath();
      });
    }
  }
};
</script>
