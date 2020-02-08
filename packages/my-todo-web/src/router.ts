import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import TodoList from "@/components/TodoList.vue";
import TodoEdit from "@/components/TodoEdit.vue";

Vue.use(VueRouter);
const routes: RouteConfig[] = [
  {
    path: "/",
    name: "home",
    component: TodoList
    // redirect: "/todos"
  },
  {
    path: "/todos",
    name: "todos",
    component: TodoList
  },
  {
    path: "/todos/:id",
    name: "todo",
    component: TodoEdit,
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
