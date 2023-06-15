import assert from "assert";
import { getPolybaseConnection } from "../connection";
import { getSchema } from "../schema";

assert(process.argv[2], "You must provide a namespace");

const db = getPolybaseConnection();
const schema = getSchema();
const namespace = process.argv[2];

db.applySchema(schema, namespace)
  .then((collections) => {
    console.log(`Collections created under ${namespace}:`);
    collections.forEach((collection) => {
      console.log(collection.id);
    });
  })
  .catch(console.error);
