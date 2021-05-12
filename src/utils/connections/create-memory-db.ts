import { createConnection, EntitySchema } from "typeorm";

type Entity = Function | string | EntitySchema<any>;

export async function createMemoryDB(entities: Entity[]) {
  return createConnection({
    type: "sqlite",
    database: ":memory:",
    entities,
    logging: false,
    synchronize: true,
  });
}