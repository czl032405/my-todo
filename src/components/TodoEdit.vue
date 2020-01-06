<template>
  <v-form ref="form">
    <v-card>
      <v-card-title>{{ isAdd ? "Add Todo" : "Edit Todo" }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="todo.title"
          label="title"
          required
          :rules="[v => !!v || 'Title is required']"
        ></v-text-field>
        <v-text-field v-model="todo.type" label="type"></v-text-field>
        <v-dialog ref="dateDialog" max-width="320" content-class="ma-0">
          <template v-slot:activator="{ on }">
            <v-text-field :value="todo.date | date" label="date" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker
            :value="todo.date | date"
            scrollable
            @change="
              $event => {
                handleDatePicker($event);
                $refs.dateDialog.save();
              }
            "
          ></v-date-picker>
        </v-dialog>
        <v-textarea v-model="todo.desc" label="desc"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn color="primary" text @click="isAdd ? addTodo() : updateTodo()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script lang="ts">
import Vue from "vue";
import { createComponent, onMounted, reactive, ref, computed, watch } from "@vue/composition-api";
import moment from "moment";
import Api from "../api";
import { BSON } from "mongodb-stitch-browser-sdk";
import router from "../router";

export default createComponent({
  setup(props, context) {
    console.info(context);
    let id = ref<string>(context.attrs.id);
    let date = ref<Date>(context.attrs.date);
    let modal = ref<boolean>(context.attrs.modal);
    let todo = ref<ITodo>({});

    let isAdd = computed(() => !id.value || id.value == "new" || !BSON.ObjectID.isValid(id.value));

    let loadData = async function() {
      console.info(id.value);
      if (isAdd.value) {
        todo.value = { date: date.value };
      } else {
        todo.value = await Api.Todo.get(id.value);
      }
    };

    let addTodo = async function(date: string) {
      let form = context["refs"]["form"];
      let result = form.validate();
      if (result) {
        await Api.Todo.insert(todo.value);
        !modal && router.push("/todos");
        context.emit("saved");
      }
    };
    let updateTodo = async function() {
      let form = context["refs"]["form"];
      let result = form.validate();
      if (result) {
        await Api.Todo.update(todo.value._id, { title: todo.value.title, desc: todo.value.desc, type: todo.value.type, date: todo.value.date });
        !modal && router.push("/todos");
        context.emit("saved");
      }
    };

    let cancel = async function() {
      !modal && router.push("/todos");
      context.emit("cancel");
    };

    let handleDatePicker = async function(datestr) {
      todo.value.date = moment(datestr).toDate();
    };

    watch(id, id => {
      loadData();
    });

    onMounted(() => console.info("Todo Edit Mounted"));

    return {
      //data
      id,
      date,
      todo,
      //computed
      isAdd,
      //methods
      addTodo,
      updateTodo,
      cancel,
      handleDatePicker
    };
  }
});
</script>
