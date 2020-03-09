import { Stitch, RemoteMongoClient, UserPasswordCredential, UserPasswordAuthProviderClient } from "mongodb-stitch-browser-sdk";

const client = Stitch.initializeDefaultAppClient("todo-pkgua");

const db = client.getServiceClient(RemoteMongoClient.factory, "todo-stitch-service").db("my-todo");

const createUser = async function(u: string, p: string) {
  const emailPasswordClient = Stitch.defaultAppClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
  await emailPasswordClient.registerWithEmail(u, p);
  console.info("[MongoDB Stitch] User Created Success");
};

globalThis.createUser = createUser;

// auth();
// test();

export { client, db };
