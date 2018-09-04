<style scoped>
</style>
<template>
  <div class="layout">
    <Layout>
      <Row>
        <Col span="12" style="width:15%">
        <Select v-model="fromStationCode" filterable remote :remote-method="searchFromStation" placeholder="请选择出发站" style="width: 200px">
          <Option v-for="item in fromSearchStationResult" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col span="12" style="width:15%">
        <Select v-model="toStationCode" filterable remote :remote-method="searchToStation" placeholder="请选择到达站" style="width: 200px">
          <Option v-for="item in toSearchStationResult" :value="item.code" :key="item.code">{{ item.name }}</Option>
        </Select>
        </Col>
        <Col span="12" style="width:15%">
        <DatePicker v-model="departureDate" type="date" placeholder="选择出发日期" style="width: 200px"></DatePicker>
        </Col>
      </Row>
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
      fromSearchStationResult: [],
      toSearchStationResult: [],
      fromStationCode: "",
      toStationCode: "",
      departureDate: "",
      stations: [],
      columns: [
        {
          title: "车次",
          key: "stationTrainCode"
        },
        {
          title: "出发站",
          key: "stationNameFrom"
        },
        {
          title: "到达站",
          key: "stationNameTo"
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
          key: "remark",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    style: "width: 200px"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.preOrder(params.row);
                    }
                  }
                },
                params.row.remark
              )
            ]);
          }
        }
      ],
      data: [],
      ticketInfo: {
        //凭证
        secret: null,
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
    this.stations = this.getStations();
  },
  methods: {
    searchFromStation: function(value) {
      var that = this;
      this.fromSearchStationResult = Enumerable.from(that.stations)
        .where(item => item.name.indexOf(value) > -1)
        .toArray();
    },
    searchToStation: function(value) {
      var that = this;
      this.toSearchStationResult = Enumerable.from(that.stations)
        .where(item => item.name.indexOf(value) > -1)
        .toArray();
    },
    analyzeResult: function(datas) {
      var that = this;
      var ticketInfos = [];
      datas.forEach(element => {
        var results = element.split("|");
        var ticketInfoModel = {
          secret: results[0],
          remark: results[1],
          trainNo: results[2],
          stationTrainCode: results[3],
          stationCodeStart: results[4],
          stationCodeEnd: results[5],
          stationCodeFrom: results[6],
          stationCodeTo: results[7],
          startTime: results[8],
          arriveTime: results[9],
          period: results[10],
          buy: results[11],
          ypInfo: results[12],
          startDate: results[13],
          trainSeatFeature: results[14],
          locationCode: results[15],
          stationNoFrom: results[16],
          stationNoTo: results[17],
          supportCard: results[18],
          controlledTrainFlag: results[19],
          //gg_num : results[20] ? results[20] : "--";
          highSoftSleeperResidualTicketCount: results[21] ? results[21] : "--",
          otherResidualTicketCount: results[22] ? results[22] : "--",
          softSleeperResidualTicketCount: results[23] ? results[23] : "--",
          softSeatResidualTicketCount: results[24] ? results[24] : "--",
          //tz_num : results[25] ? results[25] : "--";
          noSeatResidualTicketCount: results[26] ? results[26] : "--",
          //yb_num : results[27] ? results[27] : "--";
          sleeperResidualTicketCount: results[28] ? results[28] : "--",
          seatResidualTicketCount: results[29] ? results[29] : "--",
          secondSeatResidualTicketCount: results[30] ? results[30] : "--",
          firstSeatResidualTicketCount: results[31] ? results[31] : "--",
          businessSeatResidualTicketCount: results[32] ? results[32] : "--",
          dongSleeperResidualTicketCount: results[33] ? results[33] : "--",
          //yp_ex = results[34];
          seatType: results[35],
          //exchange_train_flag = results[36];
          stationNameFrom: null,
          stationNameTo: null
        };
        ticketInfoModel.stationNameFrom = Enumerable.from(
          that.stations
        ).firstOrDefault(
          item => item.code == ticketInfoModel.stationCodeFrom
        ).name;
        ticketInfoModel.stationNameTo = Enumerable.from(
          that.stations
        ).firstOrDefault(
          item => item.code == ticketInfoModel.stationCodeTo
        ).name;
        ticketInfos.push(ticketInfoModel);
      });
      return ticketInfos;
    },
    checkUser: function(callback) {
      var that = this;
      var content = {
        _json_att: ""
      };
      var options = {
        hostname: kyfwAPI.root,
        path: kyfwAPI.checkUser
      };
      this.post(
        options,
        content,
        function(data, response) {
          if (data.status) {
            if (!data.data.flag) {
              that.$Message.info("请先登录");
              that.showLogin();
              return;
            }
            callback();
            return;
          }
          that.$Message.error({
            content: data.messages,
            duration: 10,
            closable: true
          });
        },
        function(e) {
          that.$Message.error({
            content: e.message,
            duration: 10,
            closable: true
          });
        }
      );
    },
    submitOrderRequest: function(secret) {
      var that = this;
      var content = {
        secretStr: secret,
        train_date: that.getNowFormatDate(that.departureDate),
        back_train_date: that.getNowFormatDate(new Date()),
        tour_flag: "dc",
        purpose_codes: "ADULT",
        query_from_station_name: Enumerable.from(that.stations).firstOrDefault(
          item => item.code == that.fromStationCode
        ).name,
        query_to_station_name: Enumerable.from(that.stations).firstOrDefault(
          item => item.code == that.toStationCode
        ).name,
        undefined: null
      };
      var options = {
        hostname: kyfwAPI.root,
        path: kyfwAPI.submitOrderRequest,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "*/*"
        }
      };
      this.post(
        options,
        content,
        function(data, response) {
          if (data.status) {
            //Y表示离开车时间很近
            if (data.data == "Y") {
              that.$Message.info("验证成功");
              return;
            }
            //N无需提示
            that.$Message.info("验证失败");
          }
          that.$Message.error({
            content: data.messages,
            duration: 10,
            closable: true
          });
        },
        function(e) {
          that.$Message.error({
            content: e.message,
            duration: 10,
            closable: true
          });
        }
      );
    },
    preOrder: function(row) {
      var that = this;
      if (
        localStorage["loginFlag"] == undefined ||
        localStorage["loginFlag"] == false
      ) {
        that.$Message.info("请先登录");
        that.showLogin();
        return;
      }
      this.checkUser(function() {
        that.submitOrderRequest(row.secret);
      });
    },
    ticketQuery: function(address) {
      var that = this;
      var content = {
        "leftTicketDTO.train_date": that.getNowFormatDate(that.departureDate),
        "leftTicketDTO.from_station": that.fromStationCode,
        "leftTicketDTO.to_station": that.toStationCode,
        purpose_codes: "ADULT"
      };
      var options = {
        hostname: kyfwAPI.root,
        path: address,
        headers: {
          "Cache-Control": "no-cache",
          "If-Modified-Since": "0"
        }
      };
      this.get(
        options,
        content,
        function(data, response) {
          if (data.status) {
            that.data = that.analyzeResult(data.data.result);
            return;
          }
          that.ticketQuery("/otn/" + data.c_url);
        },
        function(e) {
          that.$Message.error({
            content: e.message,
            duration: 10,
            closable: true
          });
        }
      );
    },
    query: function() {
      localStorage["proxy_host"] = "127.0.0.1";
      localStorage["proxy_port"] = "1080";
      localStorage["proxy"] = false;
      var that = this;
      if (that.departureDate == "") {
        that.$Message.error("请选择出发日期");
        return;
      }
      if (that.fromStationCode == "") {
        that.$Message.error("请选择出发站");
        return;
      }
      if (that.toStationCode == "") {
        that.$Message.error("请选择到达站");
        return;
      }
      that.ticketQuery(kyfwAPI.query);
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