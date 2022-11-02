import { BatchLoadFn } from "dataloader";
import { container } from "tsyringe";
import { CategoryEntity } from "../../core/entities";
import { mappingResultForDataLoader } from "../utils";
import { CategoryService } from "../../core/services/category.service";

export const category: BatchLoadFn<number, CategoryEntity | null> = async (
  categoriesIds: ReadonlyArray<number>
) => {
  const countryService = container.resolve(CategoryService);

  const result = await countryService.findBy({
    categoriesIds,
  });

  return mappingResultForDataLoader(categoriesIds, result, "categoryId", false);
};
