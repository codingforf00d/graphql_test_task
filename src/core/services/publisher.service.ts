import "reflect-metadata";
import { singleton } from "tsyringe";
import { getRepository } from "typeorm";
import { PublisherEntity, PublisherFields } from "../entities";
import { FindCountriesByParams } from "./query-builders/country.qb";
import { PublisherQB } from "./query-builders";

@singleton()
export class PublisherService {
  private publisherRepository = getRepository(PublisherEntity);

  publisherQB() {
    return new PublisherQB();
  }

  async findBy(params: FindCountriesByParams): Promise<PublisherEntity[]> {
    return await this.publisherQB().findBy(params).qb.getMany();
  }

  async findOneBy(params: FindCountriesByParams): Promise<PublisherEntity> {
    const country = await this.publisherQB().findBy(params).qb.getOne();

    if (!country) {
      throw new Error("Unknown publisherId!");
    }

    return country;
  }

  async save(params: PublisherFields): Promise<PublisherEntity> {
    return this.publisherRepository.save(params);
  }
}
