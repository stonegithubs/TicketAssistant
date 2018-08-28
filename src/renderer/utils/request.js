import Vue from "vue";
const https = require("https");
const querystring = require("querystring");
export default {
    install: function (Vue) {
        Vue.mixin({
            methods: {
                post: function (options, content, successCallback, errorCallback) {
                    var that = this;
                    this.$Spin.show();
                    var cookie = localStorage["cookie"];
                    var opt = {
                        hostname: options.hostname,
                        port: 443,
                        path: options.path,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            Cookie: cookie == undefined ? null : cookie,
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
                            "Cache-Control": "no-cache",
                            "If-Modified-Since": "0"
                        }
                    };
                    var request = https.request(opt, function (response) {
                        response.setEncoding("utf8");
                        var body = "";
                        response.on("data", function (result) {
                            body += result;
                        });
                        response.on("end", function () {
                            that.$Spin.hide();
                            //设置cookie
                            that.refreshCookie(response.headers["set-cookie"]);
                            var data = JSON.parse(body);
                            successCallback(data, response);
                        });
                    });
                    request.write(querystring.stringify(content));
                    request.on("error", function (e) {
                        that.$Spin.hide();
                        errorCallback(e);
                    });
                    request.end();
                },
                get: function (options, content, successCallback, errorCallback) {
                    var that = this;
                    this.$Spin.show();
                    var path = options.path + "?" + querystring.stringify(content);
                    var cookie = localStorage["cookie"];
                    var opt = {
                        hostname: "kyfw.12306.cn",
                        port: 443,
                        path: path,
                        method: "GET",
                        headers: {
                            Cookie: cookie == undefined ? null : cookie,
                            "Cache-Control": "no-cache",
                            "If-Modified-Since": "0",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
                        }
                    };
                    var request = https.request(opt, (response) => {
                        response.setEncoding("utf8");
                        var body = "";
                        response.on("data", (result) => {
                            body += result;
                        });
                        response.on("end", function () {
                            that.$Spin.hide();
                            //设置cookie
                            that.refreshCookie(response.headers["set-cookie"]);
                            var data = JSON.parse(body);
                            successCallback(data, response);
                        });
                    })
                    request.on("error", (e) => {
                        that.$Spin.hide();
                        errorCallback(e);
                    });
                    request.end();
                }
            }
        });
    }
}