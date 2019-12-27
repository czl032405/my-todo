<template>
  <v-form @submit.prevent="login">
    <v-card>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="username" label="username" required :rules="[v => !!v || 'username is required']"></v-text-field>
        <v-text-field type="password" v-model="password" label="password" required :rules="[v => !!v || 'password is required']"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text type="submit">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import { createComponent, onMounted, reactive, ref, computed, watch } from "@vue/composition-api";
import Api from "../api";

export default createComponent({
  setup() {
    let username = ref("");
    let password = ref("");

    let login = async function() {
      let result = await Api.auth(username.value, password.value);
    };
    return {
      username,
      password,
      login
    };
  }
});
</script>
