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
                    var opt = {
                        hostname: options.hostname,
                        port: 443,
                        path: options.path,
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            Cookie: options.cookie
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
                }
            }
        });
    }
}