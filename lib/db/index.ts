import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "TURSO_DATABASE_URL environment variable is not set. " +
    "Create a free database at https://turso.tech and set this variable."
  );
}

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
export type DB = typeof db;
