import Vue from "vue";
export default {
    install: function (Vue) {
        Vue.mixin({
            methods: {
                //将set-cookie headers转换为cookie字符串
                refreshCookie: function (headerCookies) {
                    var that = this;
                    var cookieArray = [];
                    if (that.global.cookie != null && that.global.cookie != "") {
                        that.global.cookie.split(";").forEach((item, index) => {
                            var splitResult = item.split("=");
                            cookieArray.push({
                                key: splitResult[0],
                                value: splitResult[1]
                            });
                        });
                    }
                    if (headerCookies != null && headerCookies != "") {
                        headerCookies.forEach((item, index) => {
                            var cookieResult = item.split(";")[0];
                            var splitResult = cookieResult.split("=");
                            var key = splitResult[0];
                            var value = splitResult[1];
                            var flag = false;
                            cookieArray.some((temp, tempIndex) => {
                                if (temp.key == key) {
                                    temp.value = value;
                                    flag = true;
                                    return true;
                                }
                            });
                            if (!flag) {
                                cookieArray.push({
                                    key: key,
                                    value: value
                                });
                            }
                        });
                    }
                    var cookie = "";
                    cookieArray.forEach((item, index) => {
                        cookie += item.key + "=" + item.value + ";";
                    });
                    that.global.cookie = cookie.substring(0, cookie.length - 1);
                }
            }
        });
    }
}