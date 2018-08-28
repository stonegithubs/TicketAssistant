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
var Enumerable = require("linq");
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
          key: "startTime"
        },
        {
          title: "到达时间",
          key: "arriveTime"
        },
        {
          title: "历时",
          key: "period"
        },
        {
          title: "商务座/特等座",
          key: "businessSeatResidualTicketCount"
        },
        {
          title: "一等座",
          key: "firstSeatResidualTicketCount"
        },
        {
          title: "二等座",
          key: "secondSeatResidualTicketCount"
        },
        {
          title: "高级软卧",
          key: "highSoftSleeperResidualTicketCount"
        },
        {
          title: "软卧",
          key: "softSleeperResidualTicketCount"
        },
        {
          title: "动卧",
          key: "dongSleeperResidualTicketCount"
        },
        {
          title: "硬卧",
          key: "sleeperResidualTicketCount"
        },
        {
          title: "软座",
          key: "softSeatResidualTicketCount"
        },
        {
          title: "硬座",
          key: "seatResidualTicketCount"
        },
        {
          title: "无座",
          key: "noSeatResidualTicketCount"
        },
        {
          title: "其他",
          key: "otherResidualTicketCount"
        },
        {
          title: "操作",
          key: "remark"
        }
      ],
      data: [],
      ticketInfo: {
        //列车唯一编号
        trainNo: null,
        //本次列车站点车次码
        stationTrainCode: null,
        //起点站站点码
        stationCodeStart: null,
        //终点站站点码
        stationCodeEnd: null,
        //出发站站点码
        stationCodeFrom: null,
        //到达站站点码
        stationCodeTo: null,
        //出发站
        stationNameFrom: null,
        //到达站
        stationNameTo: null,
        //出发时间
        startTime: null,
        //到达时间
        arriveTime: null,
        //历时时长
        period: null,
        //是否可web购买
        buy: null,
        ypInfo: null,
        //出发日期
        startDate: null,
        trainSeatFeature: null,
        locationCode: null,
        stationNoFrom: null,
        stationNoTo: null,
        //凭二代身份证进出站
        supportCard: null,
        controlledTrainFlag: null,
        //商务座余票数
        businessSeatResidualTicketCount: null,
        //一等座余票数
        firstSeatResidualTicketCount: null,
        //二等座余票数
        secondSeatResidualTicketCount: null,
        //高级软卧余票数
        highSoftSleeperResidualTicketCount: null,
        //软卧余票数
        softSleeperResidualTicketCount: null,
        //动卧余票数(恕我实在想不出来啥词能形容动卧)
        dongSleeperResidualTicketCount: null,
        //硬卧余票数
        sleeperResidualTicketCount: null,
        //软座余票数
        softSeatResidualTicketCount: null,
        //硬座余票数
        seatResidualTicketCount: null,
        //无座余票数
        noSeatResidualTicketCount: null,
        //其他余票数
        otherResidualTicketCount: null,
        //座位类型
        seatType: null,
        remark: null
      }
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
    analyzeResult: function(datas) {
      var ticketInfos = [];
      var stations = this.getStations();

      datas.forEach(element => {
        var results = element.split("|");

        this.ticketInfo.remark = results[1];
        this.ticketInfo.trainNo = results[2];
        this.ticketInfo.stationTrainCode = results[3];
        this.ticketInfo.stationCodeStart = results[4];
        this.ticketInfo.stationCodeEnd = results[5];
        this.ticketInfo.stationCodeFrom = results[6];
        this.ticketInfo.stationCodeTo = results[7];
        this.ticketInfo.startTime = results[8];
        this.ticketInfo.arriveTime = results[9];
        this.ticketInfo.period = results[10];
        this.ticketInfo.buy = results[11];
        this.ticketInfo.ypInfo = results[12];
        this.ticketInfo.startDate = results[13];
        this.ticketInfo.trainSeatFeature = results[14];
        this.ticketInfo.locationCode = results[15];
        this.ticketInfo.stationNoFrom = results[16];
        this.ticketInfo.stationNoTo = results[17];
        this.ticketInfo.supportCard = results[18];
        this.ticketInfo.controlledTrainFlag = results[19];
        //cu.gg_num = currentDataArray[20] ? currentDataArray[20] : "--";
        this.ticketInfo.highSoftSleeperResidualTicketCount = results[21]
          ? results[21]
          : "--";
        this.ticketInfo.otherResidualTicketCount = results[22] ? results[22] : "--";
        this.ticketInfo.softSleeperResidualTicketCount = results[23]
          ? results[23]
          : "--";
        this.ticketInfo.softSeatResidualTicketCount = results[24]
          ? results[24]
          : "--";
        //cu.tz_num = currentDataArray[25] ? currentDataArray[25] : "--";
        this.ticketInfo.noSeatResidualTicketCount = results[26] ? results[26] : "--";
        //cu.yb_num = currentDataArray[27] ? currentDataArray[27] : "--";
        this.ticketInfo.sleeperResidualTicketCount = results[28]
          ? results[28]
          : "--";
        this.ticketInfo.seatResidualTicketCount = results[29] ? results[29] : "--";
        this.ticketInfo.secondSeatResidualTicketCount = results[30]
          ? results[30]
          : "--";
        this.ticketInfo.firstSeatResidualTicketCount = results[31]
          ? results[31]
          : "--";
        this.ticketInfo.businessSeatResidualTicketCount = results[32]
          ? results[32]
          : "--";
        this.ticketInfo.dongSleeperResidualTicketCount = results[33]
          ? results[33]
          : "--";
        //cu.yp_ex = currentDataArray[34];
        this.ticketInfo.seatType = results[35];
        //cu.exchange_train_flag = currentDataArray[36];
        //cu.from_station_name = cv[currentDataArray[6]];
        //cu.to_station_name = cv[currentDataArray[7]];
        //cw.queryLeftNewDTO = cu;
        //var stationInfo = Enumerable.From(stations).firstOrDefault();
        ticketInfos.push(this.ticketInfo);
      });
      return ticketInfos;
    },
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
        path: kyfwAPI.query
      };
      this.get(
        options,
        content,
        function(data, response) {
          if (data.status) {
            var a=that.analyzeResult(data.data.result);
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