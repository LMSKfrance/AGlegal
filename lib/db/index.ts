import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import fs from "fs";
import path from "path";
import * as schema from "./schema";

const DB_PATH = path.join(process.cwd(), "data", "ag-legal.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const client = createClient({ url: `file:${DB_PATH}` });

export const db = drizzle(client, { schema });
export type DB = typeof db;
