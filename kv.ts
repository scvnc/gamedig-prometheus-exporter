import createKV from "bun-kv";
import { Database } from "bun:sqlite";

const database = new Database("bun.sqlite");
export const KV = new createKV(database);
