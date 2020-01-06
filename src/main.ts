import Vue from "vue";
import "./vue-use";
import router from "./router";
import vuetify from "./vuetify";
import App from "./App.vue";
import moment from "moment";
import "./filter";
import "./service-worker-register";

moment.locale("zh-cn");
globalThis.moment = moment;
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
