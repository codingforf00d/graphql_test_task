import "reflect-metadata";
import { singleton } from "tsyringe";
import { getRepository } from "typeorm";
import { AuthorEntity, AuthorFields } from "../entities";
import { AuthorsQB, FindAuthorsByParams } from "./query-builders";

@singleton()
export class AuthorService {
  private authorRepository = getRepository(AuthorEntity);

  authorsQB() {
    return new AuthorsQB();
  }

  async findBy(params: FindAuthorsByParams): Promise<AuthorEntity[]> {
    return await this.authorsQB().findBy(params).qb.getMany();
  }

  async findOneBy(params: FindAuthorsByParams): Promise<AuthorEntity> {
    const author = await this.authorsQB().findBy(params).qb.getOne();

    if (!author) {
      throw new Error("Unknown authorId!");
    }

    return author;
  }

  async save(params: AuthorFields): Promise<AuthorEntity> {
    return this.authorRepository.save(params);
  }
}
