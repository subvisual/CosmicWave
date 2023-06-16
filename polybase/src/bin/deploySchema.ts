import assert from "assert";
import { Streamer } from "../collections/streamer";
import { getPolybaseConnection } from "../connection";
import { getSchema } from "../schema";

assert(process.argv[2], "You must provide a namespace");

const db = getPolybaseConnection();
const schema = getSchema();
const namespace = process.argv[2];

async function main() {
  const collections = await db.applySchema(schema, namespace);

  console.log(`Collections created under ${namespace}:`);
  collections.forEach((collection) => {
    console.log(collection.id);
  });

  return db.collection<Streamer>(`${namespace}/Streamer`).create();
}

main().then(console.log).catch(console.error);
