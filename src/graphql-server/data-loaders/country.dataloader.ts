import { BatchLoadFn } from "dataloader";
import { container } from "tsyringe";
import { CountryEntity } from "../../core/entities";
import { mappingResultForDataLoader } from "../utils";
import { CountryService } from "../../core/services/country.service";

export const country: BatchLoadFn<number, CountryEntity | null> = async (
  countriesIds: ReadonlyArray<number>
) => {
  const countryService = container.resolve(CountryService);

  const result = await countryService.findBy({
    countriesIds,
  });

  return mappingResultForDataLoader(countriesIds, result, "countryId", false);
};
