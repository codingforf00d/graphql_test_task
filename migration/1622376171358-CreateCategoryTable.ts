import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryTable1622376171358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE category (
                name       VARCHAR(255) NOT NULL COMMENT 'Название категории',
                categoryId INT UNSIGNED AUTO_INCREMENT
                    PRIMARY KEY
                );
        `);

    await queryRunner.query(
      `INSERT INTO books.category (name) VALUES ('Detective'), ('Drama')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS category;`);
  }
}
