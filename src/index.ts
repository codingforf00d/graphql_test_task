import "reflect-metadata";
import { createConnection } from "typeorm";
import { SERVER_PORT } from "./common/constants";
import { initGraphQLServer } from "./graphql-server";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const type = "mysql";
  const host = process.env.DB_HOST_NAME || "localhost";
  const port = Number(process.env.DB_HOST_PORT) || 3306;
  const username = process.env.DB_USER || "node";
  const password = process.env.DB_PASSWORD || "password";
  const database = process.env.DB_NAME || "books";

  await createConnection({
    type,
    host,
    port,
    username,
    password,
    database,
    entities: ["./src/core/entities/*.ts"],
  });

  const graphqlServer = await initGraphQLServer();

  await graphqlServer.listen(SERVER_PORT);
}

main()
  .then(() =>
    console.log(`Server has started on http://localhost:${SERVER_PORT}`)
  )
  .catch((e) => console.error(e));
