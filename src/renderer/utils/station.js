import Vue from "vue";
import stationNames from './station.sources'
export default {
    install: function (Vue) {
        Vue.mixin({
            methods: {
                getStations: function () {
                    var stations = [];
                    var temp=stationNames.split("@");
                    temp.splice(0, 1);
                    temp.forEach(item => {
                        var result = item.split("|");
                        var station = {
                            name: result[1],
                            code: result[2],
                            pinyin: result[3],
                            //拼音首字母简写
                            pinyin_abbreviation: result[4],
                            //全国站点排名
                            index: result[5]
                        }
                        stations.push(station);
                    });
                    return stations;
                }
            }
        });
    }
}