import { buildSchema as gqBuildSchema } from "type-graphql";
import { container } from "tsyringe";
import {
  BookResolver,
  AuthorResolver,
  CountryResolver,
  CategoryResolver,
  PublisherResolver,
} from "./schemas";

class ContainerType {
  get(cls: string) {
    return container.resolve(cls);
  }
}

export const buildSchema = () =>
  gqBuildSchema({
    resolvers: [
      BookResolver,
      AuthorResolver,
      CountryResolver,
      CategoryResolver,
      PublisherResolver,
    ],
    container: new ContainerType(),
  });
