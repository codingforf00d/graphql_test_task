import { BatchLoadFn } from "dataloader";
import { container } from "tsyringe";
import { BookEntity } from "../../core/entities";
import { BookService } from "../../core/services";
import { mappingResultForDataLoader } from "../utils";

export const booksForAuthors: BatchLoadFn<number, BookEntity[] | null> = async (
  authorsIds: ReadonlyArray<number>
) => {
  const bookService = container.resolve(BookService);

  const result = await bookService.findBy({
    authorsIds,
  });

  return mappingResultForDataLoader(authorsIds, result, "authorId", true);
};

export const booksForPublishers: BatchLoadFn<
  number,
  BookEntity[] | null
> = async (publishersIds: ReadonlyArray<number>) => {
  const bookService = container.resolve(BookService);

  const result = await bookService.findBy({
    publishersIds,
  });

  return mappingResultForDataLoader(publishersIds, result, "publisherId", true);
};
