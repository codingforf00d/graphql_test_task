import { PublisherEntity } from "../../entities";
import { CountriesIds, PublishersIds } from "../common.types";
import { AbstractQueryBuilder, AnySelectQueryBuilder } from "./utils";

export type FindPublisherByParams = Partial<PublishersIds> &
  Partial<CountriesIds>;

export class PublisherQB extends AbstractQueryBuilder<PublisherEntity> {
  constructor(alias = "publishers", qb?: AnySelectQueryBuilder) {
    super(PublisherEntity, alias, qb);
  }

  findBy(params: FindPublisherByParams) {
    const qb = this.qb;

    const { publishersIds, countriesIds } = params;

    if (publishersIds) {
      qb.andWhere(`${this.alias}.publisherId IN (:...publishersIds)`, {
        publishersIds,
      });
    }

    if (countriesIds) {
      qb.innerJoinAndSelect(`${this.alias}.country`, "country");
      qb.andWhere(`${this.alias}.countryId IN (:...countriesIds)`, {
        countriesIds,
      });
    }

    return this;
  }
}
