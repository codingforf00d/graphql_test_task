import { BatchLoadFn } from "dataloader";
import { container } from "tsyringe";
import { PublisherEntity } from "../../core/entities";
import { mappingResultForDataLoader } from "../utils";
import { PublisherService } from "../../core/services/publisher.service";

export const publisher: BatchLoadFn<number, PublisherEntity | null> = async (
  publishersIds: ReadonlyArray<number>
) => {
  const publisherService = container.resolve(PublisherService);

  const result = await publisherService.findBy({
    publishersIds,
  });

  return mappingResultForDataLoader(
    publishersIds,
    result,
    "publisherId",
    false
  );
};

export const publishersFromCountry: BatchLoadFn<
  number,
  PublisherEntity[] | null
> = async (countriesIds: ReadonlyArray<number>) => {
  const publisherService = container.resolve(PublisherService);

  const result = await publisherService.findBy({
    countriesIds,
  });

  return mappingResultForDataLoader(countriesIds, result, "countryId", true);
};
