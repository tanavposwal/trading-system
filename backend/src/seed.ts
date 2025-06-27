import { db } from "./db";
import { users } from "./schema";

export const usersData = [
  {
    id: "1",
    name: "tanav",
    cash: 1000,
    stock: 15,
  },
  {
    id: "2",
    name: "theo",
    cash: 1000,
    stock: 7,
  },
  {
    id: "3",
    name: "harkirat",
    cash: 1000,
    stock: 10,
  },
];

async function seed() {
  // Clear the users table first
  await db.delete(users);

  // Insert usersData (omit id, since it's serial in schema)
  await db.insert(users).values(
    usersData.map(({ name, cash, stock }) => ({
      name,
      cash: cash.toString(),
      stock: stock.toString(),
    }))
  );

  console.log("Seeded users table");
}

seed();
