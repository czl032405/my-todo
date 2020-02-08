import { Stitch, RemoteMongoClient, UserPasswordCredential, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

const client = Stitch.initializeDefaultAppClient("todo-pkgua");

const db = client.getServiceClient(RemoteMongoClient.factory, "todo-stitch-service").db("my-todo");

const createUser = async function(u: string, p: string) {
  const emailPasswordClient = Stitch.defaultAppClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
  await emailPasswordClient.registerWithEmail(u, p);
  console.info("[MongoDB Stitch] User Created Success");
};

const auth = async function(u: string, p: string) {
  let credential = new UserPasswordCredential(u, p);
  let user = await client.auth.loginWithCredential(credential);
  console.info("[MongoDB Stitch] Auth Success", user);
};

const test = async function() {
  await db.collection("todos").updateOne({ owner_id: client.auth.user.id }, { $set: { title: "test-title" } }, { upsert: true });
  let todos: ITodo[] = await db
    .collection("todos")
    .find({}, { limit: 100 })
    .asArray();
  console.log("Found docs", todos);
};

globalThis.createUser = createUser;

// auth();
// test();

export { client, db };
