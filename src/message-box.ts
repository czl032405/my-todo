import { ref, watch } from "@vue/composition-api";

class MessageBox {
  static globalMessage = ref("");
}

export default MessageBox;
