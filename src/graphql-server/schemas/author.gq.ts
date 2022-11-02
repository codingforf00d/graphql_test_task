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
import { AuthorEntity, AuthorFields } from "../../core/entities";
import { AuthorService } from "../../core/services";
import { DataLoadersContext } from "../data-loaders";
import { GqBook } from "./book.gq";

@ObjectType({
  description: "Автор",
})
export class GqAuthor extends AuthorEntity {}

@InputType({
  description: "Параметры создания автора",
})
class GqCreateAuthorInput extends AuthorFields {}

@InputType({
  description: "Параметры поиска автора",
})
class GqFindAuthorInput {
  @Field(() => [ID])
  authorsIds: ReadonlyArray<number>;
}

@singleton()
@Resolver(() => GqAuthor)
export class AuthorResolver {
  constructor(private authorService: AuthorService) {}

  @Query(() => [GqAuthor], {
    description: "Получить список авторов",
    nullable: true,
  })
  authors(@Arg("input") input: GqFindAuthorInput): Promise<GqAuthor[]> {
    return this.authorService.findBy(input);
  }

  @Query(() => GqAuthor, {
    description: "Получить автора",
    nullable: true,
  })
  author(@Arg("input") input: GqFindAuthorInput): Promise<GqAuthor> {
    return this.authorService.findOneBy(input);
  }

  @Mutation(() => GqAuthor, {
    description: "Создать автора",
  })
  saveAuthor(@Arg("input") input: GqCreateAuthorInput): Promise<GqAuthor> {
    return this.authorService.save(input);
  }

  @FieldResolver(() => [GqBook], {
    description: "Список книг автора",
    nullable: true,
  })
  async books(
    @Root() author: GqAuthor,
    @Ctx() { dataLoaders }: DataLoadersContext
  ): Promise<GqBook[] | null> {
    return dataLoaders.booksForAuthors.loadOrNull(author.authorId);
  }
}
