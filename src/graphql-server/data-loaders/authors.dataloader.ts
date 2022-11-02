import { BatchLoadFn } from "dataloader";
import { container } from "tsyringe";
import { AuthorEntity } from "../../core/entities";
import { AuthorService } from "../../core/services";
import { mappingResultForDataLoader } from "../utils";

export const author: BatchLoadFn<number, AuthorEntity | null> = async (
  authorsIds: ReadonlyArray<number>
) => {
  const authorService = container.resolve(AuthorService);

  const result = await authorService.findBy({
    authorsIds,
  });

  return mappingResultForDataLoader(authorsIds, result, "authorId", false);
};
