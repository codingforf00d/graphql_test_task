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
import { PublisherEntity, PublisherFields } from "../../core/entities";
import { DataLoadersContext } from "../data-loaders";
import { GqBook } from "./book.gq";
import { PublisherService } from "../../core/services/publisher.service";
import { GqCategory } from "./category.gq";
import { GqCountry } from "./country.gq";

@ObjectType({
  description: "Издатель",
})
export class GqPublisher extends PublisherEntity {}

@InputType({
  description: "Параметры создания издателя",
})
class GqCreatePublisherInput extends PublisherFields {}

@InputType({
  description: "Параметры поиска издателя",
})
class GqFindPublisherInput {
  @Field(() => [ID])
  publishersIds: ReadonlyArray<number>;
}

@singleton()
@Resolver(() => GqPublisher)
export class PublisherResolver {
  constructor(private publisherServices: PublisherService) {}

  @Query(() => GqPublisher, {
    description: "Получить издателя",
    nullable: true,
  })
  publisher(@Arg("input") input: GqFindPublisherInput): Promise<GqPublisher> {
    return this.publisherServices.findOneBy(input);
  }

  @Mutation(() => GqPublisher, {
    description: "Добавить издателя",
  })
  savePublisher(
    @Arg("input") input: GqCreatePublisherInput
  ): Promise<GqPublisher> {
    return this.publisherServices.save(input);
  }

  @FieldResolver(() => [GqBook], {
    description: "Список книг издателя",
    nullable: true,
  })
  async books(
    @Root() publisher: GqPublisher,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqBook[] | null> {
    return dataLoaders.booksForPublishers.loadOrNull(publisher.publisherId);
  }

  @FieldResolver(() => GqCategory, {
    description: "Категория книги",
    nullable: true,
  })
  async country(
    @Root() publisher: GqPublisher,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqCountry | null> {
    return dataLoaders.country.loadOrNull(publisher.countryId);
  }
}
