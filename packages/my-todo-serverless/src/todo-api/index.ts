import Axios from "axios";
import * as cloud from "wx-server-sdk";

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

export async function main(event, context) {
  console.info(event);

  return 1;
}
