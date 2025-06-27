import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  cash: numeric("cash"),
  stock: numeric("stock"),
});
