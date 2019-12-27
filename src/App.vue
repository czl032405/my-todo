<template>
  <v-app>
    <v-app-bar app color="primary" class="white--text">
      <v-toolbar-title>ToDo Application</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container fluid>
        <router-view v-if="showRouter" />
      </v-container>
    </v-content>
    <v-footer app>
      <span>-</span>
    </v-footer>
    <!-- overlay -->
    <v-overlay :value="loading" z-index="9999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- login -->
    <v-dialog v-model="needLogin" max-width="900" persistent="">
      <login></login>
    </v-dialog>
  </v-app>
</template>
<script lang="ts">
import { createComponent, onMounted, reactive, ref, computed, watch } from "@vue/composition-api";
import Api from "./api";
import Login from "@/components/Login.vue";
export default createComponent({
  components: {
    Login
  },
  setup() {
    let showRouter = ref(true);
    let loading = Api.loading;
    let needLogin = Api.needLogin;
    watch(loading, loading => console.info("loading", loading));
    watch(needLogin, (n, o) => {
      console.info(n, o);
      if (n === false && o === true) {
        showRouter.value = false;
        setTimeout(() => {
          showRouter.value = true;
        }, 0);
      }
    });
    return {
      loading,
      needLogin,
      showRouter
    };
  }
});
</script>
<style lang="less"></style>
