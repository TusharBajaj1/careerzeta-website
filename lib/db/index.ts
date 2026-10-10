import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

const connectionString = process.env.CareerZeta_DATABASE_URL;
if (!connectionString) {
  throw new Error("CareerZeta_DATABASE_URL is not set");
}

export const db = drizzle(neon(connectionString), { schema });
