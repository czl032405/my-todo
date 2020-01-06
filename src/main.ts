import Vue from "vue";
import App from "./App.vue";
import VueCompositionApi from "@vue/composition-api";
import router from "./router";
import vuetify from "./vuetify";
import Api from "./api";
import moment from "moment";
import "./filter";
import "./service-worker-register";

moment.locale("zh-cn");

globalThis.moment = moment;

Vue.use(VueCompositionApi);
Api.init();

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
