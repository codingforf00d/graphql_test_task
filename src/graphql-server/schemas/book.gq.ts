import "reflect-metadata";
import { singleton } from "tsyringe";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  ObjectType,
  Field,
  ID,
  FieldResolver,
  Root,
  Ctx,
} from "type-graphql";
import { BookEntity, BookFields } from "../../core/entities/book.entity";
import { BookService } from "../../core/services/book.service";
import { DataLoadersContext } from "../data-loaders";
import { GqAuthor } from "./author.gq";
import { GqPublisher } from "./publisher.gq";
import { GqCategory } from "./category.gq";

@ObjectType({
  description: "Книга",
})
export class GqBook extends BookEntity {}

@InputType({
  description: "Параметры создания книги",
})
class GqCreateBookInput extends BookFields {}

@InputType({
  description: "Параметры поиска книг",
})
class GqFindBookInput {
  @Field(() => [ID])
  booksIds: ReadonlyArray<number>;
}

@singleton()
@Resolver(() => GqBook)
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => [GqBook], {
    description: "Получить список книг",
    nullable: true,
  })
  async books(@Arg("input") input: GqFindBookInput): Promise<GqBook[]> {
    return await this.bookService.findBy(input);
  }

  @Mutation(() => GqBook, {
    description: "Создать книгу",
  })
  async saveBook(@Arg("input") input: GqCreateBookInput): Promise<GqBook> {
    return await this.bookService.save(input);
  }

  @Mutation(() => BookEntity, {
    description: "Удалить книгу",
  })
  async dropBook(@Arg("input") input: GqFindBookInput) {
    return await this.bookService.drop(input);
  }

  @FieldResolver(() => GqAuthor, {
    description: "Автор книги",
    nullable: true,
  })
  async author(
    @Root() book: GqBook,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqAuthor | null> {
    return dataLoaders.author.loadOrNull(book.authorId);
  }

  @FieldResolver(() => GqPublisher, {
    description: "Автор книги",
    nullable: true,
  })
  async publisher(
    @Root() book: GqBook,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqPublisher | null> {
    return dataLoaders.publisher.loadOrNull(book.publisherId);
  }

  @FieldResolver(() => GqCategory, {
    description: "Категория книги",
    nullable: true,
  })
  async category(
    @Root() book: GqBook,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqCategory | null> {
    return dataLoaders.category.loadOrNull(book.categoryId);
  }
}
