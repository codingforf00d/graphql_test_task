import "reflect-metadata";
import { singleton } from "tsyringe";
import { getRepository } from "typeorm";
import { BookEntity, BookFields } from "../entities";
import { AuthorService } from "./author.service";
import { BooksQB, FindBooksByParams } from "./query-builders";
import { PublisherService } from "./publisher.service";

@singleton()
export class BookService {
  private bookRepository = getRepository(BookEntity);

  constructor(
    private authorService: AuthorService,
    private publisherService: PublisherService
  ) {}

  booksQB() {
    return new BooksQB();
  }

  async findBy(params: FindBooksByParams) {
    return await this.booksQB().findBy(params).qb.getMany();
  }

  async findOneBy(params: FindBooksByParams): Promise<BookEntity> {
    const book = await this.booksQB().findBy(params).qb.getOne();

    if (!book) {
      throw new Error("Unknown bookId!");
    }

    return book;
  }

  async save(params: BookFields) {
    const author = this.authorService.findOneBy({
      authorsIds: [params.authorId],
    });

    if (!author) {
      throw Error("Unknown authorId!");
    }

    const publisher = this.publisherService.findOneBy({
      publishersIds: [params.publisherId],
    });

    if (!publisher) {
      throw Error("Unknown publisherId!");
    }

    return await this.bookRepository.save(params);
  }

  async drop(params: FindBooksByParams) {
    const book = await this.findOneBy(params);
    if (book) {
      return await this.bookRepository.softRemove(book);
    }
    throw Error("Unknown bookId!");
  }
}
