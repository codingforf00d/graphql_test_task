import { CountryEntity } from "../../entities";
import { CountriesIds, PublishersIds } from "../common.types";
import { AbstractQueryBuilder, AnySelectQueryBuilder } from "./utils";

export type FindCountriesByParams = Partial<CountriesIds> &
  Partial<PublishersIds>;

export class CountryQB extends AbstractQueryBuilder<CountryEntity> {
  constructor(alias = "country", qb?: AnySelectQueryBuilder) {
    super(CountryEntity, alias, qb);
  }

  findBy(params: FindCountriesByParams) {
    const qb = this.qb;

    const { countriesIds } = params;

    if (countriesIds) {
      qb.andWhere(`${this.alias}.countryId IN (:...countriesIds)`, {
        countriesIds,
      });
    }

    return this;
  }
}
