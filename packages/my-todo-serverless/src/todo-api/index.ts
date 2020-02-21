import Axios from "axios";
import * as cloud from "wx-server-sdk";
import { database } from "wx-server-sdk";
import * as moment from "moment";

console.info(cloud.version);

cloud.init({
  env: (<any>cloud).DYNAMIC_CURRENT_ENV
});

const db = database();
const _ = db.command;
const todoCollection = db.collection("todos");

const init = async function() {
  let result = await db.createCollection("todos");
  return result;
};

const index = async function(cond: { pageNo?: number; pageSize?: number; q?: string; from?: Date; to?: Date; sort?: string } = {}) {
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
  $match.date = _.gt(from).lt(to);

  if (q) {
    $match.title = new RegExp(q, "i");
  }

  let indexResult = await todoCollection
    .where($match)
    .orderBy("date", "asc")
    .skip(skip)
    .limit(limit || 10000)
    .get();

  let countResult = await todoCollection.where($match).count();
  let total: number = countResult.total;
  return {
    data: indexResult.data,
    page: {
      pageNo: +pageNo,
      pageSize: +pageSize,
      totalPage: pageSize ? Math.ceil(total / pageSize) : 1,
      total: total
    }
  };
};

const get = async function(id: string) {
  let result = await todoCollection.doc(id).get();
  return result.data;
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
  return result._id;
};

const update = async function(id: string, patch: ITodo) {
  let result = await todoCollection.doc(id).update({ data: patch });
  return result.stats;
};

const remove = async function(id: string) {
  let result = await todoCollection.doc(id).remove();
  return result.stats;
};

export async function main(event, context) {
  console.info(event);
  try {
    const { method = "", params = {} } = event;
    switch (method) {
      case "init":
        return await init();
      case "index":
        return await index(params);
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
      default:
        throw new Error("Not Supported Method");
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}
