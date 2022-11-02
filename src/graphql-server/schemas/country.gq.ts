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
import { CountryEntity, CountryFields } from "../../core/entities";
import { DataLoadersContext } from "../data-loaders";
import { CountryService } from "../../core/services/country.service";
import { GqPublisher } from "./publisher.gq";

@ObjectType({
  description: "Страна",
})
export class GqCountry extends CountryEntity {}

@InputType({
  description: "Параметры создания страны",
})
class GqCreateCountryInput extends CountryFields {}

@InputType({
  description: "Параметры поиска стран",
})
class GqFindCountryInput {
  @Field(() => [ID])
  countriesIds: ReadonlyArray<number>;
}

@singleton()
@Resolver(() => GqCountry)
export class CountryResolver {
  constructor(private countryService: CountryService) {}

  @Query(() => GqCountry, {
    description: "Получить страну",
    nullable: true,
  })
  country(@Arg("input") input: GqFindCountryInput): Promise<GqCountry> {
    return this.countryService.findOneBy(input);
  }

  @Mutation(() => GqCountry, {
    description: "Добавть страну",
  })
  saveCountry(@Arg("input") input: GqCreateCountryInput): Promise<GqCountry> {
    return this.countryService.save(input);
  }

  @FieldResolver(() => [GqPublisher], {
    description: "Список издетелей по стране",
    nullable: true,
  })
  async publishers(
    @Root() country: GqCountry,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqPublisher[] | null> {
    return dataLoaders.publishersFromCountry.loadOrNull(country.countryId);
  }
}
