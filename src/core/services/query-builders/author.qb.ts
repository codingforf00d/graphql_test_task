import { AuthorEntity } from "../../entities";
import { AuthorsIds, BooksIds } from "../common.types";
import { AbstractQueryBuilder, AnySelectQueryBuilder } from "./utils";

export type FindAuthorsByParams = Partial<BooksIds> & Partial<AuthorsIds>;

export class AuthorsQB extends AbstractQueryBuilder<AuthorEntity> {
  constructor(alias = "authors", qb?: AnySelectQueryBuilder) {
    super(AuthorEntity, alias, qb);
  }

  findBy(params: FindAuthorsByParams) {
    const qb = this.qb;

    const { authorsIds, booksIds } = params;

    if (authorsIds) {
      qb.andWhere(`${this.alias}.authorId IN (:...authorsIds)`, {
        authorsIds,
      });
    }

    if (booksIds) {
      qb.innerJoinAndSelect(`${this.alias}.books`, "books");
      qb.andWhere("books.bookId IN (:...booksIds)", {
        booksIds,
      });
    }

    return this;
  }
}
