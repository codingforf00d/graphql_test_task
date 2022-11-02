import {
  AuthorEntity,
  BookEntity,
  CategoryEntity,
  CountryEntity,
  PublisherEntity,
} from "../../core/entities";
import { NullableDataLoader } from "./utils";
import { booksForAuthors, booksForPublishers } from "./books.dataloader";
import { author } from "./authors.dataloader";
import { country } from "./country.dataloader";
import { publisher, publishersFromCountry } from "./publisher.dataloader";
import { category } from "./category.dataloader";

export interface DataLoadersContext {
  dataLoaders: AppDataLoaders;
}

interface AppDataLoaders {
  author: NullableDataLoader<number, AuthorEntity | null>;
  booksForAuthors: NullableDataLoader<number, BookEntity[] | null>;
  booksForPublishers: NullableDataLoader<number, BookEntity[] | null>;
  country: NullableDataLoader<number, CountryEntity | null>;
  publisher: NullableDataLoader<number, PublisherEntity | null>;
  publishersFromCountry: NullableDataLoader<number, PublisherEntity[] | null>;
  category: NullableDataLoader<number, CategoryEntity | null>;
}

export function createDataLoaders(): AppDataLoaders {
  return {
    author: new NullableDataLoader(author),
    booksForAuthors: new NullableDataLoader(booksForAuthors),
    booksForPublishers: new NullableDataLoader(booksForPublishers),
    country: new NullableDataLoader(country),
    publisher: new NullableDataLoader(publisher),
    publishersFromCountry: new NullableDataLoader(publishersFromCountry),
    category: new NullableDataLoader(category),
  };
}
