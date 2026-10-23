import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

type Db = NeonHttpDatabase<typeof schema>;

let instance: Db | null = null;

/**
 * Lazily initialized so importing this module never throws at build time
 * (Next.js evaluates route modules during "Collecting page data" even for
 * fully dynamic routes, before CareerZeta_DATABASE_URL is necessarily
 * available). The connection is only opened on first actual query.
 */
function getDb(): Db {
  if (!instance) {
    const connectionString = process.env.CareerZeta_DATABASE_URL;
    if (!connectionString) {
      throw new Error("CareerZeta_DATABASE_URL is not set");
    }
    instance = drizzle(neon(connectionString), { schema });
  }
  return instance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
