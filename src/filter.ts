import Vue from "vue";
import moment from "moment";

Vue.filter("date", function(value: Date, format: string = "YYYY-MM-DD") {
  if (!value) {
    return "";
  }
  return moment(value).format(format);
});
