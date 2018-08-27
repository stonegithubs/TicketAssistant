import Vue from "vue";
export default {
    install: function (Vue) {
        Vue.mixin({
            data() {
                return global = {
                    global:{
                        cookie: null
                    }
                }
            }
        });
    }
}