import Axios from "axios";
import * as cloud from "wx-server-sdk";
import { database } from "wx-server-sdk";
import * as moment from "moment";
cloud.init({
  env: (<any>cloud).DYNAMIC_CURRENT_ENV
});

const db = database();
const _ = db.command;
const todoCollection = db.collection("todo");

const init = async function() {};

const list = async function(cond: { pageNo?: number; pageSize?: number; q?: string; from?: Date; to?: Date; sort?: string } = {}) {
  let { pageNo = 1, pageSize = 20, q = "", sort = "-date rank", from, to } = cond;
  from = from || new Date("2000-01-01");
  to = to || new Date("3000-01-01");

  let skip = (+pageNo - 1) * +pageSize;
  let limit = +pageSize;
  let $sort = sort
    .split(" ")
    .filter(Boolean)
    .reduce((acc, s) => {
      acc[s.replace("-", "")] = /-/.test(s) ? -1 : 1;
      return acc;
    }, {});

  let $match: { [fieldName: string]: any } = {};
  $match.date = _.gte(+from).lte(+to);

  var aa = { date: _.gte(+from).lte(+to) };
  // let a = _.or([{ title: /a/ }]);

  if (q) {
    $match.title = new RegExp(q, "i");
  }

  console.info($match);

  let result = await todoCollection
    .aggregate()
    .match($match)
    .sort($sort)
    .skip(skip)
    .limit(limit || 10000)
    .end();

  return result;
};

const get = async function(id: string) {
  let result = await todoCollection.doc(id).get();
  return result;
};

const add = async function(todo: ITodo = {}) {
  todo.owner_id = "aaaa";
  todo.createdAt = new Date();
  todo.updatedAt = new Date();
  todo.title = todo.title || "Test Title";
  todo.isFinish = todo.isFinish || false;
  todo.isImportant = todo.isImportant || false;
  todo.rank = 1;
  todo.date =
    todo.date ||
    moment()
      .startOf("day")
      .toDate();
  let result = await todoCollection.add({
    data: todo
  });
  return result;
};

const update = async function(id: string, patch: ITodo) {
  let result = await todoCollection.doc(id).update({ data: patch });
  return result;
};

const remove = async function(id: string) {
  let result = await todoCollection.doc(id).remove();
  return result;
};

export async function main(event, context) {
  console.info(event);
  try {
    const { method = "", params = {} } = event;
    switch (method) {
      case "list":
        return await list(params);
        break;
      case "get":
        return await get(params.id);
        break;
      case "add":
        return await add(params.doc);
        break;
      case "update":
        return await update(params.id, params.doc);
        break;
      case "remove":
        return await remove(params.id);
        break;
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
  return 1;
}
