<template>
  <v-container class="todo-list pa-0  pa-lg-5" fluid>
    <v-row>
      <v-col class="d-none d-md-block flex-grow-0">
        <v-card outlined tile>
          <v-card-title>Options</v-card-title>
          <v-card-text>
            <v-date-picker :value="selectedDate | date" @change="handleDatePicker" :show-week="true"></v-date-picker>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <v-container class="d-flex justify-space-between">
            <v-btn outlined color="secondary" class="d-none d-sm-block" @click="goPrevWeek()">Prev</v-btn>
            <v-btn fab x-small text color="secondary" class="d-sm-none" @click="goPrevWeek()">
              <v-icon>mdi-page-first</v-icon>
            </v-btn>

            <v-btn text class="px-1" @click="$vuetify.breakpoint.smAndDown && (showDatePicker = true)">{{ from | date }} -- {{ to | date }}</v-btn>
            <v-btn outlined color="secondary" class="d-none d-sm-block" @click="goNextWeek()">Next</v-btn>
            <v-btn fab x-small text color="secondary" class="d-sm-none" @click="goNextWeek()">
              <v-icon>mdi-page-last</v-icon>
            </v-btn>
          </v-container>

          <v-list three-line v-for="(todos, key) in groupTodos" :key="key">
            <v-subheader>
              <span>{{ dateTitle(key) }}</span>
              <v-btn fab text x-small color="secondary" class="ml-2" @click="showAddTodo(key)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-subheader>
            <v-list-item v-for="(todo, ix) in todos" :key="ix">
              <v-list-item-action class="mt-5">
                <v-checkbox v-model="todo.isFinish" @change="updateTodo(todo)"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content class="mt-2">
                <v-list-item-title>{{ todo.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <pre>{{ todo.desc }}</pre>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-flex>
                  <v-btn fab text x-small color="secondary" class="ml-2" @click="showEditTodo(todo)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn fab text x-small color="error" class="ml-2" @click="showDeleteTodo(todo)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- delete dialog -->
    <v-dialog v-model="showDelete" max-width="320">
      <v-card>
        <v-card-title>Confirm Delete?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDelete = false">Cancel</v-btn>
          <v-btn
            color="accent"
            text
            @click="
              showDelete = false;
              deleteTodo();
            "
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- edit dialog -->
    <v-dialog v-model="showEdit" max-width="900">
      <todo-edit v-if="showEdit" :id="selectedTodo && selectedTodo._id" :date="selectedDate" @saved="handleSaved" @cancel="showEdit = false"></todo-edit>
    </v-dialog>

    <!-- date picker dialog -->
    <v-dialog v-model="showDatePicker" max-width="320" content-class="ma-0">
      <v-date-picker :value="selectedDate | date" @change="handleDatePicker" :show-week="true"></v-date-picker>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { createComponent, onMounted, reactive, ref, computed, watch } from "@vue/composition-api";
import moment from "moment";
import Api from "../api";
import TodoEdit from "@/components/TodoEdit.vue";

export default createComponent({
  components: {
    TodoEdit
  },
  setup() {
    // state

    let showDelete = ref(false);

    let showEdit = ref(false);

    let showDatePicker = ref(false);

    let from = ref<Date>(
      moment()
        .startOf("week")
        .toDate()
    );
    let to = ref<Date>(
      moment()
        .endOf("week")
        .toDate()
    );

    let todos = ref<ITodo[]>([]);

    let selectedTodo = ref<ITodo>();

    let selectedDate = ref<Date>();

    let groupTodos = computed(() => {
      let result: { [key: string]: ITodo[] } = {};
      for (let i = moment(from.value).clone(); moment(to.value).diff(i) > 0; i.add(1, "day")) {
        result[i.format("YYYY-MM-DD")] = [];
      }
      todos.value.map(todo => {
        let key = moment(todo.date).format("YYYY-MM-DD");
        result[key] && result[key].push(todo);
      });
      return result;

      // return todos.value.reduce<{ [key: string]: ITodo[] }>((acc, todo) => {
      //   let key = moment(todo.date).format("YYYY-MM-DD");
      //   acc[key] = acc[key] || [];
      //   acc[key].push(todo);
      //   return acc;
      // }, {});
    });

    let dateTitle = computed(() => (dateString: string) =>
      moment(dateString)
        .locale("zh-cn")
        .format("YYYY-MM-DD ddd")
    );

    // methods
    let handleDatePicker = async function(datestr) {
      selectedDate.value = moment(datestr).toDate();
      showDatePicker.value = false;
    };

    let handleSaved = async function() {
      showEdit.value = false;
      loadTodos();
    };

    let goPrevWeek = async function() {
      from.value = moment(from.value)
        .add(-1, "week")
        .toDate();
      to.value = moment(to.value)
        .add(-1, "week")
        .toDate();
    };
    let goNextWeek = async function() {
      from.value = moment(from.value)
        .add(1, "week")
        .toDate();
      to.value = moment(to.value)
        .add(1, "week")
        .toDate();
    };
    let showAddTodo = async function(dateString: string) {
      showEdit.value = true;
      selectedDate.value = moment(dateString).toDate();
      selectedTodo.value = undefined;
    };
    let showEditTodo = async function(todo: ITodo) {
      showEdit.value = true;
      selectedDate.value = undefined;
      selectedTodo.value = todo;
    };
    let showDeleteTodo = async function(todo: ITodo) {
      selectedTodo.value = todo;
      showDelete.value = true;
    };
    let loadTodos = async function() {
      let result = await Api.Todo.index({ from: from.value, to: to.value, pageSize: 0 });
      todos.value = result.data;
    };
    let addTodo = async function(date: string) {};
    let updateTodo = async function(todo: ITodo) {
      await Api.Todo.update(todo._id!, { isFinish: todo.isFinish });
    };
    let deleteTodo = async function() {
      let todo = selectedTodo.value;
      await Api.Todo.delete(todo._id!);
      loadTodos();
    };

    watch(
      computed(() => from.value.toString() + to.value.toString()),
      async () => {
        loadTodos();
      }
    );

    watch(selectedDate, selectedDate => {
      from.value = moment(selectedDate)
        .startOf("week")
        .toDate();
      to.value = moment(selectedDate)
        .endOf("week")
        .toDate();
    });

    onMounted(async () => {
      console.info("ToDo List Mounted");
    });

    return {
      //data
      showDelete,
      showEdit,
      showDatePicker,
      from,
      to,
      todos,
      selectedTodo,
      selectedDate,
      //computed
      groupTodos,
      dateTitle,
      // methods

      goPrevWeek,
      goNextWeek,
      addTodo,
      updateTodo,
      deleteTodo,
      showAddTodo,
      showDeleteTodo,
      showEditTodo,
      handleDatePicker,
      handleSaved
    };
  }
});
</script>
<style lang="less">
.todo-list {
  .v-list--three-line .v-list-item .v-list-item__subtitle,
  .v-list-item--three-line .v-list-item__subtitle {
    -webkit-line-clamp: inherit;
  }
  .v-list--three-line .v-list-item,
  .v-list-item--three-line {
    min-height: auto;
  }
  pre {
    white-space: pre-line;
  }
}
</style>
