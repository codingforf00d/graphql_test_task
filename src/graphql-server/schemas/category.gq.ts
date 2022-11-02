import "reflect-metadata";
import { singleton } from "tsyringe";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  ObjectType,
  ID,
  Field,
  FieldResolver,
  Root,
  Ctx,
} from "type-graphql";
import { CategoryEntity, CategoryFields } from "../../core/entities";
import { CategoryService } from "../../core/services/category.service";
import { GqBook } from "./book.gq";
import { DataLoadersContext } from "../data-loaders";

@ObjectType({
  description: "Категория",
})
export class GqCategory extends CategoryEntity {}

@InputType({
  description: "Параметры создания категории",
})
class GqCreateCategoryInput extends CategoryFields {}

@InputType({
  description: "Параметры поиска категории",
})
class GqFindCategoryInput {
  @Field(() => [ID])
  categoriesIds: ReadonlyArray<number>;
}

@singleton()
@Resolver(() => GqCategory)
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => GqCategory, {
    description: "Получить категорию",
    nullable: true,
  })
  category(@Arg("input") input: GqFindCategoryInput): Promise<GqCategory> {
    return this.categoryService.findOneBy(input);
  }

  @Mutation(() => GqCategory, {
    description: "Добавить категорию",
  })
  saveCategory(
    @Arg("input") input: GqCreateCategoryInput
  ): Promise<GqCategory> {
    return this.categoryService.save(input);
  }
}
