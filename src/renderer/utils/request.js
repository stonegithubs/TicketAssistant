import Vue from "vue";
const https = require("https");
const http = require("http");
const querystring = require("querystring");
const HttpsProxyAgent = require("https-proxy-agent");
const tls = require("tls");
const zlib = require('zlib');
export default {
    install: function (Vue) {
        Vue.mixin({
            methods: {
                post: function (options, content, successCallback, errorCallback) {
                    var that = this;
                    this.$Spin.show();
                    var cookie = localStorage["cookie"];
                    console.log(cookie);
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
                            "If-Modified-Since": "0",
                            "X-Requested-With": "XMLHttpRequest"
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
                            if (response.statusCode != 200) {
                                var e = { message: "请求数据失败:" + response.statusCode }
                                errorCallback(e);
                                return;
                            }
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
                    console.log(cookie);
                    var opt = {
                        hostname: options.hostname,
                        port: 443,
                        path: path,
                        method: "GET",
                        headers: {
                            Cookie: cookie == undefined ? null : cookie,
                            "Cache-Control": "no-cache",
                            "If-Modified-Since": "0",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
                            "X-Requested-With": "XMLHttpRequest",
                            "Host": options.hostname
                        }
                    };
                    //是否启用代理
                    var proxy = localStorage["proxy"];
                    if (proxy == true || proxy == "true") {
                        var request = http.request({
                            //代理地址
                            host: localStorage["proxy_host"],
                            //代理端口
                            port: localStorage["proxy_port"],
                            method: "CONNECT",
                            path: options.hostname + ":443",
                        });
                        //连接到代理
                        request.on("connect", function (res, socket, head) {
                            //使用tls
                            var cts = tls.connect({
                                host: options.hostname,
                                socket: socket,
                                //忽略证书安全
                                rejectUnauthorized: false
                            }, function () {
                                //根据headers生成http协议
                                var headers = "GET " + path + " HTTP/1.1\r\n";
                                for (var property in opt.headers) {
                                    headers += property + ": " + opt.headers[property] + "\r\n"
                                }
                                headers += "\r\n";
                                console.log(headers);
                                cts.write(headers);
                            });
                            var body = "";
                            cts.on("data", function (data) {
                                body += data.toString();
                            });
                            cts.on("end", function () {
                                that.$Spin.hide();
                                //解析出response和data
                                var result = body.split("\r\n\r\n");
                                //解析response
                                var responses = result[0].split("\r\n");
                                if (responses[0].split(" ")[1] == "200") {
                                    successCallback(JSON.parse(result[1]), "");
                                } else {
                                    var e = { message: "请求数据失败:" + responses[0].split(" ")[1] }
                                    errorCallback(e);
                                }
                            });
                        });

                        request.end();
                        return;

                    }
                    // var request = https.request(opt, (response) => {
                    //     response.setEncoding("utf8");
                    //     var body = [];
                    //     response.on("data", (result) => {
                    //         body.push(result);
                    //     });
                    //     response.on("end", function () {
                    //         that.$Spin.hide();


                    //         var buffer = Buffer.concat(body);
                    //         zlib.gunzip(buffer, function (err, decoded) {
                    //             var temp = decoded.toString();
                    //         });

                    //         if (response.statusCode != 200) {
                    //             var e = { message: "请求数据失败:" + response.statusCode }
                    //             errorCallback(e);
                    //             return;
                    //         }
                    //         //设置cookie
                    //         that.refreshCookie(response.headers["set-cookie"]);
                    //         var data = JSON.parse(body);
                    //         successCallback(data, response);
                    //     });
                    // })
                    // request.on("error", (e) => {
                    //     that.$Spin.hide();
                    //     errorCallback(e);
                    // });
                    // request.end();

                    var request = https.request(opt, (response) => {
                        response.setEncoding("utf8");
                        var body = "";
                        response.on("data", (result) => {
                            body += result;
                        });
                        response.on("end", function () {
                            that.$Spin.hide();
                            console.log(response.headers["content-encoding"]);
                            if (response.statusCode != 200) {
                                var e = { message: "请求数据失败:" + response.statusCode }
                                errorCallback(e);
                                return;
                            }
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