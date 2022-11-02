import "reflect-metadata";
import { singleton } from "tsyringe";
import { getRepository } from "typeorm";
import { CategoryEntity, CategoryFields } from "../entities";
import {
  CategoryQB,
  FindCategoriesByParams,
} from "./query-builders/category.qb";

@singleton()
export class CategoryService {
  private categoryRepository = getRepository(CategoryEntity);

  caterogyQB() {
    return new CategoryQB();
  }

  async findBy(params: FindCategoriesByParams): Promise<CategoryEntity[]> {
    return await this.caterogyQB().findBy(params).qb.getMany();
  }

  async findOneBy(params: FindCategoriesByParams): Promise<CategoryEntity> {
    const category = await this.caterogyQB().findBy(params).qb.getOne();

    if (!category) {
      throw new Error("Unknown categoryId!");
    }

    return category;
  }

  async save(params: CategoryFields): Promise<CategoryEntity> {
    return this.categoryRepository.save(params);
  }
}
