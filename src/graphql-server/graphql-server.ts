import { buildSchema } from "./schema";
import { ApolloServer } from "apollo-server";
import { createDataLoaders } from "./data-loaders";

export async function initGraphQLServer() {
  const schema = await buildSchema();

  return new ApolloServer({
    schema,
    context: () => {
      return {
        dataLoaders: createDataLoaders(),
      };
    },
    playground: true,
  });
}
