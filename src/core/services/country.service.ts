import "reflect-metadata";
import { singleton } from "tsyringe";
import { getRepository } from "typeorm";
import { CountryEntity, CountryFields } from "../entities";
import { CountryQB, FindCountriesByParams } from "./query-builders/country.qb";

@singleton()
export class CountryService {
  private countryRepository = getRepository(CountryEntity);

  countriesQB() {
    return new CountryQB();
  }

  async findBy(params: FindCountriesByParams): Promise<CountryEntity[]> {
    return await this.countriesQB().findBy(params).qb.getMany();
  }

  async findOneBy(params: FindCountriesByParams): Promise<CountryEntity> {
    const country = await this.countriesQB().findBy(params).qb.getOne();

    if (!country) {
      throw new Error("Unknown countryId!");
    }

    return country;
  }

  async save(params: CountryFields): Promise<CountryEntity> {
    return this.countryRepository.save(params);
  }
}
