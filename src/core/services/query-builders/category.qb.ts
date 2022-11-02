import { CategoriesIds } from "../common.types";
import { AbstractQueryBuilder, AnySelectQueryBuilder } from "./utils";
import { CategoryEntity } from "../../entities";

export type FindCategoriesByParams = Partial<CategoriesIds>;

export class CategoryQB extends AbstractQueryBuilder<CategoryEntity> {
  constructor(alias = "category", qb?: AnySelectQueryBuilder) {
    super(CategoryEntity, alias, qb);
  }

  findBy(params: FindCategoriesByParams) {
    const qb = this.qb;

    const { categoriesIds } = params;

    if (categoriesIds) {
      qb.andWhere(`${this.alias}.categoryId IN (:...categoriesIds)`, {
        categoriesIds,
      });
    }

    return this;
  }
}
