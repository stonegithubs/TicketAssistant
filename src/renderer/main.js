import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

import iView from 'iview';    //引入UI框架
import 'iview/dist/styles/iview.css';
import https from './utils/request';
import cookie from './utils/cookie';
import station from './utils/station';

Vue.use(iView);
Vue.use(https);
Vue.use(cookie);
Vue.use(station);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
