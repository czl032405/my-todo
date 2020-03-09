import { db, client } from "./db";
import moment from "moment";
import { ref, Ref } from "@vue/composition-api";
import { BSON, StitchClientError, StitchServiceError } from "mongodb-stitch-browser-sdk";
import { Stitch, RemoteMongoClient, UserPasswordCredential, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";
import MessageBox from "./message-box";

const TodoCollection = db.collection("todos");

const setLoading = function(loading: boolean) {
  Api.loading.value = loading;
};

const callStitch = async function<T>(asyncFunc: () => Promise<T>): Promise<T> {
  try {
    setLoading(true);
    let result = await asyncFunc();
    return result;
  } catch (error) {
    if (error instanceof StitchClientError) {
      if (error.errorCodeName == "MustAuthenticateFirst") {
        Api.needLogin.value = true;
      }
    }
    if (error instanceof StitchServiceError) {
      MessageBox.globalMessage.value = error.message;
    }
    throw error;
  } finally {
    setLoading(false);
  }
};

class TodoApi {
  static async index(cond: { pageNo?: number; pageSize?: number; q?: string; from?: Date; to?: Date; sort?: string } = {}) {
    return await callStitch(async function() {
      let { pageNo = 1, pageSize = 20, q = "", sort = "-date rank", from, to } = cond;

      // match
      let $match: any = {
        $and: [
          //
          { $or: [] },
          {
            $or: [
              {
                date: {
                  $lte: new Date("3000-01-01"),
                  $gte: new Date("2000-01-01")
                }
              },
              { isFinish: false }
            ]
          }
        ]
      };

      if (q) {
        let searchFields = "title,desc,type";
        let expq = new RegExp(q, "i");
        searchFields
          .split(",")
          .map(a => a.trim())
          .map(a => $match.$and[0].$or.push({ [a]: expq }));
      }

      if (from) {
        $match.$and[1].$or[0].date.$gte = from;
      }

      if (to) {
        $match.$and[1].$or[0].date.$lte = to;
      }

      $match.$and = $match.$and.filter(cond => cond.$or.length);

      // sort
      let $sort = sort
        .split(" ")
        .filter(Boolean)
        .reduce((acc, s) => {
          acc[s.replace("-", "")] = /-/.test(s) ? -1 : 1;
          return acc;
        }, {});

      //query
      let [todos, total]: [ITodo[], number] = await Promise.all([
        TodoCollection.aggregate(
          [
            //
            { $match },
            { $sort },
            { $skip: (+pageNo - 1) * +pageSize },
            pageSize && { $limit: +pageSize }
          ].filter(Boolean)
        ).asArray(),
        TodoCollection.count($match)
      ]);

      let result = {
        data: todos.map<ITodo>(t => ({ ...t, _id: t._id + "" })),
        page: {
          pageNo: +pageNo,
          pageSize: +pageSize,
          totalPage: pageSize ? Math.ceil(total / pageSize) : 1,
          total: total
        }
      };
      console.info(result);
      return result;
    });
  }

  static async get(_id: string) {
    return await callStitch(async function() {
      let todo: ITodo = await TodoCollection.findOne({ _id: new BSON.ObjectId(_id) });
      if (todo) {
        todo._id = todo._id + "";
      }

      return todo;
    });
  }

  static async insert(todo: ITodo = {}) {
    return await callStitch(async function() {
      todo.owner_id = client.auth.user.id;
      todo.createdAt = new Date();
      todo.updatedAt = new Date();
      todo.title = todo.title || "Title";
      todo.isFinish = todo.isFinish || false;
      todo.isImportant = todo.isImportant || false;
      todo.date =
        todo.date ||
        moment()
          .startOf("day")
          .toDate();
      todo.rank = 1;
      let result: { insertedId: string } = await TodoCollection.insertOne(todo);
      if (result && result.insertedId) {
        result.insertedId = result.insertedId + "";
      }
      return result;
    });
  }

  static async delete(_id: string) {
    return await callStitch(async function() {
      let result = await TodoCollection.deleteOne({ _id: new BSON.ObjectId(_id) });
      return result;
    });
  }

  static async update(_id: string, patch: ITodo) {
    return await callStitch(async function() {
      patch.updatedAt = new Date();
      let todo: ITodo = await TodoCollection.findOneAndUpdate({ _id: new BSON.ObjectId(_id) }, { $set: patch });
      if (todo) {
        todo._id = todo._id + "";
      }
      return todo;
    });
  }
}

class Api {
  static Todo = TodoApi;
  static loading: Ref<boolean> = ref(false);
  static needLogin: Ref<boolean> = ref(false);
  static async checkLogin() {}
  static async auth(username: string, password: string) {
    return await callStitch(async function() {
      let credential = new UserPasswordCredential(username, password);
      let user = await client.auth.loginWithCredential(credential);
      Api.needLogin.value = false;
      return user;
    });
  }
  static async logout() {
    return await callStitch(async function() {
      let result = await client.auth.logout();
      return result;
    });
  }
}

globalThis.Api = Api;
export default Api;
