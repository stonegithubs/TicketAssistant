import Vue from "vue";
export default {
    install: function (Vue) {
        Vue.mixin({
            methods: {
                //合并对象的属性,如果两个对象具有相同的属性,数组索引较大对象的属性值会覆盖数组索引较小对象的属性值.
                mergeObject: function (objects) {
                    if (!Array.isArray(objects)) {
                        return {};
                    }
                    var mergeObj = {};
                    if (objects == undefined || objects == null) {
                        return {};
                    }
                    for (var obj in objects) {
                        if (objects[obj] == undefined || objects[obj] == null) {
                            continue;
                        }
                        for (var property in objects[obj]) {
                            mergeObj[property] = objects[obj][property];
                        }
                    }
                    return mergeObj;
                },
                getNowFormatDate: function (date) {
                    var seperator = "-";
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var strDate = date.getDate();
                    if (month >= 1 && month <= 9) {
                        month = "0" + month;
                    }
                    if (strDate >= 0 && strDate <= 9) {
                        strDate = "0" + strDate;
                    }
                    var currentdate = year + seperator + month + seperator + strDate;
                    return currentdate;
                }
            }
        });
    }
}