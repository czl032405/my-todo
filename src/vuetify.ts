import Vue from "vue";
import Vuetify from "vuetify/lib";
import zhHans from "vuetify/src/locale/zh-Hans";
import en from "vuetify/src/locale/en";

Vue.use(Vuetify);
let vuetify = new Vuetify({
  lang: {
    locales: { zhHans, en },
    current: "en"
  },
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

console.info(vuetify);

export default vuetify;
