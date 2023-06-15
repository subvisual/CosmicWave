import { getPolybaseConnection } from "./connection";

console.log(process.argv[2]);

const conn = getPolybaseConnection();
console.log(conn);
