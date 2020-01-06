<template>
  <v-app>
    <v-app-bar app color="primary" class="white--text">
      <v-toolbar-title>ToDo Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn style="display:none" color="white" text @click="changeLang" width="50">{{lang}}</v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view v-if="showRouter" />
      </v-container>
    </v-content>
    <v-footer app>
      <span>-</span>
    </v-footer>
    <!-- snackbar -->
    <v-snackbar v-model="showSnackbar" :timeout="3000">
      {{ globalMessage }}
      <v-btn color="pink" text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
    <!-- overlay -->
    <v-overlay :value="loading" z-index="9999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- login -->
    <v-dialog v-model="needLogin" max-width="900" persistent>
      <login></login>
    </v-dialog>
  </v-app>
</template>
<script lang="ts">
import { createComponent, onMounted, reactive, ref, computed, watch } from "@vue/composition-api";
import Api from "./api";
import Login from "@/components/Login.vue";
import vuetify from "./vuetify";
import MessageBox from "./message-box";
export default createComponent({
  components: {
    Login
  },
  setup() {
    let showRouter = ref(true);
    let showSnackbar = ref(false);
    let lang = ref("en");
    let loading = Api.loading;
    let needLogin = Api.needLogin;
    let globalMessage = MessageBox.globalMessage;

    watch(needLogin, (n, o) => {
      if (n === false && o === true) {
        showRouter.value = false;
        setTimeout(() => {
          showRouter.value = true;
        }, 0);
      }
    });

    watch(lang, lang => {
      let $vuetify = vuetify.framework;
      $vuetify.lang.current = lang;
    });

    watch(globalMessage, globalMessage => globalMessage && (showSnackbar.value = true));

    const changeLang = async function() {
      let langs = ["zhHans", "en"];
      let currentIndex = langs.indexOf(lang.value);
      lang.value = langs[(currentIndex + 1) % langs.length];
    };

    return {
      showSnackbar,
      showRouter,
      lang,
      loading,
      needLogin,
      globalMessage,
      changeLang
    };
  }
});
</script>
<style lang="less"></style>
