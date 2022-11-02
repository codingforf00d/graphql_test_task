import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBooksTable1622385299560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			CREATE TABLE books
			(
				name       VARCHAR(255)                NOT NULL COMMENT 'Имя книги',
				pageCount   INT UNSIGNED                NOT NULL COMMENT 'Количество страниц',
				authorId    INT UNSIGNED                NOT NULL COMMENT 'ID автора',
				categoryId  INT UNSIGNED                NOT NULL COMMENT 'ID категории',
				type        ENUM ('0', '1') DEFAULT '1' NOT NULL,
				publisherId INT UNSIGNED                NOT NULL COMMENT 'ID издателя',
				bookId      INT UNSIGNED AUTO_INCREMENT
					PRIMARY KEY,
				deletedAt   DATETIME(6)                 NULL,
				CONSTRAINT book_author
					FOREIGN KEY (authorId) REFERENCES authors (authorId),
				CONSTRAINT book_category
					FOREIGN KEY (categoryId) REFERENCES category (categoryId)
			);
        `);

    await queryRunner.query(`
			INSERT INTO books.books (name, pageCount, authorId, categoryId, type, publisherId, bookId, deletedAt) 
			VALUES ('Exodus 2', 453, 1, 1, '1', 1, 1, null)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS authors;`);
  }
}
