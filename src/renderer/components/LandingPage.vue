<style scoped>
</style>
<template>
  <div class="layout">
    <Layout>
      <Header style="background:white">
      </Header>
      <Content>
        <Checkbox>GC-高铁/城际</Checkbox>
        <Checkbox>D-动车</Checkbox>
        <Checkbox>Z-直达</Checkbox>
        <Checkbox>T-特快</Checkbox>
        <Checkbox>K-快速</Checkbox>
        <Checkbox>其他</Checkbox>
        <Button v-on:click="query" type="primary">Query</Button>
        <Table stripe :columns="columns" :data="data" />
      </Content>
      <Footer style="text-align:center">© 2018-2018 Spardag</Footer>
    </Layout>
  </div>
</template>
<script>
//获取主进程BrowserWigit pndow对象
const { remote, ipcRenderer } = require("electron");
const BrowserWindow = remote.BrowserWindow;
//获取当前网页窗口
const currentWindow = remote.getCurrentWindow();
//获取主进程定义的mainURL对象
const mainURL = remote.getGlobal("mainURL");
//获取主进程定义的kyfwAPI对象
const kyfwAPI = remote.getGlobal("kyfwAPI");
export default {
  data() {
    return {
      columns: [
        {
          title: "车次",
          key: "name"
        },
        {
          title: "出发站",
          key: "age"
        },
        {
          title: "到达站",
          key: "address"
        },
        {
          title: "出发时间",
          key: "address"
        },
        {
          title: "到达时间",
          key: "address"
        },
        {
          title: "历时",
          key: "address"
        },
        {
          title: "商务座/特等座",
          key: "address"
        },
        {
          title: "一等座",
          key: "address"
        },
        {
          title: "二等座",
          key: "address"
        },
        {
          title: "高级软卧",
          key: "address"
        },
        {
          title: "软卧",
          key: "address"
        },
        {
          title: "动卧",
          key: "address"
        },
        {
          title: "硬卧",
          key: "address"
        },
        {
          title: "软座",
          key: "address"
        },
        {
          title: "硬座",
          key: "address"
        },
        {
          title: "无座",
          key: "address"
        },
        {
          title: "其他",
          key: "address"
        },
        {
          title: "操作",
          key: "address"
        }
      ],
      data: []
    };
  },
  mounted: function() {
    var that = this;
    //监听用户登录事件
    ipcRenderer.on("login-event", (event, arg) => {
      that.$Message.info("您已成功登录");
    });
    //this.showLogin();
  },
  methods: {
    query: function() {
      var that = this;
      var content = {
        "leftTicketDTO.train_date": "2018-09-06",
        "leftTicketDTO.from_station": "BJP",
        "leftTicketDTO.to_station": "SHH",
        purpose_codes: "ADULT"
      };
      var options = {
        hostname: kyfwAPI.root,
        path: kyfwAPI.query,
        cookie: that.global.cookie
      };
      this.get(
        options,
        content,
        function(data, response) {
          if (data.status) {
            //设置cookie
            that.refreshCookie(response.headers["set-cookie"]);
            return;
          }
          that.$Message.error(data.result_message);
        },
        function(e) {
          that.$Message.error(e.message);
        }
      );
    },
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