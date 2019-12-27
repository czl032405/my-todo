import Vue from "vue";
import App from "./App.vue";
import VueCompositionApi from "@vue/composition-api";
import Vuetify from "vuetify/lib";
import router from "./router";
import "./filter";
import "./db";
import Api from "./api";

Vue.use(Vuetify);
Vue.use(VueCompositionApi);
Api.init();

Vue.config.productionTip = false;

let vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#9c27b0",
        secondary: "#3f51b5",
        accent: "#f44336",
        error: "#e91e63",
        warning: "#ffc107",
        info: "#2196f3",
        success: "#4caf50"
      }
    }
  }
});

new Vue({
  router,
  vuetify: vuetify,
  render: h => h(App)
}).$mount("#app");
