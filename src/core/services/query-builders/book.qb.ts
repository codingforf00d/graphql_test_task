import { BookEntity } from "../../entities";
import { AuthorsIds, BooksIds, CategoriesIds, PublishersIds } from "../common.types";
import { AbstractQueryBuilder, AnySelectQueryBuilder } from "./utils";

export type FindBooksByParams = Partial<BooksIds> &
  Partial<AuthorsIds> &
  Partial<PublishersIds> &
  Partial<CategoriesIds>;

export class BooksQB extends AbstractQueryBuilder<BookEntity> {
  constructor(alias = "books", qb?: AnySelectQueryBuilder) {
    super(BookEntity, alias, qb);
  }

  findBy(params: FindBooksByParams) {
    const qb = this.qb;

    const { booksIds, authorsIds, publishersIds, categoriesIds } = params;

    if (booksIds) {
      qb.andWhere(`${this.alias}.bookId IN (:...booksIds)`, {
        booksIds,
      });
    }

    if (authorsIds) {
      qb.andWhere(`${this.alias}.authorId IN (:...authorsIds)`, {
        authorsIds,
      });
    }

    if (publishersIds) {
      qb.andWhere(`${this.alias}.publisherId IN (:...publishersIds)`, {
        publishersIds,
      });
    }

    if (categoriesIds) {
      qb.andWhere(`${this.alias}.categoryId IN (:...categoriesIds)`, {
        categoriesIds
      });
    }

    return this;
  }
}
