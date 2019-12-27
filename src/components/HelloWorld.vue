<template>
  <div class="hello">
    <v-btn color="primary">Hello</v-btn>
  </div>
</template>

<script lang="ts">
import { createComponent, onMounted } from "@vue/composition-api";

export default createComponent({
  // type inference enabled
  setup() {
    onMounted(() => {
      console.info("Helloword Mounted");
    });
    return {};
  }
});
</script>

<style lang="less"></style>
